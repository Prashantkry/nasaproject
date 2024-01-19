const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

// ! part 2 search planet
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// * All these will happen asynchronously
// * when want to know data of planet
/*
    ! creating promise basic 
        const promise = new Promise((req,res)=>{
            res('data')
        })
        promise.then((result)=>{
        
        })
        const result = await promise
        console.log(result)
    
*/
const habitAblePlanet = [];
// making here promise so that data reading will be done only when data is returned for execution for api call
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..","..", "data", "kepler_data.csv")
    ) // reading raw data of file
      .pipe(
        parse({
          comment: "#", // these both line will return js data as an obj
          columns: true, // with key value pairs
        })
      ) // connect readableSource to writeable stream destination
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitAblePlanet.push(data);
          // console.log(habitAblePlanet)
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        console.log(`${habitAblePlanet.length} habitAblePlanet found`); // data can be matched from -> https://phl.upr.edu/projects/habitable-exoplanets-catalog
        console.log("data fetch completed");
        resolve();
      });
  });
}

module.exports = {
  loadPlanetsData, // export it in app.js file so that it will load data of planet to serve
  planets: habitAblePlanet,
};
