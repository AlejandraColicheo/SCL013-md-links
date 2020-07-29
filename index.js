/* module.exports = () => {
  // ...
}; */

const fetch = require("fetch")
const fetchUrl = fetch.fetchUrl;





const getHttpStatus = (url) => {
  
  return new Promise((resolve, reject) => {
    
    fetchUrl(url, (error, meta, body) => {
      if(error){
        reject(error);
      }else{
        resolve(meta.status);
      } 
    });

  })
}

let url = "https://www.googlewwwwwww.com/"
getHttpStatus(url)
.then(res =>{
  console.log("El estado de", url, "es:", res);
})
.catch(err =>{
  console.log(err.code);
});

console.log("El programa sigue");



