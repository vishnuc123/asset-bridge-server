import { inject, injectable } from "inversify";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import { AppError } from "../../../shared/utils/AppError";
import type { IResetPasswordUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import crypto from "crypto"
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import bcrypt from "bcrypt"

@injectable()
export class ResetPassUseCase implements IResetPasswordUseCase {
    constructor(
        @inject(Tokens.redisService) private redisService: IredisService,
        @inject(Tokens.authRepository) private authRepository: IAuthRepository
    ) { }
    async execute(password: string, token: string): Promise<{ message: string; }> {
        if (!password) {
            throw new AppError(AUTH_ERROR_MESSAGES.passError, HttpStatusCode.BAD_REQUEST)
        }
        const hashTempToken = crypto.createHash('sha256').update(token).digest("hex")
        const key = `reset:${hashTempToken}`
        console.log("key to chekc in redis", key)
        const userId = await this.redisService.get(key)
        console.log("get token from redis", userId)

        if (!userId) {
            throw new AppError(AUTH_ERROR_MESSAGES.tokenError, HttpStatusCode.BAD_REQUEST)
        }

        const user = await this.authRepository.findById(userId as string)
        if (!user) {
            throw new AppError(AUTH_ERROR_MESSAGES.userNotFound, HttpStatusCode.NOT_FOUND)
        }
        const ValidatePass = await bcrypt.compare(password, user?.password)
        if (ValidatePass) {
            throw new AppError(AUTH_ERROR_MESSAGES.passError, HttpStatusCode.BAD_REQUEST)
        }
        const hashedPass = await bcrypt.hash(password, 10)
        await this.authRepository.update(user.id, { $set: { password: hashedPass, } })
        await this.redisService.deleteResetToken(userId as string)
        return {
            message: "password changed successfully please Re-login"
        }
    }
}