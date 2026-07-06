import { inject, injectable } from "inversify";
import type { TUserData } from "../../../shared/types/AuthTypes";
import type { IRegisterUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import { v4 as uuidV4 } from "uuid"
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";
import type { TUserRegistrationInput } from "../../../shared/types/commonTypes";
import { AUTH_RES_MESSAGES } from "../../../shared/constants/ResMessages";

@injectable()
export class RegisterUseCase implements IRegisterUseCase {

    constructor(
        @inject(Tokens.authRepository) private authRepository: IAuthRepository,
        @inject(Tokens.redisService) private redisService: IredisService,
        @inject(Tokens.authService) private authService: IAuthService
    ) { }
    async execute(userData: TUserData): Promise<{ userid: string; expiryTime: number; message: string }> {
        // console.log("user data", userData)

        const existingUser = await this.authRepository.findUserByEmail(userData.email)
        if (existingUser) {
            throw new AppError(AUTH_ERROR_MESSAGES.userExist, HttpStatusCode.BAD_REQUEST)
        }

        const tempUserId = `temp:signup:${uuidV4()}`
        const existingOtp = await this.redisService.getOtp(tempUserId, "signup")
        // if (existingOtp) {
        //     throw new AppError(AUTH_ERROR_MESSAGES.otpExist, HttpStatusCode.BAD_REQUEST)
        // }

        const newOtp = this.authService.generateOtp(6)
        const hashedPass = await this.authService.hashPassword(userData.password)

        const newUserData: TUserRegistrationInput = {
            ...userData,
            password: hashedPass,
            status: "pending",
            roles: ["user","investor","vendor"],
        }
        const [result] = await Promise.all([
            this.redisService.storeOtp(tempUserId, newOtp, newUserData, "signup"),
            this.authService.sendOtpOnEmail(userData.email, newOtp)
        ])
        return {
            userid: tempUserId,
            expiryTime: result.timer,
            message: AUTH_RES_MESSAGES.otp
        }
    }
}