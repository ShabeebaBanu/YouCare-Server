import mongoose from "mongoose";
import { Schema } from "mongoose";

export const districtSchema = new Schema({
    name: {
        type: String, 
        required: true 
    }
});

const District = mongoose.model("District", districtSchema);
export default District;


