export interface IResponse {
	fullName: string;
	email: string;
	password: string;
}

export interface ILogin {
	email: string;
	password: string;
}

export interface IAddNote {
	title: string;
	content: string;
	tags: string[];
}
