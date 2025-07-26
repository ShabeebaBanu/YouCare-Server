import express from "express";
import donationServiceImp from "../service/donationServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";

const donationRouter = express.Router();

donationRouter.post(
  "/create",
  upload.array("images", MAX_IMAGE_LIMIT),
  async (req, res) => {
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

      const donation = await donationServiceImp.createDonation(donationData);

      return res.status(201).json({ message: "Donation Created Successfully!", donation });
    } catch (error) {
      console.error("Donation creation error:", error);
      return res.status(500).json({ message: "Error creating Donation", error: error.message });
    }
  }
);


donationRouter.get("/all", async (res) => {
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


donationRouter.get("/user/:createdBy", async (req, res) => {
    try {
        const donations = await donationServiceImp.getDonationsByCreatedBy(req.params.createdBy);

        if (donations == null) {
            return res.status(404).json({ message: `No Donations found with user ID ${req.params.createdBy}` })
        }

        return res.status(200).json({ message: "Donations fetched successfully!", donations });
    } catch (error) {
        return res.status(500)({
          message: `Error fetching the donations with ID ${req.params.createdBy}`,
          error: error.message
       });
    }
});


donationRouter.put("/:donationId", async (req, res) => {
  try {
     const updatedDonation = await donationServiceImp.updateDonation(req.params.donationId, req.body);

     if (updatedDonation == null) {
          return res.status(404).json({ message: `No Donation found with ID ${req.params.donationId}`})
     }

     return res.status(200).json({ message: "Donation updated successfully!", updatedDonation });
  } catch (error) {
    return res.status(500)({
      message: `Error updating the donation with ID ${req.params.donationId}`,
      error: error.message
    });
  }
});

export default donationRouter;
