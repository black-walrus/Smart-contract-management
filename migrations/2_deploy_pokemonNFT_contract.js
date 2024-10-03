const PokemonNFTContract = artifacts.require("PokemonNFT");

module.exports = function(deployer) {
    deployer.deploy(PokemonNFTContract);
}