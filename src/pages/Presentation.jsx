import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import {
	subscribeToPresentationDeck,
	savePresentationDeck,
} from "../firebase/services";

const LOCAL_BACKUP_KEY = "presentationSlidesBackupV1";
const SAVE_DEBOUNCE_MS = 600;

const defaultSlides = [
	{
		id: "intro",
		layout: "title",
		title: "Smart Physics Car",
		subtitle: "SPH4U Passion Project",
		speaker: "All",
		tags: ["Design", "Physics", "Coding"],
	},
	{
		id: "why",
		layout: "split",
		title: "Why we built it",
		subtitle: "Make physics visible with live data",
		speaker: "All",
		bullets: [
			"Turn motion into graphs we can explain in class",
			"Test real forces instead of only equations",
			"Connect hardware, software, and physics together",
		],
		visual: "hero",
		visualPosition: "right",
	},
	{
		id: "units",
		layout: "split",
		title: "Connections to SPH4U",
		subtitle: "Multiple course units in one system",
		speaker: "All",
		bullets: [
			"Kinematics: velocity, acceleration, and graphs",
			"Dynamics: net force, friction, and traction",
			"Energy: transformations and efficiency losses",
			"Momentum: impulse during collisions",
		],
		visual: "physics",
		visualPosition: "right",
	},
	{
		id: "overview",
		layout: "split",
		title: "System overview",
		subtitle: "Data pipeline from cart to dashboard",
		speaker: "Hast",
		bullets: [
			"IMU measures acceleration and rotation in 3 axes",
			"Arduino filters, calibrates, and timestamps data",
			"WiFi streams packets to the web dashboard",
			"Dashboard plots live graphs for analysis",
		],
		visual: "pipeline",
		visualPosition: "right",
	},
	{
		id: "experiment",
		layout: "split",
		title: "Experiment plan",
		subtitle: "What we tested and measured",
		speaker: "Abdulrahman",
		bullets: [
			"Acceleration from rest and terminal speed",
			"Surface changes for friction and traction",
			"Impact trials for collisions and impulse",
			"Orientation changes to compare frames",
		],
		visual: "track",
		visualPosition: "right",
	},
	{
		id: "results",
		layout: "split",
		title: "Key findings and errors",
		subtitle: "What the data showed",
		speaker: "Abdulrahman",
		bullets: [
			"Acceleration peaks early then drops as drag grows",
			"Friction changes shift top speed and stopping",
			"Impulse spikes are limited by IMU range",
			"Integration drift needs filtering and resets",
		],
		visual: "chart",
		visualPosition: "right",
	},
	{
		id: "design",
		layout: "split",
		title: "Design idea and fixes",
		subtitle: "Qais - layout, visuals, and clarity",
		speaker: "Qais",
		bullets: [
			"Clean school-portal layout with bold red accent",
			"Cards group research, experiment, and demo steps",
			"Removed clutter and boosted contrast for reading",
			"Visual-first slides so we talk more than we read",
		],
		visual: "dashboard",
		visualPosition: "right",
	},
	{
		id: "qais-1",
		layout: "cards",
		kicker: "Qais research 1 of 2",
		title: "Motion and graphs",
		speaker: "Qais",
		cards: [
			{
				title: "Acceleration-time graph",
				text: "Acceleration peaks early, then trends to zero at constant speed.",
			},
			{
				title: "Momentum and impulse limits",
				text: "IMU range and sampling can miss sharp collision peaks.",
			},
			{
				title: "Rotation to linear speed",
				text: "v = omega * r works only when wheels do not slip.",
			},
		],
		visual: "research",
		cardColumns: 3,
		visualPlacement: "bottom",
	},
	{
		id: "qais-2",
		layout: "cards",
		kicker: "Qais research 2 of 2",
		title: "Energy and forces",
		speaker: "Qais",
		cards: [
			{
				title: "Energy transformations",
				text: "Chemical to electrical to kinetic, with heat losses.",
			},
			{
				title: "Terminal speed",
				text: "Drag + friction balance motor force at top speed.",
			},
			{
				title: "Relative motion",
				text: "Measured velocity depends on the observer frame.",
			},
		],
		visual: "energy",
		cardColumns: 3,
		visualPlacement: "bottom",
	},
	{
		id: "abdul-1",
		layout: "cards",
		kicker: "Abdulrahman research 1 of 2",
		title: "Projectile motion and sensing",
		speaker: "Abdulrahman",
		cards: [
			{
				title: "Projectile equations",
				text: "Ideal motion is parabolic but drag shifts the path.",
			},
			{
				title: "IMU sensor fusion",
				text: "Accelerometer + gyro reduce drift in orientation.",
			},
			{
				title: "Model vs real data",
				text: "Compare ideal values with drag-corrected data.",
			},
		],
		visual: "physics",
		cardColumns: 3,
		visualPlacement: "bottom",
	},
	{
		id: "abdul-2",
		layout: "cards",
		kicker: "Abdulrahman research 2 of 2",
		title: "Collisions and friction",
		speaker: "Abdulrahman",
		cards: [
			{
				title: "Elastic vs inelastic",
				text: "Energy conserved only in elastic collisions.",
			},
			{
				title: "Impact limits",
				text: "Sensor noise and range cap reduce impulse accuracy.",
			},
			{
				title: "Friction and traction",
				text: "Surface changes set max acceleration and slip.",
			},
		],
		visual: "impact",
		cardColumns: 3,
		visualPlacement: "bottom",
	},
	{
		id: "coding",
		layout: "split",
		title: "Coding and system logic",
		subtitle: "Hast - firmware and dashboard",
		speaker: "Hast",
		bullets: [
			"IMU calibration, bias removal, and filtering",
			"Madgwick orientation updates for roll/pitch/yaw",
			"WebSocket stream for real-time graphs",
			"Frontend charts + 3D model for live demo",
		],
		visual: "code",
		visualPosition: "right",
	},
	{
		id: "hast-1",
		layout: "cards",
		kicker: "Hast research 1 of 2",
		title: "Sensors and motion",
		speaker: "Hast",
		cards: [
			{
				title: "Arduino + IMU data",
				text: "Acceleration + gyro provide 3-axis motion data.",
			},
			{
				title: "Wireless streaming",
				text: "WiFi latency can drop packets during fast updates.",
			},
			{
				title: "Friction and normal force",
				text: "Higher normal force increases traction and drag.",
			},
		],
		visual: "sensor",
		cardColumns: 3,
		visualPlacement: "bottom",
	},
	{
		id: "hast-2",
		layout: "cards",
		kicker: "Hast research 2 of 2",
		title: "Stability and data quality",
		speaker: "Hast",
		cards: [
			{
				title: "Center of mass",
				text: "Low, centered mass reduces tilt and false readings.",
			},
			{
				title: "Velocity from IMU",
				text: "Integration drift requires smoothing and resets.",
			},
			{
				title: "WiFi disconnects",
				text: "Signal drops, buffers, and firmware limits.",
			},
		],
		visual: "signal",
		cardColumns: 3,
		visualPlacement: "bottom",
	},
	{
		id: "demo",
		layout: "split",
		title: "Live demo plan",
		subtitle: "Show the system in action",
		speaker: "All",
		bullets: [
			"Power on cart and confirm WiFi status",
			"Open dashboard and verify live graphs",
			"Run straight-line test and show acceleration",
			"Trigger collision and show impact spike",
		],
		visual: "checklist",
		visualPosition: "right",
	},
	{
		id: "close",
		layout: "title",
		title: "Thank you",
		subtitle: "Questions and discussion",
		speaker: "All",
		tags: ["Q and A"],
	},
];

const reorderList = (list, fromIndex, toIndex) => {
	const next = [...list];
	const [moved] = next.splice(fromIndex, 1);
	next.splice(toIndex, 0, moved);
	return next;
};

const createSlide = (layout) => {
	const id = `slide-${Date.now()}`;
	if (layout === "title") {
		return {
			id,
			layout,
			title: "New title slide",
			subtitle: "",
			speaker: "",
			tags: ["New"],
		};
	}
	if (layout === "cards") {
		return {
			id,
			layout,
			title: "New cards slide",
			subtitle: "",
			speaker: "",
			kicker: "",
			cards: [
				{
					title: "Card title",
					text: "Card text",
				},
			],
			visual: "research",
			cardColumns: 3,
			visualPlacement: "bottom",
		};
	}
	return {
		id,
		layout: "split",
		title: "New split slide",
		subtitle: "",
		speaker: "",
		bullets: ["New bullet"],
		visual: "hero",
		visualPosition: "right",
	};
};

const VisualFrame = ({ children }) => (
	<div className="w-full h-full rounded-2xl border border-red-100 bg-white/80 shadow-sm p-4 sm:p-6">
		{children}
	</div>
);

const VisualHero = () => (
	<VisualFrame>
		<div className="h-full flex items-center justify-center">
			<svg viewBox="0 0 520 260" className="w-full h-full">
				<defs>
					<linearGradient id="heroGlow" x1="0" x2="1" y1="0" y2="1">
						<stop offset="0" stopColor="#fee2e2" />
						<stop offset="1" stopColor="#ffffff" />
					</linearGradient>
				</defs>
				<rect x="20" y="20" width="480" height="220" rx="18" fill="url(#heroGlow)" />
				<rect x="120" y="120" width="280" height="60" rx="18" fill="#fca5a5" />
				<rect x="160" y="100" width="200" height="40" rx="12" fill="#fecaca" />
				<circle cx="170" cy="190" r="26" fill="#111827" />
				<circle cx="350" cy="190" r="26" fill="#111827" />
				<circle cx="170" cy="190" r="12" fill="#f97316" />
				<circle cx="350" cy="190" r="12" fill="#f97316" />
			</svg>
		</div>
	</VisualFrame>
);

const VisualPhysics = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="30" y="30" width="460" height="200" rx="16" fill="#fef2f2" />
			<line x1="80" y1="190" x2="440" y2="190" stroke="#ef4444" strokeWidth="4" />
			<line x1="80" y1="190" x2="80" y2="60" stroke="#ef4444" strokeWidth="4" />
			<path d="M80 190 Q210 60 440 90" fill="none" stroke="#111827" strokeWidth="4" />
			<circle cx="210" cy="120" r="8" fill="#ef4444" />
			<circle cx="320" cy="110" r="8" fill="#ef4444" />
		</svg>
	</VisualFrame>
);

const VisualPipeline = () => (
	<VisualFrame>
		<div className="h-full flex items-center">
			<svg viewBox="0 0 520 200" className="w-full h-full">
				<rect x="30" y="60" width="110" height="80" rx="14" fill="#fee2e2" />
				<rect x="205" y="60" width="110" height="80" rx="14" fill="#fecaca" />
				<rect x="380" y="60" width="110" height="80" rx="14" fill="#fee2e2" />
				<line x1="140" y1="100" x2="205" y2="100" stroke="#ef4444" strokeWidth="6" />
				<line x1="315" y1="100" x2="380" y2="100" stroke="#ef4444" strokeWidth="6" />
				<circle cx="85" cy="100" r="18" fill="#111827" />
				<circle cx="260" cy="100" r="18" fill="#111827" />
				<circle cx="435" cy="100" r="18" fill="#111827" />
			</svg>
		</div>
	</VisualFrame>
);

const VisualTrack = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="40" y="40" width="440" height="180" rx="20" fill="#fff1f2" />
			<path d="M80 160 C180 80, 320 220, 440 120" fill="none" stroke="#ef4444" strokeWidth="6" />
			<circle cx="160" cy="120" r="10" fill="#111827" />
			<circle cx="310" cy="180" r="10" fill="#111827" />
			<circle cx="410" cy="130" r="10" fill="#111827" />
		</svg>
	</VisualFrame>
);

const VisualChart = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="40" y="40" width="440" height="180" rx="16" fill="#fff1f2" />
			<polyline points="60,190 140,110 220,90 300,130 380,150 460,170" fill="none" stroke="#111827" strokeWidth="4" />
			<line x1="60" y1="190" x2="460" y2="190" stroke="#ef4444" strokeWidth="4" />
			<line x1="60" y1="190" x2="60" y2="70" stroke="#ef4444" strokeWidth="4" />
		</svg>
	</VisualFrame>
);

const VisualDashboard = () => (
	<VisualFrame>
		<div className="grid grid-cols-2 gap-3 h-full">
			<div className="rounded-xl bg-red-50 border border-red-100 p-3">
				<div className="h-2 w-16 bg-red-200 rounded mb-3" />
				<div className="h-20 rounded-lg bg-white border border-red-100" />
			</div>
			<div className="rounded-xl bg-red-50 border border-red-100 p-3">
				<div className="h-2 w-20 bg-red-200 rounded mb-3" />
				<div className="h-20 rounded-lg bg-white border border-red-100" />
			</div>
			<div className="col-span-2 rounded-xl bg-white border border-red-100 p-3">
				<div className="h-2 w-24 bg-red-200 rounded mb-3" />
				<div className="h-20 rounded-lg bg-red-50 border border-red-100" />
			</div>
		</div>
	</VisualFrame>
);

const VisualResearch = () => (
	<VisualFrame>
		<div className="grid grid-cols-2 gap-3 h-full">
			{Array.from({ length: 4 }).map((_, idx) => (
				<div key={idx} className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
					<div className="h-2 w-24 bg-red-200 rounded mb-3" />
					<div className="h-2 w-16 bg-gray-200 rounded mb-2" />
					<div className="h-2 w-20 bg-gray-200 rounded" />
				</div>
			))}
		</div>
	</VisualFrame>
);

const VisualEnergy = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="40" y="40" width="440" height="180" rx="18" fill="#fff1f2" />
			<circle cx="140" cy="130" r="40" fill="#fecaca" />
			<circle cx="260" cy="130" r="40" fill="#fca5a5" />
			<circle cx="380" cy="130" r="40" fill="#f87171" />
			<line x1="180" y1="130" x2="220" y2="130" stroke="#ef4444" strokeWidth="6" />
			<line x1="300" y1="130" x2="340" y2="130" stroke="#ef4444" strokeWidth="6" />
		</svg>
	</VisualFrame>
);

const VisualImpact = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="40" y="40" width="440" height="180" rx="18" fill="#fff1f2" />
			<circle cx="170" cy="140" r="40" fill="#111827" />
			<circle cx="340" cy="140" r="40" fill="#ef4444" />
			<path d="M230 140 L290 140" stroke="#ef4444" strokeWidth="8" />
			<path d="M260 90 L280 110 L250 120 L270 140 L240 150" stroke="#111827" strokeWidth="5" fill="none" />
		</svg>
	</VisualFrame>
);

const VisualCode = () => (
	<VisualFrame>
		<div className="h-full grid grid-cols-1 gap-3">
			{Array.from({ length: 5 }).map((_, idx) => (
				<div key={idx} className="h-6 rounded bg-gray-100 border border-gray-200" />
			))}
		</div>
	</VisualFrame>
);

const VisualSensor = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="60" y="60" width="160" height="140" rx="16" fill="#fee2e2" />
			<rect x="300" y="60" width="160" height="140" rx="16" fill="#fecaca" />
			<circle cx="140" cy="130" r="26" fill="#111827" />
			<circle cx="380" cy="130" r="26" fill="#111827" />
			<line x1="186" y1="130" x2="300" y2="130" stroke="#ef4444" strokeWidth="6" />
		</svg>
	</VisualFrame>
);

const VisualSignal = () => (
	<VisualFrame>
		<svg viewBox="0 0 520 260" className="w-full h-full">
			<rect x="60" y="40" width="400" height="180" rx="18" fill="#fff1f2" />
			<path d="M100 170 Q160 90 220 170 T340 170 T460 170" fill="none" stroke="#111827" strokeWidth="4" />
			{[120, 200, 280, 360, 440].map((x) => (
				<circle key={x} cx={x} cy={x % 160 === 0 ? 140 : 170} r="8" fill="#ef4444" />
			))}
		</svg>
	</VisualFrame>
);

const VisualChecklist = () => (
	<VisualFrame>
		<div className="space-y-4">
			{["w-40", "w-48", "w-44", "w-36"].map((widthClass, idx) => (
				<div key={idx} className="flex items-center gap-3">
					<div className="h-6 w-6 rounded-full bg-green-500" />
					<div className={`h-2 bg-gray-200 rounded ${widthClass}`} />
				</div>
			))}
		</div>
	</VisualFrame>
);

const SlideVisual = ({ type, imageUrl }) => {
	if (imageUrl) {
		return (
			<VisualFrame>
				<img src={imageUrl} alt="Slide visual" className="w-full h-full object-cover rounded-xl" />
			</VisualFrame>
		);
	}
	switch (type) {
		case "hero":
			return <VisualHero />;
		case "physics":
			return <VisualPhysics />;
		case "pipeline":
			return <VisualPipeline />;
		case "track":
			return <VisualTrack />;
		case "chart":
			return <VisualChart />;
		case "dashboard":
			return <VisualDashboard />;
		case "research":
			return <VisualResearch />;
		case "energy":
			return <VisualEnergy />;
		case "impact":
			return <VisualImpact />;
		case "code":
			return <VisualCode />;
		case "sensor":
			return <VisualSensor />;
		case "signal":
			return <VisualSignal />;
		case "checklist":
			return <VisualChecklist />;
		default:
			return <VisualHero />;
	}
};

const SpeakerBadge = ({ speaker }) => (
	<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wide">
		<PlayCircle className="w-4 h-4" />
		{speaker}
	</div>
);

const Slide = ({ slide, className }) => {
	if (!slide) return null;

	if (slide.layout === "title") {
		return (
			<div className={`page-card p-8 sm:p-12 text-center min-h-[60vh] flex flex-col items-center justify-center gap-4 ${className || ""}`}>
				{slide.speaker && <SpeakerBadge speaker={slide.speaker} />}
				<h1 className="text-4xl sm:text-5xl font-bold text-gray-900">{slide.title}</h1>
				{slide.subtitle && <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">{slide.subtitle}</p>}
				{slide.tags && slide.tags.length > 0 && (
					<div className="flex flex-wrap items-center justify-center gap-2 mt-2">
						{slide.tags.map((tag) => (
							<span key={tag} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		);
	}

	if (slide.layout === "cards") {
		const cards = slide.cards || [];
		const columnsClass =
			slide.cardColumns === 2
				? "md:grid-cols-2"
				: slide.cardColumns === 4
					? "md:grid-cols-4"
					: "md:grid-cols-3";
		const showVisual = slide.visual || slide.imageUrl;
		const visualBlock = showVisual ? (
			<div className="mt-2">
				<SlideVisual type={slide.visual} imageUrl={slide.imageUrl} />
			</div>
		) : null;
		const visualPlacement = slide.visualPlacement === "top" ? "top" : "bottom";

		return (
			<div className={`page-card p-6 sm:p-10 min-h-[60vh] flex flex-col gap-6 ${className || ""}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						{slide.kicker && <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">{slide.kicker}</p>}
						<h2 className="text-3xl font-bold text-gray-900">{slide.title}</h2>
					</div>
					{slide.speaker && <SpeakerBadge speaker={slide.speaker} />}
				</div>
				{visualPlacement === "top" && visualBlock}
				<div className={`grid grid-cols-1 ${columnsClass} gap-4`}>
					{cards.map((card) => (
						<div key={card.title} className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
							<h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
							<p className="text-sm text-gray-600">{card.text}</p>
						</div>
					))}
				</div>
				{visualPlacement === "bottom" && visualBlock}
			</div>
		);
	}

	const showVisual = slide.visual || slide.imageUrl;
	const visualBlock = showVisual ? (
		<div className="w-full h-full">
			<SlideVisual type={slide.visual} imageUrl={slide.imageUrl} />
		</div>
	) : null;
	const textBlock = (
		<div className="space-y-4">
			{slide.speaker && <SpeakerBadge speaker={slide.speaker} />}
			<h2 className="text-3xl font-bold text-gray-900">{slide.title}</h2>
			{slide.subtitle && <p className="text-lg text-gray-600">{slide.subtitle}</p>}
			<ul className="space-y-2 text-gray-700 list-disc list-inside">
				{(slide.bullets || []).map((bullet, idx) => (
					<li key={`${bullet}-${idx}`} className="text-base">
						{bullet}
					</li>
				))}
			</ul>
		</div>
	);
	const isVisualLeft = slide.visualPosition === "left";

	return (
		<div className={`page-card p-6 sm:p-10 min-h-[60vh] grid grid-cols-1 ${showVisual ? "lg:grid-cols-2" : ""} gap-6 items-center ${className || ""}`}>
			{showVisual ? (
				<>
					{isVisualLeft ? visualBlock : textBlock}
					{isVisualLeft ? textBlock : visualBlock}
				</>
			) : (
				textBlock
			)}
		</div>
	);
};

export default function Presentation() {
	const [slidesState, setSlidesState] = useState(defaultSlides);
	const [index, setIndex] = useState(0);
	const [editMode, setEditMode] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [dragSlideIndex, setDragSlideIndex] = useState(null);
	const [dragBulletIndex, setDragBulletIndex] = useState(null);
	const [dragCardIndex, setDragCardIndex] = useState(null);
	const [newSlideLayout, setNewSlideLayout] = useState("split");
	const [saveStatus, setSaveStatus] = useState("idle");
	const [isHydrated, setIsHydrated] = useState(false);
	const stageRef = useRef(null);
	const lastSavedRef = useRef("");

	useEffect(() => {
		const backup = localStorage.getItem(LOCAL_BACKUP_KEY);
		if (backup) {
			try {
				const parsed = JSON.parse(backup);
				if (parsed.length) {
					setSlidesState(parsed);
					lastSavedRef.current = JSON.stringify(parsed);
				}
			} catch (error) {
				// ignore backup parse failures
			}
		}

		const unsubscribe = subscribeToPresentationDeck((data) => {
			if (data && Array.isArray(data.slides) && data.slides.length > 0) {
				setSlidesState(data.slides);
				lastSavedRef.current = JSON.stringify(data.slides);
			}
			setIsHydrated(true);
		});

		return () => unsubscribe && unsubscribe();
	}, []);

	useEffect(() => {
		if (index > slidesState.length - 1) {
			setIndex(Math.max(slidesState.length - 1, 0));
		}
	}, [index, slidesState.length]);

	useEffect(() => {
		localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(slidesState));
	}, [slidesState]);

	useEffect(() => {
		if (!isHydrated) return;
		const serialized = JSON.stringify(slidesState);
		if (serialized === lastSavedRef.current) return;
		setSaveStatus("saving");

		const timer = setTimeout(async () => {
			try {
				await savePresentationDeck({ slides: slidesState });
				lastSavedRef.current = serialized;
				setSaveStatus("saved");
			} catch (error) {
				setSaveStatus("error");
			}
		}, SAVE_DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [slidesState, isHydrated]);

	useEffect(() => {
		const handleFullscreen = () => {
			setIsFullscreen(document.fullscreenElement === stageRef.current);
		};
		document.addEventListener("fullscreenchange", handleFullscreen);
		return () => document.removeEventListener("fullscreenchange", handleFullscreen);
	}, []);

	const total = slidesState.length;

	const goPrev = useCallback(() => {
		setIndex((prev) => Math.max(prev - 1, 0));
	}, []);

	const goNext = useCallback(() => {
		setIndex((prev) => Math.min(prev + 1, total - 1));
	}, [total]);

	useEffect(() => {
		const handleKey = (event) => {
			if (event.key === "ArrowLeft") goPrev();
			if (event.key === "ArrowRight") goNext();
			if (event.key === "Escape" && document.fullscreenElement) {
				document.exitFullscreen();
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [goPrev, goNext]);

	useEffect(() => {
		if (isFullscreen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [isFullscreen]);

	const activeSlide = useMemo(
		() => slidesState[index] || slidesState[0],
		[index, slidesState]
	);

	const updateSlide = (patch) => {
		setSlidesState((prev) =>
			prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
		);
	};

	const updateBullets = (bullets) => updateSlide({ bullets });
	const updateCards = (cards) => updateSlide({ cards });

	const handleAddSlide = () => {
		const newSlide = createSlide(newSlideLayout);
		const insertAt = Math.min(index + 1, slidesState.length);
		setSlidesState((prev) => [
			...prev.slice(0, insertAt),
			newSlide,
			...prev.slice(insertAt),
		]);
		setIndex(insertAt);
	};

	const handleDuplicateSlide = () => {
		const copy = JSON.parse(JSON.stringify(activeSlide));
		copy.id = `slide-${Date.now()}`;
		const insertAt = Math.min(index + 1, slidesState.length);
		setSlidesState((prev) => [
			...prev.slice(0, insertAt),
			copy,
			...prev.slice(insertAt),
		]);
		setIndex(insertAt);
	};

	const handleDeleteSlide = () => {
		if (slidesState.length <= 1) return;
		if (!window.confirm("Delete this slide?")) return;
		setSlidesState((prev) => prev.filter((_, idx) => idx !== index));
		setIndex((prev) => Math.max(prev - 1, 0));
	};

	const handleFullscreenToggle = async () => {
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else if (stageRef.current) {
				await stageRef.current.requestFullscreen();
			}
		} catch (error) {
			// ignore fullscreen errors
		}
	};

	const tagLines = (activeSlide?.tags || []).join(", ");

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1">
				<div className={isFullscreen ? "" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"}>
					{!isFullscreen && (
						<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
							<div>
								<h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Presentation Slideshow</h1>
								<p className="text-gray-600">Use the arrows or keyboard to navigate.</p>
							</div>
							<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
								<span>Slide {index + 1} of {total}</span>
								<span className={saveStatus === "error" ? "text-red-600" : "text-gray-500"}>
									{saveStatus === "saving" && "Saving..."}
									{saveStatus === "saved" && "Saved"}
									{saveStatus === "error" && "Save failed"}
								</span>
								<button
									onClick={handleFullscreenToggle}
									className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors"
								>
									Fullscreen
								</button>
								<button
									onClick={() => setEditMode((prev) => !prev)}
									className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors"
								>
									{editMode ? "Close Editor" : "Edit Slides"}
								</button>
							</div>
						</div>
					)}

					<div ref={stageRef} className={isFullscreen ? "fixed inset-0 bg-black text-white z-50 flex flex-col" : ""}>
						{isFullscreen && (
							<div className="flex items-center justify-between px-6 py-4">
								<span className="text-sm">Slide {index + 1} of {total}</span>
								<div className="flex items-center gap-3">
									<button onClick={handleFullscreenToggle} className="px-4 py-2 rounded-lg border border-white/40 text-white hover:border-white/70 transition-colors">
										Exit Fullscreen (Esc)
									</button>
								</div>
							</div>
						)}
						<div className={isFullscreen ? "flex-1 flex items-center justify-center px-6" : ""}>
							<div className={isFullscreen ? "w-full max-w-6xl" : ""}>
								<Slide slide={activeSlide} className={isFullscreen ? "min-h-[70vh]" : ""} />
							</div>
						</div>

						<div className={isFullscreen ? "px-6 pb-6" : "mt-6"}>
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<button
										onClick={goPrev}
										disabled={index === 0}
										className={
											isFullscreen
												? "px-4 py-2 rounded-lg border border-white/40 text-white hover:border-white/70 transition-colors disabled:opacity-50"
												: "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
										}
									>
										<ArrowLeft className="w-4 h-4" />
										Previous
									</button>
									<button
										onClick={goNext}
										disabled={index === total - 1}
										className={
											isFullscreen
												? "px-4 py-2 rounded-lg border border-white/40 text-white hover:border-white/70 transition-colors disabled:opacity-50"
												: "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
										}
									>
										Next
										<ArrowRight className="w-4 h-4" />
									</button>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									{slidesState.map((item, idx) => (
										<button
											key={item.id}
											onClick={() => setIndex(idx)}
											className={`h-2.5 w-2.5 rounded-full ${idx === index ? "bg-red-600" : isFullscreen ? "bg-white/30" : "bg-gray-300"}`}
											aria-label={`Go to slide ${idx + 1}`}
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					{editMode && !isFullscreen && (
						<div className="page-card p-6 mt-8 space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h2 className="text-lg font-semibold text-gray-900">Slides</h2>
										<button
											onClick={() => {
												if (!window.confirm("Reset the entire deck to default?")) return;
												setSlidesState(defaultSlides);
												setIndex(0);
											}}
											className="text-xs text-red-600 hover:text-red-700"
										>
											Reset deck
										</button>
									</div>
									<div className="space-y-2">
										{slidesState.map((slide, idx) => (
											<div
												key={slide.id}
												onDragOver={(event) => event.preventDefault()}
												onDrop={() => {
													if (dragSlideIndex === null || dragSlideIndex === idx) return;
													setSlidesState((prev) => reorderList(prev, dragSlideIndex, idx));
													setIndex(idx);
													setDragSlideIndex(null);
												}}
												className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${idx === index ? "border-red-300 bg-red-50" : "border-gray-200"}`}
											>
												<div
													draggable
													onDragStart={() => setDragSlideIndex(idx)}
													onDragEnd={() => setDragSlideIndex(null)}
													className="text-gray-400 cursor-move"
												>
													::
												</div>
												<button onClick={() => setIndex(idx)} className="text-left flex-1 text-sm">
													{idx + 1}. {slide.title || "Untitled"}
												</button>
											</div>
										))}
									</div>
									<div className="space-y-2">
										<div>
											<label className="block text-xs font-medium text-gray-500 mb-2">New slide layout</label>
											<select
												value={newSlideLayout}
												onChange={(event) => setNewSlideLayout(event.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg"
											>
												<option value="split">Split</option>
												<option value="cards">Cards</option>
												<option value="title">Title</option>
											</select>
										</div>
										<button onClick={handleAddSlide} className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
											Add slide
										</button>
										<button
											onClick={handleDuplicateSlide}
											className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors text-sm"
										>
											Duplicate slide
										</button>
										<button
											onClick={handleDeleteSlide}
											className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors text-sm"
											disabled={slidesState.length <= 1}
										>
											Delete slide
										</button>
									</div>
								</div>

								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
											<input
												type="text"
												value={activeSlide?.title || ""}
												onChange={(event) => updateSlide({ title: event.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
											<input
												type="text"
												value={activeSlide?.subtitle || ""}
												onChange={(event) => updateSlide({ subtitle: event.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
											<input
												type="text"
												value={activeSlide?.speaker || ""}
												onChange={(event) => updateSlide({ speaker: event.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
											<select
												value={activeSlide?.layout || "split"}
												onChange={(event) => updateSlide({ layout: event.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											>
												<option value="title">Title</option>
												<option value="split">Split</option>
												<option value="cards">Cards</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Visual style</label>
											<select
												value={activeSlide?.visual || ""}
												onChange={(event) => updateSlide({ visual: event.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											>
												<option value="">None</option>
												<option value="hero">Hero</option>
												<option value="physics">Physics</option>
												<option value="pipeline">Pipeline</option>
												<option value="track">Track</option>
												<option value="chart">Chart</option>
												<option value="dashboard">Dashboard</option>
												<option value="research">Research</option>
												<option value="energy">Energy</option>
												<option value="impact">Impact</option>
												<option value="code">Code</option>
												<option value="sensor">Sensor</option>
												<option value="signal">Signal</option>
												<option value="checklist">Checklist</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
											<input
												type="text"
												value={activeSlide?.imageUrl || ""}
												onChange={(event) => updateSlide({ imageUrl: event.target.value })}
												placeholder="https://..."
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
											<input
												type="text"
												value={tagLines}
												onChange={(event) =>
													updateSlide({
														tags: event.target.value
															.split(",")
															.map((tag) => tag.trim())
															.filter(Boolean),
													})
												}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Kicker (cards layout)</label>
											<input
												type="text"
												value={activeSlide?.kicker || ""}
												onChange={(event) => updateSlide({ kicker: event.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
											/>
										</div>
										{activeSlide?.layout === "split" && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">Visual position</label>
												<select
													value={activeSlide?.visualPosition || "right"}
													onChange={(event) => updateSlide({ visualPosition: event.target.value })}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
												>
													<option value="left">Visual left</option>
													<option value="right">Visual right</option>
												</select>
											</div>
										)}
										{activeSlide?.layout === "cards" && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">Cards layout</label>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
													<select
														value={activeSlide?.cardColumns || 3}
														onChange={(event) => updateSlide({ cardColumns: Number(event.target.value) })}
														className="w-full px-4 py-2 border border-gray-300 rounded-lg"
													>
														<option value={2}>2 columns</option>
														<option value={3}>3 columns</option>
														<option value={4}>4 columns</option>
													</select>
													<select
														value={activeSlide?.visualPlacement || "bottom"}
														onChange={(event) => updateSlide({ visualPlacement: event.target.value })}
														className="w-full px-4 py-2 border border-gray-300 rounded-lg"
													>
														<option value="top">Visual top</option>
														<option value="bottom">Visual bottom</option>
													</select>
												</div>
											</div>
										)}
									</div>

									{activeSlide?.layout === "split" && (
										<div>
											<div className="flex items-center justify-between mb-2">
												<label className="text-sm font-medium text-gray-700">Bullets (drag to reorder)</label>
												<button
													onClick={() => updateBullets([...(activeSlide.bullets || []), "New bullet"])}
													className="text-xs text-red-600 hover:text-red-700"
												>
													Add bullet
												</button>
											</div>
											<div className="space-y-2">
												{(activeSlide.bullets || []).map((bullet, bulletIndex) => (
													<div
														key={`${bullet}-${bulletIndex}`}
														onDragOver={(event) => event.preventDefault()}
														onDrop={() => {
															if (dragBulletIndex === null || dragBulletIndex === bulletIndex) return;
															updateBullets(reorderList(activeSlide.bullets || [], dragBulletIndex, bulletIndex));
															setDragBulletIndex(null);
														}}
														className="flex items-center gap-2"
													>
														<div
															draggable
															onDragStart={() => setDragBulletIndex(bulletIndex)}
															onDragEnd={() => setDragBulletIndex(null)}
															className="text-gray-400 cursor-move"
														>
															::
														</div>
														<input
															type="text"
															value={bullet}
															onChange={(event) => {
																const updated = [...(activeSlide.bullets || [])];
																updated[bulletIndex] = event.target.value;
																updateBullets(updated);
															}}
															className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
														/>
														<button
															onClick={() =>
																updateBullets((activeSlide.bullets || []).filter((_, idx) => idx !== bulletIndex))
															}
															className="text-xs text-red-600 hover:text-red-700"
														>
															Remove
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{activeSlide?.layout === "cards" && (
										<div>
											<div className="flex items-center justify-between mb-2">
												<label className="text-sm font-medium text-gray-700">Cards (drag to reorder)</label>
												<button
													onClick={() =>
														updateCards([...(activeSlide.cards || []), { title: "Card title", text: "Card text" }])
												}
													className="text-xs text-red-600 hover:text-red-700"
												>
													Add card
												</button>
											</div>
											<div className="space-y-3">
												{(activeSlide.cards || []).map((card, cardIndex) => (
													<div
														key={`${card.title}-${cardIndex}`}
														onDragOver={(event) => event.preventDefault()}
														onDrop={() => {
															if (dragCardIndex === null || dragCardIndex === cardIndex) return;
															updateCards(reorderList(activeSlide.cards || [], dragCardIndex, cardIndex));
															setDragCardIndex(null);
														}}
														className="border border-gray-200 rounded-lg p-3 space-y-2"
													>
														<div className="flex items-center gap-2">
															<div
																draggable
																onDragStart={() => setDragCardIndex(cardIndex)}
																onDragEnd={() => setDragCardIndex(null)}
																className="text-gray-400 cursor-move"
															>
																::
															</div>
															<input
																type="text"
																value={card.title}
																onChange={(event) => {
																	const updated = [...(activeSlide.cards || [])];
																	updated[cardIndex] = { ...updated[cardIndex], title: event.target.value };
																	updateCards(updated);
																}}
																className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
															/>
															<button
																onClick={() =>
																	updateCards((activeSlide.cards || []).filter((_, idx) => idx !== cardIndex))
															}
																className="text-xs text-red-600 hover:text-red-700"
															>
																Remove
															</button>
														</div>
														<textarea
															value={card.text}
															onChange={(event) => {
																const updated = [...(activeSlide.cards || [])];
																updated[cardIndex] = { ...updated[cardIndex], text: event.target.value };
																updateCards(updated);
															}}
															className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[90px]"
														/>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
