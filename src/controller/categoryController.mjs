import express from "express";
import categoryServiceImp from "../service/categoryServiceImp.mjs";
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const categoryRouter = express.Router();

categoryRouter.post("/create", async (req, res) => {
    try {
        const requestBody = req.body;
        validateRequestBody(requestBody);

        const category = await categoryServiceImp.createCategory(requestBody);
        return successResponse(res, category, "Category Created Successfully !", 200);
    } catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Creating Category";

        return errorResponse(res, message, status);
    }
});

categoryRouter.get("/all", async (req, res) => {
    try{
        const categories =  await categoryServiceImp.getAllCategories();

        return successResponse(res, categories, "Fetched All Categories Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching All Categories";

        return errorResponse(res, message, status);
    }
});

categoryRouter.delete("/:categoryId", async (req, res) => {
    try{
        const { categoryId } = req.params;
        validateParameter(categoryId, "Category ID");

        const category =  await categoryServiceImp.deleteCategory(categoryId);

        return successResponse(res, category, "Deleted Category Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Deleting Category";

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

export default categoryRouter;
