import { Link } from "react-router-dom";
import {
	Calendar,
	FileText,
	Video,
	MessageCircle,
	Users,
	ArrowRight,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
							SPH4U Passion Project
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Exploring the frontiers of physics through research,
							collaboration, and innovation
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
						<Link
							to="/calendar"
							className="page-card p-6 transition-all group hover:scale-[1.01]"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
									<Calendar className="w-6 h-6 text-red-600" />
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Project Calendar
							</h3>
							<p className="text-gray-600">
								Track milestones and conference dates
							</p>
						</Link>

						<Link
							to="/blog"
							className="page-card p-6 transition-all group hover:scale-[1.01]"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
									<FileText className="w-6 h-6 text-red-600" />
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Blog Feed
							</h3>
							<p className="text-gray-600">
								Share updates and progress with the team
							</p>
						</Link>

						<Link
							to="/research"
							className="page-card p-6 transition-all group hover:scale-[1.01]"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
									<FileText className="w-6 h-6 text-red-600" />
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Research Papers
							</h3>
							<p className="text-gray-600">
								Upload and explore research documents
							</p>
						</Link>

						<Link
							to="/presentation"
							className="page-card p-6 transition-all group hover:scale-[1.01]"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
									<Video className="w-6 h-6 text-red-600" />
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Presentation
							</h3>
							<p className="text-gray-600">
								Run the full slideshow with visuals
							</p>
						</Link>

						<Link
							to="/chat"
							className="page-card p-6 transition-all group hover:scale-[1.01]"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
									<MessageCircle className="w-6 h-6 text-red-600" />
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Group Chat
							</h3>
							<p className="text-gray-600">
								Collaborate and communicate with your team
							</p>
						</Link>

						<Link
							to="/team"
							className="page-card p-6 transition-all group hover:scale-[1.01]"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
									<Users className="w-6 h-6 text-red-600" />
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Our Team
							</h3>
							<p className="text-gray-600">Meet the students and teacher</p>
						</Link>
					</div>

					<div className="page-card p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							About This Project
						</h2>
						<p className="text-gray-700 leading-relaxed">
							The SPH4U Passion Project is an opportunity for students to
							explore physics topics that interest them through independent
							research, experimentation, and collaboration. This platform serves
							as a hub for sharing progress, research findings, and connecting
							with peers and mentors throughout the project timeline.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
