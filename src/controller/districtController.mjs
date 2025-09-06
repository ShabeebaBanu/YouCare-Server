import express from "express";
import districtRepository from "../repository/districtRepository.mjs";
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const districtRouter = express.Router();

districtRouter.post("/create", async (req, res) => {
    try{
        const requestBody = req.body;
        validateRequestBody(requestBody);

        const district = await districtRepository.createDistrict(requestBody);

        return successResponse(res, district, "District Created Successfully !", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Creating District";
        
        return errorResponse(res, message, status);
    }
    
});

districtRouter.get("/all", async (req, res) => {
    try{
        const districts =  await districtRepository.getAllDistricts();
    
        return successResponse(res, districts, "Fetched All Districts Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching All Districts";

        return errorResponse(res, message, status);
    }
});

districtRouter.get("/:districtId", async (req, res) => {
    try{
        const { districtId } = req.params;
        validateParameter(districtId, "District ID");

        const district = await districtRepository.getDistrictByDistrictId(req.params.districtId);
            
        return successResponse(res, district, "Fetched District Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching District";

        return errorResponse(res, message, status);
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



export default districtRouter;