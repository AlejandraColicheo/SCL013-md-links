const readFile = require('./cli');
const marked = require('marked');// nos ayuda a un proceso mas liviano no usa cache 
const fetch = require('node-fetch');// manipula los http peticiones y respuestas 400 y 200
const file = process.argv[2];//argumento que se busca y su posicion 
const path = require('path');//busca la ruta
const absolutePath = path.normalize(path.resolve(file)); // normalize() arregla la ruta. resolve()la hace absoluta
const colors = require('colors');

//filtra  y detecta los archivos de tipo md 
const detectedMd = (absolutePath) => { 
  if (path.extname(absolutePath) === '.md') {
    getLinks();
  } else {
    console.log('error. Ingresa un archivo .md');
  }
};
// Función para obtener arreglo de todos los links
const getLinks = () => {
  let printLinks = new Promise((resolve, reject) => {
    readFile.readFile(absolutePath)// a la funcion de cli le damos una ruta absoluta 
      .then(datos => {
        let renderer = new marked.Renderer();//nos trae los links sin informacion relevante y con etiqueta privada
        let links = []; 
        renderer.link = function (href, title, text) {
          links.push({// esto se pusheara al arreglo de links
            href: href,
            text: text,
            file: absolutePath,
          });
        };
        console.log(links)
        marked(datos, {
          renderer: renderer // objeto tipo texto (token) - a travez de marked nos manda la info de forma liviana y sin informacion relevante
        });
        const urlLinks = links.filter(element => element.href.includes('http'));//filtra los href que contengan http
        let argv3 = process.argv[3];//flags
        if(argv3 == "-v" || argv3 == "--validate" || argv3 == "--v"){
          console.log("Función validate en proceso")
          stateLinks(urlLinks, 200);
          }else if (argv3 == '-s' || argv3  == '-stats'  || argv3 == "--s"){
            console.log("ESTAMOS TRABAJANDO PARA USTED")
            let cont = conteoLinks(urlLinks)
            console.log(cont)
          }
      
      })
      .catch(err => {
        (console.log(err));
      })
  })
  return printLinks
}
// Función que filtra por estado de links
const stateLinks = (links, num) => { 
  links.forEach(element => {
    fetch(element.href)//consulta de link o api
      .then(response => {
        if (response.status === num) {
          console.log("______________________________________________________________")
          console.log(('File: '+ element.file + '\n'), colors.blue('Titulo: ' + element.text.toUpperCase() + '\n'), colors.yellow('href: ' + element.href + '\n'),  colors.green('Estado: ' + response.status));
        } else {
          console.log("______________________________________________________________")
          console.log(('File: '+ element.file + '\n'), colors.blue('Titulo: ' + element.text.toUpperCase() + '\n'), colors.yellow('href: ' + element.href + '\n'),  colors.red('Estado: ' + response.status));
        }//links 404 no encontrado
      })
      .catch(error => {
         
          console.log("______________________________________________________________")
        console.log(colors.red('[X] Error en el Link: ' + element.href + '\n')) // links con error de ip no existen
        
      })
    });
  console.log(colors.green("Links Analizados: " + links.length));
};

detectedMd(absolutePath);
