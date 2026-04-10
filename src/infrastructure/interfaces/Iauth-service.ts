

export interface IAuthService{
    generateOtp(length:number):string
    hashPassword(password:string):Promise<string>
    sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }>
    // storeOtp(userId:string,otp:string,data:TOtpData,purpose:"signup"|"reset"):Promise<{timer:Number}>
    // ComparePassword(passwrod:string,userPassword:string):Promise<boolean>
    // // verifyOtp(userId: string, otp: string, purpose: 'signup' | 'reset'): Promise<TOtpData>
    // resendOtp(userId: string, purpose: 'signup' | 'reset'): Promise<void>
    // generateAccessToken(userId:string,role:TRole,email:string):string
    // generateRefreashToken(userId:string,role:TRole,email:string):string
    // verifyAccessToken(token:string):JwtPayload|null
    // verifyRefreashToken(token:string):JwtPayload|null

}