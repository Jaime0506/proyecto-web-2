export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    EVALUATOR = "EVALUATOR",
}

export type IAuthUpdate = Pick<IUser, "status" | "role">;

export interface IAuth {
    email?: string;
    password?: string;
}

export interface IAuthRegister extends IAuth {
    national_id?: string;
    first_name?: string;
    last_name?: string;
    confirm_password?: string;
    email?: string;
    role?: Role;
}

export interface IUser extends IAuthRegister {
    id?: string;
    status?: boolean;
}

export interface IUserDB extends IUser {
    deleted?: boolean;
    status?: boolean;
}

export type IErrorRegister = IAuthRegister;
