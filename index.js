//const fetch = require("fetch")
//const fetchUrl = fetch.fetchUrl;

const path = require ("path");
const fs = require ("fs");
let file = process.argv[2]; // Toma lo que se le da desde consola
file = path.resolve(file);  // Convierte a ruta absoluta
file = path.normalize(file); // simplifica nuestras rutas

console.log("file",file);

const getFilemd = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      } else {
        resolve(data)
      }
        //console.log(reject);
      })
  })
}

if (path.extname(file) === '.md') {
   getFilemd(file)
    
    .then((fileData) => {
      console.log(fileData);
    })
    .catch((error) => {
      console.error(error)
    })
} else {
    console.log('Por favor, introduce una ruta que contenga un archivo .md')
}
  
  
  




