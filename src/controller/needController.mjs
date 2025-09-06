import express from "express";
import needServiceImp from "../service/needServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";
import { extractToken } from "../service/keycloakService.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const needRouter = express.Router();

needRouter.post(
  "/create",
  upload.array("images", MAX_IMAGE_LIMIT),
  async (req, res) => {

    try {
      const token = await extractToken(req);

      const formData = req.body;
      validateRequestBody(formData);
      
      const images = req.files?.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
        fileName: file.originalname
      })) || [];

      const needData = {
        ...formData,
        images
      };

      const need = await needServiceImp.createNeed(needData, token);

      return successResponse(res, need, "Need Created Successfully !", 200);  
    } catch (error) {
      const status = error.statusCode || 500;
      const message = error.message || "Unexpected Error While Creating need";

      return errorResponse(res, message, status);
    }
  }
);


needRouter.get("/all", async (req, res) => {
  try {
    const needs = await needServiceImp.getAllNeeds();

    return successResponse(res, needs, "Fetched All Needs Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Fetching All Needs";

    return errorResponse(res, message, status);
  }
});


needRouter.get("/:needId", async (req, res) => {
  try {
    const { needId } = req.params;
    validateParameter(needId, "Need ID");

    const need = await needServiceImp.getNeedByNeedId(needId);

    return successResponse(res, need, "Fetched Need Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Fetching Need";

    return errorResponse(res, message, status);
  }
});


needRouter.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const { createdBy } = req.params;
        validateParameter(createdBy, "CreatedBy");

        const needs = await needServiceImp.getNeedsByCreatedBy(createdBy);

        return successResponse(res, needs, "Fetched Needs Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Needs By CreatedBy";

        return errorResponse(res, message, status);
    }
});


needRouter.put("/:needId", async (req, res) => {
  try {
    const { needId } = req.params;
    validateParameter(needId, "Need ID");

    const requestBody = req.body;
    validateRequestBody(requestBody);

    const need = await needServiceImp.updateNeed(needId, requestBody);

    return successResponse(res, need, "Updated Need Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Updating Need";

    return errorResponse(res, message, status);
  }
});

needRouter.post("/filter/create", async (req, res) => {
  try {
    const requestBody = req.body;
    validateRequestBody(requestBody);

    const needs = await needServiceImp.getNeedByFilter(requestBody);

    return successResponse(res, needs, "Filtered Needs Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Filtering Need";

    return errorResponse(res, message, status);
  }
});

needRouter.get("/nearby/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    validateParameter(userId);

    const needs = await needServiceImp.getNearbyNeeds(userId);
    return successResponse(res, needs.data, needs.message, needs.success ? 200 : 500);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Fetching Nearby Needs";

    return errorResponse(res, message, status);
  }
});

needRouter.delete("/:needId", async (req, res) => {
    try{
      const { needId } = req.params;
      validateParameter(needId);

      const response =  await needServiceImp.deleteNeed(needId);
      return successResponse(res, response.data, response.message, response.success ? 200 : 500);
    }catch(error){
      const status = error.statusCode || 500;
      const message = error.message || "Unexpected Error While Fetching Deleting Need";

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

export default needRouter;
