// planet router for handling to get all planet data
const express = require("express");
const planetRouter = express.Router();
// const planetController = require('./planetController')  //? way 1 used when need to export as obj from origin
const { 
  httpGetAllPlanets,
} = require("./planetController");  // ? way 2 using destructure of obj

// planetRouter.get('./planet',planetController.getAllPlanet)  // ? way 1 calling fn from obj
planetRouter.get("/planets", httpGetAllPlanets); // ? way 2 using destructure of obj

module.exports = planetRouter;