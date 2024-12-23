// file initializes the app, sets up middleware, and starts the server

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const pokemonRoutes = require('./routes/pokemonRoutes');  
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Current NODE_ENV is: ', process.env.NODE_ENV)

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// define cors
app.use(cors({
    origin: ['https://pokemon-frontend-plcp.onrender.com/','http://localhost:8000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}));


// Define API routes
app.use('/pokemon', pokemonRoutes);

// Serve index.html for frontend routes (SPA fallback)
if (process.env.NODE_ENV === 'production') 
    {app.get('*', (req, res) => {
    res.redirect('https://pokemon-frontend-plcp.onrender.com/')
})} 
else {
    app.get('/', (req,res) => {
        res.send('Welcome to Pokemon Dev Backend API!')
    })
}
;

//error handling
app.use((err, req, res, next)=>{
    res.status(500).send(err.message);   
})

//start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

