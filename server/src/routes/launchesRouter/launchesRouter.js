const {
  httpGetAllLaunches,
  httpAddNewLaunches,
  httpAbortLaunch,
} = require("./launchesController");
const express = require("express");
const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunches);
launchesRouter.delete("/:id", httpAbortLaunch); // parameter of id is used here so specific launch will be aborted

module.exports = launchesRouter;
