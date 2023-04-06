import { useState } from 'react'
import { useRouter } from 'next/router'
import { NFTStorage, File } from 'nft.storage'

import Navbar from '../components/common/Navbar';
import PreviewCard from '../components/publish/PreviewCard';
import ReferenceInput from '../components/publish/ReferenceInput';
import DescriptionInput from '../components/publish/DescriptionInput';
import TextInput from '../components/publish/TextInput';
import {NFT_STORAGE_KEY} from '../nftstoragekey';

import {
  useContract,
  useSigner,
} from "wagmi";

import { getContractData } from '../utils'
const [contractAddress, contractABI] = getContractData();

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
      inputWebsite,
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
    <div className="bg-[#1E202D]">
      <Navbar/>
      <div className="bg-[#1E202D] min-h-screen">
        <div className="hero min-h-fit bg-[#1E202D] pt-6 pb-6">
            <div className="w-3/5 hero-content bg-base-100 flex-col card lg:flex-row-reverse drop-shadow-md  relative overflow-x-auto overflow-y-auto mt-10">
              <div>
                <PreviewCard project={inputProject} setImage={setImage} website={inputWebsite}/>
              </div>
              <div className="card shrink w-full max-w-2xl bg-base-100">
                <div className="card-body pl-1">
                  <TextInput label={"Project"} placeholder={"Enter your project's name"} func={setInputProject} />
                  <TextInput label={"Website"} placeholder={"Enter your website's url"} func={setInputWebsite} />
                  <DescriptionInput func={setInputDescription}/>
                  <ReferenceInput setReferences={setReferences} />
                  <div className="form-control mt-6">
                    <button onClick={mint} className="btn btn-primary bg-black border-black hover:bg-[#59CAAE] hover:border-[#59CAAE] hover:text-black">{buttonText}</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
