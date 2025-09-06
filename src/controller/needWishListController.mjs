import express from "express";
import needWishListRepository from '../repository/needWishListRepository.mjs'
import { successResponse, errorResponse } from "../model/dto/Response.mjs";

const wishListRoute = express.Router();

wishListRoute.post("/create", async (req, res) => {
    try {
        const requestBody = req.body;
        validateRequestBody(requestBody);

        const wishList = await needWishListRepository.createNeedWishList(requestBody);
        
        return successResponse(res, wishList, "Wishlist Created Successfully !", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Creating Wishlist";
        
        return errorResponse(res, message, status);
    }
});

wishListRoute.get("/all", async (req, res) => {
    try{
        const wishlists =  await needWishListRepository.getAllNeedWishList();

        return successResponse(res, wishlists, "Fetched All Wishlists Successfully!", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching All Wishlists";
        
        return errorResponse(res, message, status);
    }
});

wishListRoute.get("/createdBy/:createdBy", async (req, res) => {
    try {
        const { createdBy } = req.params;
        validateParameter(createdBy, "CreatedBy");

        const wishLists = await needWishListRepository.getNeedWishListByCreatedBy(createdBy);

        return successResponse(res, wishLists, "Fetched Wishlists Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Wishlists By CreatedBy";

        return errorResponse(res, message, status);
    }
});

wishListRoute.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        validateParameter( userId, "User ID");

        const wishLists = await needWishListRepository.getNeedWishListByUserId(userId);
        return successResponse(res, wishLists, "Fetched Wishlists Successfully!", 200);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Wishlists By UserId";
        
        return errorResponse(res, message, status);
    }
});

wishListRoute.delete("/:wishlistId", async (req, res) => {
    try{
        const { wishlistId } = req.params;
        validateParameter(wishlistId);

        const wishList =  await needWishListRepository.deleteNeedWishList(wishlistId);

        return successResponse(res, wishList, "Wishlist Deleted Successfully", 200);
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || "Unexpected Error While Fetching Deleting Wishlist";
        
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

export default wishListRoute;