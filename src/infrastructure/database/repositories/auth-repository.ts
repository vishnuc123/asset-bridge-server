import type { IUser } from "../../../core/models/user-models";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { IBaseRepository } from "../../../core/repositories/Ibase-respository";
import type { TUserData } from "../../../shared/types/AuthTypes";
import { UserModel, type IUserDocument } from "../models/user-schema";
import { BaseRepository } from "./base-repository";

export class AuthRepository extends BaseRepository<IUserDocument> implements IAuthRepository {
    constructor() { super(UserModel) }
    async findUserById(userId: string): Promise<IUser | null> {
        const data = await this.model.findById(userId)
        return data
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        const data = await this.model.findOne({ email: email })
        return data

    }
}