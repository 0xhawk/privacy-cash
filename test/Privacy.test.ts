import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory, utils } from "ethers";
import { ethers } from "hardhat";
import path from "path";
import { toFixedHex } from "../utils/ethers";

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
});

describe("Privacy #deposit", () => {
  it("should emit event", async () => {
    const commitment = toFixedHex(42);
    await expect(privacy.deposit(commitment, { value: utils.parseEther("1") })).to.emit(privacy, "Deposit");
  });

  it("should revert if there is a such commitment", async () => {
    const commitment = toFixedHex(42);
    await privacy.deposit(commitment, { value: utils.parseEther("1") });
    await expect(privacy.deposit(commitment, { value: utils.parseEther("1") })).to.be.revertedWith(
      "The commitment has been submitted",
    );
  });

  it("should revert if ETH amount not equal to denonination", async () => {
    const commitment = toFixedHex(42);
    await expect(privacy.deposit(commitment, { value: utils.parseEther("2") })).to.be.revertedWith(
      "Please send `mixDenomination` ETH along with transaction",
    );
  });
});
