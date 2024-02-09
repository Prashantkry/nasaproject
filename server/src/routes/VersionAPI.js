const express = require("express");

const planetRouter = require("./planet_router/planet_router"); // calling planetRouter
const launchesRouter = require("./launchesRouter/launchesRouter"); // calling launchesRouter

const VersionAPI = express.Router();

// creating version below which can act as no of updates in version it is just before endpoints 
VersionAPI.use("/planets", planetRouter);
VersionAPI.use("/launches", launchesRouter);

module.exports = VersionAPI;
