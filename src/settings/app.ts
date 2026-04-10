import type { Application } from "express";
import http from "http"
import express from "express"
import { container } from "../infrastructure/config/di/containers/Container";
import { Tokens } from "../shared/constants/Tokens";
import type { AuthRoutes } from "../presentation/routes/auth-routes";

export class Settings {
    public App: Application
    public server: http.Server
    constructor() {
        this.App = express()
        this.server = http.createServer(this.App)
    }

    public setRoute():void {
        const userRoutes = container.get<AuthRoutes>(Tokens.authRoutes)
        this.App.use("/api/v1/user",userRoutes.router)
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