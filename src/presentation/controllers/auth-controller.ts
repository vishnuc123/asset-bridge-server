import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { TloginResponse, TRole, TUserData } from "../../shared/types/AuthTypes";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { IForgetPassword, IGoogleLoginUseCase, ILoginUseCase, IRefreashUseCase, IRegisterUseCase, IResetPasswordUseCase, ISwitchRoleUseCase, IVerifyOtpUseCase } from "../../application/interfaces/Iauth-usecase";
import { ResponseHandler } from "../middlewares/Response-handler";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { setAccessCookies, setRefreashToken } from "../../shared/utils/SetCookies";
import { UserDtos } from "../../infrastructure/dtos/userDto";
import { AuthService } from "../../infrastructure/services/auth-service";

@injectable()
export class Authcontroller {
    constructor(
        @inject(Tokens.registerUseCase) private registerUseCase: IRegisterUseCase,
        @inject(Tokens.verifyOtpUseCase) private verifOtpUseCase: IVerifyOtpUseCase,
        @inject(Tokens.loginUseCase) private loginUseCase: ILoginUseCase,
        @inject(Tokens.refreashUseCase) private refreashUseCase: IRefreashUseCase,
        @inject(Tokens.forgetPasswordUseCase) private forgetPassUseCase: IForgetPassword,
        @inject(Tokens.resetPasswordUseCase) private resetPassUseCase: IResetPasswordUseCase,
        @inject(Tokens.googleLoginUseCase) private googleLoginUseCase: IGoogleLoginUseCase,
        @inject(Tokens.switchRoleUseCase) private SwitchRoleUseCase: ISwitchRoleUseCase
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

            const { userid } = await this.registerUseCase.execute(req.body)
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
            console.log("verify otp ")
            ResponseHandler.success(res, "verified and registerred", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async Login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw new AppError(AUTH_ERROR_MESSAGES.LoginInvalidCredentials, HttpStatusCode.BAD_REQUEST)
            }
            const { accessToken, refreashToken, user, message } = await this.loginUseCase.execute(email, password)
            const data = UserDtos.LoginUserDto(user)
            // console.log("hit setting access")
            setAccessCookies(accessToken, res)
            setRefreashToken(refreashToken, res)
            ResponseHandler.success(res, "user login successfull", data, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async GoogleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hit google login")
            const { credential } = req.body;
            if (!credential) {
                throw new AppError(AUTH_ERROR_MESSAGES.invalidGoogle, HttpStatusCode.BAD_REQUEST)
            }
            const { accessToken, refreashToken, user } = await this.googleLoginUseCase.execute(credential)

            setAccessCookies(accessToken, res)
            setRefreashToken(refreashToken, res)
            ResponseHandler.success(res, "google login successfully", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async Refreash(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hit refreash")
            const refreashToken = req.cookies["refresh-token"]
            if (!refreashToken) {
                throw new AppError(AUTH_ERROR_MESSAGES.unauthorized, HttpStatusCode.UNAUTHORIZED)
            }

            const newAccessToken = await this.refreashUseCase.execute(refreashToken)
            setAccessCookies(newAccessToken, res)

            ResponseHandler.success(res, "Token refresh successfully", null, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async Logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie("access-token")
            res.clearCookie("refresh-token")
            ResponseHandler.success(res, "logout success", null, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async ForgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body
            console.log("data from req", req.body)
            if (!email) {
                throw new AppError(AUTH_ERROR_MESSAGES.emailError, HttpStatusCode.BAD_REQUEST)
            }

            // usecase for forgetpassword
            const { token, message } = await this.forgetPassUseCase.execute(email)
            ResponseHandler.success(res, "if account exist,reset link has been send to the registered email", HttpStatusCode.OK)
        } catch (error) {
            next(Error)
        }
    }

    async ResetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { newPassword, token } = req.body
            console.log("reset passord hit", req.body)
            if (!newPassword) {
                throw new AppError(AUTH_ERROR_MESSAGES.passError, HttpStatusCode.BAD_REQUEST)
            }
            if (!token) {
                throw new AppError(AUTH_ERROR_MESSAGES.tokenError, HttpStatusCode.BAD_REQUEST)
            }



            const { message } = await this.resetPassUseCase.execute(newPassword, token)
            ResponseHandler.success(res, message, HttpStatusCode.OK)

        } catch (error) {
            next(error)
        }
    }
    async switchRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId
            const { role } = req.body
            // console.log("role from frontend",role)
            const { accessToken, refreashToken, updatedData } = await this.SwitchRoleUseCase.execute(userId as TRole, role)
            setAccessCookies(accessToken, res)
            setRefreashToken(refreashToken, res)
            ResponseHandler.success(res, "user role successfully", updatedData, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}