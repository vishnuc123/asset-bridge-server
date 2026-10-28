import { inject, injectable } from "inversify";
import type { IGenerateUploadUrlInput, IGenerateUploadUrlResult, IKycStorageService } from "../../../infrastructure/interfaces/IStorage-service";
import type { IKycStorageUseCase } from "../../interfaces/IAccountUseCase";
import { Tokens } from "../../../shared/constants/Tokens";
import { AppError } from "../../../shared/utils/AppError";
import type { TDocumentType } from "../../../shared/types/commonTypes";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";

@injectable()
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
    async confirmUpload(
        userId: string,
        values: { type: TDocumentType; filepath: string }
    ) {
        const { type, filepath } = values;

        // Check that the file belongs to this user
        if (!filepath.startsWith(`${userId}/${type}/`)) {
            throw new AppError(
                "Invalid file path",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // Check that the file exists in Supabase
        const exists = await this.kycStorageService.verifyUploadedFile(filepath);

        if (!exists) {
            throw new AppError(
                "File not found in storage",
                HttpStatusCode.NOT_FOUND
            );
        }

        return this.kycRepository.create({
            userId,
            type,
            filepath,
            status: "pending",
        });
    }
}