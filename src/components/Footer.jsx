import { Heart } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-white border-t mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="text-gray-600 text-sm mb-4 md:mb-0">
						<p>© 2025 Thomas L. Kennedy Secondary School</p>
						<p className="mt-1">SPH4U Passion Project</p>
					</div>
					<div className="flex items-center space-x-2 text-gray-600 text-sm">
						<span>Made by Hast Khalil</span>
						<Heart className="w-4 h-4 text-[var(--brand-red)]" />
					</div>
				</div>
			</div>
		</footer>
	);
}
