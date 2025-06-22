import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum: ["set", "logic","realNumber","relationAndFunction","exponentialAndLogarithms","trigon","complexNumber","matrices","sequenceAndSeries","AnalyticGeometryAndConicSections","vector","calculus","statistic","counting","probability","probabilityDistributions"],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    difficulty_quantity: {
        easy:{
            type: Number,
            required: true,
        },
        medium:{
            type: Number,
            required: true,
        },
        hard:{
            type: Number,
            required: true,
        }
    },
}, { timestamps: true });

export default mongoose.model("Score", scoreSchema);