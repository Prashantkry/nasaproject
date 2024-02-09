// All express code here
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

// * before version API use below code 
// const planetRouter = require("./routes/planet_router/planet_router"); // calling planetRouter
// const launchesRouter = require("./routes/launchesRouter/launchesRouter"); // calling planetRouter

// * after version API use below code 
const VersionAPI = require('./routes/VersionAPI')

app.use(express.json()); // implementing middleware

app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // implementing cors as middleware

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, "..", "public")));

// creating version below which can act as no of updates in version it is just before endpoints 
app.use('/v1',VersionAPI)
// app.use('/v2',VersionAPI)  -> if next version is required 

// * before version API use below code 
// app.use(planetRouter); // using as middleware 
// app.use('/launches',launchesRouter); // using as middleware 
app.get("/*", (req, res) => { // * match any end point
  res.sendFile(path.join(__dirname, "..","..", "public", "index.html"));
});
module.exports = app;
