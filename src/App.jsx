import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Blog from "./pages/Blog";
import Research from "./pages/Research";
import Videos from "./pages/Videos";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Team from "./pages/Team";

function AppContent() {
	const location = useLocation();
	const isChatPage = location.pathname === "/chat";

	return (
		<div className="min-h-screen flex flex-col app-bg">
			<Header />
			<main className="flex-1">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/calendar" element={<Calendar />} />
					<Route path="/blog" element={<Blog />} />
					<Route path="/research" element={<Research />} />
					<Route path="/videos" element={<Videos />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/login" element={<Login />} />
					<Route path="/team" element={<Team />} />
				</Routes>
			</main>
			{!isChatPage && <Footer />}
		</div>
	);
}

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
