import mongoose from "mongoose";
import { Schema } from "mongoose";

export const baseFields = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

