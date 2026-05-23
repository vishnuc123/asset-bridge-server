import type { TRole, TStatus } from "../../shared/types/AuthTypes";
import type { TKycStatus } from "../../shared/types/commonTypes";

export interface IUser {
    id:string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: TRole[],
    phone: string,
    isBlocked: boolean,
    profileImage?: string,
    isVerified: boolean,
    status:TStatus,
    kycStatus:TKycStatus,
    emailVerified:boolean,
    phoneVerified:boolean
    verificationReason?: string,
}