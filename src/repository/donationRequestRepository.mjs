import Donation from "../model/Donation.mjs";
import DonationRequest from "../model/DonationRequest.mjs";

const donationRequestRepository = {

    async createDonationRequest(donationRequestData) {
        const donationRequest = new DonationRequest(donationRequestData);
        return await donationRequest.save(donationRequestData);
    },

    async getAllDonationRequest() {
        return await DonationRequest.find({});
    },

    async getDonationRequestByCreatedBy(createdBy) {
        return await DonationRequest.find({ donationCreatedBy : createdBy})
            .populate({
            path: 'donationId',          
            populate: [
                { path: 'category', select: 'name' },
                { path: 'district', select: 'name' }
            ]
            })
             .sort({createdAt : -1});
    },

    async getDonationRequestByUserId(userId) {
        return await DonationRequest.find({ userId : userId})
            .populate({
            path: 'donationId',          
            populate: [
                { path: 'category', select: 'name' },
                { path: 'district', select: 'name' }
            ]
            })
            .sort({createdAt : -1});
    },

    async getAllSentAndReceivedDonationRequestsOfAUser(userId) {
        return await DonationRequest.find({
            $or: [
                {donationCreatedBy: userId},
                {userId: userId}
            ]
        })
        .populate({
            path: 'donationId',          
            populate: [
                { path: 'category', select: 'name' },
                { path: 'district', select: 'name' }
            ]
        }).sort({createdAt : -1});
    },

    async deleteDonationRequest(donationRequestId) {
        return await DonationRequest.deleteOne({ _id: donationRequestId });
    }
};


export default donationRequestRepository;