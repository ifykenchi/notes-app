import React, { useState } from "react";
import type { ChangeEvent } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import type { NavbarProps } from "../../interfaces/components";

const Navbar: React.FC<NavbarProps> = ({
	userInfo,
	onSearchNote,
	handleClearSearch,
}) => {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const navigate = useNavigate();

	const onLogout = (): void => {
		localStorage.clear();
		navigate("/login");
	};

	const handleSearch = (): void => {
		if (searchQuery) {
			onSearchNote(searchQuery);
		}
	};

	const onClearSearch = (): void => {
		setSearchQuery("");
		handleClearSearch();
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
			<h2 className='text-xl font-medium text-black py-2'>Notes</h2>

			<SearchBar
				value={searchQuery}
				onChange={handleInputChange}
				handleSearch={handleSearch}
				onClearSearch={onClearSearch}
			/>

			<ProfileInfo userInfo={userInfo} onLogout={onLogout} />
		</div>
	);
};

export default Navbar;
