import { ContainerModule } from "inversify";
import { Authcontroller } from "../../../../presentation/controllers/auth-controller";
import { Tokens } from "../../../../shared/constants/Tokens";

export const authModule = new ContainerModule(({ bind }) => {
    bind(Tokens.authController).to(Authcontroller)
})