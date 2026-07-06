import type { TUserResponse } from "../../shared/types/AuthTypes";

export class UserDtos{
    static LoginUserDto(user:TUserResponse){
        return {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            roles:user.roles,
            activeRole:user.activeRole,
            status:user.status,
            
        }
    }
}