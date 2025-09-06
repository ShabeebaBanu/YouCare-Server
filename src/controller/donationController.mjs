import express from "express";
import donationServiceImp from "../service/donationServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";
import { extractToken } from "../service/keycloakService.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const donationRouter = express.Router();

donationRouter.post(
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

      const donationData = {
        ...formData,
        images
      };

      const donation = await donationServiceImp.createDonation(donationData, token);

      return successResponse(res, donation, "Donation Created Successfully !", 200);
    } catch (error) {
      const status = error.statusCode || 500;
      const message = error.message || "Unexpected Error While Creating Donation";

      return errorResponse(res, message, status);
    }
  }
);


donationRouter.get("/all", async (req, res) => {
  try {
    const donations = await donationServiceImp.getAllDonations();

    return successResponse(res, donations, "Fetched All Donations Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Fetching All Donations";

    return errorResponse(res, message, status);
  }
});

donationRouter.get("/:donationId", async (req, res) => {
  try {
    const { donationId } = req.params;
    validateParameter(donationId, "Donation ID");

    const donation = await donationServiceImp.getDonationByDonationId(donationId);

    return successResponse(res, donation, "Fetched Donation Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Fetching Donation";

    return errorResponse(res, message, status);
  }
});

donationRouter.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const { createdBy } = req.params;
        validateParameter(createdBy, "CreatedBy");

        const donations = await donationServiceImp.getDonationsByCreatedBy(createdBy);
       
        return successResponse(res, donations, "Fetched Donation Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Donation By CreatedBy";

        return errorResponse(res, message, status);
    }
});

donationRouter.post("/filter/create", async (req, res) => {
  try {
    const requestBody = req.body;
    validateRequestBody(requestBody);

    const donations = await donationServiceImp.getDonationByFilter(requestBody);

    return successResponse(res, donations, "Filtered Donations Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Filtering Donation";

    return errorResponse(res, message, status);
  }
});


donationRouter.put("/:donationId", async (req, res) => {
  try {
    const { donationId } = req.params;
    validateParameter(donationId, "Donation ID");

    const requestBody = req.body;
    validateRequestBody(requestBody);

    const donation = await donationServiceImp.updateDonation(donationId, requestBody);

    return successResponse(res, donation, "Updated Donation Successfully!", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Updating Donation";

    return errorResponse(res, message, status);
  }
});

donationRouter.get("/nearby/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    validateParameter(userId);

    const donations = await donationServiceImp.getNearbyDonations(userId);
    return successResponse(res, donations.data, donations.message, donations.success ? 200 : 500);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Unexpected Error While Fetching Nearby Donations";

    return errorResponse(res, message, status);
  }
});


donationRouter.delete("/:donationId", async (req, res) => {
    try{
        const { donationId } = req.params;
        validateParameter(donationId);

        const response =  await donationServiceImp.deleteDonation(donationId);
        return successResponse(res, response.data, response.message, response.success ? 200 : 500);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Deleting Donation";

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

export default donationRouter;
