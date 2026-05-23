import type { IUser } from "../../../core/models/user-models";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { TUserResponse } from "../../../shared/types/AuthTypes";
import { Mapper } from "../../../shared/utils/Mapper";

import { UserModel, type IUserDocument } from "../models/user-schema";
import { BaseRepository } from "./base-repository";
import {injectable} from "inversify"


@injectable()
export class AuthRepository extends BaseRepository<IUserDocument> implements IAuthRepository {
    constructor() { super(UserModel) }
    async findUserById(userId: string): Promise<TUserResponse | null> {
        const data = await this.model.findById(userId)
        return Mapper.UserMapper(data as IUserDocument)
    }
    async findUserByEmail(email: string): Promise<TUserResponse | null> {
        const data = await this.model.findOne({ email: email })
        return Mapper.UserMapper(data as IUserDocument)

    }
}