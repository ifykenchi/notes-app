import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { AxiosError } from "axios";

interface SignUpResponse {
	accessToken?: string;
	error?: boolean;
	message?: string;
}

interface SignUpFormData {
	fullName: string;
	email: string;
	password: string;
}

const SignUp: React.FC = () => {
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleSignUp = async (e: FormEvent) => {
		e.preventDefault();

		if (!name) {
			setError("Please enter your name.");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		if (!password) {
			setError("Please enter the password.");
			return;
		}

		setError("");

		try {
			const formData: SignUpFormData = {
				fullName: name,
				email,
				password,
			};

			const response = await axiosInstance.post("/create-account", formData);

			if (response.data && response.data.error) {
				setError(response.data.message);
				return;
			}

			if (response.data && response.data.accessToken) {
				localStorage.setItem("token", response.data.accessToken);
				navigate("/dashboard");
			}
		} catch (error) {
			const axiosError = error as AxiosError<SignUpResponse>;
			if (
				axiosError.response &&
				axiosError.response.data &&
				axiosError.response.data.message
			) {
				setError(axiosError.response.data.message);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<>
			<Navbar
				userInfo={{ _id: "", fullName: "", email: "" }}
				onSearchNote={() => {}}
				handleClearSearch={() => {}}
			/>

			<div className='flex items-center justify-center mt-28'>
				<div className='w-96 border rounded bg-white px-7 py-10'>
					<form onSubmit={handleSignUp}>
						<h4 className='text-2xl mb-7'>SignUp</h4>

						<input
							type='text'
							placeholder='Name'
							className='input-box'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<input
							type='text'
							placeholder='Email'
							className='input-box'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<PasswordInput
							value={password}
							onChange={(e: any) => setPassword(e.target.value)}
						/>

						{error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

						<button type='submit' className='btn-primary'>
							Create Account
						</button>

						<p className='text-sm text-center mt-4'>
							Already have an account?{" "}
							<Link to='/login' className='font-medium text-primary underline'>
								Login
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
};

export default SignUp;
