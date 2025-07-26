import Need from "../model/Need.mjs";

const needRepository = {

    async createNeed(needData) {
        const need = new Need(needData);
        return await need.save(needData);
    },

    async getNeedByNeedId(needId) {
        return await Need.findById(needId);
    },

    async getAllNeeds() {
        return await Need.find({});
    },

    async getNeedsByCreatedBy(createdBy) {
        return await Need.find({createdBy});
    },

    async updateNeed(needId, updatedNeed) {
        return await Need.findByIdAndUpdate(needId, updatedNeed, { new : true});
    }

}

export default needRepository;