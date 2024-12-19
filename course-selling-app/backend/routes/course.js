const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");

const courseRouter = Router();

courseRouter.post("/purchase", async (req, res) => {
  try {
    const { courseId } = req.body.courseId;
    const userId = req.userId;
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await purchaseModel.create({
      userId: req.userId,
      courseId: course._id,
    });
    res.json({
      message: "Course Purhcased",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error purchasing course",
      error: error.message,
    });
  }
});

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.json({
      message: "Courses are loaded",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading courses",
      error: error.message,
    });
  }
});

module.exports = {
  courseRouter: courseRouter,
};
