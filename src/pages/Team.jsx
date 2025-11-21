import { Users, GraduationCap, User } from "lucide-react";
import { users } from "../data/users";

export default function Team() {
	const students = users.filter((u) => u.role === "Student");
	const teachers = users.filter((u) => u.role === "Teacher");

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
							<Users className="w-10 h-10 text-red-600" />
							Our Team
						</h1>
						<p className="text-xl text-gray-600">
							Meet the students and teacher working on this project
						</p>
					</div>

					{teachers.length > 0 && (
						<div className="mb-12">
							<h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<GraduationCap className="w-6 h-6 text-red-600" />
								Teacher
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{teachers.map((teacher) => (
									<div
										key={teacher.id}
										className="page-card p-6 text-center transition-all"
									>
										<div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center text-4xl mx-auto mb-4">
											{teacher.avatar}
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-1">
											{teacher.name}
										</h3>
										<p className="text-red-600 font-medium mb-3">
											{teacher.role}
										</p>
										<p className="text-gray-600 text-sm">{teacher.bio}</p>
										<p className="text-gray-500 text-xs mt-3">
											{teacher.email}
										</p>
									</div>
								))}
							</div>
						</div>
					)}

					<div>
						<h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
							<User className="w-6 h-6 text-red-600" />
							Students
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{students.map((student) => (
								<div
									key={student.id}
									className="page-card p-6 text-center transition-all"
								>
									<div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center text-4xl mx-auto mb-4">
										{student.avatar}
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										{student.name}
									</h3>
									<p className="text-red-600 font-medium mb-3">
										{student.role}
									</p>
									<p className="text-gray-600 text-sm">{student.bio}</p>
									<p className="text-gray-500 text-xs mt-3">{student.email}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
