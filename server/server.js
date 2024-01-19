// all server code here
const http = require("http"); // allows web-socket, http, express

const app = require("./src/app");

const PORT = process.env.PORT || 9000; // here process.env.PORT check for default env if not then 8080 , also can be set in package json -> "start": "set PORT=5000 && node src/server.js"

const { loadPlanetsData } = require("./src/model/planetModel");

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer()