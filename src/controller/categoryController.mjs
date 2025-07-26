import express from "express";
import categoryServiceImp from "../service/categoryServiceImp.mjs";

const categoryRouter = express.Router();

categoryRouter.post("/create", async (req, res) => {
    try {
        const category = await categoryServiceImp.createCategory(req.body);
        return res.status(201).json({ message: "Category Created successfully!", category});
    } catch(error){
        return res.status(500).json({ message: "Error creating category", error});
    }
});

categoryRouter.get("/all", async (req, res) => {
    try{
        const categories =  await categoryServiceImp.getAllCategories();
        return res.status(201).json({ message: "Fetched all categories successfullty!", categories});
    }catch(error){
        return res.status(500).json({ message: "Error fetching Categories", error});
    }
});

categoryRouter.delete("/:categoryId", async (req, res) => {
    try{
        const category =  await categoryServiceImp.deleteCategory(req.params.categoryId);
        return res.status(201).json({ message: "Category deleted successfullty!", category});
    }catch(error){
        return res.status(500).json({ message: "Error deleting Category", error});
    }
});

export default categoryRouter;
