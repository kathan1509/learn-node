const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");

const courseRouter = Router();

courseRouter.post("/purchase", async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await courseModel.findById(courseId);
    const purchase = await purchaseModel.create({
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

courseRouter.get("/preview", (req, res) => {
  try {
    const courses = courseModel.find({});
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
