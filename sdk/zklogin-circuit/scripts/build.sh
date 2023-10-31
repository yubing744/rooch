#!/bin/bash

SCRIPT_PATH="$( cd "$( dirname "$0" )" >/dev/null 2>&1 && pwd )"
cd "$SCRIPT_PATH/.." || exit

echo "1. clearing files to rebuild"
rm -rf ./target/* && mkdir ./target

echo "2. compiling circuit to snarkjs..."
circom -l ./node_modules circuit.circom --r1cs --wasm --sym --output=target

echo "3. groth16 setup"
snarkjs groth16 setup target/circuit.r1cs ./target/powersOfTau28_hez_final_20.ptau target/circuit_0001.zkey

echo "4. export verification key"
snarkjs zkey export verificationkey target/circuit_0001.zkey target/verification_key.json
