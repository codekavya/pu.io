const express = require("express");

const mongoose = require("mongoose");

const { mongoDbKey } = require("./config.json");

const mainRoutes = require("./routes/mainRoutes");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(mainRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(mongoDbKey)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
