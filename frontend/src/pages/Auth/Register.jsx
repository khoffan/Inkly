import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import Swal from "sweetalert2";

export default function Register() {
	const [fname, setFname] = useState("");
	const [lname, setLname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isConfirm, setIsConfirm] = useState(false);
	const [message, setMessage] = useState("");

	const navigate = useNavigate();
	const { register, isLoading } = useAuthStore();

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!isConfirm) {
			Swal.fire({
				title: "Terms Required",
				text: "You must accept the terms entirely before proceeding.",
				icon: "warning",
				confirmButtonColor: "#000",
			});
			return;
		}

		setMessage("");
		const result = await register({
			first_name: fname,
			last_name: lname,
			email,
			password,
		});

		if (result.success) {
			navigate("/login");
		} else {
			setMessage(result.message);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				<div className="px-8 py-10">
					{/* Header */}
					<div className="text-center mb-8">
						<Link to="/" className="inline-block mb-6">
							<div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-serif font-bold italic text-3xl leading-none mx-auto">
								I
							</div>
						</Link>
						<h1 className="text-3xl font-serif tracking-tight text-gray-900 mb-2">Join Inkly.</h1>
						<p className="text-gray-500 text-sm">Create an account to start writing and reading stories.</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						
						<div className="flex gap-4">
							<div className="w-1/2">
								<label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
								<input
									type="text"
									className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
									value={fname}
									onChange={(e) => setFname(e.target.value)}
									required
								/>
							</div>
							<div className="w-1/2">
								<label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
								<input
									type="text"
									className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
									value={lname}
									onChange={(e) => setLname(e.target.value)}
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input
								type="email"
								className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
							<input
								type="password"
								className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<div className="flex items-center pt-2">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
								checked={isConfirm}
								onChange={() => setIsConfirm(!isConfirm)}
							/>
							<label htmlFor="terms" className="ml-2 block text-sm text-gray-600 cursor-pointer">
								I agree to the Terms of Service and Privacy Policy
							</label>
						</div>

						{message && (
							<p className="text-red-500 text-sm text-center py-2 bg-red-50 rounded-lg">{message}</p>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-black text-white rounded-full py-3.5 px-4 mt-4 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 transition-colors shadow-md"
						>
							{isLoading ? "Creating account..." : "Sign Up"}
						</button>
					</form>

					{/* Footer */}
					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link to="/login" className="text-green-600 font-medium hover:text-green-700 hover:underline transition-all">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
