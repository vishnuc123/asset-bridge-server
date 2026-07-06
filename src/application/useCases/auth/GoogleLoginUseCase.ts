import { GoogleAuth, OAuth2Client, type TokenPayload } from "google-auth-library";
import { AUTH_ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import { AppError } from "../../../shared/utils/AppError";
import type { IGoogleLoginUseCase } from "../../interfaces/Iauth-usecase";
import { env } from "../../../shared/constants/env";
import { inject, injectable } from "inversify";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { TUserData } from "../../../shared/types/AuthTypes";
import type { IAuthService } from "../../../infrastructure/interfaces/Iauth-service";
import type { TUserRegistrationInput } from "../../../shared/types/commonTypes";
import type { IredisService } from "../../../infrastructure/interfaces/Iredis-service";
import { Mapper } from "../../../shared/utils/Mapper";


@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IAuthRepository,
        @inject(Tokens.authService) private authService: IAuthService,
        @inject(Tokens.redisService) private redisService: IredisService
    ) { }
    async execute(googleToken: string): Promise<{ accessToken: string; refreashToken: string; user: TUserData; }> {
        if (!googleToken) {
            throw new AppError(AUTH_ERROR_MESSAGES.invalidGoogle, HttpStatusCode.BAD_REQUEST)
        }
        const client = new OAuth2Client(env.GOOGLE_ID)
        let payload: TokenPayload | undefined;
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: env.GOOGLE_ID as string
            })
            payload = ticket.getPayload()
        } catch (err) {
            console.log("full error", err)
            throw new AppError("invalid google credentials", HttpStatusCode.UNAUTHORIZED)
        }
        if (!payload || !payload.email) {
            throw new AppError(AUTH_ERROR_MESSAGES.LoginInvalidCredentials, HttpStatusCode.INTERNAL_SERVER_ERROR)
        }
        let user = await this.authRepository.findUserByEmail(payload.email)
        if (!user) {
            const newUser: TUserRegistrationInput = {
                firstName: payload.given_name || "google",
                lastName: payload.family_name || "User",
                email: payload.email,
                status: "active",
                isBlocked: false,
                password: await this.authService.hashPassword(Math.random().toString(36).slice(-8)),
                roles: ["user", "investor", "vendor"]
            }
            user = await this.authRepository.create(newUser)
        } else {
            if (user.isBlocked || user.status === "banned") {
                throw new AppError(AUTH_ERROR_MESSAGES.blocked, HttpStatusCode.BAD_REQUEST)
            }

        }
        const accessToken =await this.authService.generateAccessToken(user.id, user.roles, user.email, "user")
        const refreashToken =await this.authService.generateRefreashToken(user.id, user.roles, user.email, "user")
        return { accessToken, refreashToken, user }
    }
}