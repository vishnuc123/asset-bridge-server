import type { TkycDocumentInput } from "../../shared/validations/kyc/KycDocumentValiadtion";

export interface IGenerateUploadUrlInput {
  userid: string;
  type: string;
  fileType: string;
  fileSize: number;
}

export interface IGenerateUploadUrlResult {
  filepath: string;
  token: string;
  signedUrl: string;
}

export interface IKycStorageService {
  generateUploadUrl(
    values: IGenerateUploadUrlInput
  ): Promise<IGenerateUploadUrlResult>;
}