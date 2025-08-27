import mongoose from "mongoose";
import { Schema } from "mongoose";
import { baseFields } from "./Base.mjs";

export const donationStatusEnum = {
  AVAILABLE: "AVAILABLE",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
};

export const delivaryModeEnum = {
  YES: "Yes",
  NO: "No",
  VOLUNTEER: "Volunteer",
};

const donationSchema = new Schema({
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
        enum: Object.values(donationStatusEnum), 
        default: donationStatusEnum.AVAILABLE
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
    donerName: {
        type: String,
        required: true
    },
    donerPhone: {
        type: String,
        required: true
    },
    pickupAddress: {
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
    userType: {
        type: String,
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

donationSchema.add(baseFields);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
