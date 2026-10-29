import { inject } from "inversify";
import { BaseRoute } from "./base-route";
import { Tokens } from "../../shared/constants/Tokens";
import type { AdminController } from "../controllers/admin-controller";
import { authenticateUser } from "../middlewares/AuthenticateUser";

export class AdminRoutes extends BaseRoute {
    constructor(@inject(Tokens.AdminController) private adminController: AdminController) { super() }
    protected initRoute(): void {
        this.router
            .get("/userdetails", (req, res, next) => this.adminController.getUsers(req, res, next))
    }
}