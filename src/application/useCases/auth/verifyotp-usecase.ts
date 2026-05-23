import { inject, injectable } from "inversify";
import type { UserDataDto } from "../../dtos/user-dto";
import type { IConfirmRegisterUseCase, IVerifyOtpUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import type { TOtpData, TUserRegistrationInput } from "../../../shared/types/commonTypes";
import { AUTH_RES_MESSAGES } from "../../../shared/constants/ResMessages";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    constructor(
        @inject(Tokens.redisService) private redisService: IredisService,
        @inject(Tokens.authService) private authService: IAuthService,
        @inject(Tokens.confirmRegisterUseCase) private confirmRegisterUseCase: IConfirmRegisterUseCase
    ) { }

    async execute(userId: string, otp: string, purpose: "signup" | "reset"): Promise<{ data: TOtpData, message: string, }> {
        const data = await this.authService.verifyOtp(userId, otp, purpose)
        console.log("data", data)

        if (!data) {
            throw new AppError(AUTH_ERROR_MESSAGES.otpError, HttpStatusCode.BAD_REQUEST)
        }

        if (purpose === "signup") {
            const user = await this.confirmRegisterUseCase.execute(userId)

            if (!user) {
                throw new AppError(AUTH_ERROR_MESSAGES.createFail, HttpStatusCode.BAD_REQUEST)
            }

        }else{

        }
        return {
            data:data,
            message:"otp verified"

        }

    }
}