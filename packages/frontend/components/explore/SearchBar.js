const SearchBar = ({setSearchFrase}) => {
  const handleInput = (event) => {
    setSearchFrase(event.target.value.toLowerCase())
  }
  return ( 
    <div className="form-control drop-shadow">
      <input 
        type="text" 
        placeholder="Search projects..." 
        className="input input-bordered input-accent w-128 bg-[#292C3D] text-[#FFFFFF]" 
        onChange={handleInput}
      />
    </div>
  )
}

export default SearchBar;
