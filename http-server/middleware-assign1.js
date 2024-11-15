//Create a middleware function that logs each incoming
//request’s HTTP method, URL, and timestamp to the console

const express = require("express");

const app = express();

const requestLogger = (req, res, next) => {
  const timestamp = new Date();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

module.exports = requestLogger;

app.get("/logger", requestLogger, (req, res) => {
  res.send("Hello World!");
});

app.get("/sum", requestLogger, (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  res.json({
    ans: a + b,
  });
});

app.listen(3000);
