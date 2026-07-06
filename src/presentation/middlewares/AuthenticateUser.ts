import { type Request, type Response, type NextFunction } from 'express'
// import { AppError } from '../../shared/utils/AppError'
import { AppError } from "../../shared/utils/AppError"
import { HttpStatusCode } from '../../shared/constants/HttpStatusCodes'
import { container } from '../../infrastructure/config/di/containers/Container'
import { AuthService } from '../../infrastructure/services/auth-service'
import { Tokens } from '../../shared/constants/Tokens'
import jwt, { type JwtPayload } from "jsonwebtoken"
import type { GetAuthenticateUseCase } from '../../application/useCases/auth/getAuthenticate-usecase'
import type { IgetAuthenticateUseCase } from '../../application/interfaces/Iauth-usecase'
import type { IAuthService, IJwtPayload } from '../../infrastructure/interfaces/Iauth-service'
import type { TloginResponse, TRole } from '../../shared/types/AuthTypes'
import { setAccessCookies } from '../../shared/utils/SetCookies'
import { appendFile } from 'node:fs'


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authService = container.get<IAuthService>(Tokens.authService)
    try {
        console.log("hit me middleware")

        const accessToken = req.cookies["access-token"]

        if (!accessToken) {

            console.log("access token undefined")
            throw new AppError("Access token expired", HttpStatusCode.UNAUTHORIZED)
        }

        const decodeAccessToken = authService.verifyAccessToken(accessToken)
        console.log("DECODED ACCESS TOKEN : ", decodeAccessToken)
        req.user = decodeAccessToken
        
        return next()
    } catch (error) {
        return next(error)
    }

}