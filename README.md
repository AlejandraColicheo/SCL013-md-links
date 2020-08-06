# Markdown Links

## 1. Preámbulo

Markdown es un lenguaje de marcado ligero creado por John Gruber en 2004, que trata de conseguir la máxima legibilidad y facilidad de publicación tanto en su forma de entrada como de salida, utiliza texto plano. 
Esta aplicacion es un herramienta que lee y analiza la información sobre el estado de los links en un documento de extensión .md.

## 2. Resumen de proyecto
La lógica de este programa se observa en el siguiente diagrama:

![Diagrama](/Img/DIAGRAMA.png)

## 3. Instalación

Para instalar la librería se ejecuta el siguiente comando en la consola:

npm i md-link-colicheo-aguilar

## 4. Modo de uso

Debes colocar la ruta del documento .md que deseas inspeccionar, seguido por -v o -validate, la libreria mostrar la la siguiente información de los links que contiene el documento: El Titulo, link, direccion del documento y estados de link(200 o 404) ademas de ello el numero de links que han sido analizados en el documento.

Como se muetra a continuación:

![VALIDATE](/Img/VALIDATE.png)
![VALIDATE](/Img/VALIDATE2.png)

## 5. Proximas iteraciones

Se quiere agregar suma total de las estadisticas de los links unicos y links totales mediante del comando " -stats " y una estadisticas de los links unicos, links rotos y links totales mediante del comando "-v -s".

## 6. Autores

Alejandra Colicheo y Anliana Aguilar.
