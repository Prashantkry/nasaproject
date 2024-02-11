const launches = new Map();

const { default: axios } = require("axios");
// bringing launches schema
const launchesSchema = require("./launchesSchema");

const planets_ = require("./planetSchema");

let defaultFlightNo = 100;

// ? when not using data base start
// const launch = {
//   flightNumber: 100, // act as a unique Id   spaceX flight_number
//   mission: "Kepler Exploration X", // spaceX  name
//   rocket: "Explorer ISI", // in spaceX json exist as rocket.name
//   launchDate: new Date("December 27,2030"), // all key name here must match front end // spaceX date_local
//   target: "Kepler-442 b", // not applicable in spaceX
//   customer: ["ZTM", "NASA"], // spaceX payload.customers for each payload
//   upcoming: true, // make event true in upcoming event list of frontend
//   success: true, // make in history section list of frontend
// };

// saveLaunch(launch); // calling to save to mongo db
// ? when not using data base end

// ! spacesX work start

// const SpaceXAPIUrl = "https://api.spacexdata.com/v4/launches/query";
const SpaceXAPIUrl = "https://api.spacexdata.com/v5/launches/query";

const populateLaunches = async () => {
  // this will work when there is no data in mongo db
  console.log("start downloading launch data");
  const response = await axios.post(SpaceXAPIUrl, {
    query: {},
    options: {
      pagination: false, // make pagination false else we can data in many pages & we can access here all those pages by page:2 or .....
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  // checking status code as verification of 200
  if (response.status !== 200) {
    console.log("Problem in downloading launch data.");
    throw new Error("Launch data download failed.");
  }

  const launchDocs = response.data.docs;
  console.log(launchDocs);
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);

    // saving data to mongo db
    await saveLaunch(launch);
  }
};

const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
    return;
  } else {
    await populateLaunches();
  }
};

// few code is also  below
// ! spacesX work end

// ? when not using data base start
// launches.set(launch.flightNumber, launch);
// ? when not using data base end

// below function act as data access layers
async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values()); // when saving to memory
  return await launchesSchema
    .find({}, { _id: 0, __v: 0 }) // when saving to database
    // adding pagination in webpage
    .sort({ flightNumber: 1 }) // sorting in ascending 
    .skip(skip) // this much data will get skipped
    .limit(limit); // this much data we will get from mongo db
}

// ! save launches to mongo db
async function saveLaunch(launch) {
  // validating referential integrity
  // ? removing after spacesX code as creating problem in inserting 1st launch
  // const planets = await planets_.findOne({
  //   keplerName: launch.target,
  // });

  // if (!planets) {
  //   // if no matching planet is found
  //   throw new Error("No matching planet found"); // built in error fn that will throw error
  // }
  // ? removing after spacesX code as creating problem in inserting 1st launch
  // ? putting this code in scheduleLaunch

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
  // validating referential integrity
  const planets = await planets_.findOne({
    keplerName: launch.target,
  });

  if (!planets) {
    // if no matching planet is found
    throw new Error("No matching planet found"); // built in error fn that will throw error
  }
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

// ! spacesX work start
// finding earlier if data is available in mongo or not
async function findLaunch(filter) {
  return await launchesSchema.findOne(filter);
}
// ! spacesX work end

async function existsLaunchWithId(launchId) {
  // exported to controller
  // return await launchesSchema.findOne({ flightNumber: launchId });  // when using without database
  return await findLaunch({ flightNumber: launchId }); // when using database
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
  const aborted = await launchesSchema.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  // return aborted.ok === 1 && aborted.nModified === 1
  return aborted.modifiedCount === 1;

  // ? when using memory
  // launch.delete(launchId) // will completely remove the launch data
  // const aborted = launches.get(launchId); // by this it will come in history list
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  // addNewLaunch,
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchData,
};

// created schema of launch models

/*
  ! flatMap -> apply on an array
  ! duplicate -> just make copy of each element 
    [1,2].flatMap(duplicate) -> [1,1,2,2]
*/
