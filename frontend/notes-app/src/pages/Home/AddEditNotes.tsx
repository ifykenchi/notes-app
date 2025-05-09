import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { AxiosError } from "axios";

interface NoteData {
	_id?: string;
	title?: string;
	content?: string;
	tags?: string[];
}

interface AddEditNotesProps {
	noteData?: NoteData | null;
	type: "add" | "edit";
	getAllNotes: () => void;
	onClose: () => void;
	showToastMessage: (message: string) => void;
}

interface NoteResponse {
	error?: boolean;
	note?: any;
	message?: string;
}

const AddEditNotes: React.FC<AddEditNotesProps> = ({
	noteData,
	type,
	getAllNotes,
	onClose,
	showToastMessage,
}) => {
	const [title, setTitle] = useState<string>(noteData?.title || "");
	const [content, setContent] = useState<string>(noteData?.content || "");
	const [tags, setTags] = useState<string[]>(noteData?.tags || []);
	const [error, setError] = useState<string | null>(null);

	// Add Note
	const addNewNote = async () => {
		try {
			const response = await axiosInstance.post<NoteResponse>("/add-note", {
				title,
				content,
				tags,
			});

			if (response.data && response.data.note) {
				showToastMessage("Note added successfully");
				getAllNotes();
				onClose();
			}
		} catch (error) {
			const axiosError = error as AxiosError<NoteResponse>;
			if (
				axiosError.response &&
				axiosError.response.data &&
				axiosError.response.data.message
			) {
				setError(axiosError.response.data.message);
			}
		}
	};

	// Edit Note
	const editNote = async () => {
		if (!noteData?._id) return;
		const noteId = noteData._id;

		try {
			const response = await axiosInstance.put<NoteResponse>(
				"/edit-note/" + noteId,
				{
					title,
					content,
					tags,
				}
			);

			if (response.data && response.data.note) {
				showToastMessage("Note Updated successfully");
				getAllNotes();
				onClose();
			}
		} catch (error) {
			const axiosError = error as AxiosError<NoteResponse>;
			if (
				axiosError.response &&
				axiosError.response.data &&
				axiosError.response.data.message
			) {
				setError(axiosError.response.data.message);
			}
		}
	};

	const handleAddNote = () => {
		if (!title) {
			setError("Please enter the title");
			return;
		}

		if (!content) {
			setError("Please enter the content");
			return;
		}

		setError("");

		if (type === "edit") {
			editNote();
		} else {
			addNewNote();
		}
	};

	return (
		<div className='relative'>
			<button
				className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
				onClick={onClose}
			>
				<MdClose className='text-xl text-slate-400' />
			</button>

			<div className='flex flex-col gap-2'>
				<label className='input-label'>TITLE</label>
				<input
					type='text'
					className='text-2xl text-slate-950 outline-none'
					placeholder='Go To Gym At 5'
					value={title}
					onChange={({ target }) => setTitle(target.value)}
				/>
			</div>

			<div className='flex flex-col gap-2 mt-4'>
				<label className='input-label'>CONTENT</label>
				<textarea
					className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
					placeholder='Content'
					rows={10}
					value={content}
					onChange={({ target }) => setContent(target.value)}
				/>
			</div>

			<div className='mt-3'>
				<label className='input-label'>TAGS</label>
				<TagInput tags={tags} setTags={setTags} />
			</div>

			{error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

			<button
				className='btn-primary font-medium mt-5 p-3'
				onClick={handleAddNote}
			>
				{type === "edit" ? "UPDATE" : "ADD"}
			</button>
		</div>
	);
};

export default AddEditNotes;
