pragma circom 2.1.5;

include "../helpers/jwt.circom";

component main { public [ jwt, signature, pubkey ] } = JWTVerify(512, 121, 17);