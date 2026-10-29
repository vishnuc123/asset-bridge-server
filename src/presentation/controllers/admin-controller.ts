import type { Request,Response,NextFunction } from "express";
import { inject, injectable } from "inversify";
import { Tokens } from "../../shared/constants/Tokens";
import type { IAdminUseCase } from "../../application/interfaces/IAdminUseCase";
import { AppError } from "../../shared/utils/AppError";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { ResponseHandler } from "../middlewares/Response-handler";

@injectable()
export class AdminController {
    constructor(@inject(Tokens.getUsersUseCase) private getUsersUseCase: IAdminUseCase) { }
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.getUsersUseCase.getUsers()
            ResponseHandler.success(res,"users fetched successfully",users,HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}