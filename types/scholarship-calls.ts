import { Role } from "./auth";

export interface IUserBasic {
    national_id: string;
    first_name: string;
    last_name: string;
    role: Role;
    created_at: Date;
}

export interface IScholarshipCall {
    id?: number;
    name: string;
    academic_period: string;
    start_date: string;
    end_date: string;
    description?: string;
    guideline_document?: string;
    created_by?: string;
    users: IUserBasic;
}

export type IScholarshipCallForm = Omit<IScholarshipCall, "id" | "created_by">;

export interface IScholarshipCallResponse {
    error?: { message: string };
    success?: boolean;
    data?: IScholarshipCall | IScholarshipCall[];
}
