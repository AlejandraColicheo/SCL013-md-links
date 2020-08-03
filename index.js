//const fetch = require("fetch")
//const fetchUrl = fetch.fetchUrl;

const path = require ("path");
const fs = require ("fs");
let file = process.argv[2]; // Toma lo que se le da desde consola
file = path.resolve(file);  // Convierte a ruta absoluta
file = path.normalize(file); // simplifica nuestras rutas
const chalk = require('chalk')
const marked = require("marked");
const fetch = require("node-fetch");

console.log("file",file);

let options = {
  validate:false,
  stats: false
}

const getFilemd = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
        } 
      let links = [];
      const renderer = new marked.Renderer(); 
      renderer.link = function(href, title, text) {
        // Override function
        links.push({
          href: href,
          text: text,
          file: file
        });
      };
      marked(data, { renderer: renderer }); // Aquí imprime y crea los elementos dentro del Array
      links = linksHttp(links);
           
      if (
        (options.validate === false && options.stats === false) ||
        (options.validate === false && options.stats === true)
      ) {
        resolve(links)
        return;
        } else {
          codeStatusLinks(links) // Llamada de la promesa del nuevo array con status y statusCode
            .then(links => resolve(links))
            .catch(err => console.log(err));
        }         
      //console.log(reject);
    });
  });
};

// Filtra y retorna un nuevo array con los links que contienen 'http'
const linksHttp = links => {
  return links.filter(link => {
    return link.href.substring(0, 4) === "http";
  });
};



if (path.extname(file) === '.md') {
   getFilemd(file)
    .then((fileData) => {
      if (options.validate === false && options.stats === false) {
        linksInDoc(fileData);
    } else if (options.validate === true && options.stats === false) {
        printStatus(fileData);
    } else if (options.validate === false && options.stats === true) {
        printTotalLinks(fileData)
    } else if (options.validate === true && options.stats === true) {
        printTotalLinks(fileData)
        printTotalBroken(fileData)
    }
      console.log(fileData);
    })
    .catch((error) => {
      console.error(error)
    })
} else {
    console.log('Por favor, introduce una ruta que contenga un archivo .md')
}

// Lee los links de la ruta espeficificada
const expReg = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;

fs.readFile(file, "utf-8", (err,file) => {
  if (err){
    console.log(err);
  }else{
    console.log((chalk.yellow("Links:")), file.match(expReg));
  }
})  


// Función que solo muestra los links (sin opciones activas)
const linksInDoc = (links) => {
	links.forEach(element => {
		console.log(
			chalk.greenBright('»'),
			chalk.cyan(element.href),
			chalk.yellow.bold(element.text),
			chalk.magenta(element.file)
		)
	})
}

module.exports = getFilemd; 

