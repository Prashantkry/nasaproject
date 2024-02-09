// const express = require('express')
const { getAllPlanets } = require("../../model/planetModel");
async function httpGetAllPlanets(req, res) {
  // creating fn of getting planet data
  // console.log(httpGetAllPlanets);
  return res.status(200).json(await getAllPlanets()); // if return is written here then it means only 1 time res is already set & its locked
}

module.exports = {
  // return as obj when need to export multiple fn
  httpGetAllPlanets,
};

// imported in planetRouter file in planet controller folder
