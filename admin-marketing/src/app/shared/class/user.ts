export class User {
    id: number;
    username: string;
    full_name: string;
    birth_date: string;
    email: string;
    phone: string;
    barcode: number;
    personal_id: string;
    address: string;
    country: string;
	city: string;
    image: string|any;
	password: string;
	role_user: string;
    username_mapping: string;
    date_mapping: string;
}

export const roles_user = ['System Admin', 'Manager', 'Author', 'Customer Care', 'Teller'];