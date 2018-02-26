export class Notification {
    id: number;
    subject: string;
    message: string;
    image: string|any;
    sub_url: string;
    category: number;
    sent_date: string;
    sent_user: string;
    is_QR_code: boolean;
    location: string;
    is_draft: boolean;
}