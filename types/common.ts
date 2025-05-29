export interface IResponse {
    error?: { message: string };
    success?: boolean;
}

export interface IResponseRegisterUser extends IResponse {
    password?: string;
}
