const express = require("express");
const fs = require("fs");
const passport = require("passport");
const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];
const auth = require("./config/middlewares/authorization");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const https = require("https");

mongoose.Promise = global.Promise;
mongoose.connect(config.db, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

const models_path = __dirname + "/app/models";
fs.readdirSync(models_path).forEach(file => {
  require(models_path + "/" + file);
});

require("./config/passport")(passport, config);
require("./config/express")(app, config, passport);
require("./config/routes")(app, passport, auth);

// app.listen(port);
// // we will pass our 'app' to 'https' server
https
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
      passphrase: "VerySecure"
    },
    app
  )
  .listen(3000);
console.log("Express app started on port " + port);
module.exports = app;
