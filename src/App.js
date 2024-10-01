import { useState } from 'react'; 
import {ethers} from 'ethers';
import PokemonNFTABI from './contracts/PokemonNFTABI.json'; 

function App() {
  return (
    <div className="App">
      <div>
        <h1> Pokemon Collection</h1>
        <MintButton /> <br></br>
        <SearchPokemon />

        <p id="mint-pokemon"></p>
        <div id="mint-pokemon-container"></div>
        <p id="pokemon-info"></p>
        <div id="pokemon-container"></div>
      </div>
    </div>
  );
}

function MintButton() {

  const mintPokemon = () => {
    const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
    const p = document.getElementById("mint-pokemon"); 
    const pokemonNumber = Math.floor((Math.random() * 150) + 1); 
    p.innerHTML = "minting Pokemon";

    fetch(`${POKE_API_URL}/${pokemonNumber}`)
      .then((response) => response.json())
      .then((mintedPokemon) => {

        const pokemonNFTCard = document.createElement('div'); 
        const pokemonImage = document.createElement('img');
        const pokemonName = document.createElement('h1'); 

        pokemonNFTCard.className = "pokemon-mint-card"; 
        pokemonImage.src = mintedPokemon.sprites.other.dream_world.front_default;
        pokemonName.textContent = mintedPokemon.name;

        pokemonNFTCard.appendChild(pokemonName);
        pokemonNFTCard.appendChild(pokemonImage); 
        console.log(mintedPokemon.name);

        document.getElementById('mint-pokemon-container').appendChild(pokemonNFTCard);
      })
    
  }

  return (
    <button onClick={mintPokemon}> Mint New Pokemon </button>
  )
}

function SearchPokemon() {

  const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
  const [inputValue, setInputValue] = useState('');

  const fetchPokemon = () => {
    
  }

  const printPokemon = () => { 
    const pokemonName = inputValue.toLowerCase(); 

    document.getElementById('pokemon-info').innerHTML = inputValue;
    fetch(`${POKE_API_URL}/${pokemonName}`)
      .then((response) => response.json()) 
      .then((pokemon) => {
        const pokemonCard = document.createElement('div'); 
        const pokemonImage = document.createElement('img');
        const pokemonName = document.createElement('h1'); 
        const pokemonContainer = document.getElementById('pokemon-container');

        pokemonCard.className = "card"
        pokemonImage.src = pokemon.sprites.other.dream_world.front_default;
        pokemonName.textContent = pokemon.name; 

        pokemonCard.appendChild(pokemonName)
        pokemonCard.appendChild(pokemonImage)
        pokemonContainer.appendChild(pokemonCard);
      
      })
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
