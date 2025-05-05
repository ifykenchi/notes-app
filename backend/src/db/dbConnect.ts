import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
	throw new Error("Missing MONGO_URI environment variable");
}
const dataConfig: string = process.env.MONGO_URI;

async function connectDB(): Promise<void> {
	try {
		await mongoose.connect(dataConfig);
		console.log("Connected to MongoDB Atlas...");
	} catch (err: unknown) {
		console.log("Could not connect to MongoDB Atlas... ", err);
	}
}

export default connectDB;
