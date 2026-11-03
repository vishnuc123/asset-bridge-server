import type { QueryFilter } from "mongoose";
import type { IUser } from "../../../core/models/user-models";
import type { IAuthRepository } from "../../../core/repositories/Iauth-repository";
import type { IPaginationResult } from "../../../shared/interfaces/sharedInterfaces";
import type { IFilterData, TUserResponse } from "../../../shared/types/AuthTypes";
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

    async findAllUser(pageNumber: number, Limit: number, filter: IFilterData): Promise<IPaginationResult | null> {
        // const filter = JSON.parse(values)
        console.log("values in the filter",filter)
        const skipLogic = (pageNumber - 1) * Limit
        const query: QueryFilter<IUser> = {}
        if (filter.search) {
            query.$or = [
                { firstName: { $regex: filter.search, $options: "i" } },
                { lastName: { $regex: filter.search, $options: "i" } },
                { email: { $regex: filter.search, $options: "i" } },
            ]
        }
        if (filter.status) {
            query.status = filter.status
        }
        if (filter.category) {
            query.roles = filter.category
        }

        const beforeSortQuery = this.model.find(query)
        if (filter.sortBy === "newest") {
            beforeSortQuery.sort({ createdAt: -1 })
        } else if (filter.sortBy === "oldest") {
            beforeSortQuery.sort({ createdAd: 1 })
        } else if (filter.sortBy === "asc") {
            beforeSortQuery.sort({ firstName: 1 })
        } else if (filter.sortBy === 'desc') {
            beforeSortQuery.sort({ firstname: -1 })
        }

        const data = await beforeSortQuery.skip(skipLogic).limit(Limit).lean()
        const totalDocuments = await this.model.countDocuments(query)
        const mapped = Mapper.GetUserMapper(data)
        return mapped ? {
            userDetails: mapped, pageDetails: {
                totalDocuments, page: pageNumber, limit: Limit, totalPages: Math.ceil(totalDocuments / Limit)
            }
        } : null;
    }

}