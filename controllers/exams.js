import Exam from "../models/Exam.js";



export const getExams = async (req, res, next) => {
    let query;

    //Copy req.query
    const reqQuery= {...req.query};
    ///REmove fields from query
    const removeFields = ['select', 'sort', 'page', 'limit'];
    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    //create query string
    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    query=Exam.find(JSON.parse(queryStr));
    //select fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    //Sort
    if( req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createAt');
    }
    try{
        const exams = await query;
        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        })
        console.log(exams);
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }

};

export const getExam = async (req, res, next) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }
        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const findExamsByType = async (type) => {
    const exams = await Exam.find({ type });
    if (!exams || exams.length === 0) {
        throw new Error("Exams not found");
    }
    return exams;
};

export const getExamsBytype = async (req, res, next) => {
    try {
        const exams = await Exam.find({ type: req.params.type });
        if (!exams) {
            return res.status(404).json({
                success: false,
                message: 'Exams not found'
            });
        }
        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const createExam = async (req, res, next) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json({
            success: true,
            data: exam
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const updateExam = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }
        res.status(200).json({
            success: true,
            data: exam
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const deleteExam = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
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

