import express from "express";
import needServiceImp from "../service/needServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";
import { extractToken } from "../service/keycloakService.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";
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
    if (!req.params.createdBy || req.params.createdBy == "") {
      throw new BadRequestException("CreatedBy Cannot be null/empty");
    }

    try {
        const response = await needServiceImp.getNeedsByCreatedBy(req.params.createdBy);

        if (!response.success) {
          return res.status(404).json(response)
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
          message: `Error fetching the needs with ID ${req.params.createdBy}`,
          error: error.message
       });
    }
});


needRouter.put("/:needId", async (req, res) => {
  if (!req.params.needId || req.params.needId == "") {
    throw new BadRequestException("Need ID cannot be null");
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestException("Updated need information not found");
  }
  console.log("request body: ", req.body);

  try {
     const response = await needServiceImp.updateNeed(req.params.needId, req.body);

     if (!response.success) {
        return res.status(response.success ? 200 : 400).json(response);
     }
    return res.status(response.success ? 201 : 400).json(response);
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
    if (!req.params.needId || req.params.needId == "") {
       throw new BadRequestException("Need ID cannot be null/empty");
    }

    try{
        const response =  await needServiceImp.deleteNeed(req.params.needId);
        return res.status(response.success ? 200 : 400).json(response);
    }catch(error){
      const status = error.statusCode || 500;
      const errorMessage = error.message || "Unexpected Error occured while deleting need"
      return res.status(status).json({ message: errorMessage});
    }
});

export default needRouter;
