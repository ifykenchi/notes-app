import mongoose, { Schema, Model } from "mongoose";
import type { IUser } from "../interfaces/models.interfaces";

const userSchema: Schema = new Schema({
	fullName: { type: String },
	email: { type: String },
	password: { type: String },
	createdOn: { type: Date, default: new Date().getTime() },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
