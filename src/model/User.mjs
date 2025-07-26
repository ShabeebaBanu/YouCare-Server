import mongoose from "mongoose";
import { Schema } from "mongoose";
import { baseFields } from "./Base.mjs";

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    district: { 
        type: String, 
        required: true 
    },
    province: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["ADMIN", "DONOR", "NEEDY"], 
        required: true },
    type: { 
        type: String, 
        required: true 
    }
},
    {
        timestamps: true
    }
);

userSchema.virtual("donations", {
    ref: "Donation", 
    localField: "_id",
    foreignField: "user"
});

userSchema.virtual("needs", {
    ref: "Need",
    localField: "_id",
    foreignField: "user"
});

// Ensure virtuals are included in JSON responses
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.add(baseFields);

const User = mongoose.model("User", userSchema);
export default User;
