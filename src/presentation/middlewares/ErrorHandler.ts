import type {Response, NextFunction } from "express";
import { AppError } from "../../shared/utils/AppError";

export const ErrorHandler = (err: Error | AppError,req:Request, res: Response, _next: NextFunction): void => {
    console.log("error Stack", err.stack)

    const stat = err instanceof AppError ? err.statusCode : 400
    const message = err.message || "something went wrong"

    res.status(stat).json({
        success: false,
        message,
        statusCode: stat
    })
}