
import Score from "../models/Score.js";
import { findExamsByType } from "./exams.js";

export const getScores = async (req, res, next) => {
    let query;

    // Clone and sanitize req.query
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Advanced filtering
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Use Score model instead of schema
    query = Score.find(JSON.parse(queryStr));

    // Field selection
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Make sure this field exists
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    query = query.skip(startIndex).limit(limit);

    try {
        const scores = await query;
        res.status(200).json({
            success: true,
            count: scores.length,
            data: scores
        });
        console.log(scores);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


export const getScoresByUser = async (req, res, next) => {
    try {
        const scores = await Score.find({ user: req.params.userId });
        res.status(200).json({
            success: true,
            data: scores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const getScoresByUserAndSubject = async (req, res, next) => {
    try {
        const scores = await Score.find({ user: req.params.userId, subject: req.params.subject });
        res.status(200).json({
            success: true,
            data: scores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const getScoresByUserAndType = async (req, res, next) => {
    try {
        const scores = await Score.find({ user: req.params.userId, type: req.params.type });
        res.status(200).json({
            success: true,
            data: scores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const getScoresBySucject = async (req, res, next) => {
    try {
        const scores = await Score.find({ subject: req.params.subject });
        res.status(200).json({
            success: true,
            data: scores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const getScoresByType = async (req, res, next) => {
    try {
        const scores = await Score.find({ type: req.params.type });
        res.status(200).json({
            success: true,
            data: scores
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const createScore = async (req, res, next) => {
    //console.log("res:", res); // ลองดูว่า res undefined หรือไม่
    const { email, type, subject, score } = req.body;
    if (!email || !type || !subject || !score ) {
        return res.status(400).json({ success: false, msg: "Please provide all fields" });
    }
    try {
         const exams = await findExamsByType(type);
         const easyquantity = exams.filter(exam => exam.difficulty === 'easy').length;
         const mediumquantity = exams.filter(exam => exam.difficulty === 'medium').length;
         const hardquantity = exams.filter(exam => exam.difficulty === 'hard').length;

        const Newscore = await Score.create({
            email,
            type,
            subject,
            score,
            difficulty_quantity: {
                easy: easyquantity,
                medium: mediumquantity,
                hard: hardquantity
            }
        });
        res.status(201).json({
            success: true,
            data: Newscore
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const deleteScore = async (req, res, next) => {
    try {
        const score = await Score.findByIdAndDelete(req.params.id);
        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}