import dotenv from "dotenv";
import express, { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import dbConnect from "../db/dbConnect";
import {
	createAccount,
	login,
	getUser,
	addNote,
	editNote,
	getAllNotes,
	deleteNote,
	updatePinnedNote,
	searchNotes,
} from "../controllers/crud";

const router: Router = express.Router();

dotenv.config();
dbConnect();

router.get("/", (req, res) => {
	res.send("<h1>Server is running...</h1>");
});

router.post("/create-account", createAccount);

router.post("/login", login);

router.get("/get-user", authenticateToken, getUser);

router.post("/add-note", authenticateToken, addNote);

router.put("/edit-note/:noteId", authenticateToken, editNote);

router.get("/get-all-notes/", authenticateToken, getAllNotes);

router.delete("/delete-note/:noteId", authenticateToken, deleteNote);

router.put("/update-note-pinned/:noteId", authenticateToken, updatePinnedNote);

router.get("/search-notes/", authenticateToken, searchNotes);

export default router;
