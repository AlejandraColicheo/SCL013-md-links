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
    console.log('error. Ingresa un archivo .md');
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
        const urlLinks = links.filter(element => element.href.includes('http'));
        let argv3 = process.argv[3];
        if(argv3 == "-v" || argv3 == "-validate" || argv3 == "--v"){
          console.log("PRIMER IF VALIDATE")
          stateLinks(urlLinks, false, 200);
          //totalBrokenLinks (urlLinks);
          //filterHttp(urlLinks);
          }else if (argv3 == '-s' || argv3  == '-stats'  || argv3 == "--s"){
            console.log("ESTAMOS TRABAJANDO PARA USTED")
            let cont = conteoLinks(urlLinks)
            console.log(cont)
          }
        //links = filterHttp(links); // Filtrar por prefijo http
        //links = stateLinks(links)
        //return resolve(links)
      })
      .catch(err => {
        (console.log(err));
      })
  })
  return printLinks
}

const stateLinks = (links, unique, num) => { // Función que filtra por estado de links
  links.forEach(element => {
    fetch(element.href)
      .then(response => {
        if (response.status === num) {
          console.log(('File: '+ element.file + '\n'), colors.blue('Titulo: ' + element.text.toUpperCase() + '\n'), colors.yellow('href: ' + element.href + '\n'),  colors.green('Estado: ' + response.status + '\n'));
        } else  {
          console.log(('File: '+ element.file + '\n'), colors.blue('Titulo: ' + element.text.toUpperCase() + '\n'), colors.yellow('href: ' + element.href + '\n'),  colors.red('Estado: ' + response.status + '\n'));
        }
      })
      .catch(error => {
        if(unique == false)  {
        console.log(colors.red('[X] Error en el Link: ' + element.href + '\n'))
        }
      })
    });
  console.log(colors.green("Links Analizados: " + links.length));
};

async function conteoLinks (links) {

  let conteo = 0

  let list = await links.forEach(element => {      
    let e = fetch(element.href)
            .then(response => {
                if (response.status === 200) {
                  //list.push(element)
                  conteo += 1
                  //console.log(conteo)
                  
                }
            })
            .catch(error => {
              console.log("")
            })

})
let cont = conteo
return conteo
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

//Función que calcula total de links rotos

const totalBrokenLinks = (links) => {
  const linksUrl = links.map((link) => link.href);
  let brokenLinks;
  let counterBroken = 0;
  linksUrl.forEach(element => {
    brokenLinks = fetch(element)
      .then(resp => {
        if (resp.status !== 200) {
          counterBroken++
        }
        return counterBroken;
       
      })
      .catch(error => {
        console.log("catch "+error)
      });
  })
  brokenLinks.then((res) => {
    console.log(colors.black("Broken: "), colors.red(res))
  });
}
