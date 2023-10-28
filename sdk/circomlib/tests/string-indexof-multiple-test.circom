pragma circom 2.1.5;

include "../circuits/string.circom";

component main { public [ text, targetChars, startIndex ] } = IndexOfMultiple(256, 16);
