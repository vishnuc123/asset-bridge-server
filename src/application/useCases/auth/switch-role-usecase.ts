import { inject } from "inversify";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import { AppError } from "../../../shared/utils/AppError";
import type { ISwitchRoleUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { TRole, TUserData } from "../../../shared/types/AuthTypes";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";

export class switchRoleUseCase implements ISwitchRoleUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IAuthRepository,
        @inject(Tokens.authService) private authService: IAuthService
    ) { }
    async execute(userId: string, role: TRole): Promise<{ accessToken: string,refreashToken:string, message: string, updatedData: TUserData }> {
        if (!role) {
            throw new AppError(AUTH_ERROR_MESSAGES.MissingRole, HttpStatusCode.BAD_REQUEST)
        }
        const user = await this.authRepository.findUserById(userId)
        if (!user) {
            throw new AppError(AUTH_ERROR_MESSAGES.userNotFound, HttpStatusCode.FORBIDDEN)
        }
        if (user.isBlocked) {
            throw new AppError(AUTH_ERROR_MESSAGES.blocked, HttpStatusCode.FORBIDDEN)
        }

        const isAllowed = user.roles.includes(role)
        if (!isAllowed) {
            throw new AppError(AUTH_ERROR_MESSAGES.invalidRole, HttpStatusCode.UNAUTHORIZED)
        }
        const updateActiveRole = await this.authRepository.updateUserById(userId, { activeRole: role })
        if (!updateActiveRole) {
            throw new AppError(AUTH_ERROR_MESSAGES.updateFail, HttpStatusCode.FORBIDDEN)
        }

        const newAccessToken = await this.authService.generateAccessToken(user.id, user.roles, user.email, user.activeRole as TRole)
        const refreashToken = await this.authService.generateRefreashToken(user.id, user.roles, user.email, user.activeRole as TRole)
        
        return {
            accessToken: newAccessToken,
            refreashToken:refreashToken,
            message: "user verified and approved to role switch",
            updatedData: updateActiveRole
        }
        // kyc verified anno check cheyyanam
    }
}