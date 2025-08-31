import donationRepository from "../repository/donationRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { donationStatusEnum } from "../model/Donation.mjs";
import categoryServiceImp from "./categoryServiceImp.mjs";
import { extractUserRole,
         getUserDetailsByUserId
} from "./keycloakService.mjs";
import districtRepository from "../repository/districtRepository.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";

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

  async updateDonation(donationId, updatedData) {
    const existingDonation = await donationRepository.getDonationByDonationId(donationId);
    if (!existingDonation) {
      throw new ResourceNotFoundException("No Donation found with ID : ", donationId);
    }

    if (existingDonation.status !== donationStatusEnum.AVAILABLE) {
      throw new ResourceNotFoundException("Donation Cannot Be Updated, As Donation Is In_Process Or Already Completed");
    }

    const categoryName = updatedData.category;
    const category = await categoryServiceImp.isCategoryExistByName(categoryName);

    if (!category) {
      category = await categoryServiceImp.createCategory({ name : categoryName});
    }

    try {
       const response = await donationRepository.updateDonation(
        donationId, 
        {
        ...updatedData,
        category: category._id}
      );
       if (!response) {
          return { success: false, message: "Failed to update donation" };
       }
       return { success: true, message: "Donation updated", data: response };

    } catch(error) {
      const errorMessage = error.message || "Unexpected Error occured while updating donation"
      throw new Error(errorMessage); 
    }
  },

  async getNearbyDonations(userId) {
      if (!userId || userId === "") {
          throw new ResourceNotFoundException("userId cannot be null");
      }
  
      try {
          const userDetails = await getUserDetailsByUserId(userId);
          if (!userDetails) {
              return { success: false, message: "No user data found" };
          }
          
          const district = userDetails.attributes.district[0] || "";
          console.log("district: ", district);

          if (!district ) {
              return { success: false, message: "User has no location info" };
          }
  
          const districtData = await districtRepository.getDistrictByName(district);
            console.log("districtData: ", districtData);
            if (!districtData) {
                return { success: false, message: "No Doners Near By Your Location "+ districtData.name };
          }
          const districtId = districtData._id;
          console.log("districtId: ", districtId);

          const nearByDonations = await donationRepository.getNearbyDonations(districtId);
          console.log("nearby donations response: ", nearByDonations)
  
          if (!nearByDonations || nearByDonations.length === 0) {
              return { success: false, message: "No nearby donations found", data:[] };
          }
  
          return {
            success: true,
            message: "Nearby donations fetched successfully",
            data: nearByDonations
          };
  
      } catch (error) {
          throw new Error(error.message || "Unexpected error occurred while fetching nearby donations");
      }
  },

  async getDonationsByCreatedBy(createdBy) {
      const userDetails = await getUserDetailsByUserId(createdBy);
      if (!userDetails) {
          return { success: false, message: "No user found with ID ", createdBy };
      }
  
      try {
        const response = await donationRepository.getDonationsByCreatedBy(createdBy);
        console.log("response: ", response);
      if (!response.length > 0 || !response) {
        return {success: false, message: "No donations found", data: []}
      }
        return {success: true, message: "donations fetched successfully", data: response}
      } catch (error) {
        const errorMessage = error.message || "Unexpected Error occured while fetching donation"
        throw new Error(errorMessage); 
      }    
  },
  

  async deleteDonation(donationId) {
      const donationDetail = await donationRepository.getDonationByDonationId(donationId);
      if (!donationDetail) {
          throw new ResourceNotFoundException("No donation found with ID : ", donationId);
      }
      
      const donationStatus = donationDetail.status;
      if (donationStatus == donationStatusEnum.PENDING) {
        throw new BadRequestException("Donation Cannot be deleted, As Donation Is In_Process");
      }
  
      const response = await donationRepository.deleteDonation(donationId);
      if (response.deletedCount === 0) {
        return { success: false, message: "No Donation found with ID : " + donationId };
      }
      return { success: true, message: "Donation deleted successfully" }; 
  }

};


export default donationServiceImp;
