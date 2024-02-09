// all server code here
const http = require("http"); // allows web-socket, http, express

const app = require("./app");

const PORT = process.env.PORT || 9000; // here process.env.PORT check for default env if not then 8080 , also can be set in package json -> "start": "set PORT=5000 && node src/server.js"

const MONGO_URL =
  "mongodb+srv://Nasa:Asdf213@nasa.if0d91i.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require("mongoose");

const { loadPlanetsData } = require("./model/planetModel");

const server = http.createServer(app);
mongoose.connection.once("open", () => {    // we can also use on (when want to connect multiple times)
  console.log("Mongo Db Connection  ready!!");
}); // it is event emitter that makes confirmation of mongo connection

mongoose.connection.on('error',(err)=>{
  console.error('error',err)
})

async function startServer() {
  // * below is old deprecated method 
  // await mongoose.connect(MONGO_URL, {
  //   useNewUrlParser: true, // determines how mongoose passes that connecting string that we just copied into our mongoose URL.
  //   useFindAndModify: false, // it disables the outdated way of updating Mongo data using find and modify function
  //   useCreateIndex: true, // create index function rather than the older and sure index function
  //   useUnifiedTopology: true, // mongoose will use updated way of talking to clusters of Mongo databases
  // });

  // * new method after 6th version of mongo 
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();
