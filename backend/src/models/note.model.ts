import mongoose, { Schema, Document, Model } from "mongoose";

interface INote extends Document {
	title: string;
	content: string;
	tags: string[];
	isPinned: boolean;
	userId: string;
	createdOn: Date;
}

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
