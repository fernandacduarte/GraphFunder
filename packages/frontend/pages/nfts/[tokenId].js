import { Button } from '@material-tailwind/react';
import { ethers } from "ethers";
import React, { Component } from 'react';
import { useState } from "react";
import { useRouter } from 'next/router'
import Accordion from '../../components/nfts/Accordion';
import Navbar from '../../components/Navbar';
import {
  useTokenId,
  useTokenUri,
  useTokenMetaData,
  useTokenImage
} from "../../hooks/nft"

import { useContractWrite, useContractRead, usePrepareContractWrite } from "wagmi";

import {
  ipfsToHTTP,
  getContractData,
} from '../../utils'

const [contractAddress, contractABI] = getContractData();

//Todo
// const DowloadPaper = () => {
//   const tokenId = useTokenId();
//   const metadata = useTokenMetaData(tokenId)
//   const pdfUrl = metadata ? ipfsToHTTP(metadata.properties.pdf) : null
//   return (
//     <div className="text-center mt-10">
//       {/* <button className="btn btn-primary bg-black border-black hover:bg-[#570DF8] hover:border-[#570DF8] hover:text-white"> */}
//       <a target="_blank" href={pdfUrl} rel="noopener noreferrer">
//       <button className="btn btn-primary bg-black border-black hover:text-base-100 hover:bg-[#333] hover:border-transparent">
//         Download Paper
//       </button>
//       </a>
//     </div>
//   )
// }

//Todo
const Title = () => {
  const tokenId = useTokenId();
  const metadata = useTokenMetaData(tokenId)
  return (
    <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
      {metadata ? metadata.name : "..."}
    </h2>
  )
}

//Todo
const Description = () => {
  const tokenId = useTokenId();
  const metadata = useTokenMetaData(tokenId)
  return (
    <p className="text-base text-justify text-gray-700 md:text-lg">
      <span className="mb-2 font-semibold leading-5">
        Description:&nbsp;
      </span>
      {metadata ? metadata.description : "..."}
      <br></br>
    </p>
  )
}

const ReferenceRow = ({index, tokenId}) => {
  const router = useRouter()
  const metadata = useTokenMetaData(tokenId)

  const { data, isError, isLoading } = useContractRead({
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

const ReferenceTable = ({references}) => {
  return (
    <table className="table w-full">
      {/* <!-- head --> */}
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
                <ReferenceRow index={idx} tokenId={strId}/>
            )
          })
        }
      </tbody>
    </table>
  )
}

//Todo
const References = () => {
  const tokenId = useTokenId();
  // const metadata = useTokenMetaData(tokenId)
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getDependencies',
    args: [tokenId],
  })

  // TODO melhorar isLoading e isError
  if (isLoading) {
    return (
      <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
        Loading references
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
          {data.length > 0 ? <ReferenceTable references={data}/> : null}
        </div>
      </div>
    </div>
  )
}

const EthSymbol = () => {
  return (
    <svg 
      width="32px" 
      height="32px" 
      viewBox="-6.18 0 32 32" 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      preserveAspectRatio="xMidYMid">
        <g>
          <path fill="#343434" points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32" d="M9.819 0L9.605 0.73L9.605 21.883L9.819 22.1L19.638 16.293Z"/>
          <path fill="#8C8C8C" points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" d="M9.819 0L0 16.293L9.819 22.1L9.819 11.829Z"/>
          <path fill="#3C3C3B" points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866" d="M9.819 23.957L9.697 24.102L9.697 31.638L9.819 31.99L19.644 18.155Z"/>
          <path fill="#8C8C8C" points="127.962 416.9052 127.962 312.1852 0 236.5852" d="M9.819 31.99L9.819 23.957L0 18.155Z"/>
          <path fill="#141414" points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587" d="M9.819 22.1L19.638 16.293L9.819 11.829Z"/>
          <path fill="#393939" points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588" d="M0 16.293L9.819 22.1L9.819 11.829Z"/>
        </g>
    </svg>
    // <svg 
    //   width="38px" 
    //   height="38px" 
    //   viewBox="-7.335 0 38 38" 
    //   version="1.1" 
    //   xmlns="http://www.w3.org/2000/svg" 
    //   xmlnsXlink="http://www.w3.org/1999/xlink" 
    //   preserveAspectRatio="xMidYMid">
    //     <g>
    //       <path 
    //       fill="#343434" 
    //       points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32" 
    //       d="M11.661 0L11.406 0.866L11.406 25.987L11.661 26.241L23.323 19.35Z"/>
    //       <path 
    //       fill="#8C8C8C" 
    //       points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" 
    //       d="M11.661 0L0 19.35L11.661 26.241L11.661 14.05Z"/>
    //       <path 
    //       fill="#3C3C3B" 
    //       points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"
    //         d="M11.661 28.448L11.517 28.623L11.517 37.573L11.661 37.991L23.331 21.56Z"/>
    //       <path 
    //       fill="#8C8C8C" 
    //       points="127.962 416.9052 127.962 312.1852 0 236.5852" 
    //       d="M11.661 37.991L11.661 28.448L0 21.56Z"/>
    //       <path 
    //       fill="#141414" 
    //       points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"
    //         d="M11.661 26.241L23.323 19.35L11.661 14.05Z"/>
    //         <path 
    //         fill="#393939" 
    //         points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588" 
    //         d="M0 19.35L11.661 26.241L11.661 14.05Z"/>
    //   </g>
    // </svg>
  );
};

//Todo
const TotalDonation = () => {
  return (
    <div className="card bg-[#F2F2F2] text-center mt-5 mb-3 pr-2.5 w-36 drop-shadow-lg text-gray-700 ">
      <div className="flex items-center justify-center mt-2">
        {/* <EthSymbol /> */}
        <h6 className="text-5xl font-extrabold">
        40 
        </h6>
      </div>
      <p className="mt-1 mb-2 ml-2 text-sm font-medium tracking-widest uppercase">donations</p>
    </div>
  );
};

function validate(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
}

const InputDonation = () => {
  const [donationAmount, setDonationAmount] = useState("")
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
      {/* <button className="btn btn-primary bg-[#F7BE38] border-transparent text-black hover:text-white uppercase mt-3 text-xs font-bold">Donate</button> */}
      <button onClick={write} className="btn btn-primary bg-yellow-500 border-transparent text-black hover:text-base-100 hover:bg-[#333] hover:border-transparent uppercase mt-3 text-xs font-bold">Donate</button>
    </div>
  );
};

const DonationsInfo1 = () => {
  return (
    <div className="card border-gray-800 place-items-center">
      <TotalDonation />
      <div className="form-control pl-14 mb-5 mt-3 mr-12">
        <label className="input-group">
          <input type="text" placeholder="0.01 CELO" className="input input-bordered border-gray-400" />
          <span className="bg-[#F7BE38] font-semibold">
            <svg 
              class="w-4 h-4 mr-2 -ml-1 text-[#000000]" 
              aria-hidden="true" 
              focusable="false" 
              data-prefix="fab" 
              data-icon="ethereum"
              role="img" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 320 512">
                <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
            </svg>
            Donate!
          </span>
        </label>
      </div>
    </div>
  )
}

const DonationsInfo2 = () => {
  const tokenId = useTokenId();
  // const metadata = useTokenMetaData(tokenId)
  const { data, isError, isLoading } = useContractRead({
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
    <div className="stats drop-shadow mt-10">
      <div className="stat">
        <div className="stat-figure text-primary mt-2">
          {/* <EthSymbol /> */}
        </div>
        <div className="stat-title font-semibold">Total Donations</div>
        {/* <div className="stat-value text-primary text-10xlg text-black">25.6</div> */}
        {/* <div className="stat-value text-[#81559B] text-10xlg">25.6</div> */}
        <div className="stat-value text-sky-900 text-10xlg">{value}</div>
        {/* <div className="stat-value text-[#006D77] text-10xlg">25.6</div> */}
      </div>
      <div className="stat">
        <InputDonation />
      </div>
      
    </div>
  )
}

const DonationsInfo3 = () => {
  return (
    <div class="grid grid-cols-2 row-gap-8 md:grid-cols-2">
      <div class="text-center md:border-r">
      <TotalDonation />
      </div>
      <div class="text-center">
        <InputDonation />
      </div>
    </div>
  )
}

const CoverDonateContainer = () => {
  const tokenId = useTokenId()
  const imageUrl = useTokenImage(tokenId)
  return (
    <div className="flex flex-col justify-center">
      <div className="max-w-xl mb-6">
        <figure className="h-full overflow-hidden grid grid-rows-2 drop-shadow-md">
            <img className="card " width="384px" height="100px" src={imageUrl} />
        </figure>
        {/** 1o estilo */}
        {/* <DonationsInfo1 /> */}
        {/** 2o estilo */}
        <DonationsInfo2 />
      </div>
      {/** 3o estilo */}
      {/* <DonationsInfo3 /> */}
    </div>
    
  );
};

const Content = () => {
  return (
    <div className="card py-12 bg-base-100 drop-shadow-md m-10 px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div className="grid gap-12 row-gap-8 lg:grid-cols-2 place-items-center">
        {/** Cover image and donate info*/}
        <CoverDonateContainer />
        <div className="flex flex-col justify-center">
          <div className="max-w-xl mb-6">
            <Title />
            <Description />
            <Accordion />
            {/* <DowloadPaper /> */}
          </div>        
        </div>
      </div>
      <References />
    </div>
  );
};

const NftPageComponent = () => {
  const tokenId = useTokenId()
  return (
    <div className="bg-base-200">
      <Navbar />
      <Content />
    </div>
  );
};

//debug
const outroEstilo = () => {
  return (
    <div>
      <div className="grid grid-cols-3 grid-flow-row gap-4 w-5/6 h-1/2">
          <div className="row-span-2 bg-red-900">
            <figure className="card flex-none h-1/2 w-1/2 overflow-hidden">
              <img width="384px" height="100px" src="https://placeimg.com/260/400/arch" className="max-w-sm rounded-lg shadow-2xl" />
            </figure>
          </div>
          <div className="row-span-2 bg-blue-900">02</div>
          <div className="row-span-3 bg-green-900">03</div>
          <div className="col-span-2 bg-yellow-900">04</div>
        </div>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row w-5/6">
            <div className="grid-rows-2 w-1/2">
              <div className="hero-content flex-col lg:flex-row">
                <figure className="card flex-none h-64 overflow-hidden">
                  <img width="384px" height="100px" src="https://placeimg.com/260/400/arch" className="max-w-sm rounded-lg shadow-2xl" />
                </figure>
                <div className="flex-shrink">
                  <h1 className="text-5xl font-bold">Box Office News!</h1>
                  <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                  <button className="btn btn-primary">Get Started</button>
                </div>
              </div>
              <div className="p-4">
                {/* <h1 className="text-5xl font-bold">Box Office News!</h1> */}
                <p className="py-6">
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
              </div>      
            </div>
            <object className="h-4/6 w-128" data="http://africau.edu/images/default/sample.pdf" type="application/pdf" width="555px" height="800px">
              <p>Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a></p>
            </object>
          </div>      
        </div>
      </div>
  )
}

export default NftPageComponent;