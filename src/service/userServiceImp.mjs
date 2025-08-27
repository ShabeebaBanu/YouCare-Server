import userRepository from "../repository/userRepository.mjs";
import { isEmailAlreadyRegistered,
         createUser
} from "./keycloakService.mjs";
import KeycloakErrorException from "../exceptions/KeycloakErrorException.mjs";
import otpServiceImp from "./otpServiceImp.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";
import BadRequestException from "../exceptions/BadRequestException.mjs";

const userServiceImp = {
    async createUser(userData) {

        const isEmailExist = await isEmailAlreadyRegistered(userData.email);
        if (isEmailExist) {
            throw new KeycloakErrorException("Email Already Registered");
        }

        try {
            const newUser = {
                username: userData.username,
                email: userData.email,
                enabled: true,
                emailVerified: true,  
                attributes: {
                    district: userData.district,
                    province: userData.province
                },
                credentials: [
                {
                    type: "password",
                    value: userData.password,
                    temporary: false
                }
                ]
            };

            const response = await createUser(newUser, userData.role);
            console.log(response);
            if (response.success) {
                return { success: true, message: response.userId}
            }

            return { success: false, message: "Failed to create user"}

        } catch (error) {

            if (error) {
                throw new KeycloakErrorException("Error Creating User : " + error);
            } else {
                throw new KeycloakErrorException("Unexpected error while creating user ");
            }
        }
    },

    async sendOtp(email) {
        const isEmailExist = await isEmailAlreadyRegistered(email);
        
        if (isEmailExist) {
            throw new KeycloakErrorException("Email Already Registered");
        }

        const generatedOtp = otpServiceImp.generateOtp();
        if (!generatedOtp) {
            throw new ResourceNotFoundException("No OTP generated. Error generating OTP");
        }

        try {
            const [sendResponse, saveResponse] = await Promise.all([
                otpServiceImp.sendOtpEmail(email, generatedOtp),
                otpServiceImp.saveOtp(email, generatedOtp)
            ]);

            if (sendResponse.success && saveResponse.success) {
                return {
                    success: true,
                    message: "OTP Saved & sent successfully"
                };
            }
            
            return {
                    success: false,
                    message: "Failed to save or sent the OTP"
            };

        } catch (error) {
            if (error) {
                throw new Error("Error sending OTP Mail : " + error);
            } else {
                throw new Error("Unexpected error while geerating otp ");
            }
        }
    },

    async verifyOtp(email, otp) {  
       return await otpServiceImp.verifyOtp(email, otp);
    } ,

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