import userRepository from "../repository/userRepository.mjs";

const userServiceImp = {
    async createUser(userData) {
        return await userRepository.createUser(userData);
    },

    async getAllUsers() {
        return await userRepository.getAllUsers();
    },

    async getUserByUserId(userId) {
        return await userRepository.getUserByUserId(userId);
    },

    async getUsersByDistrict(district) {
        return await userRepository.getUsersByDistrict(district);
    },

    async getUsersByProvince(province) {
        return await userRepository.getUsersByProvince(province);
    },

    async getUsersByRole(role) {
        return await userRepository.getUsersByRole(role);
    },

    async deleteUserByUserId(userId) {
        return await userRepository.deleteUserByUserId(userId);
    }
};

export default userServiceImp;