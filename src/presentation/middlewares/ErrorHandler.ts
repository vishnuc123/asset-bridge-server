import type {Request,Response, NextFunction } from "express";
import { AppError } from "../../shared/utils/AppError";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { logger } from "../../shared/utils/Logger";

export const errorHandler = (err: Error | AppError,req:Request, res: Response, _next: NextFunction): void => {
    console.log("error Stack", err.stack)

    logger.error(`Error Message:, ${ err.message }`);

    const stat = err instanceof AppError ? err.statusCode : HttpStatusCode.INTERNAL_SERVER_ERROR
    const message = err.message || "something went wrong"

    res.status(stat).json({
        success: false,
        message,
        statusCode: stat
    })
}