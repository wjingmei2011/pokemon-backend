// const getPokemon = require('../controllers/pokemonController');
// const displayPokemon = require('../controllers/pokemonController');
const express = require('express');
const pokemon = require('../controllers/pokemonController'); // Change middleware object name 
const router = express.Router();

// Route to save pokemon
router.post('/getPokemon', pokemon.getPokemon);

router.get('/displayPokemon', pokemon.displayPokemon);

module.exports = router;

