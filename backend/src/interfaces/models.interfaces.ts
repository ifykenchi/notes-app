import { Document } from "mongoose";

export interface INote extends Document {
	title: string;
	content: string;
	tags: string[];
	isPinned: boolean;
	userId: string;
	createdOn: Date;
}

export interface IUser extends Document {
	fullName: string;
	email: string;
	password: string;
	createdOn: Date;
}
