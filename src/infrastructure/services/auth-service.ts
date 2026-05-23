import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import type { IAuthService } from "../interfaces/Iauth-service";
import * as crypto from "crypto"
import bcrypt from "bcrypt"
import { jwtConfig, otpTimer } from "../config/jwt/jwt";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { IMailService } from "../interfaces/Imail-service";
import type { TOtpData } from "../../shared/types/commonTypes";
import type { IredisService } from "../interfaces/Iredis-service";
import type { TRole } from "../../shared/types/AuthTypes";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken"
import { env } from "../../shared/constants/env";

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(Tokens.mailService) private mailService: IMailService,
        @inject(Tokens.redisService) private redisService: IredisService
    ) { }
    generateOtp(length: number): string {
        if (length <= 2) {
            throw new AppError("minimum otp length should be 3", HttpStatusCode.BAD_REQUEST)
        }
        const randomNum = crypto.randomInt(100000, 999999).toString()
        return randomNum
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    async sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }> {
        const result = await this.mailService.sendOtpEmail(email, otp, (otpTimer.expiresInSeconds / 60).toString());
        return result;
    }


    async verifyOtp(userId: string, otp: string,): Promise<TOtpData> {
        const storedData = await this.redisService.getOtp(userId, "signup")
        if (!storedData) {
            throw new AppError("otp not found or expired", HttpStatusCode.BAD_REQUEST)
        }
        const currentTime = new Date().getTime()
        if (currentTime >= storedData.expiresAt) {
            throw new AppError("otp has expired", HttpStatusCode.BAD_REQUEST)
        }
        // let storedotpdata = storedData.otp.trim()
        let userotp = otp.trim()
        // console.log(storedData,userotp)
        if (storedData.otp !== userotp) {

            throw new AppError("invalid otp", HttpStatusCode.BAD_REQUEST)
        }




        return storedData.data
    }

    async ComparePassword(passwrod: string, userPassword: string): Promise<boolean> {
        return bcrypt.compare(passwrod, userPassword)
    }

    generateRefreashToken(userId: string, role: TRole[], email: string): string {
        const secreat: Secret = env.JWT_REFREASH_SECRET as string
        const options: SignOptions = {
            expiresIn: `${jwtConfig.refreshToken.maxAge}`
        }
        return jwt.sign({ userId, role, email }, secreat, options)
    }
    generateAccessToken(userId: string, role: TRole[], email: string): string {

        const secreat: Secret = env.JWT_ACCESS_SECRET as string
        const options: SignOptions = {
            expiresIn: `${jwtConfig.accessToken.maxAge}`
        }
        return jwt.sign({ userId, role, email }, secreat, options)
    }
}