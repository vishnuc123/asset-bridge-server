import type { IUser } from "../../core/models/user-models";

export interface IUpdateProfileUseCase {
    execute(userId: string, data: Partial<IUser>): Promise<IUser | null>
}