export interface LoginResponse {
	accessToken?: string;
	message?: string;
}

export interface SignUpResponse {
	accessToken?: string;
	error?: boolean;
	message?: string;
}

export interface SignUpFormData {
	fullName: string;
	email: string;
	password: string;
}

export interface NoteData {
	_id?: string;
	title?: string;
	content?: string;
	tags?: string[];
}

export interface AddEditNotesProps {
	noteData?: NoteData | null;
	type: "add" | "edit";
	getAllNotes: () => void;
	onClose: () => void;
	showToastMessage: (message: string) => void;
}

export interface NoteResponse {
	error?: boolean;
	note?: any;
	message?: string;
}

export interface Note {
	_id: string;
	title: string;
	content: string;
	tags: string[];
	isPinned: boolean;
	createdOn: string;
}

export interface UserInfo {
	_id: string;
	fullName: string;
	email: string;
}

export interface AddEditModalState {
	isShown: boolean;
	type: "add" | "edit";
	data: Note | null;
}

export interface ToastState {
	isShown: boolean;
	message: string;
	type?: "add" | "edit" | "delete" | "pin";
}
