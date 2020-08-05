
const fs = require('fs');

module.exports = () => {

};

const readFile = (path) => { // Función para leer archivo
  let content = new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
  return content
}

module.exports.readFile = readFile;
