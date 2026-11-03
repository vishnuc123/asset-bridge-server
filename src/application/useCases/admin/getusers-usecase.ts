import { inject, injectable } from "inversify";
import type { IUser } from "../../../core/models/user-models";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAdminUseCase } from "../../interfaces/IAdminUseCase";
import { AppError } from "../../../shared/utils/AppError";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import type { IFilterData, TGetUsers } from "../../../shared/types/AuthTypes";
import { Mapper } from "../../../shared/utils/Mapper";
import type { IPaginationResult } from "../../../shared/interfaces/sharedInterfaces";

@injectable()
export class GetUserUseCase implements IAdminUseCase {
    constructor(@inject(Tokens.authRepository) private authRepository: IAuthRepository) { }
    async getUsers(pageNumber: number, limit: number, filter: IFilterData): Promise<IPaginationResult | null> {
        const users = await this.authRepository.findAllUser(pageNumber, limit, filter)
        console.log("mapped allusers", users)
        return users ?? null
    }
}