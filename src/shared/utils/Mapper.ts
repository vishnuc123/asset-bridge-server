import type { IUserDocument } from "../../infrastructure/database/models/user-schema";
import type { TGetUsers, TUserResponse } from "../types/AuthTypes";

export class Mapper {
    static UserMapper(user: IUserDocument): TUserResponse {
        // console.log("user from db",user)
        return {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            roles: user.roles,
            activeRole: user.activeRole,
            phone: user.phone,
            isBlocked: user.isBlocked,
            profileImage: user.profileImage as string ?? "",
            isVerified: user.isVerified,
            status: user.status,
            kycStatus: user.kycStatus,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            verificationReason: user.verificationReason ?? "",
        }
    }
    static GetUserMapper(users: IUserDocument[]): TGetUsers[] {
        return users.map((user) => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            activeRole: user.activeRole,
            status: user.status,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            kycStatus: user.kycStatus,
            profileImage: user.profileImage ?? "",
            gender: user.gender ?? "",
            dob: user.dob ?? "",
            nationality: user.nationality ?? "",
            address: user.address ?? "",
        }));
    }
}