import express from 'express';
import { getSubjects, getSubjectById, createSubject,updateSubject,deleteSubject } from '../controllers/subject.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getSubjects)
    .post(createSubject);
router.route('/:id')
    .get(getSubjectById)
    .put(updateSubject)
    .delete(deleteSubject);

export default router;