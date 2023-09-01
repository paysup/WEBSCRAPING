const axios = require("axios");
const cheerio = require("cheerio");

// Crear la interfaz gráfica
const app = require("express")();
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
app.post("/search", async (req, res) => {
  // Escuchar el evento `body`
  req.on("body", async () => {
    // Obtener la palabra clave
    const keyword = req.body.keyword;

    // Construir la URL
    const url = `https://www.igrupos.com/whatsapp?s=${keyword}`;

    // Realizar la solicitud HTTP
    const response = await axios.get(url);

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
    res.render("results", {
      results,
    });
  });
});
app.listen(3000);
