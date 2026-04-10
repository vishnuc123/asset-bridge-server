import { string } from "zod";
import type { TUserData } from "../../shared/types/AuthTypes";

export interface IRegisterUseCase {
    execute(userData: TUserData): Promise<{ userid: string }>
}

export interface IVerifyOtpUseCase{
    execute(otp:string):Promise<{}>
}