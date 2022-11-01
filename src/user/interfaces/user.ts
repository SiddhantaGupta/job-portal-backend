import { BaseModel } from "@squareboat/nestjs-objection";

export interface IUserModel extends BaseModel {
    id: number;
    uuid: string;
    role: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    is_active: boolean;
}