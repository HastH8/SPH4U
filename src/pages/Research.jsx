import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FileText,
	Upload,
	Download,
	X,
	Image as ImageIcon,
	File,
	Eye,
	EyeOff,
	LogIn,
} from "lucide-react";
import { researchPapers as initialPapers } from "../data/research";
import {
	subscribeToResearchPapers,
	addResearchPaper,
} from "../firebase/services";

export default function Research() {
	const [papers, setPapers] = useState([]);
	const [showUpload, setShowUpload] = useState(false);
	const navigate = useNavigate();

	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
	const isLoggedIn = !!currentUser;
	const [viewingPaper, setViewingPaper] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		author: "",
		description: "",
		content: "",
		file: null,
		filePreview: null,
		images: [],
	});

	// Subscribe to real-time research papers from Firebase
	useEffect(() => {
		const unsubscribe = subscribeToResearchPapers((firebasePapers) => {
			setPapers(firebasePapers.length > 0 ? firebasePapers : initialPapers);
		});

		return () => unsubscribe();
	}, []);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.type === "application/pdf") {
				setFormData({ ...formData, file, filePreview: null });
			} else if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setFormData({
						...formData,
						images: [...formData.images, reader.result],
					});
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setFormData({
						...formData,
						images: [...formData.images, reader.result],
					});
				};
				reader.readAsDataURL(file);
			}
		});
	};

	const removeImage = (index) => {
		setFormData({
			...formData,
			images: formData.images.filter((_, i) => i !== index),
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isLoggedIn) {
			navigate("/login");
			return;
		}
		const newPaper = {
			title: formData.title,
			author: formData.author || currentUser.name,
			description: formData.description,
			content: formData.content,
			file: formData.file ? formData.file.name : null,
			fileType: formData.file ? "PDF" : "Text",
			fileSize: formData.file
				? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB`
				: "N/A",
			images: formData.images,
			uploadDate: new Date().toISOString().split("T")[0],
			timestamp: new Date().toISOString(),
		};
		try {
			await addResearchPaper(newPaper);
			setFormData({
				title: "",
				author: "",
				description: "",
				content: "",
				file: null,
				filePreview: null,
				images: [],
			});
			setShowUpload(false);
		} catch (error) {
			console.error("Error uploading research paper:", error);
			alert("Failed to upload research paper. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
								<FileText className="w-10 h-10 text-red-600" />
								Research Papers
							</h1>
							<p className="text-xl text-gray-600">
								Upload and explore research documents
							</p>
						</div>
						<button
							onClick={() => {
								if (!isLoggedIn) {
									navigate("/login");
								} else {
									setShowUpload(true);
								}
							}}
							className="btn-primary flex items-center gap-2 font-medium px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
							disabled={!isLoggedIn}
						>
							<Upload className="w-5 h-5" />
							Upload Paper
						</button>
					</div>

					{!isLoggedIn && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3">
							<LogIn className="w-5 h-5 text-red-600 flex-shrink-0" />
							<div className="flex-1">
								<p className="text-sm text-red-700 font-medium">
									Please log in to upload research papers
								</p>
								<p className="text-xs text-red-600 mt-1">
									You need to be logged in to upload research documents.
								</p>
							</div>
							<button
								onClick={() => navigate("/login")}
								className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
							>
								Login
							</button>
						</div>
					)}

					{showUpload && (
						<div className="page-card p-4 sm:p-6 mb-8">
							<div className="flex items-center justify-between mb-4 gap-4">
								<h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
									Upload Research Paper
								</h2>
								<button
									onClick={() => {
										setShowUpload(false);
										setFormData({
											title: "",
											author: "",
											description: "",
											content: "",
											file: null,
											filePreview: null,
											images: [],
										});
									}}
									className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
								>
									<X className="w-5 h-5 sm:w-6 sm:h-6" />
								</button>
							</div>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Title
										</label>
										<input
											type="text"
											value={formData.title}
											onChange={(e) =>
												setFormData({ ...formData, title: e.target.value })
											}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Author
										</label>
										<input
											type="text"
											value={formData.author}
											onChange={(e) =>
												setFormData({ ...formData, author: e.target.value })
											}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											required
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
										rows="3"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Content / Abstract
									</label>
									<textarea
										value={formData.content}
										onChange={(e) =>
											setFormData({ ...formData, content: e.target.value })
										}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
										rows="8"
										placeholder="Enter the full research content, abstract, methodology, findings, etc..."
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Upload PDF File
										</label>
										<label className="cursor-pointer">
											<input
												type="file"
												accept="application/pdf"
												onChange={handleFileUpload}
												className="hidden"
											/>
											<div className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
												<File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
												<span className="text-xs sm:text-sm text-gray-700 truncate">
													{formData.file
														? formData.file.name
														: "Choose PDF file"}
												</span>
											</div>
										</label>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Upload Images/Diagrams
										</label>
										<label className="cursor-pointer">
											<input
												type="file"
												accept="image/*"
												multiple
												onChange={handleImageUpload}
												className="hidden"
											/>
											<div className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
												<ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
												<span className="text-xs sm:text-sm text-gray-700">
													Add Images
												</span>
											</div>
										</label>
									</div>
								</div>
								{formData.images.length > 0 && (
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
										{formData.images.map((img, index) => (
											<div key={index} className="relative">
												<img
													src={img}
													alt={`Upload ${index + 1}`}
													className="w-full h-32 object-cover rounded-lg"
												/>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
												>
													<X className="w-3 h-3" />
												</button>
											</div>
										))}
									</div>
								)}
								<div className="flex gap-3">
									<button
										type="submit"
										className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
									>
										Upload
									</button>
									<button
										type="button"
										onClick={() => {
											setShowUpload(false);
											setFormData({
												title: "",
												author: "",
												description: "",
												content: "",
												file: null,
												filePreview: null,
												images: [],
											});
										}}
										className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
						{papers.map((paper) => (
							<div
								key={paper.id}
								className="page-card p-4 sm:p-6 transition-all"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="bg-red-100 p-3 rounded-lg">
										<FileText className="w-6 h-6 text-red-600" />
									</div>
									<span className="text-sm text-gray-500">
										{formatDate(paper.uploadDate)}
									</span>
								</div>
								<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">
									{paper.title}
								</h3>
								<p className="text-xs sm:text-sm text-gray-600 mb-3">
									By {paper.author}
								</p>
								<p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-3 break-words">
									{paper.description}
								</p>
								{paper.images && paper.images.length > 0 && (
									<div className="mb-4">
										<img
											src={paper.images[0]}
											alt="Research diagram"
											className="w-full h-32 object-cover rounded-lg"
										/>
									</div>
								)}
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
									<span className="text-xs sm:text-sm text-gray-500">
										{paper.fileType} {paper.fileSize && `• ${paper.fileSize}`}
									</span>
									<div className="flex gap-2 w-full sm:w-auto">
										<button
											onClick={() => setViewingPaper(paper)}
											className="flex-1 sm:flex-none bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
										>
											<Eye className="w-3 h-3 sm:w-4 sm:h-4" />
											View
										</button>
										{paper.file && (
											<button className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
												<Download className="w-3 h-3 sm:w-4 sm:h-4" />
												Download
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{viewingPaper && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
					<div className="bg-white rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto card-shadow">
						<div className="flex items-start justify-between mb-4 gap-4">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 break-words flex-1">
								{viewingPaper.title}
							</h2>
							<button
								onClick={() => setViewingPaper(null)}
								className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
							>
								<X className="w-5 h-5 sm:w-6 sm:h-6" />
							</button>
						</div>
						<div className="space-y-4">
							<div>
								<p className="text-sm text-gray-600">
									By {viewingPaper.author}
								</p>
								<p className="text-sm text-gray-500">
									{formatDate(viewingPaper.uploadDate)}
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
									Description
								</h3>
								<p className="text-gray-700 text-sm sm:text-base break-words">
									{viewingPaper.description}
								</p>
							</div>
							{viewingPaper.content && (
								<div>
									<h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
										Content
									</h3>
									<div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base break-words overflow-x-auto">
										{viewingPaper.content}
									</div>
								</div>
							)}
							{viewingPaper.images && viewingPaper.images.length > 0 && (
								<div>
									<h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
										Images & Diagrams
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										{viewingPaper.images.map((img, index) => (
											<div key={index} className="relative">
												<img
													src={img}
													alt={`Diagram ${index + 1}`}
													className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
													onClick={() => window.open(img, "_blank")}
												/>
											</div>
										))}
									</div>
								</div>
							)}
							{viewingPaper.file && (
								<div>
									<h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
										Attached File
									</h3>
									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-3 rounded-lg">
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<File className="w-5 h-5 text-gray-600 flex-shrink-0" />
											<span className="text-gray-700 text-sm sm:text-base truncate">
												{viewingPaper.file}
											</span>
										</div>
										<button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
											<Download className="w-4 h-4" />
											Download
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
