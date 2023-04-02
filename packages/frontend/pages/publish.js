//TODOs
// Mintar! (nft storage)
// Colocar mais de um autor?
// Refatorar
// Conseguir colocar uma altura máxima para a tabela e acrescentar barra de rolagem quando essa altura for atingida
// Colocar endereço do autor no card, em vez do nome?

import { useState } from 'react'
import { useRouter } from 'next/router'
import { NFTStorage, File } from 'nft.storage'

import Navbar from '../components/Navbar';
import PreviewCard from '../components/publish/PreviewCard';
import ReferenceInput from '../components/publish/ReferenceInput';
import DescriptionInput from '../components/publish/DescriptionInput';
import TextInput from '../components/publish/TextInput';
import {NFT_STORAGE_KEY} from '../nftstoragekey';

import {
  useContract,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useSigner,
  useWaitForTransaction,
  chain,
} from "wagmi";

import { getContractData } from '../utils'
const [contractAddress, contractABI] = getContractData();

const description = "OPenScience: permissionless research publishing and retroactive graph-funding"

// TODO: move it to a different file
async function storeNFT(image, project, website, description) {
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    return nftstorage.store({
        image,
        name: project,
        description: description,
        website,
    })
}

let inputDescription = "";
function setInputDescription(description) {
  inputDescription = description;
}

let image = null;
function setImage (img) {
  image = img;
}

let references = []
function setReferences (refs) {
  references = refs
}

const initialButtomText = "Mint!"
export default function PublishComponent() {
  const [inputProject, setInputProject] = useState("");
  const [inputWebsite, setInputWebsite] = useState("");
  const [buttonText, setButtonText] = useState(initialButtomText)
  let router= useRouter()

  const { data: signerData } = useSigner();
  const nftContract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: signerData,
  });
  
  const mint = async () => {
    if (!signerData) {
      alert("Connect wallet to mint nft.")
      return
    }
    if (buttonText !== initialButtomText) {
      return
    }
    // TODO check valid inputs
    setButtonText("Storing nft data ...")
    const storeReturn = await storeNFT(
      image,
      inputProject,
      inputProject,
      inputDescription
    )
    console.log("storeReturn", storeReturn)
    let error = null
    let txReceipt
    try {
      setButtonText("Signing transaction ...")
      const shares = Array(references.length).fill(10)
      const tx = await nftContract.createToken(storeReturn.url, references, shares)
      setButtonText("Sending transaction ...")
      txReceipt = await tx.wait()
    }
    catch(e) {
      console.log(e)
      error = e
      let msg = "Transaction error.\n".concat(e) 
      alert(msg)
      setButtonText(initialButtomText)
    }
    if (error === null) {
      console.log("success")
      console.log(txReceipt)
      const transferEvent = txReceipt.events.filter(e => e.event === "Transfer")
      const tokenId = transferEvent[0].args.tokenId.toString()
      console.log('tokenId',tokenId)
      router.push(`/nfts/${tokenId}`)
    }
  }
  
  return (
    <div>
      <Navbar/>
      <div className="bg-base-200 min-h-screen">
        <div className="hero min-h-fit bg-base-200 pt-6 pb-6">
          {/* <div className="w-1/2 card drop-shadow-md bg-base-100 place-items-center"> */}
          {/* <div className="w-1/2 card drop-shadow-md bg-base-100 place-items-center"> */}
            {/* <div className="w-1/2 hero-content flex-col card lg:flex-row-reverse drop-shadow-md bg-base-100 relative"> */}
            <div className="w-3/5 hero-content flex-col card lg:flex-row-reverse drop-shadow-md bg-base-100 relative overflow-x-auto overflow-y-auto">
              <div>
                <PreviewCard project={inputProject} setImage={setImage} website={inputWebsite}/>
              </div>
              <div className="card shrink w-full max-w-2xl bg-base-100">
                <div className="card-body pl-3">
                  <TextInput text={"Project"} func={setInputProject} />
                  <TextInput text={"Website"} func={setInputWebsite} />
                  <DescriptionInput func={setInputDescription}/>
                  <ReferenceInput setReferences={setReferences} />
                  <div className="form-control mt-6">
                    <button onClick={mint} className="btn btn-primary bg-black border-black hover:bg-yellow-500 hover:border-yellow-500 hover:text-black">{buttonText}</button>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="w-4/5 form-control mt-6 pb-10">
              <button className="btn btn-primary">Mint!</button>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}
