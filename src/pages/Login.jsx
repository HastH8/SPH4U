import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { users } from "../data/users";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Please enter both email and password");
			return;
		}

		const user = users.find(
			(u) =>
				u.email.toLowerCase() === email.toLowerCase() && u.password === password
		);

		if (user) {
			localStorage.setItem(
				"currentUser",
				JSON.stringify({
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					avatar: user.avatar,
				})
			);
			navigate("/");
			window.location.reload();
		} else {
			setError("Invalid email or password");
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
							<LogIn className="w-10 h-10 text-red-600" />
							Login
						</h1>
						<p className="text-xl text-gray-600">Sign in to your account</p>
					</div>

					<div className="page-card p-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
									<AlertCircle className="w-5 h-5 flex-shrink-0" />
									<span className="text-sm">{error}</span>
								</div>
							)}

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											setError("");
										}}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
										placeholder="Enter your email"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="password"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											setError("");
										}}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
										placeholder="Enter your password"
										required
									/>
								</div>
							</div>

							<button
								type="submit"
								className="w-full btn-primary py-3 font-medium text-lg"
							>
								Sign In
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
