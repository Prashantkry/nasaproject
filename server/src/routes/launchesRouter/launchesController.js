const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../model/launchModels");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches()); // (method) Map<any, any>.values(): IterableIterator<any> Returns an iterable of values in the map
  // return res.status(200).json(Array.from(launches.getAllLaunches())); // (method) Map<any, any>.values(): IterableIterator<any> Returns an iterable of values in the map
}

function httpAddNewLaunches(req, res) {
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
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  // fn will be dependent on model
  const launchId = +req.params.id; // params name must be same as name in routing

  // if launch is not available then it will give 404 not found
  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found.",
    });
  }

  // if launch is success
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
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
