// file initializes the app, sets up middleware, and starts the server

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const pokemonRoutes = require('./routes/pokemonRoutes');  

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, 'views/public')));

// Define API routes
app.use('/pokemon', pokemonRoutes);

// Serve index.html for frontend routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

//error handling
app.use((err, req, res, next)=>{
    res.status(500).send(err.message);   
})

//start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

