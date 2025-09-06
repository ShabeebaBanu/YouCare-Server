import DonationRequest from "../model/DonationRequest.mjs";

const donationRequestRepository = {

    async createDonationRequest(donationRequestData) {
        const donationRequest = new DonationRequest(donationRequestData);
        return await donationRequest.save(donationRequestData);
    },

    async getAllDonationRequest() {
        return await DonationRequest.find({});
    },

    async getDonationRequestById(donationRequestId) {
        return await DonationRequest.findById(donationRequestId);
    },

    async updateStatusById(donationRequestId, value) {
        try {
            const updatedRequest = await DonationRequest.findByIdAndUpdate(
                donationRequestId,        
                { status : value },       
                { new: true }             
            );
            return updatedRequest;
        } catch (error) {
            console.error("Error updating donation request:", error);
            throw error;
        }
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

    async getDonationRequestByDonationId(donationId) {
        return await DonationRequest.find({ donationId : donationId})
            .populate({
            path: 'donationId',          
            populate: [
                { path: 'category', select: 'name' },
                { path: 'district', select: 'name' }
            ]
            })
            .sort({createdAt : -1});
    },

    async deleteDonationRequest(donationRequestId) {
        return await DonationRequest.deleteOne({ _id: donationRequestId });
    }
};


export default donationRequestRepository;