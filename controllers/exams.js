import { get } from "mongoose";
import Exam from "../models/Exam.js";

export const getExams = async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };
  ///REmove fields from query
  const removeFields = ["select", "sort", "page", "limit"];
  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);
  //create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Exam.find(JSON.parse(queryStr)).select("-imageData -answerImageData");
  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // แก้ไขจาก createAt เป็น createdAt
  }
  try {
    const exams = await query;
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
    console.log(exams);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getExam = async (req, res, next) => {
  try {
    const { id, type } = req.params;

    // ดึงข้อมูล exam ปัจจุบัน
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // ดึงข้อมูล exam ตัวก่อนหน้า
    const previousExam = await Exam.findOne({ type, _id: { $lt: id } })
      .sort({
        _id: -1,
      })
      .skip(1) // ข้ามเอกสารแรก
      .limit(1);

    // ดึงข้อมูล exam ตัวถัดไป
    const nextExam = await Exam.findOne({ type, _id: { $gt: id } }).sort({
      _id: 1,
    });

    res.status(200).json({
      success: true,
      data: {
        currentExam: exam,
        previousExamId: previousExam ? previousExam._id : null,
        nextExamId: nextExam ? nextExam._id : null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const findExamsByType = async (type) => {
  const exams = await Exam.find({ type });
  if (!exams || exams.length === 0) {
    throw new Error("Exams not found");
  }
  return exams;
};

export const getExamsBytype = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null; // ตรวจสอบ limit
    const startIndex = (page - 1) * (limit || 0); // ถ้าไม่มี limit, startIndex จะเป็น 0
    const total = await Exam.countDocuments({ type: req.params.type });

    let examsQuery = Exam.find({ type: req.params.type });

    // Apply pagination only if limit is provided
    if (limit) {
      examsQuery = examsQuery.skip(startIndex).limit(limit);
    }

    const exams = await examsQuery;

    if (!exams || exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exams not found",
      });
    }

    // Pagination result
    const totalPages = limit ? Math.ceil(total / limit) : 1; // ถ้าไม่มี limit, totalPages จะเป็น 1
    const pagination = {};

    if (limit && startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (limit && startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: exams.length,
      total,
      totalPages,
      pagination: limit ? pagination : null, // ถ้าไม่มี limit, pagination จะเป็น null
      data: exams,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const createExam = async (req, res, next) => {
  try {
    const { name, answer, subject, type, difficulty, choices } = req.body;

    // ดึงข้อมูลไฟล์จาก req.files
    const imageData = req.files?.image?.[0]?.buffer;
    const imageType = req.files?.image?.[0]?.mimetype;
    const answerImageData = req.files?.answerImage?.[0]?.buffer;
    const answerImageType = req.files?.answerImage?.[0]?.mimetype;

    // ตรวจสอบไฟล์ที่จำเป็น
    if (!imageData || !imageType) {
      return res.status(400).json({
        success: false,
        message: "Exam image file is required.",
      });
    }

    if (!answerImageData || !answerImageType) {
      return res.status(400).json({
        success: false,
        message: "Answer image file is required.",
      });
    }

    // สร้าง exam object
    const examData = {
      name,
      imageData,
      imageType,
      answer,
      subject,
      type,
      difficulty,
      choices,
      answerImageData,
      answerImageType,
    };

    const exam = await Exam.create(examData);
    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }
    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllTypeExams = async (req, res, next) => {
  try {
    const types = await Exam.aggregate([
      { $match: { subject: req.params.subject } }, // Filter by subject
      { $group: { _id: "$type" } }, // Group by type
      { $project: { _id: 0, type: "$_id" } }, // Format the output
    ]);

    if (!types || types.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exam types found for this subject",
      });
    }

    res.status(200).json({
      success: true,
      count: types.length,
      data: types.map((t) => t.type), // Extract type values
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
