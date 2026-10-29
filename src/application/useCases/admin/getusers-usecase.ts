import { inject, injectable } from "inversify";
import type { IUser } from "../../../core/models/user-models";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import { Tokens } from "../../../shared/constants/Tokens";
import type { IAdminUseCase } from "../../interfaces/IAdminUseCase";
import { AppError } from "../../../shared/utils/AppError";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";
import type { TGetUsers } from "../../../shared/types/AuthTypes";
import { Mapper } from "../../../shared/utils/Mapper";

@injectable()
export class GetUserUseCase implements IAdminUseCase {
    constructor(@inject(Tokens.authRepository) private authRepository: IAuthRepository) { }
    async getUsers(): Promise<TGetUsers[] | null> {
        const users = await this.authRepository.find({}).exec()
        const mapped = Mapper.GetUserMapper(users)
        return mapped
    }
}