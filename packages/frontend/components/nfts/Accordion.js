import React, { useState } from 'react'
import AccordionLayout from './AccordionLayout'
import {useTokenId, useTokenMetaData} from "../../hooks/nft"

const Accordion = (props) => {
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
          title={props.title}
          body={metadata ? metadata.website : ""}
          index={0}
          activeIndices={activeIndices}
          setActiveIndices={setActiveIndices} 
        />
    </div>
  )
}

export default Accordion