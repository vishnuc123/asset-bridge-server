import { inject, injectable } from "inversify";
import { BaseRoute } from "./base-route";
import { Tokens } from "../../shared/constants/Tokens";
import type { Authcontroller } from "../controllers/auth-controller";
import { validate } from "../middlewares/validate";
import { signupSchema } from "../../shared/validations/signup-schema";
import { authenticateUser } from "../middlewares/AuthenticateUser";

@injectable()
export class AuthRoutes extends BaseRoute {
    constructor(
        @inject(Tokens.authController) private authcontroller:Authcontroller
    ) { super() }
    protected initRoute(): void {
        this.router
        .post("/signup",validate(signupSchema),(req,res,next) =>this.authcontroller.register(req,res,next))
        .post("/verify-otp",(req,res,next) => this.authcontroller.verifyOtp(req,res,next))
        .post("/login",(req,res,next) => this.authcontroller.Login(req,res,next))
    }

}