import { useState } from 'react'; 
import PokemonNFTABI from './contracts/PokemonNFTABI.json'; 

function App() {
  return (
    <div className="App">
      <div>
        <h1> Pokemon Collection</h1>
        <MintButton /> <br></br>
        <SearchPokemon />

        <p id="mint-pokemon"></p>
        <p id="pokemon-info"></p>
      </div>
    </div>
  );
}

function MintButton() {

  const mintPokemon = () => {
    const p = document.getElementById("mint-pokemon"); 
    p.innerHTML = "minting Pokemon";

  }

  return (
    <button onClick={mintPokemon}> Mint New Pokemon </button>
  )
}

function SearchPokemon() {
  const [inputValue, setInputValue] = useState('');

  const fetchPokemon = () => {
    
  }

  const printPokemon = () => { 
    document.getElementById('pokemon-info').innerHTML = inputValue;
    
  }

  return ( 
    <>
      <label htmlFor="search">Pokemon: </label>
      <input id="search-pokemon" type="text" onChange={(event) => {
        setInputValue(event.target.value);
      }}></input>
      <button onClick={printPokemon}> Search </button>
    </>
  )
}

export default App;
