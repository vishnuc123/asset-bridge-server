import { inject, injectable } from "inversify";
import type { IForgetPassword } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import crypto from "crypto"
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import type { IMailService } from "../../../infrastructure/interfaces/Imail-service";

@injectable()
export class ForgetPasswordUseCase implements IForgetPassword {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IAuthRepository,
        @inject(Tokens.redisService) private redisService: IredisService,
        @inject(Tokens.mailService) private mailService: IMailService,
    ) { }
    async execute(email: string): Promise<{ token: string; message: string; }> {
        if (!email) {
            throw new AppError(AUTH_ERROR_MESSAGES.emailError, HttpStatusCode.BAD_REQUEST)
        }

        const user = await this.authRepository.findUserByEmail(email)
        if (!user) {
            throw new AppError(AUTH_ERROR_MESSAGES.emailNotFound, HttpStatusCode.NOT_FOUND)
        }
        const tempToken = crypto.randomBytes(32).toString("hex")
        const hashTempToken = crypto.createHash("sha256").update(tempToken).digest("hex")
        const storedtoken = await this.redisService.storeResetToken(hashTempToken, user.id.toString(), 60 * 3)
        console.log("stored token = ",storedtoken)
        await this.mailService.sendResetMail(user.email, tempToken)

        return {token:"",message:"if account exist reset link will be send to the email"}
    }
}