pragma circom 2.0.0;

include "@rooch/circomlib/circuits/string.circom";
include "@rooch/circomlib/circuits/jwt.circom";
include "@rooch/circomlib/circuits/base64.circom";

template ZKLoginVerify(jwt_max_bytes) {
  signal input oauth_jwt[jwt_max_bytes];
  signal input oauth_signature[17];
  signal input oauth_pubKey[17];
  signal input sequence_number;
  signal output userId[16];
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

  // Extract user ID and nonce from JWT
  component base64Decode = Base64Decode(jwt_max_bytes);
  base64Decode.in <== jwt_payload;
  signal payload[jwt_max_bytes] <== base64Decode.out;

  // find "sub":" ==> 34 115 117 98 34 58 34 0
  signal subChars[8];
  subChars[0] <== 34;
  subChars[1] <== 115;
  subChars[2] <== 117;
  subChars[3] <== 98;
  subChars[4] <== 34;
  subChars[5] <== 58;
  subChars[6] <== 34;
  subChars[7] <== 0;

  component subStartIndex = IndexOfMultiple(jwt_max_bytes, 8);
  subStartIndex.text <== payload;
  subStartIndex.startIndex <== 0;
  subStartIndex.targetChars <== subChars;

  signal testIndex1 <== subStartIndex.index;

  // find "sub":"1234567890" end char "
  component subEndIndex = IndexOf(jwt_max_bytes);
  subEndIndex.text <== payload;
  subEndIndex.startIndex <== testIndex1 + 7;
  subEndIndex.targetChar <== 34;

  signal testIndex2 <== subEndIndex.index;

  component subText = SubString(jwt_max_bytes, 16);
  subText.text <== payload;
  subText.startIndex <== testIndex1 + 7;
  subText.count <== testIndex2 - testIndex1 - 7;

  userId <== subText.substring;

  // TODO Verify if the nonce is correct
  // TODO generate rooch_address

  rooch_address <== sequence_number;
}

