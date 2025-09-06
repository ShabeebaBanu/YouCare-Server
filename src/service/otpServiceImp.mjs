import nodemailer from "nodemailer";
import redisClient from "../Config/redis.mjs";


const otpServiceImp = {
    
    generateOtp() {
        try{
           return Math.floor(1000 + Math.random() * 9000).toString();
        } catch (error) {
           const errorMessage = error.message || "Unexpected Error While Generating OTP"
           throw new Error(errorMessage); 
        }   
    },

    async sendOtpEmail(toEmail, otp) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false, 
                },
            });
        
            const mailOptions = {
                from: `""YouCare" <${process.env.SMTP_USER}>`,
                to: toEmail,
                subject: "YouCare - OTP Code",
                text: `Your YouCare OTP Code is : ${otp}. This will expire in 5 minutes.`,
            };

            const response =  await transporter.sendMail(mailOptions);
            if (!response) {
                return { success: false, message: "Failed to Sent OTP Mail", data: null }
            }
            
            return { success: true, message: "OTP email sent successfully", data: response.messageId }

        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Sending OTP"
            throw new Error(errorMessage); 
        }
    },

    async saveOtp(email, otp) {
        try {
            const response = await redisClient.setEx(`otp:${email}`, process.env.REDIS_OTP_DURATION, otp);
            if (!response) {
                return { success: false, message: "Failed to Save OTP", data: null};
            }
            return { success: true, message: "OTP Saved", data: null};

        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Saving OTP"
            throw new Error(errorMessage); 
        }
    },

    async verifyOtp(email, enteredOtp) {
        try{
           const storedOtp = await redisClient.get(`otp:${email}`);

            if (!storedOtp) {
                return { success: false, message: "OTP expired or not found", data: null};
            } 
            if (storedOtp === enteredOtp) {
                await redisClient.del(`otp:${email}`);
                return { success: true, message: "OTP verified successfully", data: null};
            }
            return { success: false, message: "Invalid OTP", data: null};
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Verifying OTP"
            throw new Error(errorMessage);
        }   
    }

}

export default otpServiceImp;
