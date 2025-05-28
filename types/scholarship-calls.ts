export interface IScholarshipCall {
    id?: number;
    name: string;
    academic_period: string;
    start_date: string;
    end_date: string;
    created_by?: string;
}

export interface IScholarshipCallForm extends Omit<IScholarshipCall, 'id' | 'created_by'> {}

export interface IScholarshipCallResponse {
    error?: { message: string };
    success?: boolean;
    data?: IScholarshipCall | IScholarshipCall[];
} 