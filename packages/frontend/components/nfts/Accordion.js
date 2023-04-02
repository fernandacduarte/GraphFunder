import React, { useState } from 'react'
import AccordionLayout from './AccordionLayout'
import {useTokenId, useTokenUri, useTokenMetaData} from "../../hooks/nft"

export default function Accordion() {
  const [activeIndices, setActiveIndices] = useState([false, false])
  const tokenId = useTokenId();
  const metadata = useTokenMetaData(tokenId)
  console.log(metadata)
  // console.log('activeIndices', activeIndices)

  return (
    <div 
      id="accordion-flush" 
      data-accordion="collapse" 
    >
        <AccordionLayout 
          title="website" 
          body={metadata ? metadata.website : ""}
          index={0}
          activeIndices={activeIndices}
          setActiveIndices={setActiveIndices} 
        />
    </div>
  )
}
