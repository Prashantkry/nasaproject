// const express = require('express')
const { planets } = require("../../model/planetModel");
function getAllPlanet(req, res) {
  // creating fn of getting planet data
  console.log(getAllPlanet);
  return res.status(200).json(planets); // if return is written here then it means only 1 time res is already set & its locked
}

module.exports = {
  // return as obj when need to export multiple fn
  getAllPlanet,
};

// imported in planetRouter file in planet controller folder
