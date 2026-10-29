import { Container } from "inversify";
import { authModule } from "../modules/AuthModule.js";
import { accountModule } from "../modules/AccountModule.js";
import { AdminModule } from "../modules/AdminModule.js";


export const container  = new Container()
container.load(
    authModule,accountModule,AdminModule,
)

