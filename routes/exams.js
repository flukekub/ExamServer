import express from 'express';
import { getExams } from '../controllers/exams.js';
import { getExam } from '../controllers/exams.js';
import { getExamsBytype } from '../controllers/exams.js';
import { createExam } from '../controllers/exams.js';
import { updateExam } from '../controllers/exams.js';
import { deleteExam } from '../controllers/exams.js';


const router = express.Router({mergeParams:true});

router.route('/').get(getExams).post(createExam);
router.route('/:id').get(getExam).delete(deleteExam).put(updateExam);
router.route('/type/:type').get(getExamsBytype);


export default router;