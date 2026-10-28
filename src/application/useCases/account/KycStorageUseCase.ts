import { inject } from "inversify";
import type { IGenerateUploadUrlInput, IGenerateUploadUrlResult, IKycStorageService } from "../../../infrastructure/interfaces/IStorage-service";
import type { IKycStorageUseCase } from "../../interfaces/IAccountUseCase";
import { Tokens } from "../../../shared/constants/Tokens";

export class KycStorageUseCase implements IKycStorageUseCase {
    constructor(@inject(Tokens.kycStorageService) private kycStorageService: IKycStorageService) { }
    execute(userid: string, values: IGenerateUploadUrlInput): Promise<IGenerateUploadUrlResult> {
        return this.kycStorageService.generateUploadUrl({
            userid,
            type: values.type,
            fileType: values.fileType,
            fileSize: values.fileSize
        })
    }
}