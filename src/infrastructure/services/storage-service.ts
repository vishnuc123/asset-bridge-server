import { record, size } from "zod";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";
import { AppError } from "../../shared/utils/AppError";
import type { IGenerateUploadUrlInput, IGenerateUploadUrlResult, IKycStorageService } from "../interfaces/IStorage-service";
import { randomUUID } from "crypto";
import { KYC_BUCKET, supabase } from "../config/supabase/supabase";

export class KycStorageService implements IKycStorageService {
    async generateUploadUrl(values: IGenerateUploadUrlInput): Promise<IGenerateUploadUrlResult> {
        const { userid, type, fileType, fileSize } = values
        const allowedTypes = ["passport", "adhaar", "selfie"]
        const allowedFileType = ["image/jpeg", "image/pdf", "video/mp4"]
        const extensions: Record<string, string> = {
            "image/jpeg": "jpeg",
            "image/png": "png",
            "application/pdf": "pdf",
        }
        const sizeLimit = 10 * 1024 * 1024
        if (!allowedTypes.includes(fileType)) {
            throw new AppError("invalid document type(kyc)", HttpStatusCode.UNSUPPORTED_MEDIA)
        }
        if (!allowedFileType.includes(fileType)) {
            throw new AppError("unsupported file type", HttpStatusCode.UNSUPPORTED_MEDIA)
        }
        if (!Number.isInteger(fileSize) || fileSize > sizeLimit) {
            throw new AppError("file size limit 15mb,must not exceed", HttpStatusCode.NOT_ACCEPTABLE)
        }

        const Filepath = `${userid}/${type}/${randomUUID()}.${extensions[fileType]}`;
        const { data, error } = await supabase.storage.from(KYC_BUCKET).createSignedUploadUrl(Filepath, { upsert: false })
        if (error) {
            throw new AppError("failed to generate upload url", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        return {
            filepath: data.path,
            token: data.token,
            signedUrl: data.signedUrl
        }

    }
}