import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	GraduationCap,
	Menu,
	X,
	LogOut,
	Settings as SettingsIcon,
} from "lucide-react";
import Settings from "./Settings";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [logo, setLogo] = useState(null);
	const logoInputRef = useRef(null);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// load custom logo and favicon from localStorage (if any)
		const storedLogo = localStorage.getItem("schoolLogo");
		if (storedLogo) setLogo(storedLogo);
		const storedFavicon = localStorage.getItem("faviconData");
		if (storedFavicon) {
			const link =
				document.getElementById("site-favicon") ||
				document.querySelector("link[rel*='icon']");
			if (link) link.href = storedFavicon;
		}

		const checkLoginStatus = () => {
			const currentUser = localStorage.getItem("currentUser");
			setIsLoggedIn(!!currentUser);
		};

		checkLoginStatus();
		window.addEventListener("storage", checkLoginStatus);

		return () => window.removeEventListener("storage", checkLoginStatus);
	}, [location]);

	const setFavicon = (dataUrl) => {
		const link =
			document.getElementById("site-favicon") ||
			document.querySelector("link[rel*='icon']");
		if (link) {
			link.href = dataUrl;
		} else {
			const l = document.createElement("link");
			l.id = "site-favicon";
			l.rel = "icon";
			l.type = "image/png";
			l.href = dataUrl;
			document.head.appendChild(l);
		}
	};

	const handleLogoUpload = (e) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const dataUrl = ev.target.result;
			setLogo(dataUrl);
			try {
				localStorage.setItem("schoolLogo", dataUrl);
			} catch (err) {}
		};
		reader.readAsDataURL(file);
	};

	// favicon uploads handled via Settings modal

	const handleSignOut = () => {
		localStorage.removeItem("currentUser");
		setIsLoggedIn(false);
		navigate("/");
		window.location.reload();
	};

	const isActive = (path) => location.pathname === path;

	return (
		<header className="glass-nav sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link to="/" className="flex items-center space-x-3 group">
						<div className="relative">
							<div
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										logoInputRef.current && logoInputRef.current.click();
									}
								}}
								onClick={(e) => {
									// prevent navigating when opening upload picker
									e.preventDefault();
									e.stopPropagation();
									logoInputRef.current && logoInputRef.current.click();
								}}
								className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center border cursor-pointer"
								style={{ borderColor: "rgba(0,0,0,0.06)" }}
								title="Click to change school logo"
							>
								{logo ? (
									<img
										src={logo}
										alt="School logo"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-[#c62828]">
										<GraduationCap className="w-6 h-6 text-white" />
									</div>
								)}
							</div>

							<input
								ref={logoInputRef}
								type="file"
								accept="image/*"
								onChange={handleLogoUpload}
								className="hidden"
							/>
						</div>

						<div className="flex flex-col">
							<span className="text-lg font-semibold text-gray-900">
								Thomas L. Kennedy
							</span>
							<span className="text-xs text-gray-600">
								SPH4U Passion Project
							</span>
						</div>
					</Link>

					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/"
							className={`font-medium transition-colors ${
								isActive("/")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Home
						</Link>
						<Link
							to="/calendar"
							className={`font-medium transition-colors ${
								isActive("/calendar")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Calendar
						</Link>
						<Link
							to="/blog"
							className={`font-medium transition-colors ${
								isActive("/blog")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Blog
						</Link>
						<Link
							to="/research"
							className={`font-medium transition-colors ${
								isActive("/research")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Research
						</Link>
						<Link
							to="/presentation"
							className={`font-medium transition-colors ${
								isActive("/presentation")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Presentation
						</Link>
						<Link
							to="/chat"
							className={`font-medium transition-colors ${
								isActive("/chat")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Chat
						</Link>
						<Link
							to="/team"
							className={`font-medium transition-colors ${
								isActive("/team")
									? "text-red-600 border-b-2 border-red-600 pb-1"
									: "text-gray-700 hover:text-red-600"
							}`}
						>
							Team
						</Link>
						{isLoggedIn ? (
							<button
								onClick={handleSignOut}
								className="bg-[var(--brand-red)] text-white px-4 py-2 rounded-lg hover:bg-[var(--brand-red-600)] transition-colors font-medium flex items-center gap-2"
							>
								<LogOut className="w-4 h-4" />
								Sign Out
							</button>
						) : (
							<Link
								to="/login"
								className="bg-[var(--brand-red)] text-white px-4 py-2 rounded-lg hover:bg-[var(--brand-red-600)] transition-colors font-medium"
							>
								Login
							</Link>
						)}
					</nav>

					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
					>
						{mobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{mobileMenuOpen && (
					<nav className="md:hidden py-4 border-t border-gray-200">
						<div className="flex flex-col space-y-3">
							<Link
								to="/"
								className={`font-medium transition-colors pl-2 ${
									isActive("/")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Home
							</Link>
							<Link
								to="/calendar"
								className={`font-medium transition-colors pl-2 ${
									isActive("/calendar")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Calendar
							</Link>
							<Link
								to="/blog"
								className={`font-medium transition-colors pl-2 ${
									isActive("/blog")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Blog
							</Link>
							<Link
								to="/research"
								className={`font-medium transition-colors pl-2 ${
									isActive("/research")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Research
							</Link>
							<Link
								to="/presentation"
								className={`font-medium transition-colors pl-2 ${
									isActive("/presentation")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Presentation
							</Link>
							<Link
								to="/chat"
								className={`font-medium transition-colors pl-2 ${
									isActive("/chat")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Chat
							</Link>
							<Link
								to="/team"
								className={`font-medium transition-colors pl-2 ${
									isActive("/team")
										? "text-red-600 border-l-4 border-red-600"
										: "text-gray-700 hover:text-red-600"
								}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								Team
							</Link>
							{isLoggedIn ? (
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										handleSignOut();
									}}
									className="bg-[var(--brand-red)] text-white px-4 py-2 rounded-lg hover:bg-[var(--brand-red-600)] transition-colors font-medium text-center flex items-center justify-center gap-2"
								>
									<LogOut className="w-4 h-4" />
									Sign Out
								</button>
							) : (
								<Link
									to="/login"
									className="bg-[var(--brand-red)] text-white px-4 py-2 rounded-lg hover:bg-[var(--brand-red-600)] transition-colors font-medium text-center"
									onClick={() => setMobileMenuOpen(false)}
								>
									Login
								</Link>
							)}
						</div>
					</nav>
				)}

				{/* Settings button */}
				{/* <div className="hidden md:flex items-center gap-3">
					<button
						onClick={() => setSettingsOpen(true)}
						className="text-gray-600 hover:text-[var(--brand-red)] transition-colors p-2 rounded-md"
						title="Site settings"
					>
						<SettingsIcon className="w-5 h-5" />
					</button>
				</div>
				{settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />} */}
			</div>
		</header>
	);
}
