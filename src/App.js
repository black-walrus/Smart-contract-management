import { useEffect, useState } from 'react'; 
import Web3 from 'web3';
import PokemonNFT_abi from './PokemonNFT_abi.json';
import './App.css';


function App() {

  // change contract address to deployed contract address 
  const contractAddress = '0x13461526f0a36ac432555A8d83d4D26e6dE08443';

  const [errorMessage, setErrorMessage] = useState();
  const [account, setAccount] = useState(); 
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [contract, setContract] = useState();
  const [web3, setWeb3] = useState();

    useEffect(() => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        window.ethereum.request({method: 'eth_requestAccounts'})
          .then(accounts => {
            setAccount(accounts[0]);
            const contractInstance = new web3.eth.Contract(PokemonNFT_abi, contractAddress);
            setContract(contractInstance);
          })
          .catch(error => {
            console.error("Error connecting to Metamask: ", error);
            alert("Please connect to MetaMask.");
          });
      } else {
        alert("Please install Metamask extension!");
      }
    }, []);
 
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
  
          try {
            await contract.methods.mintPokemon(_name, _level, _type1, _type2).send({from: account});  
          } catch (error) {
            console.error("Error minting Pokemon: ", error);
          }
        });
      
    }

  const getPokemon = async () => {
    try {
      const pokemon = await contract.methods.getPokemon(0).call({from: account});
      console.log(pokemon);
      console.log();
    } catch (error) {
      console.error("Error getting Pokemon: ", error);
    }
  }

  const getTotalPokemon = async () => {
    try {
      const totalPokemon = await contract.methods.getTotalPokemon().call({from: account});
      console.log(totalPokemon);
    } catch (error) {
      console.error("Error getting total Pokemon: ", error);
    }
  }

  const getPokemonLevel = async () => {
    try {
      const pokemonLevel = await contract.methods.getPokemonLevel(0).call({from: account});
      console.log(pokemonLevel.toString());
    } catch (error) {
      console.error("Error getting Pokemon level: ", error);
    }
  }

  const getPokemonTypes = async () => {
    try{
      const pokemonType1 = await contract.methods.getPokemonType1(0).call({from: account});
      const pokemonType2 = await contract.methods.getPokemonType2(0).call({from: account});

      console.log(pokemonType1, pokemonType2);
    } catch (error) {
      console.error("Error getting Pokemon types: ", error);
    } 
  }

  const createPokemonNFTCard = async (index) => {
    const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon"; 
    const card = document.createElement('div');
    card.className = "pokemon-nft-card";

    const pokemonName = document.createElement('h1');
    const pokemonImage = document.createElement('img');
    const pokemonLevel = document.createElement('h3');
    const pokemonType = document.createElement('h3');
    const pokemonProfile = document.createElement("div");

    pokemonProfile.className = "pokemon-nft-profile";

    const _name = await contract.methods.getPokemon(index).call({from: account});
    const _level = await contract.methods.getPokemonLevel(index).call({from: account});
    const _type1 = await contract.methods.getPokemonType1(index).call({from: account});
    const _type2 = await contract.methods.getPokemonType2(index).call({from: account});

    fetch(`${POKE_API_URL}/${_name.toLowerCase()}`)
      .then((response) => response.json())
      .then((pokemon) => {
        pokemonName.textContent = _name;
        pokemonImage.src = pokemon.sprites.other.dream_world.front_default;
        pokemonLevel.textContent = `Level: ${_level}`;
        pokemonType.textContent = `Types: ${_type1}`;

        pokemonImage.height = 250;
        pokemonImage.width = 250; 

        if (_type2 != "NONE") {
          pokemonType.textContent += `/${_type2}`;
        }

        card.appendChild(pokemonName);
        card.appendChild(pokemonImage);

        pokemonProfile.appendChild(pokemonLevel);
        pokemonProfile.appendChild(pokemonType); 

        card.appendChild(pokemonProfile);
        
        document.getElementById('pokemon-nft-cards-container').appendChild(card)
      })
    }
  
  const viewCollection = async () => {
    try {
      const cardsContainer = document.getElementById('pokemon-nft-cards-container');
      const collectionSize = 4; 

      for (let i = 0; i < collectionSize; i++) { 
        createPokemonNFTCard(i); 
      }
    } catch (error) {
      console.error("Error getting Pokemon Collection: ", error);
    }
  }

  return (
      <div className="App">
        <div>
          <h1> Pokemon Collection</h1>

          <div className="main-buttons">
            <button onClick={mintPokemon}>Mint Pokemon</button>
            <button onClick={viewCollection}> View Pokemon Collection </button> 
          </div>

          <p>Account: {account}</p>
          <h2 id="mint-pokemon"></h2>
          <div id="mint-pokemon-container"></div>
          <p id="pokemon-info"></p>
          <div id="pokemon-container"></div>

          <div id="pokemon-nft-cards-container">

          </div>

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
