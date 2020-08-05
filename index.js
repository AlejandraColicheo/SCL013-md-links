const readFile = require('./cli');
const marked = require('marked');
const fetch = require('node-fetch');
const file = process.argv[2];
const path = require('path');
const absolutePath = path.normalize(path.resolve(file)); // normalize() arregla la ruta. resolve() la hace absoluta
const colors = require('colors');

const detectedMd = (absolutePath) => { // Función para detectar archivos tipo .md
  if (path.extname(absolutePath) === '.md') {
    getLinks();
  } else {
    console.log('error. Ingrese un archivo .md');
  }
};

const getLinks = () => { // Función para obtener arreglo de todos los links
  let printLinks = new Promise((resolve, reject) => {
    readFile.readFile(absolutePath)
      .then(datos => {
        let renderer = new marked.Renderer();
        let links = [];
        renderer.link = function (href, title, text) {
          links.push({
            href: href,
            text: text,
            file: absolutePath,
          });
        };
        marked(datos, {
          renderer: renderer
        });
        links = filterHttp(links); // Filtrar por prefijo http
        links = stateLinks(links)
        return resolve(links)
      })
      .catch(err => {
        (console.log(err));
      })
  })
  return printLinks
}

const stateLinks = (links) => { // Función que filtra por estado de links
  links.forEach(element => {
    fetch(element.href)
      .then(response => {
        if (response.status === 200) {
          console.log(('File: '+ element.file + '\n'), colors.blue('Titulo: ' + element.text.toUpperCase() + '\n'), colors.yellow('href: ' + element.href + '\n'),  colors.green('Estado: ' + response.status + '\n'));
        } else  {
          console.log(('File: '+ element.file + '\n'), colors.blue('Titulo: ' + element.text.toUpperCase() + '\n'), colors.yellow('href: ' + element.href + '\n'),  colors.red('Estado: ' + response.status + '\n'));
        }
      })
      .catch(error => 
        console.log(colors.red('[X] Error en el Link: ' + element.href + '\n')))   
  });
  console.log(colors.green("Links Analizados: " + links.length));
};

const filterHttp = (links) => { // Función que filtra por prefijo http de links
  let filterHttp = [];
  links.forEach((element) => {
    let prefix = element.href.substring(0, 4);
    if (prefix == 'http') {
      filterHttp.push(element);
    }
  })
  return filterHttp;
};

detectedMd(absolutePath);