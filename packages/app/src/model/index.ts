export class Message {
	id: number;
	receiver: string;
	sender: string;
	timestamp: any;
	status: "pending" | "sent" | "deleted";
	content?: string;
}

export class Contact {
	address: string;
}

export class ContactMessageStatus {
	sender: string;
	messages: number;
}
