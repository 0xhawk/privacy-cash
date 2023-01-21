#!/bin/bash

TARGET_CIRCUIT=../../circuits/circuit.circom

cd "$(dirname "$0")"
cd ..

mkdir -p ./build/circuits
cd ./build/circuits

echo 'Generating circuit.r1cs & circuit.sys & circuit.wasm...'
circom $TARGET_CIRCUIT --r1cs --wasm --sym