import { string } from "zod";
import type { TloginResponse, TRole, TUserData, TUserResponse } from "../../shared/types/AuthTypes";
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
    execute(email: string, password: string): Promise<{ accessToken: string, refreashToken: string, user:TUserResponse,message: string }>
}

export interface IgetAuthenticateUseCase{
    execute(userId:string,refreashToken:string):Promise<TloginResponse>
}

export interface IRefreashUseCase {
    execute(refreshToken:string):Promise<string>
}

export interface IForgetPassword{
    execute(email:string):Promise<{token:string,message:string}>
}
export interface IResetPasswordUseCase{
    execute(password:string,token:string):Promise<{message:string}>
}
export interface IGoogleLoginUseCase{
    execute(googleToken:string):Promise<{accessToken:string,refreashToken:string,user:TUserData}>
}
export interface ISwitchRoleUseCase{
    execute(userId:string,role:TRole):Promise<{accessToken:string,refreashToken:string,message:string,updatedData:TUserData}>
}