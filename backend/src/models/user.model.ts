import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
	fullName: string;
	email: string;
	password: string;
	createdOn: Date;
}

const userSchema: Schema = new Schema({
	fullName: { type: String },
	email: { type: String },
	password: { type: String },
	createdOn: { type: Date, default: new Date().getTime() },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
