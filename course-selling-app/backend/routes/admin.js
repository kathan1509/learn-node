const { Router } = require("express");
const adminRouter = Router();
const { JWT_ADMIN_PASSWORD } = require("../config");

const jwt = require("jsonwebtoken");
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middleware/admin");
const bcrypt = require("bcrypt");
const { z } = require("zod");

// Define a schema for signup validation using zod
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// Define a schema for signin validation using zod
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

adminRouter.get("/", async (req, res) => {
  res.json({
    message: "Hello Admin",
  });
});

adminRouter.post("/signup", async (req, res) => {
  try {
    // Validate request body
    const { email, password, firstName, lastName } = signupSchema.parse(
      req.body
    );

    const existingAdmin = await adminModel.findOne({ email });

    if (existingAdmin) {
      return res.status(403).json({
        message: "Admin already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({
      message: "Signup Successful",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid input",
      error: error.errors || error.message,
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  try {
    // Validate request body
    const { email, password } = signinSchema.parse(req.body);

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD
    );

    res.json({
      token: token,
      message: "Signin Successful",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid input",
      error: error.errors || error.message,
    });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const { title, description, price, imageUrl } = req.body;

  await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creatorId: adminId,
  });
  res.json({
    message: "Course Created",
    courseId: course._id,
  });
});

adminRouter.put("/course/:id", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const course = await courseModel.updateOne(
      { _id: courseId, creatorId: adminId },
      {
        title,
        description,
        price,
        imageUrl,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course Updated",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
});

adminRouter.get("/courses/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  try {
    const courses = await courseModel.find({
      creatorId: adminId,
    });
    res.json({
      message: "Courses are loaded",
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading courses",
      error: error.message,
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
