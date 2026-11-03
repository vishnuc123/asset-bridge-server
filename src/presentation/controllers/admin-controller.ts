import type { Request, Response, NextFunction } from "express";
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
            // console.log("getusercontroller")
            console.log("userparams", req.query)
            const PageNumber = Number(req.query.page) || 1
            const Limit = Number(req.query.limit) || 10
            const filter = req.query.filter
            let parsedFilter;
            if (typeof filter === "string") {
                parsedFilter = JSON.parse(filter)
                
                console.log("getusers request filter",parsedFilter)
            } else {
                throw new AppError("invalid filter request format", HttpStatusCode.BAD_REQUEST)
            }
            const allUsers = await this.getUsersUseCase.getUsers(PageNumber, Limit, parsedFilter)
            ResponseHandler.success(res, "users fetched successfully", allUsers, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}