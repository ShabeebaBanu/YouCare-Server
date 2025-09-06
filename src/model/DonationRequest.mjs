import mongoose from "mongoose";
import { Schema } from "mongoose";

export const donationRequestStatusEnum = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

const donationRequestSchema = new Schema({
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
        require: true
    },
    donationCreatedBy: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true
    },
    status: { 
        type: String, 
        enum: Object.values(donationRequestStatusEnum), 
        default: donationRequestStatusEnum.PENDING
    },
},
    {
       timestamps: true 
    }
);


const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);
export default DonationRequest;