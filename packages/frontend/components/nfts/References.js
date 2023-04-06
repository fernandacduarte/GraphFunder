import React from 'react';
import { useRouter } from 'next/router'
import { ethers } from "ethers";
import { useContractRead } from "wagmi";

import { getContractData } from '../../utils'
import {
  useTokenId,
  useTokenMetaData,
} from "../../hooks/nft"

const [contractAddress, contractABI] = getContractData();

const ReferenceRow = ({ index, tokenId }) => {
  const router = useRouter()
  const metadata = useTokenMetaData(tokenId)

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

  const rowClick = () => {
    router.push(`/nfts/${tokenId}`)
  }
  
  return (
      <tr className="hover" onClick={rowClick}>
        <td>{index + 1}</td>
        <td>{metadata ? metadata.name : ""}</td>
        <td>{metadata ? metadata.website : ""}</td>
        <td>{value} CELO</td>
      </tr>
  )
}

const ReferenceTable = ({ references }) => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th></th>
          <th>Project</th>
          <th>site</th>
          <th>Total Donations</th>
        </tr>
      </thead>
      <tbody>
        {
          references.map((refId, idx) => {
            const strId = refId.toString()
            return (
                <ReferenceRow index={idx} tokenId={strId} />
            )
          })
        }
      </tbody>
    </table>
  )
}

const References = () => {
  const tokenId = useTokenId();
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getDependencies',
    args: [tokenId],
  })

  // TODO: improve isLoading and isError
  if (isLoading) {
    return (
      <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
        Loading references...
      </h2> 
    )
  }

  if (isError) {
    console.log(isError)
    return (
      <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
        Error loading references
      </h2> 
    )
  }

  return (
    <div className="sm:text-center mt-8">
      <div className="w-full">
        <div className="text-left pl-2 pb-3 mb-3 border-b border-gray-300 text-gray-700 font-semibold">
          References
        </div>
        <div className="overflow-x-auto drop-shadow-md">
          {data.length > 0 ? <ReferenceTable references={data} /> : null}
        </div>
      </div>
    </div>
  )
}

export default References