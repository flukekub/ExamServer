import express from "express";
import { getExams, getAllTypeExams } from "../controllers/exams.js";
import { getExam } from "../controllers/exams.js";
import { getExamsBytype } from "../controllers/exams.js";
import { createExam } from "../controllers/exams.js";
import { updateExam } from "../controllers/exams.js";
import { deleteExam } from "../controllers/exams.js";
import { protect, authorize } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router({ mergeParams: true });
const upload = multer();

router
  .route("/")
  .get(getExams)
  .post(
    protect,
    authorize('admin'),
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "answerImage", maxCount: 1 },
    ]),
    createExam
  );
router.route("/subject/:subject").get(getAllTypeExams);
router
  .route("/id/:type/:id")
  .get(getExam)
  .delete(protect, deleteExam)
  .put(protect, updateExam);
router.route("/type/:type").get(getExamsBytype);

export default router;
