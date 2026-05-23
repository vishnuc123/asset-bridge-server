import {type Request,type Response,type NextFunction} from 'express'
export const authenticateUser = (req:Request,res:Response,next:NextFunction) => {
    const accessToken = req.cookies["access-token"]
    const refreashToken = req.cookies["refreash-token"]
    console.log("access",accessToken,"refreash",refreashToken)
}