import type { IUserDocument } from "../../infrastructure/database/models/user-schema";
import type { BaseRepository } from "../../infrastructure/database/repositories/base-repository";
import type { IPaginationResult } from "../../shared/interfaces/sharedInterfaces";
import type { IFilterData, TUserData, TUserResponse } from "../../shared/types/AuthTypes";
import type { IUser } from "../models/user-models";

export interface IAuthRepository extends BaseRepository<IUserDocument> {
    findUserById(userId: string): Promise<TUserResponse | null>;
    findUserByEmail(email: string): Promise<TUserResponse | null>;
    updateUserById(userId: string, updateData: Partial<IUser>): Promise<TUserResponse | null>;
    findAllUser(pageNumber: number, Limit: number, filter: IFilterData): Promise<IPaginationResult | null>;

}