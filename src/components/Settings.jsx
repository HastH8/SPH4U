import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2 } from "lucide-react";

export default function Settings({ onClose }) {
	const [logoPreview, setLogoPreview] = useState(null);
	const [faviconPreview, setFaviconPreview] = useState(null);
	const logoRef = useRef(null);
	const faviconRef = useRef(null);

	useEffect(() => {
		const storedLogo = localStorage.getItem("schoolLogo");
		const storedFavicon = localStorage.getItem("faviconData");
		if (storedLogo) setLogoPreview(storedLogo);
		if (storedFavicon) setFaviconPreview(storedFavicon);
	}, []);

	const readFile = (file, cb) => {
		const reader = new FileReader();
		reader.onload = (ev) => cb(ev.target.result);
		reader.readAsDataURL(file);
	};

	const handleLogo = (e) => {
		const f = e.target.files && e.target.files[0];
		if (!f) return;
		readFile(f, (data) => {
			setLogoPreview(data);
			try {
				localStorage.setItem("schoolLogo", data);
			} catch (err) {}
		});
	};

	const handleFavicon = (e) => {
		const f = e.target.files && e.target.files[0];
		if (!f) return;
		readFile(f, (data) => {
			setFaviconPreview(data);
			try {
				localStorage.setItem("faviconData", data);
			} catch (err) {}
			const link =
				document.getElementById("site-favicon") ||
				document.querySelector("link[rel*='icon']");
			if (link) link.href = data;
			else {
				const l = document.createElement("link");
				l.id = "site-favicon";
				l.rel = "icon";
				l.href = data;
				document.head.appendChild(l);
			}
		});
	};

	const resetLogo = () => {
		localStorage.removeItem("schoolLogo");
		setLogoPreview(null);
	};

	const resetFavicon = () => {
		localStorage.removeItem("faviconData");
		setFaviconPreview(null);
		const link =
			document.getElementById("site-favicon") ||
			document.querySelector("link[rel*='icon']");
		if (link) link.href = "/favicon.svg";
	};

	return (
		<div className="fixed inset-0 modal-backdrop flex items-center justify-center z-60 p-4">
			<div className="w-full max-w-lg bg-white page-card p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold">Site Settings</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School Logo
						</label>
						<div className="flex items-center gap-3">
							<div className="w-20 h-20 rounded-lg overflow-hidden border flex items-center justify-center">
								{logoPreview ? (
									<img
										src={logoPreview}
										alt="logo"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="text-red-600">No logo</div>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<input
									ref={logoRef}
									type="file"
									accept="image/*"
									onChange={handleLogo}
									className="hidden"
								/>
								<button
									onClick={() => logoRef.current && logoRef.current.click()}
									className="btn-primary flex items-center gap-2"
								>
									<Upload className="w-4 h-4" /> Upload
								</button>
								<button
									onClick={resetLogo}
									className="text-sm text-red-600 flex items-center gap-2"
								>
									<Trash2 className="w-4 h-4" /> Reset
								</button>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Favicon
						</label>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded overflow-hidden border flex items-center justify-center">
								{faviconPreview ? (
									<img
										src={faviconPreview}
										alt="favicon"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="text-red-600">favicon</div>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<input
									ref={faviconRef}
									type="file"
									accept="image/*,image/svg+xml"
									onChange={handleFavicon}
									className="hidden"
								/>
								<button
									onClick={() =>
										faviconRef.current && faviconRef.current.click()
									}
									className="btn-primary flex items-center gap-2"
								>
									<Upload className="w-4 h-4" /> Upload
								</button>
								<button
									onClick={resetFavicon}
									className="text-sm text-red-600 flex items-center gap-2"
								>
									<Trash2 className="w-4 h-4" /> Reset
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
