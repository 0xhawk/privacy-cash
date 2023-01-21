#!/bin/bash

cd "$(dirname "$0")"
cd ../contracts

if [ -f ../build/circuits/circuit_final.zkey ]; then

  snarkjs zkey export solidityverifier ../build/circuits/circuit_final.zkey Verifier.sol
  [ $? -eq 0 ] && echo "success: ./contracts/Verifier.sol"

else
  echo "Fail: circuit_final.zkey not found"
fi
