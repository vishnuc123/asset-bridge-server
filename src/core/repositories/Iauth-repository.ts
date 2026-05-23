import type { IUserDocument } from "../../infrastructure/database/models/user-schema";
import type { BaseRepository } from "../../infrastructure/database/repositories/base-repository";
import type { TUserData, TUserResponse } from "../../shared/types/AuthTypes";
import type { IUser } from "../models/user-models";

export interface IAuthRepository extends BaseRepository<IUserDocument>{
    findUserById(user:string):Promise<TUserResponse | null>;
    findUserByEmail(email:string):Promise<TUserResponse | null>;
}