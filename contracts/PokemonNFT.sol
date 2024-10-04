// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0; 

contract PokemonNFT {
    
    uint private nftSize = 0; 
    mapping(uint => string) public pokemonNFTS; 
    mapping(uint => uint) public pokemonNFTLevels; 
    mapping(uint => mapping(string => string)) public pokemonNFTTypes; 


    function mintPokemon(string memory _name, uint _level, string memory _type1, string memory _type2) public {
        pokemonNFTS[nftSize] = _name; 
        pokemonNFTLevels[nftSize] = _level;
        pokemonNFTTypes[nftSize]["type1"] = _type1;
        pokemonNFTTypes[nftSize]["type2"] = _type2;
        nftSize += 1; 
    } 

    function getPokemon(uint index) public view returns (string memory) {
        return pokemonNFTS[index]; 
    }

    function getPokemonLevel(uint index) public view returns (uint) {
        return pokemonNFTLevels[index];
    }

    function getPokemonType1(uint index) public view returns (string memory) {
        return pokemonNFTTypes[index]["type1"];
    }

    function getPokemonType2(uint index) public view returns (string memory) {
        return pokemonNFTTypes[index]["type2"];
    }

    function getNFTSize() public view returns (uint) {
        return nftSize;
    }
}
