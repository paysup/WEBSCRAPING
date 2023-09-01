const axios = require("axios");
const cheerio = require("cheerio");

const app = require("express")();

// Crear la interfaz
const interfaz = {
  // Obtener la palabra clave
  getKeyword() {
    return req.body.keyword;
  },

  // Realizar la búsqueda
  search() {
    const keyword = this.getKeyword();

    // Construir la URL
    const url = `https://www.igrupos.com/whatsapp?s=${keyword}`;

    // Realizar la solicitud HTTP
    axios
      .get(url)
      .then((response) => {
        // Parsear el contenido HTML
        const $ = cheerio.load(response.data);

        // Obtener los resultados
        const results = [];
        for (const row of $("tr")) {
          const result = {};
          result["nombre"] = $(row).find("td.nombre").text();
          result["descripcion"] = $(row).find("td.descripcion").text();
          result["enlace"] = $(row).find("a").attr("href");
          results.push(result);
        }

        // Mostrar los resultados
        this.renderResults(results);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  // Renderizar los resultados
  renderResults(results) {
    const table = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <tr key={i}>
              <td>{result.nombre}</td>
              <td>{result.descripcion}</td>
              <td><a href={result.enlace} target="_blank">Abrir</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    `;

    document.querySelector("#results").innerHTML = table;
  },
};

// Renderizar la interfaz
app.get("/", (req, res) => {
  res.send(
    `<html>
      <head>
        <title>Web Scraper</title>
      </head>
      <body>
        <form action="/search" method="post">
          <input type="text" name="keyword" placeholder="Palabra clave">
          <input type="submit" value="Buscar">
        </form>
        <div id="results"></div>
      </body>
    </html>`
  );
});

// Escuchar la solicitud POST
app.post("/search", (req, res) => {
  interfaz.search();
});

app.listen(3000);
