import type { IUser } from "../../core/models/user-models";

export type UserDataDto = Pick<IUser, "firstName" | "lastName" | "email" | "status" | "isBlocked" | "emailVerified" | "profileImage" | "kycStatus" | "roles">