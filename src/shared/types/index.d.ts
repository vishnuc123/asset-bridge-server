import type { IJwtPayload } from "../../infrastructure/interfaces/Iauth-service";
import type { TloginResponse } from "./AuthTypes";

declare global {
    namespace Express {
        interface Request{
            user?:IJwtPayload | null,
        }
    }
}