// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18; 

contract PokemonNFT {
    
    struct Pokemon {
        string name; 
        uint level; 
        string type1; 
        string type2; 
    }

    Pokemon[] public pokemonCollection; 

    function mintPokemon(string memory _name, uint _level, string memory _type1, string memory _type2) public {
        pokemonCollection.push(Pokemon(_name, _level, _type1, _type2));
    }

    function getPokemon(uint index) view public returns (Pokemon memory) {
        return pokemonCollection[index];
    }

    function getTotalPokemon() view public returns (uint) {
        return pokemonCollection.length;
    }
    
    function getPokemonCollection() view public returns (Pokemon[] memory ) {
        return pokemonCollection; 
    } 
}


