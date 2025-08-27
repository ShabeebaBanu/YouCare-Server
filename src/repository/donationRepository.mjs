import Donation from "../model/Donation.mjs";
import mongoose from "mongoose";

const donationRepository = {

    async createDonation(donationData) {
        const donation = new Donation(donationData);
        return await donation.save(donationData);
    },

    async getDonationByDonationId(donationId) {
        return await Donation.findById(donationId);
    },

    async getAllDonations() {
        return await Donation.find({})
            .populate('category', 'name')
            .populate('district', 'name')
            .sort({createdAt : -1});
    },

    async filterDonation(districtFilter, categoryFilter, userType) {
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
    
        return await Donation.find(query)
            .populate('category', 'name')
            .populate('district', 'name')
            .sort({ createdAt: -1 });
    },

    async getDonationsByCreatedBy(createdBy) {
        return await Donation.find({ createdBy });
    },

    async updateDonation(donationId, updatedData) {
        return await Donation.findByIdAndUpdate(donationId, updatedData, { new : true })
    },

    async deleteDonation(donationId) {
        return await Donation.deleteOne({ _id: donationId});
    }
}

export default donationRepository;