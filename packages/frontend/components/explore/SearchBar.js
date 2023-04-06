const SearchBar = ({setSearchFrase}) => {
  const handleInput = (event) => {
    setSearchFrase(event.target.value.toLowerCase())
  }
  return ( 
    <div className="form-control drop-shadow">
      <input type="text" placeholder="Search projects..." className="input input-bordered w-128" onChange={handleInput}/>
    </div>
  )
}

export default SearchBar;
