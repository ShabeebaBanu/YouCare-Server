import needRepository from "../repository/needRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { needStatusEnum } from "../model/Need.mjs";
import categoryServiceImp from "./categoryServiceImp.mjs";
import { extractUserRole } from "./keycloakService.mjs";

const needServiceImp = {
    async createNeed(needData, token) {

        const categoryName = needData.category;
        const category = await categoryServiceImp.isCategoryExistByName(categoryName);

        if (!category) {
            category = await categoryServiceImp.createCategory({ name : categoryName});
        }

        const userRole =await extractUserRole(token);
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

    async deleteNeed(needId) {
        return await needRepository.deleteNeed(needId);
    }
    
};

export default needServiceImp;