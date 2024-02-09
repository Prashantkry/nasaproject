const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://Nasa:Asdf213@nasa.if0d91i.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  // we can also use on (when want to connect multiple times)
  console.log("Mongo Db Connection  ready!!");
}); // it is event emitter that makes confirmation of mongo connection

mongoose.connection.on("error", (err) => {
  console.error("error", err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
