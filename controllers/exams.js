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
    const exam = await Exam.findById(req.params.id);
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
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Exam.countDocuments({ type: req.params.type });

    const exams = await Exam.find({ type: req.params.type })
      .skip(startIndex)
      .limit(limit);

    if (!exams || exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exams not found",
      });
    }

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: exams.length,
      total,
      pagination,
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
    const types = await Exam.distinct("type", { subject: req.params.subject });
    if (!types || types.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exam types found for this subject",
      });
    }
    res.status(200).json({
      success: true,
      count: types.length,
      data: types,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
