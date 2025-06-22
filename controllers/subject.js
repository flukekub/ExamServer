import Subject from "../models/Subject.js";

export const getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json({
            success: true,
            data: subjects
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const getSubjectById = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }
        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const createSubject = async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); 
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }
        console.log("req body ",req.body);
        res.status(200).json({
            
            success: true,
            data: subject
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}