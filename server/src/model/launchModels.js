const launches = new Map();

// bringing launches schema
const launchesSchema = require("./launchesSchema");

const planets_ = require("./planetSchema");

let defaultFlightNo = 100;

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

saveLaunch(launch); // calling to save to mongo db

launches.set(launch.flightNumber, launch);

// below function act as data access layers
async function getAllLaunches() {
  // return Array.from(launches.values()); // when saving to memory
  return await launchesSchema.find({}, { _id: 0, __v: 0 }); // when saving to database
}

// ! save launches to mongo db
async function saveLaunch(launch) {
  // validating referential integrity
  const planets = await planets_.findOne({
    keplerName: launch.target,
  });

  if (!planets) {
    // if no matching planet is found
    throw new Error("No matching planet found"); // built in error fn that will throw error
  }

  // await launchesSchema.updateOne(  // or
  await launchesSchema.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

// POST Launch    //! FROM MEMORY launch
// function addNewLaunch(launch) {
//   latestFlightNo++;
//   launches.set(
//     latestFlightNo,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customer: ["Prashant", "NASA"],
//       flightNumber: latestFlightNo,
//     })
//   );
// }

// ! from data base launch
async function scheduleNewLaunch(launch) {
  const newFlightNo = (await getFlightNo()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["Prashant Kumar", "NASA"],
    flightNumber: newFlightNo,
  });
  await saveLaunch(newLaunch);
}

// function existsLaunchWithId(launchId) {  // when using memory
//   // exported to controller
//   return launches.has(launchId);
// }

async function existsLaunchWithId(launchId) {
  // exported to controller
  return await launchesSchema.findOne({ flightNumber: launchId });
}

// get flight no
async function getFlightNo() {
  // * to keep track of flight no in launch use last flight
  let latestLaunch = await launchesSchema.findOne().sort("-flightNumber"); // - means in descending order
  if (!latestLaunch) {
    return defaultFlightNo;
  }

  return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
  // * when using database
  const aborted = await launchesSchema.updateOne({
      flightNumber: launchId,
    },{
      upcoming: false,
      success: false,
    }
  );

  return aborted.ok === 1 && aborted.nModified === 1

  // ? when using memory
  // launch.delete(launchId) // will completely remove the launch data
  // const aborted = launches.get(launchId); // by this it will come in history list
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted; 
}

module.exports = {x
  // addNewLaunch,
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
};

// created schema of launch models
