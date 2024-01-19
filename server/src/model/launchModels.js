const launches = new Map();

// * to keep track of flight no in launch use last flight
let latestFlightNo = 100;

const launch = {
  flightNumber: 100, // act as a unique Id
  mission: "Kepler Exploration X",
  rocket: "Explorer ISI",
  launchDate: new Date("December 27,2030"), // all key name here must match front end
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true, // make event true in upcoming event list of frontend
  success: true, // make in history section list of frontend
};

launches.set(launch.flightNumber, launch);
function getAllLaunches() {
  return Array.from(launches.values());
}

// POST Launch
function addNewLaunch(launch) {
  latestFlightNo++;
  launches.set(
    latestFlightNo,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customer: ["Prashant", "NASA"],
      flightNumber: latestFlightNo,
    })
  );
}

function existsLaunchWithId(launchId) {
  // exported to controller
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  // launch.delete(launchId) // will completely remove the launch data
  const aborted = launches.get(launchId); // by this it will come in history list
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};

// created schema of launch models
