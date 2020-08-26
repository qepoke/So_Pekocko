const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //Spliter car cette section comporte un 1er mot suivi du token, il faut donc couper en deux et faire un tableau avec la fct splite et ne prendre que le 2ème élèment, le token.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //remettre la même clé de cryptage que dans le login
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};