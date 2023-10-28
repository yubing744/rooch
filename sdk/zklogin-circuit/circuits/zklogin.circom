pragma circom 2.0.0;

include "@rooch/circomlib/circuits/string.circom";
include "@rooch/circomlib/circuits/jwt.circom";

template ZKLoginVerify(jwt_max_bytes) {
  signal input oauth_jwt[jwt_max_bytes];
  signal input oauth_signature[17];
  signal input oauth_pubKey[17];
  signal input sequence_number;
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

  // TODO Extract user ID and nonce from JWT
  // TODO Verify if the nonce is correct
  // TODO generate rooch_address

  rooch_address <== sequence_number;
}

