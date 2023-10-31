pragma circom 2.1.5;

include "./circuits/zklogin.circom";

component main { public [ oauth_signature, oauth_pubKey, kc_name ] } = ZKLoginVerify(512);