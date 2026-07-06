import type { Application } from "express";
import http from "http"
import express from "express"
import { container } from "../infrastructure/config/di/containers/Container";
import { Tokens } from "../shared/constants/Tokens";
import type { AuthRoutes } from "../presentation/routes/auth-routes";
import cookieParser from "cookie-parser";
import cors from "cors"
import { env } from "../shared/constants/env";
import { errorHandler } from "../presentation/middlewares/ErrorHandler";

export class Settings {
    public App: Application
    public server: http.Server
    constructor() {
        this.App = express()
        this.server = http.createServer(this.App)
        this.setSecurityMiddlewares();
        this.setGlobalMiddlewares();
        this.setRoutes();
        this.setErrorHandling();

    }
    private setGlobalMiddlewares(): void {
        this.App.use(cookieParser())
        this.App.use(express.json())
        this.App.use(express.urlencoded({ extended: true }))

    }
    private setSecurityMiddlewares(): void {
        this.App.use(cors({
            origin: env.CLIENT_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

    }
    private setErrorHandling(): void {
        this.App.use(errorHandler)
    }
    private setRoutes(): void {
        const userRoutes = container.get<AuthRoutes>(Tokens.authRoutes)
        this.App.use("/api/v1/user", userRoutes.router)
    }

    public listen(port: number): void {
        this.server.listen(port, () => {
            console.log(`server is running on http://localhost:${port}`)
        })
    }

    public getServer(): Application {
        return this.App
    }
}