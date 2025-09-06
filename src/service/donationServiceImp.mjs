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
    try {
      const categoryName = donationData.category;
      const category = await categoryServiceImp.isCategoryExistByName(categoryName);
      if (!category) {
        category = await categoryServiceImp.createCategory({ name : categoryName});
      }

      const userRole = await extractUserRole(token);
      if (!userRole.success) {
        throw new Error(userRole.message);
      }

      return await donationRepository.createDonation({
        ...donationData,
        category: category._id,
        userType: userRole.data[0]
      });
    } catch (error) {
      const errorMessage = error.message || "Unexpected Error occured while creating Donation";
      throw new Error(errorMessage); 
    }
    
  },

  async getDonationByDonationId(donationId) {
    return await donationRepository.getDonationByDonationId(donationId);
  },

  async getAllDonations() {
    try{
        return await donationRepository.getAllDonations();
    } catch(error) {
        const errorMessage = error.message || "Unexpected Error Occured While Fetching All Donations"
        throw new Error(errorMessage); 
    }
  },

  async updateDonation(donationId, updatedData) {
    const existingDonation = await donationRepository.getDonationByDonationId(donationId);
    if (!existingDonation) {
      throw new ResourceNotFoundException("No Donation Found With Given Donation ID");
    }

    if (existingDonation.status !== donationStatusEnum.AVAILABLE) {
      throw new BadRequestException("Donation Cannot Be Updated, As Donation Is In_Process Or Already Completed");
    }

    try {
      const categoryName = updatedData.category;
      const category = await categoryServiceImp.isCategoryExistByName(categoryName);

      if (!category) {
        category = await categoryServiceImp.createCategory({ name : categoryName});
      }

      const response = await donationRepository.updateDonation(
      donationId, 
      {
      ...updatedData,
      category: category._id}
      );

      return response;

    } catch(error) {
      const errorMessage = error.message || "Unexpected Error Occured While Updating Donation"
      throw new Error(errorMessage); 
    }
  },

  async getNearbyDonations(userId) {
      try {
          const userDetails = await getUserDetailsByUserId(userId);
          if (!userDetails) {
            throw new ResourceNotFoundException("No User Found With Given User ID")
          }
          
          const district = userDetails?.attributes?.district?.[0] || "";

          if (!district) {
            return { success: false, message: "User Has No Location Information", data: []};
          }
  
          const districtData = await districtRepository.getDistrictByName(district);
          if (!districtData) {
            return { success: false, message: "User Has No Location Information", data: []};
          }

          const districtId = districtData._id;

          const nearByDonations = await donationRepository.getNearbyDonations(districtId);
  
          return { success: true, message: "Nearby Donations Fetched successfully", data: nearByDonations};
      } catch (error) {
          const errorMessage = error.message || "Unexpected Error Occured While Fetching NearBy Donations"
          throw new Error(errorMessage);
      }
  },

  async getDonationsByCreatedBy(createdBy) {
      try {
        const userDetails = await getUserDetailsByUserId(createdBy);
        if (!userDetails) {
            throw new ResourceNotFoundException("Failed to Fetch Donations : No User Found With Given ID");
        }

        const response = await donationRepository.getDonationsByCreatedBy(createdBy);
        return response;
      } catch (error) {
        const errorMessage = error.message || "Unexpected Error occured while fetching donations By CreatedBy"
        throw new Error(errorMessage); 
      }    
  },

  async getDonationByFilter(filterRequest) {
    try{
      const response = donationRepository.filterDonation(filterRequest.district, filterRequest.category, filterRequest.userType);
      return response;
    } catch(error) {
      const errorMessage = error.message || "Unexpected Error occured while Filtering Donation"
      throw new Error(errorMessage); 
    }    
  },
  

  async deleteDonation(donationId) {
    try{
        const donationDetail = await donationRepository.getDonationByDonationId(donationId);
        if (!donationDetail) {
            throw new ResourceNotFoundException("No Donation Found With Given ID");
        }
        
        const donationStatus = donationDetail.status;
        if (donationStatus == donationStatusEnum.PENDING) {
          throw new BadRequestException("Donation Cannot Be Deleted, As Donation Is In_Process");
        }
    
        const response = await donationRepository.deleteDonation(donationId);
        if (response.deletedCount === 0) {
          return { success: false, message: "Failed To Delete Donation", data: null};
        }

        return { success: true, message: "Donation Deleted Successfully" , data: response};
    } catch (error) {
        const errorMessage = error.message || "Unexpected Error occured while Deleting Donation";
        throw new Error(errorMessage); 
    }
       
  }

};


export default donationServiceImp;
 