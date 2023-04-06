import React, { useState } from 'react';

import Accordion from '../../components/nfts/Accordion';
import Navbar from '../../components/common/Navbar';
import {
  useTokenId,
  useTokenMetaData,
  useTokenImage
} from "../../hooks/nft"
import { getContractData } from '../../utils'
import Donation from '../../components/nfts/Donation';
import References from '../../components/nfts/References';
import Title from '../../components/nfts/Title';
import Description from '../../components/nfts/Description';

const [contractAddress, contractABI] = getContractData();

const NftPageComponent = () => {
  const [donationAmount, setDonationAmount] = useState("")
  const tokenId = useTokenId()
  const imageUrl = useTokenImage(tokenId)
  const metadata = useTokenMetaData(tokenId)

  return (
    <div className="bg-base-200 min-h-screen pb-10">
      <Navbar />
      <div className="card py-12 bg-base-100 drop-shadow-md mt-10 px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid gap-12 row-gap-8 lg:grid-cols-2 place-items-center">
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <figure className="h-full overflow-hidden grid grid-rows-2 drop-shadow-md">
                  <img className="card " width="384px" height="100px" src={imageUrl} />
              </figure>
              <Donation 
                contractAddress={contractAddress} 
                contractABI={contractABI} 
                donationAmount={donationAmount}
                setDonationAmount={setDonationAmount} />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <Title name={metadata ? metadata.name : ''}/>
              <Description text={metadata ? metadata.description : ''}/>
              <Accordion title="website"/>
            </div>        
          </div>
        </div>
        <References />
      </div>
    </div>
  );
};

export default NftPageComponent;