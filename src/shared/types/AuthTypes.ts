export type TUserData = {
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    isBlocked:boolean,
    status:TStatus
}
export type TRole = "user"|"admin"|"investor"|"vendor"
export type TStatus = "active"|"banned"|"pending"