import { GenderType } from "../../enum/user.enum"

export interface IUserUpdate{
    
    fullName?: string

    UserName?: string

    gender?: GenderType;

    telephone?: string;

    address?: string
}