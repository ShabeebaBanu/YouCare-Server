import District from "../model/District.mjs";

const districtRepository = {

    async createDistrict(districtData) {
        const district = new District(districtData);
        return await district.save(districtData);
    },

    async getDistrictByDistrictId(districtId) {
        return await District.findById(districtId);
    },

   async getDistrictByName(districtName) {
        return await District.findOne({
            name: { $regex: new RegExp(`^${districtName}$`, 'i') } 
        });
    },

    async getAllDistricts() {
        return await District.find({});
    }

}

export default districtRepository;