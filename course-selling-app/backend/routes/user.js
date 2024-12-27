const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const userRouter = Router();

// Define validation schemas using zod
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

userRouter.get("/", (req, res) => {
  res.json({
    message: "Hello User",
  });
});

userRouter.post("/signup", async (req, res) => {
  try {
    // Validate request body
    const { email, password, firstName, lastName } = signupSchema.parse(
      req.body
    );

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    res.json({
      message: "Signup Successful",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid input",
      error: error.errors || error.message,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    // Validate request body
    const { email, password } = signinSchema.parse(req.body);

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    res.json({
      message: "Signin Successful",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid input",
      error: error.errors || error.message,
    });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const courses = courseModel.find({ creatorId: userId });

  if (!courses) {
    return res.status(404).json({
      message: "Courses not found",
    });
  }

  const purchases = await purchaseModel.find({ userId: userId });

  const courseData = await courseModel.find({ _id: { $in: purchases } });
  res.json({
    purchases,
    courseData,
    message: "Courses are loaded",
  });
});

module.exports = {
  userRouter: userRouter,
};
