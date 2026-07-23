import { inject, injectable } from "inversify";
import { Tokens } from "../../../shared/constants/Tokens";
import { AppError } from "../../../shared/utils/AppError";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { AUTH_RES_MESSAGES } from "../../../shared/constants/ResMessages";

import type { IResendOtpUseCase } from "../../interfaces/Iauth-usecase";
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
        @inject(Tokens.redisService)
        private readonly redisService: IredisService,

        @inject(Tokens.authService)
        private readonly authService: IAuthService
    ) { }

    async execute(
        userId: string
    ): Promise<{ expiryTime: number; message: string }> {

        const otpData = await this.redisService.getOtp(userId, "signup");

        if (!otpData?.data) {
            throw new AppError(
                AUTH_ERROR_MESSAGES.otpError,
                HttpStatusCode.BAD_REQUEST
            );
        }

        const newOtp = this.authService.generateOtp(6);

        const { timer } = await this.redisService.storeOtp(
            userId,
            newOtp,
            otpData.data,
            "signup"
        );

        await this.authService.sendOtpOnEmail(
            otpData.data.email as string,
            newOtp
        );

        return {
            expiryTime: timer,
            message: AUTH_RES_MESSAGES.otp,
        };
    }
}