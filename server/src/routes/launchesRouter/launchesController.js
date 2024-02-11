const {
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../model/launchModels");

const { GenPagination } = require("../../utility/query");

// TODO problem here 

async function httpGetAllLaunches(req, res) {
  // creating pagination in launches fn
  // ! spacesX work start
  const { skip, limit } = await GenPagination(req.query);
  // ! spacesX work end

  const launches_ = await getAllLaunches(skip, limit);
  return res.status(200).json(launches_);

  // return res.status(200).json(Array.from(launches.getAllLaunches())); // (method) Map<any, any>.values(): IterableIterator<any> Returns an iterable of values in the map
}
async function httpAddNewLaunches(req, res) {
  const launch = req.body;
  // below if condition will executed when any launches fails
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  // if date is not valid
  if (launch.launchDate.toString() === "Invalid Date") {
    // instead of using toString we can use isNaN(launch.launchDate)
    return res.status(400).json({
      error: "Invalid launch Date",
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  // fn will be dependent on model
  const launchId = +req.params.id; // params name must be same as name in routing

  // if launch is not available then it will give 404 not found
  const existLaunch = await existsLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found.",
    });
  }

  // if launch is success / fail
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted something went wrong",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}
module.exports = { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunch };

/* to check valid date UNIX Time system
  isNaN(date)
    -> false
  isNaN(date.valueOf())
    -> false
  date.valueOf()
    ->7632267278    // o/p as unix time 
*/
