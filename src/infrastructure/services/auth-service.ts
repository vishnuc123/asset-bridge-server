import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import type { IAuthService } from "../interfaces/Iauth-service";
import * as crypto from "crypto"
import  bcrypt from "bcrypt"
import { otpTimer } from "../config/jwt/jwt";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { IMailService } from "../interfaces/Imail-service";

@injectable()
export class AuthService implements IAuthService{
    constructor(
        @inject(Tokens.mailService)private mailService:IMailService
    ){}
    generateOtp(length: number): string {
        if(length<=2){
            throw new AppError("minimum otp length should be 3",HttpStatusCode.BAD_REQUEST)
        }
        const randomNum = crypto.randomInt(100000,999999).toString()
        return randomNum
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }

    async sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }> {
        const result = await this.mailService.sendOtpEmail(email, otp, (otpTimer.expiresInSeconds / 60).toString());
        return result;
    }
}