import React, { useState } from "react";
import type { FormEvent } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { AxiosError } from "axios";

interface LoginResponse {
	accessToken?: string;
	message?: string;
}

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();

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
			const response = await axiosInstance.post<LoginResponse>("/login", {
				email: email,
				password: password,
			});

			if (response.data && response.data.accessToken) {
				localStorage.setItem("token", response.data.accessToken);
				navigate("/dashboard");
			}
		} catch (error) {
			const axiosError = error as AxiosError<LoginResponse>;
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
					<form onSubmit={handleLogin}>
						<h4 className='text-2xl mb-7'>Login</h4>

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
							Login
						</button>

						<p className='text-sm text-center mt-4'>
							Not registered yet?{" "}
							<Link to='/signup' className='font-medium text-primary underline'>
								Create an Account
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
