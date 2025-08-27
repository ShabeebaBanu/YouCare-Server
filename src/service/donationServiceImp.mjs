import donationRepository from "../repository/donationRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { donationStatusEnum } from "../model/Donation.mjs";
import categoryServiceImp from "./categoryServiceImp.mjs";
import { extractUserRole } from "./keycloakService.mjs";

const donationServiceImp = {
  async createDonation(donationData, token) {
    console.log("Creating Donation : ", donationData);

    const categoryName = donationData.category;
    const category = await categoryServiceImp.isCategoryExistByName(categoryName);

    if (!category) {
      category = await categoryServiceImp.createCategory({ name : categoryName});
    }

    const userRole =await extractUserRole(token);
      if (!userRole.success) {
        throw new Error(userRole.message);
    }

    try {
       return await donationRepository.createDonation({
        ...donationData,
        category: category._id,
        userType: userRole.message[0]
       });
    } catch (error) {
      const errorMessage = error.message || "Unexpected Error occured while creating user"
      throw new Error(errorMessage); 
    }
    
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
  },

  async deleteDonation(donationId) {
    return await donationRepository.deleteDonation(donationId);
  },

  async getDonationByFilter(filterData) {
    
  const response = donationRepository.filterDonation(filterData.district, filterData.category, filterData.userType);
  console.log(response);
  return response;
},

};


export default donationServiceImp;
