import type { JwtPayload } from "jsonwebtoken"
import type { TRole } from "../../shared/types/AuthTypes"
import type { TOtpData } from "../../shared/types/commonTypes"


export interface IJwtPayload {
    userId: string
    roles: TRole[]
    activeRole:TRole
    email: string
}

export interface IAuthService {
    generateOtp(length: number): string
    hashPassword(password: string): Promise<string>
    sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }>
    // storeOtp(userId:string,otp:string,data:TOtpData,purpose:"signup"|"reset"):Promise<{timer:Number}>
    ComparePassword(passwrod: string, userPassword: string): Promise<boolean>
    verifyOtp(userId: string, otp: string, purpose: 'signup' | 'reset'): Promise<TOtpData>
    // resendOtp(userId: string, purpose: 'signup' | 'reset'): Promise<void>
    generateAccessToken(userId: string, role: TRole[], email: string,aciveRole:TRole): string
    generateRefreashToken(userId: string, role: TRole[], email: string,activeRole:TRole): string
    verifyAccessToken(token: string): IJwtPayload | null
    verifyRefreashToken(token: string): IJwtPayload | null

}