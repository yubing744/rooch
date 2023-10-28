pragma circom 2.1.5;

include "../circuits/string.circom";

component main { public [ text ] } = Extract(128, 16, 16);