pragma circom 2.0.0;

include "circomlib/circuits/mimc.circom";
include "@rooch/circomlib/circuits/string.circom";
include "@rooch/circomlib/circuits/jwt.circom";
include "@rooch/circomlib/circuits/base64.circom";

template ZKLoginVerify(jwt_max_bytes) {
  signal input oauth_jwt[jwt_max_bytes];
  signal input oauth_signature[17];
  signal input oauth_pubKey[17];
  signal input kc_name[12];
  signal output kc_value[32];
  signal output nonce[32];

  // JWT Verify
  component jwtVerify = JWTVerify(jwt_max_bytes, 121, 17); // 46 is '.'
  jwtVerify.jwt <== oauth_jwt;
  jwtVerify.signature <== oauth_signature;
  jwtVerify.pubkey <== oauth_pubKey;

  // Split JWT into header and payload
  component splitBy = SplitBy(jwt_max_bytes, 46, 2); // 46 is '.'
  splitBy.text <== oauth_jwt;
  signal jwt_header[jwt_max_bytes] <== splitBy.out[0];
  signal jwt_payload[jwt_max_bytes] <== splitBy.out[1];

  // Base64 decode payload from JWT
  component base64Decode = Base64Decode(jwt_max_bytes);
  base64Decode.in <== jwt_payload;
  signal payload[jwt_max_bytes] <== base64Decode.out;

  // Extract nonce from payload, "nonce":" ==> 34 110 111 110 99 101 34 58 34 0
  signal nonceStartChars[10];
  nonceStartChars[0] <== 34;
  nonceStartChars[1] <== 110;
  nonceStartChars[2] <== 111;
  nonceStartChars[3] <== 110;
  nonceStartChars[4] <== 99;
  nonceStartChars[5] <== 101;
  nonceStartChars[6] <== 34;
  nonceStartChars[7] <== 58;
  nonceStartChars[8] <== 34;
  nonceStartChars[9] <== 0;

  component extractNonceComp = Extract(jwt_max_bytes, 10, 32);
  extractNonceComp.text <== payload;
  extractNonceComp.start_chars <== nonceStartChars;
  extractNonceComp.end_char <== 34; // 34 is "
  extractNonceComp.start_index <== 0;

  nonce <== extractNonceComp.extracted_text;

  // Extract kc_name from payload, like sub、email
  component kcConcat3Comp = Concat3(1, 12, 3);
  kcConcat3Comp.text1[0] <== 34; // 34 is "
  kcConcat3Comp.text2 <== kc_name;   
  kcConcat3Comp.text3[0] <== 34; // 34 is "
  kcConcat3Comp.text3[1] <== 58; // 34 is :
  kcConcat3Comp.text3[2] <== 34; // 34 is "

  component extractSubComp = Extract(jwt_max_bytes, 16, 32);
  extractSubComp.text <== payload;
  extractSubComp.start_chars <== kcConcat3Comp.out;
  extractSubComp.end_char <== 34; // 34 is "
  extractSubComp.start_index <== 0;

  kc_value <== extractSubComp.extracted_text;
}
