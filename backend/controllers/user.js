const bcrypt = require('bcrypt'); //Permet le cryptage du mot de passe
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mailValidator = require('email-validator'); //Permet de s'assurer que l'utilisateur utilise une adresse email valide via une REGEX contenu dans ce plugin
const passwordValidator = require('password-validator'); // Idem mais pour avoir un mot de passe fort via les propriétés contenues dans schema
 
var schema = new passwordValidator();
 
schema
.is().min(8)                                    // Minimum length 8
.is().max(40)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces


exports.signup = (req, res, next) => {
    if (!mailValidator.validate(req.body.email)){ // Si l'email n'est pas valide|| 
        throw { message: "Merci de bien vouloir entrer une adresse email valide !" } 
    } 
    else if(!schema.validate(req.body.password)) { // Si le password n'est pas valide
        throw { message: "Veuillez choisir un mot de passe fort, entre 8 et 40 caractères contenant au moins un caractère majuscule et un minuscule, 2 chiffres et sans espaces."}  
    }
    else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {  // Si tout est valide
    bcrypt.hash(req.body.password, 10) // 10 salage du password
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    };
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.TOKEN, // Encodage du token via la varaible d'environnement contenu dans le .env
                        { expiresIn: '3h' } // Expiration de la connexion au bout de 3h
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};