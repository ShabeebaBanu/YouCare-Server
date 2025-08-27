import NeedWishList from "../model/NeedWishList.mjs";

const needWishListRepository = {

    async createNeedWishList(wishListData) {
        const wishList = new NeedWishList(wishListData);
        return await wishList.save(wishListData);
    },

    async getAllNeedWishList() {
        return await NeedWishList.find({});
    },

    async getNeedWishListByCreatedBy(createdBy) {
        return await NeedWishList.find({ needCreatedBy : createdBy})
            .populate({
            path: 'needId',          
            populate: [
                { path: 'category', select: 'name' },
                { path: 'district', select: 'name' }
            ]
            })
            .sort({createdAt: -1});
    },

    async getNeedWishListByUserId(userId) {
        return await NeedWishList.find({ userId : userId})
            .populate({
            path: 'needId',          
            populate: [
                { path: 'category', select: 'name' },
                { path: 'district', select: 'name' }
            ]
            })
            .sort({createdAt: -1});
    },

    async deleteNeedWishList(wishListId) {
        return await NeedWishList.deleteOne({ _id: wishListId });
    }
}

export default needWishListRepository;