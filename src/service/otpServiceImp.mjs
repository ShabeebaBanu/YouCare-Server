import nodemailer from "nodemailer";
import redisClient from "../Config/redis.mjs";


const otpServiceImp = {
    
    generateOtp() {
        try{
           return Math.floor(1000 + Math.random() * 9000).toString();
        } catch (error) {
            if (error) {
                throw new Error("Error Generating OTP : " + error);
            } else {
                throw new Error("Unexpected error while geerating otp ");
            }
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
            console.log("mailoption : ", mailOptions);

            const response =  await transporter.sendMail(mailOptions);
            return { success: true,
                     message: "OTP email sent successfully",
                     id: response.messageId
            }

        } catch (error) {
            console.error("Mail sending failed:", error.message);

            return {
                success: false,
                message: "Failed to send OTP email",
                error: error.message, 
            };
        }
    },

    async saveOtp(email, otp) {
        try {
            await redisClient.setEx(`otp:${email}`, process.env.REDIS_OTP_DURATION, otp);
            return {
                success: true,
                message: "OTP Saved"
            };

        } catch (error) {
            console.error("Failed to save OTP:", error.message);

            return {
                success: false,
                message: "Failed to save OTP",
                error: error.message, 
            };
        }
    },

    async verifyOtp(email, enteredOtp) {
        const storedOtp = await redisClient.get(`otp:${email}`);

        if (!storedOtp) {
            return { success: false, message: "OTP expired or not found"};
        } 
        if (storedOtp === enteredOtp) {
            await redisClient.del(`otp:${email}`);
            return { success: true, message: "OTP verified successfully"};
        }
        return { success: false, message: "Invalid OTP"};
    }

}

export default otpServiceImp;
