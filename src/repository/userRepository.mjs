import User from "../model/User.mjs";

const userRepository = {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    },

    async getAllUsers() {
        return await User.find({});
    },

    async getUserByUserId(userId) {
        return await User.findById(userId).populate("donations");
    },

    async getUsersByDistrict(district) {
        return await User.find({district: district});
    },

    async getUsersByProvince(province) {
        return await User.find({province: province});
    },

    async getUsersByRole(role) {
        return await User.find({role : role});
    },

    async deleteUserByUserId(userId) {
        return await User.findByIdAndDelete(userId);
    }
};

export default userRepository;