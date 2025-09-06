import express from "express";
import donationRequestRepository from "../repository/donationRequestRepository.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";
import { getUserDetailsByUserId } from "../service/keycloakService.mjs";
import { donationRequestStatusEnum } from "../model/DonationRequest.mjs";
import donationRepository from "../repository/donationRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { donationStatusEnum } from "../model/Donation.mjs";
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const donationRequest = express.Router();

donationRequest.post("/create", async (req, res) => {
    try {
        const requestBody = req.body;
        validateRequestBody(requestBody);

        const donationRequest = await donationRequestRepository.createDonationRequest(requestBody);

        return successResponse(res, donationRequest, "Donation Request Created Successfully !", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Creating Donation";

        return errorResponse(res, message, status);
    }
});

donationRequest.get("/all", async (req, res) => {
    try{
        const donationRequests =  await donationRequestRepository.getAllDonationRequest();
   
        return successResponse(res, donationRequests, "Fetched All Donation Requests Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching All Donation Requests";
        
        return errorResponse(res, message, status);
    }
});

donationRequest.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const { createdBy } = req.params;
        validateParameter(createdBy, "CreatedBy");

        const donationRequests = await donationRequestRepository.getDonationRequestByCreatedBy(createdBy);
        
        return successResponse(res, donationRequests, "Fetched Donation Requests Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Donation Requests By CreatedBy";

        return errorResponse(res, message, status);
    }
});

donationRequest.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        validateParameter( userId, "User ID");

        const donationRequests = await donationRequestRepository.getDonationRequestByUserId(userId);
        
        return successResponse(res, donationRequests, "Fetched Donation Requests Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Donation Requests By UserId";

        return errorResponse(res, message, status);
    }
});

// get All Sent And Received Donation Requests Of A User
donationRequest.get("/all-request/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        validateParameter( userId, "User ID");

        const donationRequests = await donationRequestRepository.getAllSentAndReceivedDonationRequestsOfAUser(userId);
                
        return successResponse(res, donationRequests, "Fetched Donation Requests Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Donation Requests By UserId";

        return errorResponse(res, message, status);
    }
});

donationRequest.put("/confirm/:donationRequestId", async (req, res) => {
    try {
        const { donationRequestId } = req.params;
        validateParameter( donationRequestId, "Donation Request ID");

        const requestData = donationRequestRepository.getDonationRequestById(donationRequestId);
        if (!requestData) {
            throw new ResourceNotFoundException("No Donation Request found with Given ID");
        }

        const updatedRequest = await donationRequestRepository.updateStatusById(
         donationRequestId,
         String(donationRequestStatusEnum.ACCEPTED)
        );
        if (!updatedRequest) {
            throw new Error("Failed to update donation request Status");
        }

        const updateDonation = await donationRepository.updateStatusById(
         updatedRequest.donationId,
         donationStatusEnum.COMPLETED
        );
        if (!updateDonation) {
           throw new Error("Failed to update donation Status");
        }

        return successResponse(res, updatedRequest, "Donation Request Confirmed Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Confirming Donation Request";
        
        return errorResponse(res, message, status);
    }
});

donationRequest.get("/donation/:donationId", async (req, res) => {
    try {
        const { donationId } = req.params;
        validateParameter(donationId, "Donation ID");

        const donationRequests = await donationRequestRepository.getDonationRequestByDonationId(donationId);

        if (!donationRequests || donationRequests.length === 0) {
            return successResponse(res, [], "No Donation Requests Found With Given Donation ID", 200);
        }

        const formatResponse = await Promise.all(
            donationRequests.map(async (request) => {
                const needyDetails = await getUserDetailsByUserId(request.userId);
                if (!needyDetails) {
                    throw new ResourceNotFoundException("No Needy Found With Given ID")
                }

                const donorDetails = await getUserDetailsByUserId(request.donationCreatedBy);
                if (!donorDetails) {
                    throw new ResourceNotFoundException("No Doner Found With Given ID")
                }

                return {
                    donationRequestDetail: {
                        id: request._id,
                        createdBy: request.createdBy,
                        createdAt: request.createdAt,
                        updatedAt: request.updatedAt
                    },
                    donationDetail: {
                        id: request.donationId._id,
                        title: request.donationId.title,
                        item: request.donationId.item,
                        description: request.donationId.description,
                        status: request.donationId.status,
                        quantity: request.donationId.quantity,
                        category: request.donationId.category.name,
                        pickupAddress: request.pickupAddress,
                        district: request.donationId.district.name,
                        delivary: request.donationId.delivary,
                        userType: request.donationId.userType,
                        images: request.donationId.images,
                    },
                    needyDetails: {
                        id: request.userId,
                        username: needyDetails?.username || "",
                        district: needyDetails?.attributes?.district?.[0] || "",
                        province: needyDetails?.attributes?.province?.[0] || "",
                        organizationName: needyDetails?.attributes?.organizationName?.[0] || "",
                        organizationAddress: needyDetails?.attributes?.organizationAddress?.[0] || ""
                    },
                    donorDetails: {
                        id: donorDetails?._id,
                        username: request.donerName || "",
                        phone: request.donerPhone || "",
                        district: donorDetails?.attributes?.district?.[0] || "",
                        province: donorDetails?.attributes?.province?.[0] || "",
                        organizationName: donorDetails?.attributes?.organizationName?.[0] || "",
                        organizationAddress: donorDetails?.attributes?.organizationAddress?.[0] || ""
                    }
                };
            })
        );

        return successResponse(res, formatResponse, "Fetched Donation Request Details Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Donation Request Details";
        
        return errorResponse(res, message, status);
    }
});

donationRequest.delete("/:donationRequestId", async (req, res) => {
    try{
        const { donationRequestId } = req.params;
        validateParameter(donationRequestId);

        const response =  await donationRequestRepository.deleteCategory(donationRequestId);
        
        return successResponse(res, response, "Donation Request Deleted Successfully", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Deleting Donation Request";
        
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


export default donationRequest;