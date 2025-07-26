import mongoose from "mongoose";
import { Schema } from "mongoose";
import { baseFields } from "./Base.mjs";

export const needStatusEnum = {
  AVAILABLE: "AVAILABLE",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
}

const needScheme = new Schema({
    title: { 
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