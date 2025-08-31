import express from "express";
import donationServiceImp from "../service/donationServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";
import { extractToken } from "../service/keycloakService.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";

const donationRouter = express.Router();

donationRouter.post(
  "/create",
  upload.array("images", MAX_IMAGE_LIMIT),
  async (req, res) => {

    const token = await extractToken(req);

    try {
      const formData = req.body;

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

      return res.status(201).json({ message: "Donation Created Successfully!", donation });
    } catch (error) {
      console.error("Donation creation error:", error);
      return res.status(500).json({ message: "Error creating Donation", error: error.message });
    }
  }
);


donationRouter.get("/all", async (req, res) => {
  try {
    const donations = await donationServiceImp.getAllDonations();
    return res.status(200).json({ message: "Fetched all donations successfully!", donations });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
});


donationRouter.get("/:donationId", async (req, res) => {
  try {
    const donation = await donationServiceImp.getDonationByDonationId(req.params.donationId);

    if (!donation) {
      return res.status(404).json({ message: `Donation with ID ${req.params.donationId} not found` });
    }

    return res.status(200).json({ message: "Donation fetched successfully!", donation });
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching the donation with ID ${req.params.donationId}`,
      error: error.message
    });
  }
});


donationRouter.get("/createdBy/:createdBy", async (req, res) => {
    if (!req.params.createdBy || req.params.createdBy == "") {
      throw new BadRequestException("CreatedBy Cannot be null/empty");
    }

    try {
        const response = await donationServiceImp.getDonationsByCreatedBy(req.params.createdBy);

        if (!response.success) {
          return res.status(404).json(response)
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
          message: `Error fetching the donations with ID ${req.params.createdBy}`,
          error: error.message
       });
    }
});

donationRouter.post("/filter/create", async (req, res) => {
  console.log("start");
  try {
     
     const donations = await donationServiceImp.getDonationByFilter(req.body);

     return res.status(200).json({ message: "Donation filtered successfully!", donations });
  } catch (error) {
    return res.status(500).json({
      message: `Error filtering the donations`,
      error: error.message
    });
  }
});


donationRouter.put("/:donationId", async (req, res) => {
  if (!req.params.donationId || req.params.donationId == "") {
    throw new BadRequestException("Donation ID cannot be null");
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestException("Updated donation information not found");
  }
  console.log("request body: ", req.body);

  try {
     const response = await donationServiceImp.updateDonation(req.params.donationId, req.body);

     if (!response.success) {
        return res.status(response.success ? 200 : 400).json(response);
     }
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    return res.status(500).json({
      message: `Error updating the donation with ID ${req.params.donationId}`,
      error: error.message
    });
  }
});

donationRouter.get("/nearby/user/:userId", async (req, res) => {
  try {
    const response = await donationServiceImp.getNearbyDonations(req.params.userId);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    const status = error.statusCode || 500;
    const errorMessage = error.message || "Unexpected Error occured while fetching nearby donations"
    return res.status(status).json({ message: errorMessage});
  }
});


donationRouter.delete("/:donationId", async (req, res) => {
    if (!req.params.donationId || req.params.donationId == "") {
       throw new BadRequestException("Donation ID cannot be null/empty");
    }

    try{
        const response =  await donationServiceImp.deleteDonation(req.params.donationId);
        return res.status(response.success ? 200 : 400).json(response);
    }catch(error){
      const status = error.statusCode || 500;
      const errorMessage = error.message || "Unexpected Error occured while deleting Donation"
      return res.status(status).json({ message: errorMessage});
    }
});

export default donationRouter;
