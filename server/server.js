var express = require("express");
const bodyParser = require("body-parser");
var logger = require("morgan");

const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization "
  );
  next();
});

app.use(bodyParser.json());
app.use(logger("dev"));

app.post('/api/users/authenticate', (req, res) => {
  console.log("\najunge in authenticate", req.body.username, req.body.password)
  res.send({ "username": req.body.username, "token": "123" });
});

app.use((err, req, res, next) => {
  console.warn(err);
  res.status(500).send("some error...");
});

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});
