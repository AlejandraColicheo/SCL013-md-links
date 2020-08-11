const fs = require('fs');

module.exports = () => {

};
//lee el archivo que le entreguemos
const readFile = (path) => { // Función para leer archivo
  let content = new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => { // forma en que puede leer un archivo asincrono
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
  return content
}

module.exports.readFile = readFile;
