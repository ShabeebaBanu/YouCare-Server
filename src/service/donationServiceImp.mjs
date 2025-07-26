import donationRepository from "../repository/donationRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { donationStatusEnum } from "../model/Donation.mjs";

const donationServiceImp = {
  async createDonation(donationData) {
    return await donationRepository.createDonation(donationData);
  },

  async getDonationByDonationId(donationId) {
    return await donationRepository.getDonationByDonationId(donationId);
  },

  async getAllDonations() {
    return await donationRepository.getAllDonations();
  },

  async getDonationsByCreatedBy(createdBy) {
    return await donationRepository.getDonationsByCreatedBy(createdBy);
  },

  async updateDonation(donationId, updatedData) {
    const existingDonation = donationRepository.getDonationByDonationId(donationId);

    if (!existingDonation) {
      throw new ResourceNotFoundException(`No Donation Found With ID ${donationId}`);
    }

    if (existingDonation.status !== donationStatusEnum.AVAILABLE) {
      throw new ResourceNotFoundException("Donation Cannot Be Updated, As Donation Is In_Process Or Already Completed");
    }

    return await donationRepository.updateDonation(donationId, updatedData);
  }

};

export default donationServiceImp;
