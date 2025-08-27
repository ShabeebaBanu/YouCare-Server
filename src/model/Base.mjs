import mongoose from "mongoose";
import { Schema } from "mongoose";

export const baseFields = new Schema({
    createdBy: {
        type: String,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: String,
        ref: "User"
    }
});

