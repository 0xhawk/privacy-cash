#!/bin/bash

TARGET_CIRCUIT=../../circuits/circuit.circom
PTAU_FILE=powersOfTau28_hez_final_15.ptau
ENTROPY_FOR_ZKEY=0xhawk

cd "$(dirname "$0")"
cd ..

mkdir -p ./build/circuits
cd ./build/circuits

echo 'Generating circuit.r1cs & circuit.sys & circuit.wasm...'
circom $TARGET_CIRCUIT --r1cs --wasm --sym

if [ -f ./$PTAU_FILE ]; then
    echo skip: "$PTAU_FILE already exists"
else
    echo "Downloading $PTAU_FILE"
    wget https://hermez.s3-eu-west-1.amazonaws.com/$PTAU_FILE
fi

echo "Generating circuit_0000.zkey..."
snarkjs zkey new circuit.r1cs $PTAU_FILE circuit_0000.zkey

echo "Generating circuit_final.zkey..."
echo $ENTROPY_FOR_ZKEY | snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey

echo "Generating verification_key.json..."
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
