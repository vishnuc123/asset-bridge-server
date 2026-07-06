import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import type { IAuthService, IJwtPayload } from "../interfaces/Iauth-service";
import * as crypto from "crypto"
import bcrypt from "bcrypt"
import { jwtConfig, otpTimer } from "../config/jwt/jwt";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { IMailService } from "../interfaces/Imail-service";
import type { TOtpData } from "../../shared/types/commonTypes";
import type { IredisService } from "../interfaces/Iredis-service";
import type { TRole } from "../../shared/types/AuthTypes";
import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken"
import { env } from "../../shared/constants/env";
import ms from "ms"

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


    generateRefreashToken(userId: string, roles: TRole[], email: string, activeRole: TRole): string {
        try {
            const secret: Secret = env.JWT_REFREASH_SECRET;

            const options: SignOptions = {
                expiresIn: jwtConfig.refreshToken.expiresIn as ms.StringValue
            };

            const refreshToken = jwt.sign({ userId, roles, email, activeRole }, secret, options);
            return refreshToken
        } catch (error) {
            console.error("Access token generation failed:", error);

            throw new AppError(
                "Failed to generate access token",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }


    generateAccessToken(userId: string, roles: TRole[], email: string, activeRole: TRole): string {
        try {
            const secret: Secret = env.JWT_ACCESS_SECRET;

            const options: SignOptions = {
                expiresIn: jwtConfig.accessToken.expiresIn as ms.StringValue
            };
            const accessToken = jwt.sign({ userId, roles, email, activeRole }, secret, options);
            console.log("new AccesToken", accessToken)
            return accessToken
        } catch (error) {
            console.error("Access token generation failed:", error);

            throw new AppError(
                "Failed to generate access token",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }



    verifyRefreashToken(token: string): IJwtPayload | null {
        try {
            console.log("incoming token", token);

            const dec = jwt.verify(token, env.JWT_REFREASH_SECRET)
            console.log("verify refreash token ", dec);

            return dec as IJwtPayload

        } catch (error: any) {
            console.log("error actual", error);


            if (error.name === "TokenExpiredError") {
                throw new AppError(
                    "Refresh token expired",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            if (error.name === "JsonWebTokenError") {
                throw new AppError(
                    "Invalid Refresh token",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            throw new AppError(
                "Token verification failed",
                HttpStatusCode.UNAUTHORIZED
            );
        }

    }


    verifyAccessToken(token: string): IJwtPayload {
        try {
            const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
            console.log("verify access Token", decoded);

            return decoded as IJwtPayload;
        } catch (error: any) {

            if (error.name === "TokenExpiredError") {
                throw new AppError(
                    "Access token expired",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            if (error.name === "JsonWebTokenError") {
                throw new AppError(
                    "Invalid access token",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            throw new AppError(
                "Token verification failed",
                HttpStatusCode.UNAUTHORIZED
            );
        }
    }
}