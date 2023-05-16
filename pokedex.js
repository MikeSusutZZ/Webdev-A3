require("./utils.js");
require("dotenv").config();
const express = require('express');
const fetch = require('node-fetch').default;
const axios = require('axios');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
const port = 3000;

var page = 0;

app.get('/', async (req, res) => {
    try {
      let page = parseInt(req.query.page);
      if (isNaN(page) || page < 1) {
        page = 0;
      }
  
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page * 10}&limit=10`);
      const data = await response.json();
  
      const pokemonList = [];
  
      for (const pokemon of data.results) {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        pokemonList.push({
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
          page: page
        });
      }
  
      res.render('main', { pokemonList, page });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get("/info", async (req, res) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.query.num}`);
      const data = await response.json();
  
      const abilities = data.abilities;
      const types = data.types;
      const stats = data.stats;
  
      res.render("info", { abilities, types, stats, pokemon: data });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });