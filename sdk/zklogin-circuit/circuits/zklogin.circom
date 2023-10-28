pragma circom 2.0.0;

include "circomlib/circuits/mimc.circom";
include "@rooch/circomlib/circuits/string.circom";
include "@rooch/circomlib/circuits/jwt.circom";
include "@rooch/circomlib/circuits/base64.circom";

template ZKLoginVerify(jwt_max_bytes) {
  signal input oauth_jwt[jwt_max_bytes];
  signal input oauth_signature[17];
  signal input oauth_pubKey[17];
  signal input sequence_number;
  signal input salt;
  signal output rooch_address;

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

  // Extract sub from payload, "sub":" ==> 34 115 117 98 34 58 34 0
  signal subChars[8];
  subChars[0] <== 34;
  subChars[1] <== 115;
  subChars[2] <== 117;
  subChars[3] <== 98;
  subChars[4] <== 34;
  subChars[5] <== 58;
  subChars[6] <== 34;
  subChars[7] <== 0;

  component extractSubComp = Extract(jwt_max_bytes, 8, 16);
  extractSubComp.text <== payload;
  extractSubComp.start_chars <== subChars;
  extractSubComp.end_char <== 34;
  extractSubComp.start_index <== 0;

  signal sub[16] <== extractSubComp.extracted_text;

  // Calc rooch address by mimcHash(sub, 16)
  component mimcHash = MultiMiMC7(16, 2);
  mimcHash.in <== sub;
  mimcHash.k <== salt;

  rooch_address <== mimcHash.out;
}

