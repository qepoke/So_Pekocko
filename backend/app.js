const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose= require ('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path'); //Plugin permettant d'accéder au path du serveur
const helmet = require('helmet'); //Plugin assurant un niveau de sécurité élevé. Possèdant 11 middlewares, il sécurise entre autres les requêtes, les Headers, et empêche le sniffing.

require('dotenv').config(); // Appel du plugin dotenv permettant de stocker et de gitignorer les variables d'environnement nécessaire à la connexion à la base de données

mongoose.connect('mongodb+srv://'+process.env.LOGIN+':'+process.env.PASSWORD+'@'+process.env.DB, 
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet()); //Execution d'helmet

app.use((req, res, next) => {  
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permet de résoudre les erreurs liées à l'accès multi-origine. (CROSS)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;