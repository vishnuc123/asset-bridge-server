import type { IUser } from "../../core/models/user-models";
import type { TGetUsers } from "../types/AuthTypes";

export interface IPaginationResult{
    userDetails:TGetUsers[] | null
    pageDetails:{
        totalDocuments:number,
        page:number,
        limit:number,
        totalPages:number,
    }
}