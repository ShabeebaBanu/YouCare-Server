import express from "express";
import needServiceImp from "../service/needServiceImp.mjs";
import upload, { MAX_IMAGE_LIMIT } from "../Config/multer.mjs";

const needRouter = express.Router();

needRouter.post(
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

      const needData = {
        ...formData,
        images
      };

      const need = await needServiceImp.createNeed(needData);

      return res.status(201).json({ message: "Need Created Successfully!", need });
    } catch (error) {
      console.error("Need creation error:", error);
      return res.status(500).json({ message: "Error creating Need", error: error.message });
    }
  }
);


needRouter.get("/all", async (res) => {
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


needRouter.get("/user/:createdBy", async (req, res) => {
    try {
        const needs = await needServiceImp.getNeedsByCreatedBy(req.params.createdBy);

        if (needs == null) {
            return res.status(404).json({ message: `No Needs found with user ID ${req.params.createdBy}` })
        }

        return res.status(200).json({ message: "Needs fetched successfully!", needs });
    } catch (error) {
        return res.status(500)({
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
    return res.status(500)({
      message: `Error updating the need with ID ${req.params.needId}`,
      error: error.message
    });
  }
});

export default needRouter;
