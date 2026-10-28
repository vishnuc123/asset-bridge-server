import { ContainerModule } from "inversify";
import { Tokens } from "../../../../shared/constants/Tokens";
import { AccountController } from "../../../../presentation/controllers/account-controller";
import { AccountRoutes } from "../../../../presentation/routes/account-routes";
import { updateProfileUseCase } from "../../../../application/useCases/account/updateProfile-useCase";
import { KycStorageService } from "../../../services/storage-service";
import { KycStorageUseCase } from "../../../../application/useCases/account/KycStorageUseCase";

export const accountModule = new ContainerModule(({ bind }) => {
    bind(Tokens.AccountRoutes).to(AccountRoutes)
    bind(Tokens.accountController).to(AccountController)
    bind(Tokens.accountUpdateUseCase).to(updateProfileUseCase)
    bind(Tokens.kycStorageService).to(KycStorageService)
    bind(Tokens.kycStorageUseCase).to(KycStorageUseCase)
    
})