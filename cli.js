const readFile = require('./index');
const marked = require('marked');
const fetch = require('node-fetch');
const file = process.argv[2];
const path = require('path');
const absolutePath = path.normalize(path.resolve(file)); // normalize() arregla la ruta. resolve() la hace absoluta
const colors = require('colors');

function detectedMd(absolutePath) { // Función para detectar archivos tipo .md
  if (path.extname(absolutePath) === '.md') {
    getLinks();
  } else {
    console.log('error. Ingrese un archivo .md');
  }
};

function getLinks() { // Función para obtener arreglo de todos los links
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
        }; //console.log("renderer.link",renderer.link);
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

function stateLinks(links) { // Función que filtra por estado de links
  links.forEach(element => {
    fetch(element.href)
      .then(response => {
        if (response.status === 200) {
          console.log(colors.blue('(text ' + element.text + '\n'), colors.yellow('href: ' + element.href + '\n'), ('file: '+ element.file + '\n'), colors.green('Estado: ' + response.status + ')'));
          //console.log(chalk.yellow('href: ' + linksArry ));
              console.log((colors.blue("Links:")), element.href)
              //console.log("newArry",newArry);
        } else {
          console.log(colors.blue('(text ' + element.text + ''), colors.yellow('href: ' + element.href), ('file: '+ element.file), colors.red('Estado: ' + response.status + ')'));
        }
      })
      
      .catch(error => 
        console.log(colors.red('Link con error: ' + element.href)))
        
  });
  console.log(colors.green("Total de links analizados " +links.length));
};

function filterHttp(links) { // Función que filtra por prefijo http de links
  let filterHttp = [];
  links.map((element) => {
    let prefix = element.href.substring(0, 4);
    if (prefix == 'http') {
        filterHttp.push(element);
    }
  })
  return filterHttp;
  
};
detectedMd(absolutePath);