import express from "express";
import needServiceImp from "../service/needServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";
import { extractToken } from "../service/keycloakService.mjs";
const needRouter = express.Router();

needRouter.post(
  "/create",
  upload.array("images", MAX_IMAGE_LIMIT),
  async (req, res) => {

    const token = await extractToken(req);

    try {
      const formData = req.body;
      console.log("need data: ", formData);
      const images = req.files?.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
        fileName: file.originalname
      })) || [];

      const needData = {
        ...formData,
        images
      };

      console.log("need data: ", needData);
      const response = await needServiceImp.createNeed(needData, token);

      return res.status(response.success ? 201 : 400).json(response);
  
    } catch (error) {
      const status = error.statusCode || 500;
      const errorMessage = error.message || "Unexpected Error occured while creating need"
      return res.status(status).json({ message: errorMessage});
    }
  }
);


needRouter.get("/all", async (req, res) => {
  try {
    const needs = await needServiceImp.getAllNeeds();
    return res.status(200).json({ message: "Fetched all needs successfully!", needs });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching needs", error: error.message });
  }
});


needRouter.get("/:needId", async (req, res) => {
  try {
    const need = await needServiceImp.getNeedByNeedId(req.params.needId);

    if (!need) {
      return res.status(404).json({ message: `Need with ID ${req.params.needId} not found` });
    }

    return res.status(200).json({ message: "Need fetched successfully!", need });
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching the need with ID ${req.params.needId}`,
      error: error.message
    });
  }
});


needRouter.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const needs = await needServiceImp.getNeedsByCreatedBy(req.params.createdBy);

        if (needs == null) {
            return res.status(404).json({ message: `No Needs found with user ID ${req.params.createdBy}` })
        }

        return res.status(200).json({ message: "Needs fetched successfully!", needs });
    } catch (error) {
        return res.status(500).json({
          message: `Error fetching the needs with ID ${req.params.createdBy}`,
          error: error.message
       });
    }
});


needRouter.put("/:needId", async (req, res) => {
  try {
     const updatedNeed = await needServiceImp.updateNeed(req.params.needId, req.body);

     if (updatedNeed == null) {
          return res.status(404).json({ message: `No Need found with ID ${req.params.needId}`})
     }

     return res.status(200).json({ message: "Need updated successfully!", updatedNeed });
  } catch (error) {
    return res.status(500).json({
      message: `Error updating the need with ID ${req.params.needId}`,
      error: error.message
    });
  }
});

needRouter.post("/filter/create", async (req, res) => {
  console.log("start");
  try {
     
     const needs = await needServiceImp.getNeedByFilter(req.body);

     return res.status(200).json({ message: "Need filtered successfully!", needs });
  } catch (error) {
    return res.status(500).json({
      message: `Error filtering the needs`,
      error: error.message
    });
  }s
});

needRouter.get("/nearby/user/:userId", async (req, res) => {
  try {
    const response = await needServiceImp.getNearbyNeeds(req.params.userId);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    const status = error.statusCode || 500;
    const errorMessage = error.message || "Unexpected Error occured while fetching nearby needs"
    return res.status(status).json({ message: errorMessage});
  }
});

needRouter.delete("/:needId", async (req, res) => {
    try{
        const need =  await needServiceImp.deleteNeed(req.params.needId);
        return res.status(201).json({ message: "Need deleted successfullty!", need});
    }catch(error){
        return res.status(500).json({ message: "Error deleting Need", error: error.message});
    }
});

export default needRouter;
