import type { TGetUsers } from "../../shared/types/AuthTypes";

export interface IAdminUseCase{
    getUsers():Promise<TGetUsers[] | null>;
}