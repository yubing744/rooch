#!/bin/bash

SCRIPT_PATH="$( cd "$( dirname "$0" )" >/dev/null 2>&1 && pwd )"
cd "$SCRIPT_PATH/.." || exit

echo "1. clearing files to rebuild"
rm -rf ./target && mkdir ./target

echo "2. download ptau"
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_20.ptau -o ./target
