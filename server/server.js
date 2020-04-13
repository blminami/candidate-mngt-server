import express from "express";
import "babel-polyfill";
import cors from "cors";
import usersRoute from "./routes/usersRoute";
import seedRoute from "./routes/seedRoute";

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

app.use("/api", usersRoute);
app.use("/api", seedRoute);

app.use((err, req, res, next) => {
  console.warn(err);
  res.status(500).send("some error...");
});

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});
