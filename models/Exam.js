import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
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
        enum: ["set", "logic","realNumber","relationAndFunction","exponentialAndLogarithms","trigon","complexNumber","matrices","sequenceAndSeries","AnalyticGeometryAndConicSections","vector","calculus","statistic","counting","probability","probabilityDistributions"],
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Exam", examSchema);