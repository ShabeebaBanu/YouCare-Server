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

        const categoryName = needData.category;
        const category = await categoryServiceImp.isCategoryExistByName(categoryName);

        if (!category) {
            category = await categoryServiceImp.createCategory({ name : categoryName});
        }

        const userRole = await extractUserRole(token)
        if (!userRole.success) {
            throw new Error(userRole.message);
        }
        
        try {
            const response = await needRepository.createNeed({
                ...needData, 
                category: category._id,
                userType: userRole.message[0]
            });
            return { success: true, message: response}
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error occured while creating user"
            throw new Error(errorMessage); 
        }
    },

    async getNeedByNeedId(needId) {
        return await needRepository.getNeedByNeedId(needId);
    },

    async getAllNeeds() {
        return await needRepository.getAllNeeds();
    },

    async getNeedsByCreatedBy(createdBy) {
        const userDetails = await getUserDetailsByUserId(createdBy);
        if (!userDetails) {
            return { success: false, message: "No user found with ID ", createdBy };
        }

        try {
            const response = await needRepository.getNeedsByCreatedBy(createdBy);
            console.log("respomse: ", response);
            if (!response.length > 0 || !response) {
                return {success: false, message: "No needs found", data: []}
            }
            return {success: true, message: "needs fetched successfully", data: response}
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error occured while fetching needs"
            throw new Error(errorMessage); 
        }    
    },

    async updateNeed(needId, updatedData) {
        const existingNeed = await needRepository.getNeedByNeedId(needId);
        if (!existingNeed) {
          throw new ResourceNotFoundException("No Need found with ID : ", needId);
        }
    
        if (existingNeed.status !== needStatusEnum.AVAILABLE) {
          throw new ResourceNotFoundException("Need Cannot Be Updated, As Need Is In_Process Or Already Completed");
        }
    
        const categoryName = updatedData.category;
        const category = await categoryServiceImp.isCategoryExistByName(categoryName);
    
        if (!category) {
          category = await categoryServiceImp.createCategory({ name : categoryName});
        }
    
        try {
           const response = await needRepository.updateNeed(
            needId, 
            {
            ...updatedData,
            category: category._id}
          );
           if (!response) {
              return { success: false, message: "Failed to update Need" };
           }
           return { success: true, message: "Need updated", data: response };
    
        } catch(error) {
          const errorMessage = error.message || "Unexpected Error occured while updating Need"
          throw new Error(errorMessage);
        }
    },

    async getNeedByFilter(filterData) {
       const response = needRepository.filterNeeds(filterData.district, filterData.category, filterData.userType);
       console.log(response);
       return response;
    },

    async getNearbyNeeds(userId) {
        console.log("inside getnearby need")
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
                return { success: false, message: "No Needies Near By Your Location "+ districtData.name };
            }
            const districtId = districtData._id;
            console.log("districtId: ", districtId);

            const nearByNeeds = await needRepository.getNearbyNeeds(districtId);
            console.log("nearby need response: ", nearByNeeds);

            if (!nearByNeeds || nearByNeeds.length === 0) {
                return { success: false, message: "No nearby needs found", data:[] };
            }

            return {
                success: true,
                message: "Nearby needs fetched successfully",
                data: nearByNeeds
            };

        } catch (error) {
            throw new Error(error.message || "Unexpected error occurred while fetching nearby needs");
        }
    },

    async deleteNeed(needId) {
        const needDetail = await needRepository.getNeedByNeedId(needId);
        if (!needDetail) {
            throw new ResourceNotFoundException("No need found with ID : ", needId);
        }
        
        const needStatus = needDetail.status;
        if (needStatus != needStatusEnum.AVAILABLE) {
            throw new BadRequestException("Need Cannot be deleted, As Need Is In_Process Or Already Completed");
        }

        const response = needRepository.deleteNeed(needId);
        if (response.deletedCount === 0) {
            return { success: false, message: "No Need found with ID : " + needId };
        }
        return { success: true, message: "Need deleted successfully" }; 
    }
};

export default needServiceImp;