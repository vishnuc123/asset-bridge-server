import { inject, injectable } from "inversify";
import type { ILoginUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";
import type { IUser } from "../../../core/models/user-models";
import type { TUserResponse } from "../../../shared/types/AuthTypes";

@injectable()
export class LoginUseCase implements ILoginUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IAuthRepository,
        @inject(Tokens.authService) private authService: IAuthService
    ) {

    }
    async execute(email: string, password: string): Promise<{ accessToken: string; refreashToken: string; user: TUserResponse, message: string; }> {
        const user = await this.authRepository.findUserByEmail(email)

        if (!user) {
            throw new AppError(AUTH_ERROR_MESSAGES.userNotFound, HttpStatusCode.NOT_FOUND)
        }

        const verifyPass = await this.authService.ComparePassword(password, user.password)
        if (!verifyPass) {
            throw new AppError(AUTH_ERROR_MESSAGES.loginFailed, HttpStatusCode.BAD_REQUEST)
        }
        const accessToken = await this.authService.generateAccessToken(user.id, user.roles, user.email, "user")
        const refreashToken = await this.authService.generateRefreashToken(user.id, user.roles, user.email, "user")

        return {
            accessToken,
            refreashToken,
            user,
            message: "user logged in Successfully"
        }
    }
}
