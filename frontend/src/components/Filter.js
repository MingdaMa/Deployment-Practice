const Filter = (props) => {
  const {searchWord, handleSearchWordChange} = props;
  
  return (
    <div>
        filter shown with <input value={searchWord} onChange={handleSearchWordChange}/>
      </div>
  )
}

export default Filter;