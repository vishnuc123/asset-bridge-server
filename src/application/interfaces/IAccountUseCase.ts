import type { IUser } from "../../core/models/user-models";
import type { IGenerateUploadUrlInput, IGenerateUploadUrlResult } from "../../infrastructure/interfaces/IStorage-service";

export interface IUpdateProfileUseCase {
    execute(userId: string, data: Partial<IUser>): Promise<IUser | null>
}
export interface IKycStorageUseCase {

    execute(userId: string, values: IGenerateUploadUrlInput): Promise<IGenerateUploadUrlResult>
}