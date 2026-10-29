import { ContainerModule } from "inversify";
import { Tokens } from "../../../../shared/constants/Tokens";
import { GetUserUseCase } from "../../../../application/useCases/admin/getusers-usecase";

export const AdminModule = new ContainerModule(({bind}) => {
    bind(Tokens.getUsersUseCase).to(GetUserUseCase)

})