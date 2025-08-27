import mongoose from "mongoose";
import { Schema } from "mongoose";

const needWishListSchema = new Schema({
    needId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Need",
        require: true
    },
    needCreatedBy: {
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


const NeedWishList = mongoose.model("NeedWishList", needWishListSchema);
export default NeedWishList;