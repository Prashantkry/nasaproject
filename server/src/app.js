// All express code here
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const planetRouter = require("./routes/planet_router/planet_router"); // calling planetRouter
const launchesRouter = require("./routes/launchesRouter/launchesRouter"); // calling planetRouter

app.use(express.json()); // implementing middleware

app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // implementing cors as middleware

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(planetRouter); // using as middleware 
app.use('/launches',launchesRouter); // using as middleware 
app.get("/*", (req, res) => { // * match any end point
  res.sendFile(path.join(__dirname, "..","..", "public", "index.html"));
});
module.exports = app;
