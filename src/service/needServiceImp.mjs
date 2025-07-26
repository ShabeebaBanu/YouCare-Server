import needRepository from "../repository/needRepository.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import { needStatusEnum } from "../model/Need.mjs";

const needServiceImp = {
    async createNeed(needData) {
        return await needRepository.createNeed(needData);
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
    }
}

export default needServiceImp;