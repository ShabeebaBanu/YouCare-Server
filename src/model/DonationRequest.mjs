import mongoose from "mongoose";
import { Schema } from "mongoose";

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
    }
},
    {
       timestamps: true 
    }
);


const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);
export default DonationRequest;