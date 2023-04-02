

import Link from "next/link"
import {
  useTokenMetaData,
  useTokenImage
} from "../../hooks/nft"

import {
  ipfsToHTTP,
  stringTrim
} from '../../utils'

const ImageIPFS = (imgUrl) => {
  return (
    <div></div>
  )
}

const CardToken = ({tokenId, metadata}) => {
  let imageUrl = metadata ? ipfsToHTTP(metadata.image) : null
  const href = `/nfts/${tokenId}`
  return ( 
    <Link href={href}>
      <div className="card w-96 h-[480px]  bg-base-100 border border-black-100 shadow-md mb-5 transform transition duration-500 hover:scale-105">
        {/* <div className="h-64 bg-base-300 place-content-center"> */}
          <figure className="max-h-sm h-full overflow-hidden">
            <img className="overflow-hidden" width="384px" height="100px" src={imageUrl}/>
          </figure>
        {/* </div> */}
        <div className="card-body">
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
            <span
              // href={href}
              className="text-gray-900"
            >
              {metadata ? metadata.website : ""}
            </span>
            {/* <span className="text-gray-600"> {props.date} </span> */}
          </p>
          <span
            // href={href}
            className="inline-block mb-3 text-2xl font-bold leading-7"
          >
            {metadata ? stringTrim(metadata.name, 50) : ""}
          </span>
          {/* <p className="mb-2 text-gray-700">
            {metadata ? metadata.properties.keywords : ""}
          </p> */}
        </div>
      </div>
    </Link>
  )
}

export default CardToken;