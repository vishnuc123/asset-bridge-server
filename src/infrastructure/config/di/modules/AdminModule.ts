import { ContainerModule } from "inversify";
import { Tokens } from "../../../../shared/constants/Tokens";
import { GetUserUseCase } from "../../../../application/useCases/admin/getusers-usecase";
import { AdminRoutes } from "../../../../presentation/routes/admin-route";
import { AdminController } from "../../../../presentation/controllers/admin-controller";

export const AdminModule = new ContainerModule(({bind}) => {
    bind(Tokens.AdminRoutes).to(AdminRoutes)
    bind(Tokens.AdminController).to(AdminController)
    bind(Tokens.getUsersUseCase).to(GetUserUseCase)

})