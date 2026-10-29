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
    activeRole:string,
    phone: string,
    isBlocked: boolean,
    profileImage?: string,
    isVerified: boolean,
    status: TStatus,
    kycStatus: TKycStatus,
    emailVerified: boolean,
    phoneVerified: boolean
    verificationReason?: string,
    gender?:string,
    nationality?:string,
    dob?:string,
    address?:string
}
export type TloginResponse = {
    id: string
    firstName: string,
    lastName: string
    email: string
    roles: TRole[]
    status: string
}
export type TRole = "user" | "admin" | "investor" | "vendor"
export type TStatus = "active" | "banned" | "pending"

export interface TGetUsers {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: TRole[];
  activeRole: TRole;
  status: TStatus;
  isVerified: boolean;
  isBlocked: boolean;
  kycStatus?: TKycStatus;
  profileImage?: string;
  gender:string,
  dob:string|Date,
  address:string,
  nationality:string
}