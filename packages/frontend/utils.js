import { ethers } from "ethers";
import axios, { Axios } from 'axios'
import {
  NETWORK_ID,
} from "./config";
const chainId = Number(NETWORK_ID);

import contracts from "./contracts/hardhat_contracts.json";
const contractAddress =
  contracts[chainId][0].contracts.NFT.address;
const contractABI =
  contracts[chainId][0].contracts.NFT.abi;

export const getContractData = () => {
  return [contractAddress, contractABI];
};

export const getEthersNftContract = (provider) => {
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  return contract
}

export const ipfsToHTTP = (ipfsName) => ipfsName.replace("ipfs://", "https://ipfs.io/ipfs/");

export const getTokenMetadata = async (provider, tokenId) => {
  const nftContract = getEthersNftContract(provider)
  const tokenUri = await nftContract.tokenURI(tokenId)
  return axios.get(ipfsToHTTP(tokenUri))
}

export const stringShortener = (str, limit) => {
  if (str && str.length > limit) {
    const sliceSize = 15
    return `${str.slice(0, sliceSize)}...${str.slice(
      str.length - sliceSize,
      str.length
    )}`;
  }
  return str;
};

export const stringTrim = (str, limit) => {
  if (str && str.length > limit) {
    return `${str.slice(0, limit)}...`;
  }
  return str;
};