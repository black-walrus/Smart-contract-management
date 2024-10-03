import { useEffect, useState } from 'react'; 
import { ethers } from 'ethers';
import PokemonNFT from './build/contracts/PokemonNFT.json';
import './App.css';


function App() {
  const [account, setAccount] = useState(); 
  const [pokemon, setPokemon] = useState(); 
  //const [contract, setContract] = useState();

  const rpcURL = 'http://127.0.0.1:8545'; 
  const provider = new ethers.JsonRpcProvider(rpcURL); 

  const signer = provider.getSigner();

  const contractAddress = "0x7C246C325F461aA6c04bacC55F520A31966411D5";
  const contract = new ethers.Contract(contractAddress, PokemonNFT.abi, signer);
  
    return (
      <div className="App">
        <div>
          <h1> Pokemon Collection</h1>
          <Buttons contract={contract}/>
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
 
}

function Buttons({ contract }) {
  return (
    <div className="buttons">
      <MintButton contract={contract}/>
      <CollectionButton contract={contract}/> 
    </div>
  )
}

function MintButton({ contract }) {

  const mintPokemon = async () => {
    const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
    const p = document.getElementById("mint-pokemon"); 
    const pokemonNumber = Math.floor((Math.random() * 500) + 1); 
    p.innerHTML = "You've acquired: ";

    fetch(`${POKE_API_URL}/${pokemonNumber}`)
      .then((response) => response.json())
      .then(async (mintedPokemon) => {
        const mintPokemonContainer = document.getElementById('mint-pokemon-container');
        
        const pokemonNFTCard = document.createElement('div'); 
        const pokemonImage = document.createElement('img');
        const pokemonName = document.createElement('h1'); 
        const pokemonType = document.createElement('h3');
        const pokemonProfile = document.createElement('div'); 

        // for supplying values to contract call 
        var _name = "";
        var _level = 50; 
        var _type1 = ""; 
        var _type2 = "None";
        
        pokemonImage.height = 250;
        pokemonImage.width = 250; 

        pokemonNFTCard.className = "pokemon-mint-card"; 
        pokemonProfile.className = "pokemon-profile";

        pokemonImage.src = mintedPokemon.sprites.other.dream_world.front_default;
        pokemonName.textContent = mintedPokemon.name.toUpperCase();
        _name = pokemonName.textContent; 

        pokemonType.textContent = `Types: ${mintedPokemon.types[0].type.name.toUpperCase()}`; 
        _type1 = mintedPokemon.types[0].type.name.toUpperCase(); 
      
        if (mintedPokemon.types.length == 2) {
          pokemonType.textContent += `/${mintedPokemon.types[1].type.name.toUpperCase()}`; 
          _type2 = mintedPokemon.types[1].type.name.toUpperCase();
        }

        // console.log(mintedPokemon.types[0].type.name);
        // console.log(mintedPokemon.types[1].type.name);

        pokemonNFTCard.appendChild(pokemonName);
        pokemonNFTCard.appendChild(pokemonImage); 

        pokemonProfile.appendChild(pokemonType);
        pokemonNFTCard.appendChild(pokemonProfile);
      
        if (mintPokemonContainer.children.length > 0)
          mintPokemonContainer.removeChild(mintPokemonContainer.firstChild);
        document.getElementById('mint-pokemon-container').appendChild(pokemonNFTCard);
        console.log(mintPokemonContainer.children.length);

        await contract.mintPokemon(_name, _level, _type1, _type2);
      })
    
  }

  return (
    <button className="mint-button" onClick={mintPokemon}> Mint New Pokemon </button>
  )
}

function CollectionButton({contract}) {

  const viewCollection = async () => {
    const collection = await contract.getTotalPokemon().toString(); 
    console.log(collection);
  }



  return (
    <button onClick={viewCollection}>View Collection</button>
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
