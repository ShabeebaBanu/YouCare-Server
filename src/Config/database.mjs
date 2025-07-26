import mongoose from "mongoose";


const connectMongoDB = async () => {
    try{
        const connectionInstance = await mongoose.connect("mongodb://localhost:27017/YouCare",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Mongo DB Connected Successful ! : ${connectionInstance}`);
    }
    catch(error){
        console.log("Mongo DB Connection Error : ", error);
        process.exit(1);
    }
    
}

export default connectMongoDB;
