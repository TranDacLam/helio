export class Feedback {
	id: number;
	name: string;
	phone: string;
	email: string;
	subject: string;
	message: string;
	rate: string;
	sent_date: Date;
	feedback_type: string;
	status: string;
	answer: string;
	created: Date;
}

export const Status = ['no_process', 'answered', 'moved'];