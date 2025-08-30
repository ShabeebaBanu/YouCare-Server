import needRepository from "../repository/needRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { needStatusEnum } from "../model/Need.mjs";
import categoryServiceImp from "./categoryServiceImp.mjs";
import districtRepository from "../repository/districtRepository.mjs";
import { extractUserRole,
         getUserDetailsByUserId
 } from "./keycloakService.mjs";

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
        return await needRepository.getNeedsByCreatedBy(createdBy);
    },

    async updateNeed(needId, updatedNeed) {
       const existingNeed = needRepository.getNeedByNeedId(needId);

       if (!existingNeed) {
         throw new ResourceNotFoundException(`No Need Found With ID ${needId}`);
       }

       if (existingNeed.status !== needStatusEnum.AVAILABLE) {
         throw new ResourceNotFoundException("Need Cannot Be Updated, As Need Is In_Process Or Already Completed");
       }

       return await needRepository.updateNeed(needId, updatedNeed);
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
        return await needRepository.deleteNeed(needId);
    }
    
};

export default needServiceImp;