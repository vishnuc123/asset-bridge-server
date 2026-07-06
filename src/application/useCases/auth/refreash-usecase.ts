import { inject, injectable } from "inversify";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import type { TRole } from "../../../shared/types/AuthTypes";
import { AppError } from "../../../shared/utils/AppError";
import type { IRefreashUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";


@injectable()
export class RefreashUseCase implements IRefreashUseCase {
    constructor(
        @inject(Tokens.authService) private authService: IAuthService,
        @inject(Tokens.authRepository) private authRepository: IAuthRepository
    ) { }
    async execute(token: string): Promise<string> {


        const decode = this.authService.verifyRefreashToken(token)
        const userId = decode?.userId

        console.log("refreash userid and decoded",userId,decode);
        
        if (!userId) {
            throw new AppError(AUTH_ERROR_MESSAGES.tokenError, HttpStatusCode.UNAUTHORIZED)
        }

        const user = await this.authRepository.findUserById(userId)
        console.log("user from db refreash token",user);
        
        if (!user) {
            throw new AppError(AUTH_ERROR_MESSAGES.userNotFound, HttpStatusCode.NOT_FOUND)
        }

        const newAccessToken = await this.authService.generateAccessToken(user.id, user.roles, user.email, user.activeRole as TRole)

        return newAccessToken
    }
}