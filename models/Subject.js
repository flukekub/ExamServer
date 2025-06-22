import mongoose from "mongoose";

export const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});
export default mongoose.model("Subject", subjectSchema);