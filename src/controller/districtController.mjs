import express from "express";
import districtRepository from "../repository/districtRepository.mjs";

const districtRouter = express.Router();

districtRouter.post("/create", async (req, res) => {
    try{
        const district = await districtRepository.createDistrict(req.body);
        return res.status(201).json({ message: "District Created successfully!", district});
    }catch(error){
        return res.status(500).json({ message: "Error creating district", error});
    }
    
});

districtRouter.get("/all", async (req, res) => {
    try{
        const districts =  await districtRepository.getAllDistricts(req, res);
        return res.status(201).json({ message: "Fetched all districts successfullty!", districts});
    }catch(error){
        return res.status(500).json({ message: "Error fetching districts", error});
    }
});

districtRouter.get("/:districtId", async (req, res) => {
    try{
        const district = await districtRepository.getDistrictByDistrictId(req.params.districtId);
        if(!district){
            return res.status(404).json({ message: `District with ID ${req.params.districtId} not found`});
        }
        return res.status(201).json({ message: "District fetched successfully!", district});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the district with ID ${req.params.districtId}`});
    }
});


export default districtRouter;