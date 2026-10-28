import { inject, injectable } from "inversify";
import { BaseRoute } from "./base-route";
import { Tokens } from "../../shared/constants/Tokens";
import type { AccountController } from "../controllers/account-controller";
import { authenticateUser } from "../middlewares/AuthenticateUser";
import { validate } from "../middlewares/validate";
import { updateProfileSchema } from "../../shared/validations/profile/profileValidation";
import { KycDocumentSchema } from "../../shared/validations/kyc/KycDocumentValiadtion";

@injectable()
export class AccountRoutes extends BaseRoute {
    constructor(@inject(Tokens.accountController) private accountController: AccountController) {
        super()
    }
    protected initRoute(): void {
        this.router
            .patch("/updateProfile", authenticateUser, validate(updateProfileSchema), (req, res, next) => this.accountController.updateProfile(req, res, next))
            .post("/verifyKyc", authenticateUser, (req, res, next) => this.accountController.generateUploadUrl(req,res,next))
            .post("/confirm-upload",authenticateUser,(req,res,next) => this.accountController.)
    }
}