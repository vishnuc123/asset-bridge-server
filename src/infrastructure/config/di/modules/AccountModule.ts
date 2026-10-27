import { ContainerModule } from "inversify";
import { Tokens } from "../../../../shared/constants/Tokens";
import { AccountController } from "../../../../presentation/controllers/account-controller";
import { AccountRoutes } from "../../../../presentation/routes/account-routes";
import { updateProfileUseCase } from "../../../../application/useCases/account/updateProfile-useCase";

export const accountModule = new ContainerModule(({ bind }) => {
    bind(Tokens.AccountRoutes).to(AccountRoutes)
    bind(Tokens.accountController).to(AccountController)
    bind(Tokens.accountUpdateUseCase).to(updateProfileUseCase)
})