import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, utils } from "ethers";
import path from "path";

// build
const HasherPath = "../build/contracts/Hasher.json";
const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");

// env
const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;
const denomination = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

// contract
let [Hasher, Verifier, Privacy]: ContractFactory[] = [];
let [hasher, verifier, privacy]: Contract[] = [];
let signers: SignerWithAddress[];

before(async () => {
    Hasher = await ethers.getContractFactory(require(HasherPath).abi, require(HasherPath).bytecode);
    Verifier = await ethers.getContractFactory("Verifier");
    Privacy = await ethers.getContractFactory("ETHPrivacy");
    signers = await ethers.getSigners();    
});

beforeEach(async () => {
    hasher = await Hasher.deploy();
    verifier = await Verifier.deploy();
    privacy = await Privacy.deploy(verifier.address, denomination, levels, hasher.address);
});

describe("Privacy #constructor", () => {
    it("should initialize ", async () => {
        expect(await privacy.denomination()).to.equal(denomination);
    });
})