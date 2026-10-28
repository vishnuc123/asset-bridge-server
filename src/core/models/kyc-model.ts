import type { TDocumentType, TKycStatus } from "../../shared/types/commonTypes";

export interface Ikyc{
    id:string,
    userid:string,
    overallStatus:TKycStatus,
    documents:[{
        type: TDocumentType
        storedPath:string,
        documentStatus:TKycStatus,
        verifiedAt:String,
        verifiedBy:String,
        rejectionReasong:string,
    }]
}