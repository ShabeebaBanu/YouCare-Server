import needRepository from "../repository/needRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { needStatusEnum } from "../model/Need.mjs";
import categoryServiceImp from "./categoryServiceImp.mjs";
import districtRepository from "../repository/districtRepository.mjs";
import { extractUserRole,
         getUserDetailsByUserId
} from "./keycloakService.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";

const needServiceImp = {
    async createNeed(needData, token) {
    try {
        const categoryName = needData.category;
        const category = await categoryServiceImp.isCategoryExistByName(categoryName);

        if (!category) {
            category = await categoryServiceImp.createCategory({ name : categoryName});
        }

        const userRole = await extractUserRole(token)
        if (!userRole.success) {
            throw new Error(userRole.message);
        }
        
        return await needRepository.createNeed({
            ...needData, 
            category: category._id,
            userType: userRole.data[0]
        });
    } catch (error) {
        const errorMessage = error.message || "Unexpected Error occured while creating Need";
        throw new Error(errorMessage);  
    }
    },

    async getNeedByNeedId(needId) {
        return await needRepository.getNeedByNeedId(needId);
    },

    async getAllNeeds() {
        try{
           return await needRepository.getAllNeeds();
        } catch(error) {
            const errorMessage = error.message || "Unexpected Error Occured While Fetching All Needs"
            throw new Error(errorMessage); 
        }   
    },

    async getNeedsByCreatedBy(createdBy) {
        try {
            const userDetails = await getUserDetailsByUserId(createdBy);
            if (!userDetails) {
               throw new ResourceNotFoundException("Failed to Fetch Needs : No User Found With Given ID");
            }

            const response = await needRepository.getNeedsByCreatedBy(createdBy);
            return response;
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured while Fetching Needs By CreatedBy"
            throw new Error(errorMessage);  
        }    
    },

    async updateNeed(needId, updatedData) {
        const existingNeed = await needRepository.getNeedByNeedId(needId);
        if (!existingNeed) {
          throw new ResourceNotFoundException("No Need found with Give Need ID");
        }
    
        if (existingNeed.status !== needStatusEnum.AVAILABLE) {
          throw new ResourceNotFoundException("Need Cannot Be Updated, As Need Is In_Process Or Already Completed");
        }
    
        try {
            const categoryName = updatedData.category;
            const category = await categoryServiceImp.isCategoryExistByName(categoryName);
        
            if (!category) {
               category = await categoryServiceImp.createCategory({ name : categoryName});
            }

            const response = await needRepository.updateNeed(
            needId, 
            {
            ...updatedData,
            category: category._id}
            );

            return response;
        } catch(error) {
            const errorMessage = error.message || "Unexpected Error occured while updating Need"
            throw new Error(errorMessage);
        }
    },

    async getNeedByFilter(filterData) {
        try{
           const response = needRepository.filterNeeds(filterData.district, filterData.category, filterData.userType);
           return response;
        } catch (error) {
           const errorMessage = error.message || "Unexpected Error occured while Filtering Needs"
           throw new Error(errorMessage); 
        }   
    },

    async getNearbyNeeds(userId) {
        try {
            const userDetails = await getUserDetailsByUserId(userId);
            if (!userDetails) {
                throw new ResourceNotFoundException("No User Found With Given User ID")
            }

            const district = userDetails?.attributes?.district?.[0] || "";

            if (!district ) {
                return { success: false, message: "User Has No Location Information", data: []};
            }

            const districtData = await districtRepository.getDistrictByName(district);
            if (!districtData) {
                return { success: false, message: "User Has No Location Information", data: []};
            }

            const districtId = districtData._id;

            const nearByNeeds = await needRepository.getNearbyNeeds(districtId);

            return { success: true, message: "Nearby needs fetched successfully", data: nearByNeeds };
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Fetching NearBy Needs"
            throw new Error(errorMessage);
        }
    },

    async deleteNeed(needId) {
      try {
            const needDetail = await needRepository.getNeedByNeedId(needId);
            if (!needDetail) {
                throw new ResourceNotFoundException("No need found with Given ID");
            }
            
            const needStatus = needDetail.status;
            if (needStatus == needStatusEnum.PENDING) {
                throw new BadRequestException("Need Cannot be deleted, As Need Is In_Process");
            }

            const response = needRepository.deleteNeed(needId);
            if (response.deletedCount === 0) {
                return { success: false, message: "Failed To Delete Donation", data: null };
            }

            return { success: true, message: "Need deleted successfully", data: response }; 
        } catch( error) {
            const errorMessage = error.message || "Unexpected Error occured while Deleting Need";
            throw new Error(errorMessage); 
        }
      }
};

export default needServiceImp;