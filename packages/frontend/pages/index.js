import { useState } from "react";
import Navbar from '../components/common/Navbar';
import SearchBar from '../components/explore/SearchBar';
import CardToken from '../components/explore/CardToken';

import { useAllMetadata } from '../hooks/nft'

const processSearch = (searchFrase, allMetadata) => {
  if (!allMetadata) {
    return allMetadata
  }
  const search = allMetadata.filter(e => {
    if (searchFrase === '') {
      return true
    }
    const match = e.metadata.name.toLowerCase().match(searchFrase.toLowerCase())
    return match !== null
  })
  return search
}

export default function ExploreComponent() {
  const [searchFrase, setSearchFrase] = useState('')
  const allMetadata = useAllMetadata()
  
  const searchList = processSearch(searchFrase, allMetadata)
  
  return (
    <div className="bg-[#1E202D]">
      <Navbar/>
      <div className="flex flex-col w-full place-items-center p-6">
        <SearchBar setSearchFrase={setSearchFrase}/>
      </div>      
      <div className="flex flex-col w-full">
        <div className="p-4 place-items-center">  
          <div className="flex flex-wrap flex-none flex-row justify-between gap-6 p-4">
            {
              searchList.map(e => {
                return (
                  <CardToken tokenId={e.tokenId} metadata={e.metadata}/>
                  )
                })
              }
            {/** width 96 is the same as CardToken component */}
            {/** Important: do not remove the next 3 rows! */}
            <div className="w-96 h-0" />
            <div className="w-96 h-0" />
            <div className="w-96 h-0" />
          </div> 
        </div>
      </div>
    </div>
  )
}
