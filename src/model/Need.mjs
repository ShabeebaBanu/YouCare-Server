import mongoose from "mongoose";
import { Schema } from "mongoose";
import { baseFields } from "./Base.mjs";

export const needStatusEnum = {
  AVAILABLE: "AVAILABLE",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
};

export const delivaryModeEnum = {
  YES: "Yes",
  NO: "No",
  VOLUNTEER: "Volunteer",
};

const needScheme = new Schema({
    title: { 
        type: String,
        required: true
    },
    item: {
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(needStatusEnum),
        default: needStatusEnum.AVAILABLE
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    needyName: {
        type: String,
        required: true
    },
    needyPhone: {
        type: String,
        required: true
    },
    delivaryAddress: {
        type: String
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
        required: true
    },
    delivary: {
        type: String,
        enum: Object.values(delivaryModeEnum)
    },
    
    images: {
        type: [{
        data: Buffer, 
        contentType: String,
        fileName: String
       }]
    }
},
    {
        timestamps: true
    }
);

needScheme.add(baseFields);

const Need = mongoose.model("Need", needScheme);
export default Need;