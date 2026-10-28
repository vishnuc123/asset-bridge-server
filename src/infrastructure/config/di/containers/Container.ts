import { Container } from "inversify";
import { authModule } from "../modules/AuthModule.js";
import { accountModule } from "../modules/AccountModule.js";


export const container  = new Container()
container.load(
    authModule,accountModule,
)

