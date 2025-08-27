import express from "express";
import needWishListRepository from '../repository/needWishListRepository.mjs'

const wishListRoute = express.Router();

wishListRoute.post("/create", async (req, res) => {
    try {
        const wishList = await needWishListRepository.createNeedWishList(req.body);
        return res.status(201).json({ message: "WishList Created Successfully!", wishList });
    } catch (error) {
        console.error("Wishlist creation error:", error);
        return res.status(500).json({ message: "Error creating Wishlist", error: error.message });
    }
});

wishListRoute.get("/all", async (req, res) => {
    try{
        const wishlist =  await needWishListRepository.getAllNeedWishList();
        return res.status(201).json({ message: "Fetched all Wishlist successfully!", wishlist});
    }catch(error){
        return res.status(500).json({ message: "Error fetching Wishlist", error});
    }
});

wishListRoute.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const wishList = await needWishListRepository.getNeedWishListByCreatedBy(req.params.createdBy);
        return res.status(201).json({ message: "WishList Fetched Successfully!", wishList });
    } catch (error) {
        console.error("Wishlist Fetching error:", error);
        return res.status(500).json({ message: "Error Fetching Wishlist", error: error.message });
    }
});

wishListRoute.get("/user/:userId", async (req, res) => {
    try {
        const wishList = await needWishListRepository.getNeedWishListByUserId(req.params.userId);
        return res.status(201).json({ message: "WishList Fetched Successfully!", wishList });
    } catch (error) {
        console.error("Wishlist Fetching error:", error);
        return res.status(500).json({ message: "Error Fetching Wishlist", error: error.message });
    }
});

wishListRoute.delete("/:wishlistId", async (req, res) => {
    try{
        const wishList =  await needWishListRepository.deleteNeedWishList(req.params.wishlistId);
        return res.status(201).json({ message: "Wishlist deleted successfullty!", wishList});
    }catch(error){
        return res.status(500).json({ message: "Error deleting Wishlist", error});
    }
});


export default wishListRoute;