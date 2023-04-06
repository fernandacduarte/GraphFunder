import { ethers } from "ethers";
import React from 'react';

import {
  useTokenId,
} from "../../hooks/nft"

import { useContractWrite, useContractRead, usePrepareContractWrite } from "wagmi";

function validate(s) {
  var rgx = /^[0-9]*\.?[0-9]*$/;
  return s.match(rgx);
}

const InputDonation = ({ contractAddress, contractABI, donationAmount, setDonationAmount }) => {
  const tokenId = useTokenId();
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'donate',
    args: [tokenId],
    overrides: {
      value: ethers.utils.parseEther(donationAmount === '' ? "0.0" : donationAmount),
    },
  })
  const { write } = useContractWrite(config)

  const handleChange = (event) => {
    if (validate(event.target.value))
      setDonationAmount(event.target.value)
  }

  return (
    <div className="card form-control place-items-center bg-transparent p-1.5">
      <input type="text"
             placeholder="0.01 CELO"
             className="input input-bordered w-40"
             value = {donationAmount}
             onChange={handleChange}/>
      <button onClick={write} className="btn btn-primary bg-yellow-500 border-transparent text-black hover:text-base-100 hover:bg-[#333] hover:border-transparent uppercase mt-3 text-xs font-bold">Donate</button>
    </div>
  );
};

const Donation = ({ contractAddress, contractABI, donationAmount, setDonationAmount }) => {
  const tokenId = useTokenId();
  const { data, isError } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'tokenTotalDonated',
    args: [tokenId],
    watch: true,
  })

  let value = ""
  if (data) {
    value = ethers.utils.formatEther(data, {commify: true})
  }
  else if (isError) {
    value = "error"
  }
  
  return (
    <div className="stats flex drop-shadow mt-10">
      <div className="stat place-items-center">
        <div className="stat-title font-semibold">Total Donations</div>
        <div className="stat-value text-sky-900 text-10xlg">{value}</div>
        <div className="stat-desc text-sky-900">CELO</div>
      </div>
      <div className="stat">
        <InputDonation 
          contractAddress={contractAddress}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount} />
      </div>
    </div>
  )
}

export default Donation;