
import axios, { Axios } from 'axios'
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import {
  useContractRead,
  useContract,
  useProvider,
} from "wagmi";

import {
  getContractData,
  getEthersNftContract,
  ipfsToHTTP,
  getTokenMetadata,
} from '../utils'

const [contractAddress, contractABI] = getContractData();

// export const useTokenUri = (tokenId) => {
//   const [tokenUri, setTokenUri] = useState()
//   const [tokenUriError, setTokenUriError] = useState()
//   if (!tokenUri && !tokenUriError) {
//       const { data, isError, isLoading } = useContractRead({
//       address: contractAddress,
//       abi: contractABI,
//       functionName: 'tokenURI',
//       args: [tokenId],
//     })
//     console.log(data, isError, isLoading)
//     if (!isLoading && !isError) {
//       console.log("data",data)
//       setTokenUri(data);
//     }
//     else if (isError) {
//       console.log("isError")
//       console.log(isError)
//       setTokenUriError(isError)
//     }
//   }
//   return tokenUri
// }

export const useTokenUri = (tokenId) => {
  const [tokenUri, setTokenUri] = useState()
  const provider = useProvider()
  // console.log(tokenUri)
  useEffect(() => {
    if (provider && tokenId) {
      const nftContract = getEthersNftContract(provider)
      nftContract.tokenURI(tokenId).
      then ( uri =>{
        setTokenUri(uri)
      })
    }
  },[provider, tokenId])
  return tokenUri
}

export const useTokenMetaData = (tokenId) => {
  const [tokenMetadata, setTokenMetadata] = useState()
  const tokenUri = useTokenUri(tokenId)
  useEffect(() => {
    if (tokenUri) {
      axios.get(ipfsToHTTP(tokenUri)).
      then(request => {
        // console.log(request.data)
        setTokenMetadata(request.data)
      })
    }
  },[tokenUri])
  return tokenMetadata
}

export const useAllMetadata = () => {
  const [allMetadata, setAllMetadata] = useState([])
  const requests = useRef({})
  const provider = useProvider()
  const { data: tokenCount, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'numberOfTokens',
    watch: true,
  })

  useEffect(() => {
    if (!tokenCount) {
      return
    }
    if (tokenCount > allMetadata.length) {
      for (let i=allMetadata.length; i<tokenCount; i++) {
        if (!requests.current[i]) {
          requests.current[i] = getTokenMetadata(provider, i).then(
            response => {
              console.log(i, response)
              // allMetadata.push()
              setAllMetadata(arr => {
                const ret = [...arr, {tokenId: i.toString(), metadata: response.data}]
                ret.sort((e1, e2) => e2.tokenId - e1.tokenId)
                return ret
              })
            }
          ) 
        }
        
      }
    }
  },[tokenCount])

  return allMetadata
}

export const useTokenImage = (tokenId) => {
  const metadata = useTokenMetaData(tokenId)
  return metadata ? ipfsToHTTP(metadata.image) : null;
}

export function useTokenId () {
  const router = useRouter()
  const {tokenId} = router.query
  return tokenId
}