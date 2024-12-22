const axios = require('axios');
const pg = require ('pg');
const pool = require('./db');
const pokemonModel = {};

require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

module.exports = pokemonModel;

pokemonModel.fetchPokemon = async (username, month, color) => {
    console.log('data received:', username, month, color);
    const length = username.length;


    const pokeid = ((length * month) + (month * 37)) % 1025 || 1;
    
    console.log('Pokemon ID calculated:', pokeid);

    try{
    // getting pokeid through external API
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeid}`);
    console.log('PokeAPI response received:', response.data.name);

    const pokemon = {
        name: response.data.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeid}.png`,
        type: response.data.types[0].type.name,
        abilities: response.data.abilities.map((a)=>a.ability.name),
    };

    // getting response from open source model API
    const groqResponse = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `Please generate a personalized paragraph to describe a Pokémon match for a user. Make the description sound personalized, as if it matches the personality and preference of the user, but 
                    please do not explicitly mention the user's birth month in the response. 
                    The Pokémon is ${pokemon.name}, its abilities are ${pokemon.abilities}, its type is ${pokemon.type}, 
                    the user's favorite color is ${color}, and their birth month is ${month}. 
                    Start the last sentence with 4 spaces away from the previous one, and generate a simple, personalized and specific 
                    fortune cookie message about the upcoming year of 2025 for the user. Here is an example (but no need to use it as a template): Wynaut is the perfect Pokémon for you!
                     As a pure Psychic-type, Wynaut embodies curiosity, positivity, and an infectious sense of playfulness—qualities often
                    seen in those born in summer, who are natural leaders with a sunny disposition. With its abilities, Shadow Tag and Telepathy, Wynaut is always aware of its surroundings, making it a clever and intuitive companion. 
                    Your favorite color, pink, highlights Wynaut's cheerful and lighthearted nature, as it reflects a sense of warmth, kindness, 
                    and compassion. Together, you and Wynaut are a dynamic force of optimism and empathy—spreading positivity wherever you go, just like a bright pink summer bloom in August!   Your Pokémon's secret message for you : "2025 is destined to be your year of growth and unexpected joys – embrace the surprises and adventures coming your way!"`
            }
        ],
        model:'llama-3.3-70b-versatile',
        temperature: 1.2,
        max_tokens: 300,
    });

    const generatedResponse = groqResponse.choices[0]?.message?.content || `Looks like the stars are still aligning for your match with ${pokemon.name}! With its incredible abilities of ${pokemon.abilities.join(', ')}, this ${pokemon.type}-type Pokémon is ready to embark on adventures with you. Stay excited, because 2025 promises to be a year full of surprises and epic moments!`;
    
    await pool.query(
        `INSERT INTO user_pokemon (user_name, favorite_color, pokemon_name, image, type, abilities)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [username, color, pokemon.name, pokemon.image, pokemon.type, JSON.stringify(pokemon.abilities)]
    );

    return {...pokemon, description: generatedResponse};

    } catch (err) {
        console.error(`Error in fetchPokeon function: ${err.message}`);
        throw err;
    }
};

pokemonModel.fetchAllPokemons = async () => {
    try{
        const result = await pool.query(`SELECT * FROM user_pokemon`);
        return result.rows;
    } catch (err) {
        console.error(`Error in fetchAllPokemons function: ${err.message}`);
    }
};


