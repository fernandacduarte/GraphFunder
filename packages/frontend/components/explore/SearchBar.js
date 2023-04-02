import { Input } from "@material-tailwind/react";

const SearchBar = ({setSearchField, setSearchFrase}) => {
  const handleSelect = (event) => {
    setSearchField(event.target.value.toLowerCase())
  }
  const handleInput = (event) => {
    setSearchFrase(event.target.value.toLowerCase())
  }
  return ( 
    <div className="form-control drop-shadow">
      <div className="input-group">
        <select className="select select-bordered" onChange={handleSelect} >
          <option disabled selected>Project</option>
        </select>
        <input type="text" placeholder="Search…" className="input input-bordered" onChange={handleInput}/>
        <button className="btn btn-square border-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>
    </div>
  )
}

export default SearchBar;