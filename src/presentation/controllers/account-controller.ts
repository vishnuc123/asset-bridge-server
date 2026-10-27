import type { Request, Response, NextFunction } from "express"
import { AppError } from "../../shared/utils/AppError"
import { AUTH_ERROR_MESSAGES } from "../../shared/constants/errorMessages"
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes"
import { inject } from "inversify"
import { Tokens } from "../../shared/constants/Tokens"
import type { IUpdateProfileUseCase } from "../../application/interfaces/IAccountUseCase"
import { ResponseHandler } from "../middlewares/Response-handler"
export class AccountController {
    constructor(@inject(Tokens.accountUpdateUseCase) private accountUpdateUseCase: IUpdateProfileUseCase) { }
    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId
            const data = req.body
            console.log("userdetails in the request", req.user)
            if (!userId || !data) {
                throw new AppError(AUTH_ERROR_MESSAGES.IdMissing, HttpStatusCode.INTERNAL_SERVER_ERROR)
            }
            const result = await this.accountUpdateUseCase.execute(userId, data)
            ResponseHandler.success(res, "user updated succesfully", result, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}