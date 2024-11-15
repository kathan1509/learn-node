const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { z } = require("zod");

const app = express();
app.use(express.json());
const { UserModel, TodoModel } = require("./db");
const { auth } = require("./auth");
const uri = process.env.MONGODB_URI;

const mongoose = require("mongoose");
mongoose.connect(uri);

const secret = process.env.JWT_SECRET;

console.log(secret);

app.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    name: z.string().min(3).max(20),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    return res.status(400).json(parsedDataWithSuccess.error);
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const hasedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
    email: email,
    password: hasedPassword,
    name: name,
  });

  res.json({
    message: "You are signed up",
  });
});

app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
  });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (user && passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      secret
    );

    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect creds",
    });
  }
});

app.post("/todo", auth, async function (req, res) {
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;

  await TodoModel.create({
    userId,
    title,
    done,
  });

  res.json({
    message: "Todo created",
  });
});

app.get("/todos", auth, async function (req, res) {
  const userId = req.userId;

  const todos = await TodoModel.find({
    userId,
  });

  res.json({
    todos,
  });
});

app.listen(3000);
