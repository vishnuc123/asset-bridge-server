import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { TUserData } from "../../shared/types/AuthTypes";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { IRegisterUseCase } from "../../application/interfaces/Iauth-usecase";
import { ResponseHandler } from "../middlewares/Response-handler";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../shared/constants/errorMessages";

@injectable()
export class Authcontroller {
    constructor(
        @inject(Tokens.registerUseCase) private registerUseCase: IRegisterUseCase
    ) {

    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
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
            const { otp } = req.body.otp
            if (!otp) {
                throw new AppError(AUTH_ERROR_MESSAGES.otpError, HttpStatusCode.BAD_REQUEST)

            }

            const {} = this.
        } catch (error) {
            next(error)
        }
    }
}