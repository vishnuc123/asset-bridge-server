import type { IUser } from "../../core/models/user-models";

export type TKycStatus = "pending" | "verified" | "rejected"
export type TUserRegistrationInput = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password' | 'roles' | "status" | "isBlocked">;
export type TOtpData = TUserRegistrationInput | { email: string } | { [key: string]: unknown }
