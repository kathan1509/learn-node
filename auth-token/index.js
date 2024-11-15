const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "kirat123123";

const app = express();
app.use(express.json());

const users = [];

function logger(req, res, next) {
  console.log(req.method + " request came");
  next();
}

// localhost:3000
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", logger, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  users.push({
    username: username,
    password: password,
  });

  // we should check if a user with this username already exists

  res.json({
    message: "You are signed in",
  });
});

app.post("/signin", logger, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      foundUser = users[i];
      break; // Exit loop once user is found
    }
  }

  if (!foundUser) {
    return res.status(401).json({
      message: "Credentials incorrect",
    });
  }

  const token = jwt.sign(
    {
      username: foundUser.username, // Use foundUser instead of users[i]
    },
    JWT_SECRET
  );

  res.header("jwt", token);
  res.json({
    token: token,
  });
});

function auth(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided. Please sign in first.",
    });
  }

  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData.username) {
      req.username = decodedData.username;
      next();
    } else {
      res.status(401).json({
        message: "Invalid token",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}

app.get("/me", logger, auth, function (req, res) {
  // req = {status, headers...., username, password, userFirstName, random; ":123123"}
  const currentUser = req.username;
  // const token = req.headers.token;
  // const decodedData = jwt.verify(token, JWT_SECRET);
  // const currentUser = decodedData.username

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
      foundUser = users[i];
    }
  }

  res.json({
    username: foundUser.username,
    password: foundUser.password,
  });
});

app.listen(3000);
