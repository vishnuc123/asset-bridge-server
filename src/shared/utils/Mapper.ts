import type { IUserDocument } from "../../infrastructure/database/models/user-schema";
import type { TUserResponse } from "../types/AuthTypes";

export class Mapper {
    static UserMapper(user: IUserDocument): TUserResponse {
        // console.log("user from db",user)
        return {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password:user.password,
            roles: user.roles,
            activeRole:user.activeRole,
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
}