import type { Request, Response, NextFunction } from "express"
import { AppError } from "../../shared/utils/AppError"
import { AUTH_ERROR_MESSAGES } from "../../shared/constants/errorMessages"
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes"
import { inject } from "inversify"
import { Tokens } from "../../shared/constants/Tokens"
import type { IKycStorageUseCase, IUpdateProfileUseCase } from "../../application/interfaces/IAccountUseCase"
import { ResponseHandler } from "../middlewares/Response-handler"
export class AccountController {
    constructor(
        @inject(Tokens.accountUpdateUseCase) private accountUpdateUseCase: IUpdateProfileUseCase,
        @inject(Tokens.kycStorageUseCase) private KycStorageUseCase: IKycStorageUseCase
    ) { }
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
    async generateUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId as string
            const result = await this.KycStorageUseCase.execute(userId, req.body)
            ResponseHandler.success(res, "file uploaded successfully", result, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}