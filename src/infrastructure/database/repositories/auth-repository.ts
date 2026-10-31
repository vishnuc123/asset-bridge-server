import type { IUser } from "../../../core/models/user-models";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { IPaginationResult } from "../../../shared/interfaces/sharedInterfaces";
import type { TUserResponse } from "../../../shared/types/AuthTypes";
import { Mapper } from "../../../shared/utils/Mapper";

import { UserModel, type IUserDocument } from "../models/user-schema";
import { BaseRepository } from "./base-repository";
import { injectable } from "inversify"


@injectable()
export class AuthRepository extends BaseRepository<IUserDocument> implements IAuthRepository {
    constructor() { super(UserModel) }
    async findUserById(userId: string): Promise<TUserResponse | null> {
        const data = await this.model.findById(userId)
        return Mapper.UserMapper(data as IUserDocument)
    }
    async findUserByEmail(email: string): Promise<TUserResponse | null> {
        const data = await this.model.findOne({ email: email })
        // console.log("data from db",data)
        return data ? Mapper.UserMapper(data as IUserDocument) : null;
    }
    async updateUserById(userId: string, updateData: Partial<IUser>): Promise<TUserResponse | null> {
        const data = await this.model.findByIdAndUpdate(userId, updateData, { returnDocument: "after" })
        return data
            ? Mapper.UserMapper(data as IUserDocument)
            : null
    }

    async findAllUser(pageNumber: number, Limit: number): Promise<IPaginationResult | null> {
        const skipLogic = (pageNumber - 1) * Limit
        const data = await this.model.find().skip(skipLogic).limit(Limit)
        const totalDocuments = await this.model.countDocuments()
        const mapped = Mapper.GetUserMapper(data)
        return mapped ? {
            userDetails: mapped, pageDetails: {
                totalDocuments, page: pageNumber, limit: Limit, totalPages: Math.ceil(totalDocuments / Limit)
            }
        } : null;
    }

}