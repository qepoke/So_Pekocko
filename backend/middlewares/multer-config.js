const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');  //Supprime les espaces du nom du fichier et les remplace par des underscore afin d'éviter les erreurs côté serveur
    const extension = MIME_TYPES[file.mimetype];  // Crée l'extension du fichier en fonction du dictionnaire MIME_TYPES
    callback(null, name + Date.now() + '.' + extension); // Le fichier reçu sera composé de son nom de base sans les espaces, de la date à la milliseconde, suivi d'un point, et de l'extension
  }
});

module.exports = multer({storage}).single('image'); // On précise à multer que les fichiers seront des images

//Dans ce middleware :

/*
nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :

la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;

la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;

nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.

*/