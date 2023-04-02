
const hre = require("hardhat");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");
require('dotenv').config({ path: '../../../.env' });
// import { Network, Alchemy } from "alchemy-sdk";
const alchemySdk = require("alchemy-sdk");

const settings = {
  apiKey: process.env.ALCHEMY_OPT_GOERLI_KEY, // Replace with your Alchemy API Key.
  network: alchemySdk.Network.OPT_MAINNET, // Replace with your network.
};
const alchemy = new alchemySdk.Alchemy(settings);

function BN (num) {
  return hre.ethers.BigNumber.from(num)
}

function getProvider () {
  return new hre.ethers.providers.Web3Provider(hre.network.provider)
}

function reportGas(transactionReceipt, gasPrice) {
  // console.log(transactionReceipt)
  const gasUsed = transactionReceipt.gasUsed;
  // const effectiveGasPrice = transactionReceipt.effectiveGasPrice;
  // const txFee = gasUsed.mul(effectiveGasPrice);
  const txFee = gasUsed.mul(gasPrice);
  // console.log("  Gas spent: ", gasUsed.toString(), " fee: ", format(txFee));
  return txFee
}

function format (value) {
  return hre.ethers.utils.formatUnits(value)
}

function formatGwei (value) {
  return hre.ethers.utils.formatUnits(value)
}

async function claim (contract, beneficiary, claimee) {
  try {
    console.log("checking ", beneficiary.toString(), claimee.toString())
    const claimable = await contract.claimable(beneficiary, claimee)
    console.log("  claimable", format(claimable))
    const fee = claimable.div(BN(100))
    console.log("  fee", format(fee))
    if (fee.isZero()) {
      console.log("  nothing to claim")
      return
    }
    let gas
    if (beneficiary.eq(claimee)) {
      gas = await contract.estimateGas.claimToOwner(beneficiary)
    }
    else {
      gas = await contract.estimateGas.claimToDep(beneficiary, claimee)
    }
    console.log("  gasEstimation", gas.toString())
    const gasPrice = await alchemy.core.getGasPrice()
    console.log("  gasPrice", formatGwei(gasPrice))
    const txCost = gas.mul(gasPrice)
    console.log("  gasEstimationCost", format(txCost))
    if (fee.gt(txCost)) {
      let tx
      if (beneficiary.eq(claimee)) {
        tx = await contract.claimToOwner(beneficiary)
      }
      else {
        tx = await contract.claimToDep(beneficiary, claimee)
      }
      console.log("  claiming ", beneficiary.toString(), claimee.toString(), "tx: ", tx.hash)
      const txReceipt = await tx.wait()
      const txFee = reportGas(txReceipt, gasPrice)
      console.log("  Profit ",beneficiary.toString(), claimee.toString(), " :", format(fee.sub(txFee))," ETH")
    }
  }
  catch(err) {
    console.log(err)
  }
}

let curTriggerPromise = null

async function triggerClaims (contract, tokenId, pendingPromise) {
  if (pendingPromise) {
    await pendingPromise
  }
  console.log("triggerClaims", tokenId.toString())
  // claim own token donation
  await claim(contract, tokenId, tokenId)
  // claim references' cut
  const references = await contract.getDependencies(tokenId)
  if (references) {
    for(const ref of references) {
      await claim(contract, ref, tokenId)
    }
  }
}

async function main () {
  const { deployer } = await getNamedAccounts();
  console.log(deployer)
  const contract = await hre.ethers.getContract('NFT', deployer)
  // console.log(contract)
  const tokenCount = await contract.numberOfTokens()
  console.log("tokenCount", tokenCount.toNumber())

  const donateFilter = contract.filters.Donation()
  const donateClaimedFilter = contract.filters.DonationClaimed()

  const provider = getProvider()
  provider.on(donateFilter, (log) => {
    const parsedEvent = contract.interface.parseLog({
      topics: log.topics,
      data: log.data,
    })
    const tokenId = parsedEvent.args.tokenId
    console.log("Donation event:")
    console.log("  donor: ", parsedEvent.args.donor)
    console.log("  tokenId: ", tokenId.toString())
    console.log("  value: ", format(parsedEvent.args.value))
    curTriggerPromise = triggerClaims(contract, tokenId, curTriggerPromise)
  })
  provider.on(donateClaimedFilter, (log) => {
    const parsedEvent = contract.interface.parseLog({
      topics: log.topics,
      data: log.data,
    })
    const tokenId = parsedEvent.args.to
    console.log("DonationClaimed event:")
    console.log("  from: ", parsedEvent.args.from.toString())
    console.log("  to: ", tokenId.toString())
    console.log("  value: ", format(parsedEvent.args.valueClaimed))
    curTriggerPromise = triggerClaims(contract, tokenId, curTriggerPromise)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});