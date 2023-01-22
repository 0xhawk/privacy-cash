import { expect } from "chai";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

const HasherPath = "../build/contracts/Hasher.json";
const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

let Hasher: ContractFactory;
let MerkleTree: ContractFactory;

let hasher: Contract;
let merkleTree: Contract;

before(async () => {
    Hasher = await ethers.getContractFactory(require(HasherPath).abi, require(HasherPath).bytecode);
    MerkleTree = await ethers.getContractFactory("MerkleTreeMock");
});

beforeEach(async () => {
    hasher = await Hasher.deploy();
    merkleTree = await MerkleTree.deploy(levels, hasher.address);
});

describe("MerkleTree #constructor", () => {
    it("should initialize", async () => {
        const zeroValue: BigNumber = await merkleTree.ZERO_VALUE();

        expect(await merkleTree.zeros(0)).to.equal(zeroValue);
        expect(await merkleTree.filledSubtrees(0)).to.equal(zeroValue);
    })
})