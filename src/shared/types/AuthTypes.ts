import type { TKycStatus } from "./commonTypes"

export type TUserData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isBlocked: boolean,
    status: TStatus
}
export type TUserResponse = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: TRole[],
    phone: string,
    isBlocked: boolean,
    profileImage: string,
    isVerified: boolean,
    status: TStatus,
    kycStatus: TKycStatus,
    emailVerified: boolean,
    phoneVerified: boolean
    verificationReason?: string,
}
export type TRole = "user" | "admin" | "investor" | "vendor"
export type TStatus = "active" | "banned" | "pending"