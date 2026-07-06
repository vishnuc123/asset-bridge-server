import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/utils/AppError";
import { AUTH_ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import type { TRole } from "../../shared/types/AuthTypes";

export const authorizeRoles = (...roles: TRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        console.log("Req.user autorize role", req.user)
        if (!req.user) {
            return next(new AppError("Please sign in to continue.", HttpStatusCode.UNAUTHORIZED));
        }

        const activeRole = req.user?.activeRole
        // console.log("userrole",userRole)
        if (!roles.includes(activeRole as TRole)) {
            return next(new AppError("You do not have permission to perform this action.", HttpStatusCode.FORBIDDEN));
        }

        next();
    };
};