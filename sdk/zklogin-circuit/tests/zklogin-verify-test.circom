pragma circom 2.1.5;

include "../circuits/zklogin.circom";

component main { public [ oauth_jwt, oauth_signature, oauth_pubKey, sequence_number ] } = ZKLoginVerify(512);