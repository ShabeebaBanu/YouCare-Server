import Donation from "../model/Donation.mjs";

const donationRepository = {

    async createDonation(donationData) {
        const donation = new Donation(donationData);
        return await donation.save(donationData);
    },

    async getDonationByDonationId(donationId) {
        return await Donation.findById(donationId);
    },

    async getAllDonations() {
        return await Donation.find({});
    },

    async getDonationsByCreatedBy(createdBy) {
        return await Donation.find({ createdBy });
    },

    async updateDonation(donationId, updatedData) {
        return await Donation.findByIdAndUpdate(donationId, updatedData, { new : true })
    }

}

export default donationRepository;