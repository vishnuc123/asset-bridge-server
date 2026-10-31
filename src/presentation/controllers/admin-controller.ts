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
            console.log("getusercontroller")
            console.log("userparams",req.query)
            const PageNumber = Number(req.query.page) || 1
            const Limit = Number(req.query.limit) || 10
            
            const allUsers = await this.getUsersUseCase.getUsers(PageNumber,Limit)
            ResponseHandler.success(res,"users fetched successfully",allUsers,HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}