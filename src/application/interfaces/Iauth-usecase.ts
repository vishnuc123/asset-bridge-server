import { string } from "zod";
import type { TUserData } from "../../shared/types/AuthTypes";
import type { UserDataDto } from "../dtos/user-dto";
import type { TOtpData, TUserRegistrationInput } from "../../shared/types/commonTypes";
import type { IUser } from "../../core/models/user-models";

export interface IRegisterUseCase {
    execute(userData: TUserData): Promise<{ userid: string }>
}

export interface IVerifyOtpUseCase {
    execute(userId: string, otp: string, purpose: "signup" | "reset"): Promise<{ message: string, data: TOtpData }>
}
export interface IConfirmRegisterUseCase {
    execute(userId: string): Promise<{ userId: string, message: string }>
}

export interface ILoginUseCase {
    execute(email: string, password: string): Promise<{ accessToken: string, refreashToken: string, user:IUser,message: string }>
}