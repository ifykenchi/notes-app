import type { ChangeEvent } from "react";

export interface NoteCardProps {
	title: string;
	date: string | Date;
	content: string;
	tags: string[];
	isPinned: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onPinNote: () => void;
}

export interface UserInfo {
	_id: string;
	fullName: string;
	email: string;
}

export interface ProfileInfoProps {
	userInfo: UserInfo | null;
	onLogout: () => void;
}

export interface EmptyCardProps {
	imgSrc: string;
	message: string;
}

export interface PasswordInputProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
}

export interface TagInputProps {
	tags: string[];
	setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface UserInfo {
	_id: string;
	fullName: string;
	email: string;
}

export interface NavbarProps {
	userInfo: UserInfo | null;
	onSearchNote: (query: string) => void;
	handleClearSearch: () => void;
}

export interface SearchBarProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleSearch: () => void;
	onClearSearch: () => void;
}

type ToastType = "success" | "delete" | "add" | "edit" | "pin" | undefined;

export interface ToastProps {
	isShown: boolean;
	message: string;
	type: ToastType;
	onClose: () => void;
}
