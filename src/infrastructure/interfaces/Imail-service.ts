export interface IMailService {
    sendOtpEmail(email: string, otp: string, otpExpireAt: string): Promise<{ message: string; otpExpireAt: string }>;
    sendResetMail(email:string,Token:string):Promise<{message:string,linkExpiresAt:string}>
}