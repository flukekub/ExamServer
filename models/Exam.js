import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    imageData: {
        type: Buffer,
        required: true,
    },
    imageType: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    subject:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
    },
    choices:{
        type: Number,
        required: true,
    },
    answerImageData: {
        type: Buffer,
        required: true,
    },
    answerImageType: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Exam", examSchema);