import mongoose from "mongoose";
import { Schema } from "mongoose";

export const categoryScheme = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Category = mongoose.model("Category", categoryScheme);
export default Category;