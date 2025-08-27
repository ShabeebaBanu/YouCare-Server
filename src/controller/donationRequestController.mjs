import express from "express";
import donationRequestRepository from "../repository/donationRequestRepository.mjs";

const donationRequest = express.Router();

donationRequest.post("/create", async (req, res) => {
    try {
        const donationRequest = await donationRequestRepository.createDonationRequest(req.body);
        return res.status(201).json({ message: "Donation Request Created Successfully!", donationRequest });
    } catch (error) {
        console.error("Donation Request creation error:", error);
        return res.status(500).json({ message: "Error creating Wishlist", error: error.message });
    }
});

donationRequest.get("/all", async (req, res) => {
    try{
        const donationRequest =  await donationRequestRepository.getAllDonationRequest();
        return res.status(201).json({ message: "Fetched all Donation Request successfully!", donationRequest});
    }catch(error){
        return res.status(500).json({ message: "Error fetching Donation Request", error});
    }
});

donationRequest.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const donationRequest = await donationRequestRepository.getDonationRequestByCreatedBy(req.params.createdBy);
        return res.status(201).json({ message: "Donation Request Fetched Successfully!", donationRequest });
    } catch (error) {
        console.error("Wishlist Fetching error:", error);
        return res.status(500).json({ message: "Error Fetching Wishlist", error: error.message });
    }
});

donationRequest.get("/user/:userId", async (req, res) => {
    try {
        const donationRequest = await donationRequestRepository.getDonationRequestByUserId(req.params.userId);
        return res.status(201).json({ message: "Donation Request Fetched Successfully!", donationRequest });
    } catch (error) {
        console.error("Donation Request Fetching error:", error);
        return res.status(500).json({ message: "Error Fetching Donation Request", error: error.message });
    }
});

donationRequest.get("/all-request/user/:userId", async (req, res) => {
    try {
        const donationRequest = await donationRequestRepository.getAllSentAndReceivedDonationRequestsOfAUser(req.params.userId);
        return res.status(201).json({ message: "Donation Request Fetched Successfully!", donationRequest });
    } catch (error) {
        console.error("Donation Request Fetching error:", error);
        return res.status(500).json({ message: "Error Fetching Donation Request", error: error.message });
    }
});

donationRequest.delete("/:donationRequestId", async (req, res) => {
    try{
        const donationRequest =  await donationRequestRepository.deleteCategory(req.params.donationRequestId);
        return res.status(201).json({ message: "Donation Request deleted successfullty!", donationRequest});
    }catch(error){
        return res.status(500).json({ message: "Error deleting Donation Request", error});
    }
});


export default donationRequest;