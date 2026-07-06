import { inject, injectable } from "inversify";
import type { TUserRegistrationInput } from "../../../shared/types/commonTypes";
import type { IConfirmRegisterUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import type { UserDataDto } from "../../dtos/user-dto";
import type { IUser } from "../../../core/models/user-models";
import { AppError } from "../../../shared/utils/AppError";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import { AUTH_RES_MESSAGES } from "../../../shared/constants/ResMessages";

@injectable()
export class ConfirmRegisterUseCase implements IConfirmRegisterUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IAuthRepository,
        @inject(Tokens.redisService) private redisService: IredisService
    ) { }
    async execute(userId: string): Promise<{ userId: string; message: string; }> {
        // console.log("userid", userId)
        const otpdata = await this.redisService.getOtp(userId, "signup")
        const userData = otpdata?.data
        console.log("data from redis", userData)
        if (!userData?.email) {
            throw new Error("Email is required");
        }

        const existingUser = await this.authRepository.findUserByEmail(userData?.email.toString())
        let user;
        if (!existingUser) {
            user = await this.authRepository.create({
                ...userData,
                emailVerified: true,
                status: "active",
                isBlocked: false
            })
        } else {
            const updatedRoles = [...existingUser.roles, "investor", "vendor"]
            await this.authRepository.update(existingUser.id.toString(), {
                roles: updatedRoles,
            })
            user = existingUser;
        }
        if (!user || !user.id) {
            throw new AppError("user creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        // creating essentials things are here
        // Promise.all([])
        const deleted = await this.redisService.deleteOtp(userId, "signup")
        if (deleted <= 0) {
            throw new AppError("error while verifying otp", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        return {
            userId: user.id.toString(),
            message: AUTH_RES_MESSAGES.signup
        }
    }
}