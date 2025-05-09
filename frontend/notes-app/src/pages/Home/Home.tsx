import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-notes.svg";
import NoDataImg from "../../assets/images/no-data.svg";
import { AxiosError } from "axios";

interface Note {
	_id: string;
	title: string;
	content: string;
	tags: string[];
	isPinned: boolean;
	createdOn: string;
}

interface UserInfo {
	_id: string;
	fullName: string;
	email: string;
}

interface AddEditModalState {
	isShown: boolean;
	type: "add" | "edit";
	data: Note | null;
}

interface ToastState {
	isShown: boolean;
	message: string;
	type?: "add" | "edit" | "delete" | "pin";
}

const Home: React.FC = () => {
	const [openAddEditModal, setOpenAddEditModal] = useState<AddEditModalState>({
		isShown: false,
		type: "add",
		data: null,
	});

	const [showToastMsg, setShowToastMsg] = useState<ToastState>({
		isShown: false,
		message: "",
		type: "add",
	});

	const [allNotes, setAllNotes] = useState<Note[]>([]);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [isSearch, setIsSearch] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleEdit = (noteDetails: Note) => {
		setOpenAddEditModal({
			isShown: true,
			data: noteDetails,
			type: "edit",
		});
	};

	const showToastMessage = (message: string, type?: ToastState["type"]) => {
		setShowToastMsg({
			isShown: true,
			message,
			type,
		});
	};

	const handleCloseToast = () => {
		setShowToastMsg({
			isShown: false,
			message: "",
			type: "add",
		});
	};

	const getUserInfo = async () => {
		try {
			const response = await axiosInstance.get<{ user: UserInfo }>("/get-user");
			if (response.data && response.data.user) {
				setUserInfo(response.data.user);
			}
		} catch (error) {
			const axiosError = error as AxiosError;
			if (axiosError.response?.status === 401) {
				localStorage.clear();
				navigate("/login");
			}
		}
	};

	const getAllNotes = async () => {
		try {
			const response = await axiosInstance.get<{ notes: Note[] }>(
				"/get-all-notes"
			);

			if (response.data && response.data.notes) {
				setAllNotes(response.data.notes);
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.", error);
		}
	};

	const deleteNote = async (data: Note) => {
		const noteId = data._id;

		try {
			const response = await axiosInstance.delete<{
				error?: boolean;
				message?: string;
			}>("/delete-note/" + noteId);

			if (response.data && !response.data.error) {
				showToastMessage("Note Deleted successfully", "delete");
				getAllNotes();
			}
		} catch (error) {
			const axiosError = error as AxiosError;
			if (
				axiosError.response &&
				axiosError.response.data //&&
				//axiosError.response.data.message
			) {
				console.log("An unexpected error occurred. Please try again.");
			}
		}
	};

	const onSearchNote = async (query: string) => {
		try {
			const response = await axiosInstance.get<{ notes: Note[] }>(
				"/search-notes",
				{
					params: { query },
				}
			);

			if (response.data && response.data.notes) {
				setIsSearch(true);
				setAllNotes(response.data.notes);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateIsPinned = async (noteData: Note) => {
		const noteId = noteData._id;

		try {
			const response = await axiosInstance.put<{ note: Note }>(
				"/update-note-pinned/" + noteId,
				{
					isPinned: !noteData.isPinned,
				}
			);

			if (response.data && response.data.note) {
				showToastMessage("Note Updated successfully");
				getAllNotes();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleClearSearch = () => {
		setIsSearch(false);
		getAllNotes();
	};

	useEffect(() => {
		getAllNotes();
		getUserInfo();
		return () => {};
	}, []);

	return (
		<>
			<Navbar
				userInfo={userInfo}
				onSearchNote={onSearchNote}
				handleClearSearch={handleClearSearch}
			/>

			<div className='container mx-auto'>
				{allNotes.length > 0 ? (
					<div className='grid grid-cols-3 gap-4 mt-8'>
						{allNotes.map((item) => (
							<NoteCard
								key={item._id}
								title={item.title}
								date={item.createdOn}
								content={item.content}
								tags={item.tags}
								isPinned={item.isPinned}
								onEdit={() => handleEdit(item)}
								onDelete={() => deleteNote(item)}
								onPinNote={() => updateIsPinned(item)}
							/>
						))}
					</div>
				) : (
					<EmptyCard
						imgSrc={isSearch ? NoDataImg : AddNotesImg}
						message={
							isSearch
								? "Oops! No notes found matching your search."
								: "Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started!"
						}
					/>
				)}
			</div>

			<button
				className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
				onClick={() => {
					setOpenAddEditModal({
						isShown: true,
						type: "add",
						data: null,
					});
				}}
			>
				<MdAdd className='text-[32px] text-white' />
			</button>

			<Modal
				isOpen={openAddEditModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: "rgba(0,0,0,0.2)",
					},
				}}
				contentLabel=''
				className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll'
			>
				<AddEditNotes
					type={openAddEditModal.type}
					noteData={openAddEditModal.data}
					onClose={() => {
						setOpenAddEditModal({
							isShown: false,
							type: "add",
							data: null,
						});
					}}
					getAllNotes={getAllNotes}
					showToastMessage={showToastMessage}
				/>
			</Modal>

			<Toast
				isShown={showToastMsg.isShown}
				message={showToastMsg.message}
				type={showToastMsg.type}
				onClose={handleCloseToast}
			/>
		</>
	);
};

export default Home;
