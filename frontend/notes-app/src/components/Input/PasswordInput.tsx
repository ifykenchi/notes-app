import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import type { PasswordInputProps } from "../../interfaces/components";

const PasswordInput: React.FC<PasswordInputProps> = ({
	value,
	onChange,
	placeholder,
}) => {
	const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

	const toggleShowPassword = () => {
		setIsShowPassword(!isShowPassword);
	};

	return (
		<div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
			<input
				value={value}
				onChange={onChange}
				type={isShowPassword ? "text" : "password"}
				placeholder={placeholder || "Password"}
				className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
			/>

			{isShowPassword ? (
				<FaRegEye
					size={22}
					className='text-primary cursor-pointer'
					onClick={() => toggleShowPassword()}
				/>
			) : (
				<FaRegEyeSlash
					size={22}
					className='text-slate-400 cursor-pointer'
					onClick={() => toggleShowPassword()}
				/>
			)}
		</div>
	);
};

export default PasswordInput;
