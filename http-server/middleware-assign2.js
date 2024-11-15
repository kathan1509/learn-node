//Create a middleware that counts total number of requests sent to a server. Also create an endpoint that exposes it

const express = require("express");

const app = express();

let totalRequests = 0;

// Request counter middleware
const requestCounter = (req, res, next) => {
  totalRequests++;
  req.requestCount = totalRequests;
  console.log(`Request #${totalRequests} - ${req.method} ${req.url}`);

  next();
};

app.use(requestCounter);

app.get("/stats", (req, res) => {
  res.json({
    totalRequests,
    message: `Total requests since server start: ${totalRequests}`,
  });
});

app.get("/current", (req, res) => {
  res.json({
    currentRequest: req.requestCount,
    message: `This is request #${req.requestCount}`,
  });
});

app.get("/", (req, res) => {
  res.send(`Hello World! This is request #${req.requestCount}`);
});

app.get("/count", function (req, res) {
  res.json({
    count: count,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access request stats at http://localhost:${PORT}/stats`);
});

module.exports = app;
