import type { IPaginationResult } from "../../shared/interfaces/sharedInterfaces";
import type { TGetUsers } from "../../shared/types/AuthTypes";

export interface IAdminUseCase {
    getUsers(pageNumber: number, limit: number, filter:): Promise<IPaginationResult | null>;
}