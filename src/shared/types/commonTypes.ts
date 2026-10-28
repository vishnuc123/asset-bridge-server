import type { IUser } from "../../core/models/user-models";

export type TKycStatus = "pending" | "verified" | "rejected"
export type TDocumentType = "passport"|"adhaar"|"selfie"
export type TUserRegistrationInput = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password' | 'roles' | "status" | "isBlocked"| "gender"|"nationality"|"address"|"dob">;
export type TOtpData = TUserRegistrationInput | { email: string } | { [key: string]: unknown }
