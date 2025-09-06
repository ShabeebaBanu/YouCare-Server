import userRepository from "../repository/userRepository.mjs";
import { isEmailAlreadyRegistered,
         createUser,
         getUserDetailsByUserId,
         extractUserRole,
         updateUserDetailsByUserId,
         AssignRole,
         getClientRoleDetailWithRoleName,
         resetUserPassword,
         getUserDetailsByEmail
} from "./keycloakService.mjs";
import KeycloakErrorException from "../exceptions/KeycloakErrorException.mjs";
import otpServiceImp from "./otpServiceImp.mjs";
import ResourceNotFoundException from "../exceptions/resourceNotFoundException.mjs";



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
                    province: userData.province,
                    organizationName: userData.organizationName,
                    organizationAddress: userData.organizationAddress
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

            return response;

        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Creating User"
            throw new Error(errorMessage); 
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
                    message: "OTP Saved & sent successfully",
                    data: null
                };
            }
            
            return {
                    success: false,
                    message: "Failed to save or sent the OTP",
                    data: null
            };

        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Sending OTP"
            throw new Error(errorMessage); 
        }
    },

    async updateUser(userId, userData, token) {

        const isEmailExist = await isEmailAlreadyRegistered(userData.email);
        if (!isEmailExist) {
            throw new ResourceNotFoundException("No user found with Email/Id");
        }
    
        const userRole = await extractUserRole(token);
        console.log("userRole: ", userRole);
     
        if (userRole.message[0] != userData.userType) {
            const roleNewRoleDetail = await getClientRoleDetailWithRoleName(userData.userType);
            const assignNewRole = await AssignRole(userId, roleNewRoleDetail);
            if (assignNewRole.success) {
               console.log("User Role assigned");
            }
        }

        
        try {
            const updatedUser = {
                email: userData.email,
                attributes: {
                    district: userData.district,
                    province: userData.province,
                    organizationName: userData.organizationName || "",
                    organizationAddress: userData.organizationAddress || ""
                }
            };

            const response = await updateUserDetailsByUserId(userId, updatedUser);
            console.log("update response: ", response);
            return { success: true, message: "User Updated successfully"}

        } catch (error) {

            if (error) {
                throw new KeycloakErrorException("Error updating User : " + error);
            } else {
                throw new KeycloakErrorException("Unexpected error while updating user ");
            }
        }
    },


    async verifyOtp(email, otp) {  
        try{
           return await otpServiceImp.verifyOtp(email, otp);
        } catch (error) {
           const errorMessage = error.message || "Unexpected Error Occured While Verifying OTP"
           throw new Error(errorMessage); 
        } 
    },

    async getAllUsers() {
        return await userRepository.getAllUsers();
    },

    async getUserByUserId(userId, token) {
        try{
           const response = await getUserDetailsByUserId(userId);
           if (!response) {
              throw new ResourceNotFoundException("User Details Not Found");
           }

           const userRole = await extractUserRole(token);
           if (!userRole.success) {
               throw new Error(userRole.message);
           }

           const formatResponse = {
             id: response.id,
             username: response.username,
             email: response.email,
             district: response.attributes.district[0],
             province: response.attributes.province[0],
             organizationName: response.attributes.organizationName[0] || "",
             organizationAddress: response.attributes.organizationAddress[0] || "",
             userType: userRole.message[0]
           }
           return formatResponse;
        } catch (error) {
           const errorMessage = error.message || "Unexpected Error Occured While Fetching User Details"
           throw new Error(errorMessage);
        }
    },

    async resetPassword(email, newPassword) {
        const response = await getUserDetailsByEmail(email);
        if (!response || response == []) {
            return { success: false, message: "No user found with email : " + email}
        }

        const userId = response[0].id;
        if(!userId || userId == "") {
            return { success: false, message: "userId not found/empty"}
        }

        try {
            const response = await resetUserPassword(userId, newPassword);
            return response;
        } catch (error) {
            if (error) {
                throw new Error("Error reseting user password : " + error);
            } else {
                throw new Error("Unexpected error while reseting user password ");
            }
        }
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