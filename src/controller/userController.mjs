import express from "express";
import userServiceImp from "../service/userServiceImp.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";
import { extractToken } from "../service/keycloakService.mjs";
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const userRouter = express.Router();

userRouter.post("/create", async (req, res) => {
    try{
        const requestBody = req.body;
        validateRequestBody(requestBody);

        if (!requestBody.email || requestBody.email == "") {
           throw new BadRequestException("Email is Required");
        }

        const response = await userServiceImp.createUser(requestBody);

        return successResponse(res, response.data, response.message, response.success ? 200 : 500);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Creating User";
        
        return errorResponse(res, message, status);
    }
});

userRouter.post("/otp", async (req, res) => {
    try{
        const requestBody = req.body;
        validateRequestBody(requestBody);

        const response = await userServiceImp.sendOtp(requestBody.email);

        return successResponse(res, response.data, response.message, response.success ? 200 : 500);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Sending OTP";

        return errorResponse(res, message, status);
    }
});

userRouter.post("/verify/otp", async (req, res) => {
    try {
        const requestBody = req.body;
        validateRequestBody(requestBody);

        const { otp, email } = requestBody;

        if (!otp || otp === "" || !email || email === "") {
            throw new BadRequestException("Email and OTP Cannot be empty/ null")
        }

        const response = await userServiceImp.verifyOtp(email, otp);

        return successResponse(res, response.data, response.message, response.success ? 200 : 500);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Verifying OTP";
        
        return errorResponse(res, message, status);
    }
});

userRouter.get("/all", async (req, res) => {
    try{
        const users =  await userServiceImp.getAllUsers();

        return successResponse(res, users, "Fetched All Users Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching All Users";
        
        return errorResponse(res, message, status);
    }
});

userRouter.get("/:userId", async (req, res) => {
    try{
        const { userId } = req.params;
        validateParameter( userId, "User ID");

        const token = await extractToken(req);

        const response = await userServiceImp.getUserByUserId(userId, token);
        
        return successResponse(res, response, "Fetched User Details Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching User Details";

        return errorResponse(res, message, status);
    }
});

userRouter.put("/update/:userId", async (req, res) => {
    try{
        if (!req.params.userId) {
           throw new BadRequestException("UserId is Required");
        }

        if (!req.body) {
            throw new BadRequestException("Updated user data cannot be null")
        }

        const token = await extractToken(req);
        console.log("request: ", req);
        const response = await userServiceImp.updateUser(req.params.userId, req.body, token);
        return res.status(response.success ? 200 : 400).json(response);
    }catch(error){
        const status = error.statusCode || 500;
        const errorMessage = error.message || "Unexpected Error occured while updating user"
        return res.status(status).json({ message: errorMessage});
    }
});

userRouter.put("/reset-password/:email", async (req, res) => {
    if (!req.params.email || req.params.email == "") {
        throw new BadRequestException("Email cannot be null/empty");
    }
    
    if (!req.body.newPassword || req.body.newPassword == "") {
        throw new BadRequestException("Password cannot be null/empty");
    }

    try{
        const response = await userServiceImp.resetPassword(req.params.email, req.body.newPassword);
        return res.status(response.success ? 200 : 400).json(response);
    }catch(error){
        const status = error.statusCode || 500;
        const errorMessage = error.message || "Unexpected Error occured while reseting password"
        return res.status(status).json({ message: errorMessage});
    }
});

userRouter.get("/district/:district", async (req, res) => {
    try{
        const users = await userServiceImp.getUsersByDistrict(req.params.district);
        if(users.length == 0){
            return res.status(404).json({ message: `No users found in ${req.params.district}`});
        }
        return res.status(201).json({ message: `Fetched all usres from ${req.params.district} successfully!`, users});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the users with district ${req.params.district}`});
    }
}),

userRouter.get("/province/:province", async (req, res) => {
    try{
        const users = await userServiceImp.getUsersByProvince(req.params.province);
        if(users.length == 0){
            return res.status(404).json({ message: `No users found in ${req.params.province}`});
        }
        return res.status(201).json({ message: `Fetched all usres from ${req.params.province} successfully!`, users});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the users with province ${req.params.province}`});
    }
});

userRouter.get("/role/:role", async (req, res) => {
    try{
        const users = await userServiceImp.getUsersByRole(req.params.role);
        if(users.length == 0){
            return res.status(404).json({ message: `No users found with role ${req.params.role}`});
        }
        return res.status(201).json({ message: `Fetched all usres with role ${req.params.role} successfully!`, users});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the users with role ${req.params.role}`});
    }
});

userRouter.delete("/:userId", async (req, res) => {
    try{
        const deletedUser = await userServiceImp.deleteUserByUserId(req.params.userId);
        if(!deletedUser){
            return res.status(404).json({ message: `No users found with ID ${req.params.userId}`});
        }
        return res.status(201).json({ message: `User with ID ${req.params.userId} deleted successfully!`, deletedUser});
    }catch(error){
        return res.status(500).json({ message: `Error deleting the user with ID ${req.params.userId}`});
    }
});


function validateParameter(param, type) {
    if (!param) {
      throw new BadRequestException(`${type} is required or is invalid format`);
    }
}

function validateRequestBody(requestBody) {
    if (!requestBody || Object.keys(requestBody).length === 0) {
       throw new BadRequestException("No Request Found: Request Body Cannot Be Empty")
    }
}

export default userRouter;