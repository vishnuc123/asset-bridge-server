import { inject, injectable } from "inversify";
import type { TloginResponse, TUserResponse } from "../../../shared/types/AuthTypes";
import type { IgetAuthenticateUseCase } from "../../interfaces/Iauth-usecase";
import { Tokens } from "../../../shared/constants/Tokens";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { UserDtos } from "../../../infrastructure/dtos/userDto";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";

@injectable()
export class GetAuthenticateUseCase implements IgetAuthenticateUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRespository: IAuthRepository,
        @inject(Tokens.authService) private authService: IAuthService
    ) { }
    async execute(userId: string, refreashToken: string): Promise<TloginResponse> {
        if (!userId) {
            throw new AppError(AUTH_ERROR_MESSAGES.IdMissing, HttpStatusCode.BAD_REQUEST)
        }
        if (!refreashToken) {
            throw new AppError(AUTH_ERROR_MESSAGES.sessionExpired, HttpStatusCode.UNAUTHORIZED)
        }
        const verifyToken = await this.authService.verifyRefreashToken(refreashToken)
        console.log("payload jwt",verifyToken)
        // const date = new Date(verifyToken?.exp *1000)
        // console.log(date)
        // const currentTime = d

        if (verifyToken) {

            const UserData = await this.authRespository.findUserById(userId)
            if (!UserData) {
                throw new AppError(AUTH_ERROR_MESSAGES.notFound, HttpStatusCode.NOT_FOUND)
            }
            if (UserData.status === "banned" || UserData.isBlocked) {
                throw new AppError(AUTH_ERROR_MESSAGES.blocked, HttpStatusCode.BAD_REQUEST)
            }
            return UserDtos.LoginUserDto(UserData)
        }
        else {
            throw new AppError(AUTH_ERROR_MESSAGES.invalidToken, HttpStatusCode.UNAUTHORIZED)
        }
    }
}