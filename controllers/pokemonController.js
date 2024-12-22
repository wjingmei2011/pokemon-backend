// define how backend react to each api route 
const express = require('express');
const pokemonModel = require('../models/pokemonModel');

const pokemon = {};
module.exports = pokemon;


pokemon.getPokemon = async (req, res, next) => {
    try{
    const {username, month, color} = req.body;
    console.log('Request Body is:', req.body);
    if (!username || !month || !color) {
        return res.status(400).send({ error: 'All fields are required' });
    };
    const matchedPokemon = await pokemonModel.fetchPokemon(username, month, color);
    res.send(matchedPokemon)}
    catch(err) {
        console.error(`Error in getPokemon route: ${err.message}`);
        next(err);
    }};
    

pokemon.displayPokemon = async (req, res, next) => {
    try{
        const allPokemons = await pokemonModel.fetchAllPokemons();
        res.send(allPokemons);
    }
    catch(err){
    console.error(`Error in displayPokemon route: ${err.message}`);
    next(err);
}}; 