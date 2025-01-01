const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { cors } = require("cors");
const logger = require("./utilities/logger.js");
const morgan = require("morgan");

const { courseRouter } = require("./routes/course");
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const app = express();
app.use(express.json());
const port = 3000;

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();
