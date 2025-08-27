import Need from "../model/Need.mjs";
import mongoose from "mongoose";

const needRepository = {

    async createNeed(needData) {
        const need = new Need(needData);
        return await need.save(needData);
    },

    async getNeedByNeedId(needId) {
        return await Need.findById(needId);
    },

    async getAllNeeds() {
        return await Need.find({})
           .populate('category', 'name')
           .populate('district', 'name')
           .sort({createdAt : -1})
        ;
    },

    async filterNeeds(districtFilter, categoryFilter, userType) {
        const query = {};
    
        if (districtFilter && mongoose.Types.ObjectId.isValid(districtFilter)) {
            query.district = new mongoose.Types.ObjectId(districtFilter);
        }

        if (categoryFilter && mongoose.Types.ObjectId.isValid(categoryFilter)) {
            query.category = new mongoose.Types.ObjectId(categoryFilter);
        }

        if (userType) {
           query.userType = userType;
        }

        if (Object.keys(query).length === 0) {
            return [];
        }

        console.log("Final query:", query);

        return await Need.find(query)
            .populate('category', 'name')
            .populate('district', 'name')
            .sort({ createdAt: -1 });
    },

    async getNeedsByCreatedBy(createdBy) {
        return await Need.find({createdBy});
    },

    async updateNeed(needId, updatedNeed) {
        return await Need.findByIdAndUpdate(needId, updatedNeed, { new : true});
    },

    async deleteNeed(needId) {
        return await Need.deleteOne({ _id: needId});
    }

}

export default needRepository;