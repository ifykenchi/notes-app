import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Note from "../models/note.model";
import { hash, isMatch } from "../utils/hash";
import env from "../env";

interface IUser {
	_id: string;
	fullName: string;
	email: string;
	password: string;
	createdOn: Date;
}

declare global {
	namespace Express {
		interface Request {
			user?: {
				user: IUser;
			};
		}
	}
}

export const createAccount = async (req: Request, res: Response) => {
	const { fullName, email, password } = req.body;

	if (!fullName) {
		res.status(400).json({ error: true, message: "Full Name is required" });
		return;
	}

	if (!email) {
		res.status(400).json({ error: true, message: "Email is required" });
		return;
	}

	if (!password) {
		res.status(400).json({ error: true, message: "Password is required" });
		return;
	}

	const isUser = await User.findOne({ email: email });

	if (isUser) {
		res.json({
			error: true,
			message: "User already exists",
		});
		return;
	}

	const user = new User({
		fullName,
		email,
		password,
	});

	user.password = await hash(user.password);

	await user.save();

	if (!env.ACCESS_TOKEN_SECRET) {
		throw new Error("ACCESS_TOKEN_SECRET not configured");
	}

	const accessToken = jwt.sign({ user }, env.ACCESS_TOKEN_SECRET, {
		expiresIn: "36000m",
	});

	res.json({
		error: false,
		user,
		accessToken,
		message: "Registration Successful",
	});
	return;
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email) {
		res.status(400).json({ message: "Email is required" });
		return;
	}

	if (!password) {
		res.status(400).json({ message: "Password is required" });
		return;
	}

	const userInfo = await User.findOne({ email: email });

	if (!userInfo) {
		res.status(400).json({ message: "User not found" });
		return;
	}

	const validPassword = await isMatch(password, userInfo.password);

	if (!env.ACCESS_TOKEN_SECRET) {
		throw new Error("ACCESS_TOKEN_SECRET not configured");
	}

	if (userInfo.email == email && validPassword) {
		const user = { user: userInfo };
		const accessToken = jwt.sign(user, env.ACCESS_TOKEN_SECRET, {
			expiresIn: "36000m",
		});

		res.json({
			error: false,
			message: "Login Successful",
			email,
			accessToken,
		});
		return;
	} else {
		res.status(400).json({
			error: true,
			message: "Invalid Credentials",
		});
		return;
	}
};

export const getUser = async (req: Request, res: Response) => {
	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;

	const isUser = await User.findOne({ _id: user._id });

	if (!isUser) {
		res.sendStatus(401);
		return;
	}

	res.json({
		user: {
			fullName: isUser.fullName,
			email: isUser.email,
			_id: isUser._id,
			createdOn: isUser.createdOn,
		},
		message: "",
	});
	return;
};

export const addNote = async (req: Request, res: Response) => {
	const { title, content, tags } = req.body;

	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;

	if (!title) {
		res.status(400).json({ error: true, message: "Title is required" });
		return;
	}

	if (!content) {
		res.status(400).json({ error: true, message: "Content is required" });
		return;
	}

	try {
		const note = new Note({
			title,
			content,
			tags: tags || [],
			userId: user._id,
		});

		await note.save();

		res.json({
			error: false,
			note,
			message: "Note added successfully",
		});
		return;
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
		return;
	}
};

export const editNote = async (req: Request, res: Response) => {
	const noteId = req.params.noteId;
	const { title, content, tags, isPinned } = req.body;

	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;

	if (!title && !content && !tags) {
		res.status(400).json({ error: true, message: "No changes provided" });
		return;
	}

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			res.status(404).json({ error: true, message: "Note not found" });
			return;
		}

		if (title) note.title = title;
		if (content) note.content = content;
		if (tags) note.tags = tags;
		if (isPinned) note.isPinned = isPinned;

		await note.save();

		res.json({
			error: false,
			note,
			message: "Note updated successfully",
		});
		return;
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
		return;
	}
};

export const getAllNotes = async (req: Request, res: Response) => {
	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;

	try {
		const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

		res.json({
			error: false,
			notes,
			message: "All notes retrieved successfully",
		});
		return;
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
		return;
	}
};

export const deleteNote = async (req: Request, res: Response) => {
	const noteId = req.params.noteId;

	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			res.status(404).json({ error: true, message: "Note not found" });
			return;
		}

		await Note.deleteOne({ _id: noteId, userId: user._id });

		res.json({
			error: false,
			message: "Note deleted successfully",
		});
		return;
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
		return;
	}
};

export const updatePinnedNote = async (req: Request, res: Response) => {
	const noteId = req.params.noteId;
	const { isPinned } = req.body;

	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			res.status(404).json({ error: true, message: "Note not found" });
			return;
		}

		note.isPinned = isPinned;

		await note.save();

		res.json({
			error: false,
			note,
			message: "Note updated successfully",
		});
		return;
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
		return;
	}
};

export const searchNotes = async (
	req: Request<{}, {}, {}, { query: string }>,
	res: Response
) => {
	if (!req.user) {
		res.sendStatus(401);
		return;
	}

	const { user } = req.user;
	const { query } = req.query;

	if (!query) {
		res.status(400).json({ error: true, message: "Search query is required" });
		return;
	}

	try {
		const matchingNotes = await Note.find({
			userId: user._id,
			$or: [
				{ title: { $regex: new RegExp(query, "i") } },
				{ content: { $regex: new RegExp(query, "i") } },
			],
		});

		res.json({
			error: false,
			notes: matchingNotes,
			message: "Notes matching the search query retrieved successfully",
		});
		return;
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
		return;
	}
};
