import mongoose, { Schema, Model } from "mongoose";

import type { INote } from "../interfaces/models.interfaces";

const noteSchema: Schema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	tags: { type: [String], default: [] },
	isPinned: { type: Boolean, default: false },
	userId: { type: String, required: true },
	createdOn: { type: Date, default: new Date().getTime() },
});

const Note: Model<INote> = mongoose.model<INote>("Note", noteSchema);

export default Note;
