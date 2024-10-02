import { useState } from 'react'; 
// import { ethers } from 'ethers';
import PokemonNFTABI from './contracts/PokemonNFTABI.json'; 
import './App.css';

const ethers = require("ethers"); 

function App() {
  const [account, setAccount] = useState(); 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum); 
        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const userAddress = await signer.getAddress(); 
        setAccount(userAddress); 
        return signer;
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install Metamask extension to access!');
    }
  }

  if (window.ethereum) {
    return (
      <div className="App">
        <div>
          <h1> Pokemon Collection</h1>
          <MintButton /> <br></br>
          {/* <SearchPokemon /> */}
  
          <h2 id="mint-pokemon"></h2>
          <div id="mint-pokemon-container"></div>
          <p id="pokemon-info"></p>
          <div id="pokemon-container"></div>
        </div>
        <style jsx> 
          {`
            .App {
              text-align: center
            }
          `}

        </style>
      </div>
    );
  } else {
    return (
      <>
        <h1> Pokemon Collection </h1>
        <p> Please Install Metamask wallet first!</p>
        <style jsx> 
          {`
            .App {
              text-align: center
            }
          `}

        </style>
      </>
    )
  }
  
}

function MintButton() {

  const mintPokemon = () => {
    const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
    const p = document.getElementById("mint-pokemon"); 
    const pokemonNumber = Math.floor((Math.random() * 150) + 1); 
    p.innerHTML = "You've acquired: ";

    fetch(`${POKE_API_URL}/${pokemonNumber}`)
      .then((response) => response.json())
      .then((mintedPokemon) => {
        const mintPokemonContainer = document.getElementById('mint-pokemon-container');
        
        const pokemonNFTCard = document.createElement('div'); 
        const pokemonImage = document.createElement('img');
        const pokemonName = document.createElement('h1'); 
        const pokemonType1 = document.createElement('p');
        const pokemonType2 = document.createElement('p');
        
        pokemonImage.height = 250;
        pokemonImage.width = 250; 

        pokemonNFTCard.className = "pokemon-mint-card"; 
        pokemonImage.src = mintedPokemon.sprites.other.dream_world.front_default;
        pokemonName.textContent = mintedPokemon.name;

        console.log(mintedPokemon.types.length);
        // console.log(mintedPokemon.types[0].type.name);
        // console.log(mintedPokemon.types[1].type.name);

        pokemonNFTCard.appendChild(pokemonName);
        pokemonNFTCard.appendChild(pokemonImage); 
        console.log(mintedPokemon.name);

        if (mintPokemonContainer.children.length > 0)
          mintPokemonContainer.removeChild(mintPokemonContainer.firstChild);
        document.getElementById('mint-pokemon-container').appendChild(pokemonNFTCard);
        console.log(mintPokemonContainer.children.length);
      })
    
  }

  return (
    <button className="mint-button" onClick={mintPokemon}> Mint New Pokemon </button>
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
