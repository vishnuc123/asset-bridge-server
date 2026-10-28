import { KycModel, type IKycDocument } from "../models/kyc-schema";
import { BaseRepository } from "./base-repository";

export class kycRepository extends BaseRepository<IKycDocument> {
    constructor() { super(KycModel) }
    async findUserId(userid: string) {
        return this.model.findOne({ userid }).exec()
    }
}