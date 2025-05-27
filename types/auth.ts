enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    EVALUATOR = "EVALUATOR"
}

export interface IAuth{
    email?: string
    password?: string
}

export interface IAuthRegister extends IAuth{
    national_id?: string
    first_name?: string
    last_name?: string
    confirm_password?: string
    email?: string
}

export interface IUser extends IAuthRegister {
    id?: string
    role?: Role
    status?: boolean
}

