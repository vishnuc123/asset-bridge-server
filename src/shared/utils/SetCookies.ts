import  { type Response } from "express"
import { jwtConfig } from "../../infrastructure/config/jwt/jwt"

export const setAccessCookies = (accessToken: string, res: Response) => {
    return res.cookie("access-token",accessToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:jwtConfig.accessToken.maxAge
    })
}
export const setRefreashToken = (refreashToken: string, res: Response) => {
    return res.cookie("refresh-token",refreashToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:jwtConfig.refreshToken.maxAge
    })
}