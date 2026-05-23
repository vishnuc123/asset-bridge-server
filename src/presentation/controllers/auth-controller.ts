import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { TUserData } from "../../shared/types/AuthTypes";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { ILoginUseCase, IRegisterUseCase, IVerifyOtpUseCase } from "../../application/interfaces/Iauth-usecase";
import { ResponseHandler } from "../middlewares/Response-handler";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { setAccessCookies, setRefreashToken } from "../../shared/utils/SetCookies";

@injectable()
export class Authcontroller {
    constructor(
        @inject(Tokens.registerUseCase) private registerUseCase: IRegisterUseCase,
        @inject(Tokens.verifyOtpUseCase) private verifOtpUseCase: IVerifyOtpUseCase,
        @inject(Tokens.loginUseCase) private loginUseCase: ILoginUseCase
    ) {

    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hit register")
            const { firstName, lastName, email, password } = req.body


            const userData: TUserData = {
                firstName,
                lastName,
                email,
                password,
                isBlocked: false,
                status: "active"
            }

            const { userid } = await this.registerUseCase.execute(userData)
            ResponseHandler.success(res, "user created success", userid, HttpStatusCode.OK)

        } catch (error) {
            next(error)
        }
    }


    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, otp } = req.body
            if (!userId) {
                throw new AppError(AUTH_ERROR_MESSAGES.IdMissing, HttpStatusCode.BAD_REQUEST)
            }
            if (!otp) {
                throw new AppError(AUTH_ERROR_MESSAGES.otpError, HttpStatusCode.BAD_REQUEST)
            }

            const user = await this.verifOtpUseCase.execute(userId, otp, "signup")
            console.log("verify otp ", user)
            ResponseHandler.success(res, "verified and registerred", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async Login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw new AppError(AUTH_ERROR_MESSAGES.LoginInvalidCredentials, HttpStatusCode.BAD_REQUEST)
            }
            const { accessToken, refreashToken, user,message } = await this.loginUseCase.execute(email, password)
            const data = {
                user,
                message
            }
            setAccessCookies(accessToken, res)
            setRefreashToken(refreashToken, res)
            ResponseHandler.success(res, "user login successfull", data, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}