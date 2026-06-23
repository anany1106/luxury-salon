import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Star, MapPin, Search, Compass, Shield, Award, Calendar, Heart, Eye, Trash2, Download, Phone, User, Clock, CheckCircle, Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Salon, Neighborhood, Treatment, EditorsPick, Booking } from "./types";
import { SALONS_DATA, NEIGHBORHOODS_DATA, TREATMENT_CARDS, EDITORS_PICKS } from "./data";
import MapContainer from "./components/MapContainer";
import AIConcierge from "./components/AIConcierge";
import WebcamDiagnostic from "./components/WebcamDiagnostic";
import SalonDetailModal from "./components/SalonDetailModal";
import BookingConfirmationModal from "./components/BookingConfirmationModal";
import AuraQuiz from "./components/AuraQuiz";

const getICSTimestamps = (dateStr: string, timeStr: string, durationStr: string) => {
  const dParts = dateStr.split("-");
  const year = parseInt(dParts[0], 10) || 2026;
  const month = (parseInt(dParts[1], 10) || 6) - 1; 
  const day = parseInt(dParts[2], 10) || 8;
  
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  let hours = 12;
  let minutes = 0;
  if (match) {
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && h < 12) {
      h += 12;
    } else if (ampm === "AM" && h === 12) {
      h = 0;
    }
    hours = h;
    minutes = m;
  }
  
  const startDate = new Date(year, month, day, hours, minutes, 0);
  const durationMatch = durationStr.match(/(\d+)\s*min/i);
  const durationMins = durationMatch ? parseInt(durationMatch[1], 10) : 60;
  
  const endDate = new Date(startDate.getTime() + durationMins * 60 * 1000);
  
  const formatICSDate = (d: Date) => {
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    const da = String(d.getUTCDate()).padStart(2, "0");
    const ho = String(d.getUTCHours()).padStart(2, "0");
    const mi = String(d.getUTCMinutes()).padStart(2, "0");
    const se = String(d.getUTCSeconds()).padStart(2, "0");
    return `${y}${mo}${da}T${ho}${mi}${se}Z`;
  };
  
  return {
    start: formatICSDate(startDate),
    end: formatICSDate(endDate),
    timestamp: formatICSDate(new Date())
  };
};

const handleSendCalendarInvite = (booking: Booking) => {
  const { start, end, timestamp } = getICSTimestamps(booking.date, booking.time, booking.service.duration);
  const summary = `Lux Appointment: ${booking.service.name} at ${booking.salon.name}`;
  const description = `Luxury Beauty Appointment\\nSanctuary: ${booking.salon.name}\\nService: ${booking.service.name} (Price: INR ${booking.service.price.toLocaleString("en-IN")})\\nStylist: ${booking.stylist ? booking.stylist.name : "Luxury Master Team"}\\nCustomer Name: ${booking.customerName}\\nDuration: ${booking.service.duration}\\nPhone: ${booking.customerPhone}`;
  const location = `${booking.salon.name}, ${booking.salon.address}`;
  const organizer = `CN=Aura & Gilt Support:mailto:concierge@auraandgilt.com`;
  
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aura and Gilt//NONSGML Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-${Math.floor(Math.random() * 1000)}@auraandgilt.com`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `ORGANIZER;${organizer}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  
  const icsContent = icsLines.join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `luxe-appointment-${booking.salon.id}-${booking.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("aura_theme");
      return (stored === "dark" || stored === "light") ? stored : "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("aura_theme", theme);
    } catch (e) {
      console.error(e);
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [salons, setSalons] = useState<Salon[]>(SALONS_DATA);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(NEIGHBORHOODS_DATA);
  const [treatments, setTreatments] = useState<Treatment[]>(TREATMENT_CARDS);
  const [editorsPicks, setEditorsPicks] = useState<EditorsPick[]>(EDITORS_PICKS);

  // Filtering / Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Selection states
  const [selectedMapSalon, setSelectedMapSalon] = useState<Salon | null>(null);
  const [activeTab, setActiveTab] = useState<"discovery" | "concierge" | "vision" | "wishlist" | "quiz" | "appointments">("discovery");

  // Bookings state persisted in localStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem("aura_bookings");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aura_bookings", JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings:", e);
    }
  }, [bookings]);

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("aura_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlist]);

  const toggleWishlist = (salonId: string) => {
    setWishlist((prev) =>
      prev.includes(salonId) ? prev.filter((id) => id !== salonId) : [...prev, salonId]
    );
  };

  // Booking states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<"services" | "stylists" | "contact">("services");
  const [focusedSalon, setFocusedSalon] = useState<Salon | null>(null);
  const [preselectedStylistId, setPreselectedStylistId] = useState<string | null>(null);

  const [lastBookingConfirmed, setLastBookingConfirmed] = useState<Booking | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // References to scroll targets smoothly
  const interactivePortalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Parallel download indices from our full stack express backend endpoints
    const loadAppData = async () => {
      try {
        const [salonsRes, hoodRes, treatRes, pickRes] = await Promise.all([
          fetch("/api/salons"),
          fetch("/api/neighborhoods"),
          fetch("/api/treatments"),
          fetch("/api/editors-picks"),
        ]);

        if (salonsRes.ok) setSalons(await salonsRes.json());
        if (hoodRes.ok) setNeighborhoods(await hoodRes.json());
        if (treatRes.ok) setTreatments(await treatRes.json());
        if (pickRes.ok) setEditorsPicks(await pickRes.json());
      } catch (err) {
        console.error("Error communicating with full-stack server endpoints:", err);
      }
    };
    loadAppData();
  }, []);

  // Auto-open salon from shared deep link
   useEffect(() => {
    if (salons.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const salonParam = params.get("salon");
      if (salonParam) {
        const foundSalon = salons.find((s) => s.id === salonParam);
        if (foundSalon) {
          setFocusedSalon(foundSalon);
          setPreselectedStylistId(null);
          setModalInitialTab("services");
          setIsDetailModalOpen(true);
        }
      }
    }
  }, [salons]);

  // Filter logic
  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHood = selectedNeighborhood ? salon.neighborhood === selectedNeighborhood : true;
    
    if (activeCategory === "ALL") return matchesSearch && matchesHood;
    return (
      matchesSearch &&
      matchesHood &&
      salon.services.some((svc) => svc.category === activeCategory)
    );
  });

  // Handle callback triggers from concierge / webcam matches
  const handleBookStylistMatch = (salonId: string, stylistId: string | null) => {
    const matchedSalon = salons.find((s) => s.id === salonId);
    if (matchedSalon) {
      setFocusedSalon(matchedSalon);
      setPreselectedStylistId(stylistId);
      setModalInitialTab("services");
      setIsDetailModalOpen(true);
    }
  };

  // Pre-select treatment booking from the Bento grid listing
  const handleQuickBookTreatment = (treatment: Treatment) => {
    // Find matching salon
    const matchedSalon = salons.find((s) => 
      s.services.some((svc) => svc.name.toLowerCase() === treatment.title.toLowerCase() || svc.price === treatment.price)
    ) || salons[0];

    if (matchedSalon) {
      setFocusedSalon(matchedSalon);
      setPreselectedStylistId(null);
      setModalInitialTab("services");
      setIsDetailModalOpen(true);
    }
  };

  const handleConfirmReservation = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
    setLastBookingConfirmed(booking);
    setIsDetailModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const scrollToSelector = () => {
    if (interactivePortalRef.current) {
      interactivePortalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#c5a880]/30 selection:text-stone-900 leading-normal transition-colors duration-300 ${
      theme === "dark" ? "bg-stone-950 text-stone-200" : "bg-stone-50 text-stone-800"
    }`}>
      
      {/* Top Floating Glass Header Navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${
        theme === "dark" ? "bg-stone-950/85 border-stone-800/80 text-stone-100" : "bg-white/80 border-stone-200/80 text-stone-800"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setActiveTab("discovery"); setIsMobileMenuOpen(false); }}>
            <span className={`font-serif text-lg sm:text-xl font-semibold tracking-wide transition-colors ${
              theme === "dark" ? "text-stone-100" : "text-stone-900"
            }`}>
              Aura <span className="text-[#a48259] font-medium">&amp;</span> Gilt
            </span>
            <span className="w-1.5 h-1.5 bg-[#a48259] rounded-full self-end mb-2" />
          </div>

          {/* Desktop Tab Navigations - Hidden on screens below lg */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2.5">
            <button
              onClick={() => setActiveTab("discovery")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono tracking-wider transition-all uppercase font-semibold cursor-pointer ${
                activeTab === "discovery"
                  ? (theme === "dark" ? "bg-stone-800 border border-stone-700/80 text-[#c5a880] shadow-sm" : "bg-stone-950 text-white shadow-sm")
                  : (theme === "dark" ? "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60")
              }`}
            >
              Discover
            </button>
            <button
              id="tab-ai-concierge"
              onClick={() => setActiveTab("concierge")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono tracking-wider transition-all uppercase font-semibold flex items-center gap-1 cursor-pointer ${
                activeTab === "concierge"
                  ? (theme === "dark" ? "bg-stone-800 border border-stone-700/80 text-[#c5a880] shadow-sm" : "bg-stone-950 text-white shadow-sm")
                  : (theme === "dark" ? "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60")
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#c5a880] fill-current" /> AI Concierge
            </button>
            <button
              id="tab-aura-quiz"
              onClick={() => setActiveTab("quiz")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono tracking-wider transition-all uppercase font-semibold flex items-center gap-1 cursor-pointer ${
                activeTab === "quiz"
                  ? (theme === "dark" ? "bg-stone-800 border border-stone-700/80 text-[#c5a880] shadow-sm" : "bg-stone-950 text-white shadow-sm")
                  : (theme === "dark" ? "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60")
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#c5a880]" /> Aura Quiz
            </button>
            <button
              id="tab-diagnostic-camera"
              onClick={() => setActiveTab("vision")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono tracking-wider transition-all uppercase font-semibold flex items-center gap-1 cursor-pointer ${
                activeTab === "vision"
                  ? (theme === "dark" ? "bg-stone-800 border border-stone-700/80 text-[#c5a880] shadow-sm" : "bg-stone-950 text-white shadow-sm")
                  : (theme === "dark" ? "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60")
              }`}
            >
              Symmetry Vision
            </button>
            <button
              id="tab-wishlist"
              onClick={() => setActiveTab("wishlist")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono tracking-wider transition-all uppercase font-semibold flex items-center gap-1 cursor-pointer ${
                activeTab === "wishlist"
                  ? (theme === "dark" ? "bg-stone-800 border border-stone-700/80 text-[#c5a880] shadow-sm" : "bg-stone-950 text-white shadow-sm")
                  : (theme === "dark" ? "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60")
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === "wishlist" ? "text-rose-500 fill-rose-500" : "text-stone-400"}`} />
              Wishlist
              {wishlist.length > 0 && (
                <span className="bg-[#a48259]/20 text-[#a48259] text-[9.5px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              id="tab-my-appointments"
              onClick={() => setActiveTab("appointments")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono tracking-wider transition-all uppercase font-semibold flex items-center gap-1 core-appointments-btn cursor-pointer ${
                activeTab === "appointments"
                  ? (theme === "dark" ? "bg-stone-800 border border-stone-700/80 text-[#c5a880] shadow-sm" : "bg-stone-950 text-white shadow-sm")
                  : (theme === "dark" ? "text-stone-400 hover:text-stone-100 hover:bg-stone-900/60" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60")
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
              My Appointments
              {bookings.length > 0 && (
                <span className="bg-[#a48259]/20 text-[#a48259] text-[9.5px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                  {bookings.length}
                </span>
              )}
            </button>

            {/* Gilded Theme Toggle Trigger */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2 rounded-lg border text-xs transition-all duration-300 flex items-center justify-center cursor-pointer h-8 w-8 sm:h-10 sm:w-10 ${
                theme === "dark"
                  ? "bg-stone-900 border-stone-850 text-amber-400 hover:bg-stone-800 hover:scale-105"
                  : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200/80 hover:text-stone-950 hover:scale-105"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 fill-stone-600/10" />
              )}
            </button>
          </nav>

          {/* Mobile Actions and Hamburger Menu Button - Visible on screens below lg */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Gilded Theme Toggle Trigger for Mobile */}
            <button
              id="theme-toggle-btn-mobile"
              onClick={toggleTheme}
              className={`p-2 rounded-lg border text-xs transition-all duration-300 flex items-center justify-center cursor-pointer h-8 w-8 ${
                theme === "dark"
                  ? "bg-stone-900 border-stone-850 text-amber-400"
                  : "bg-stone-100 border-stone-200 text-stone-600"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 fill-amber-400/20" />
              ) : (
                <Moon className="w-3.5 h-3.5 fill-stone-600/10" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-center cursor-pointer h-8 w-8 ${
                theme === "dark"
                  ? "bg-stone-900 border-stone-850 text-stone-200 hover:bg-stone-800"
                  : "bg-stone-150 border-stone-200 text-stone-700 hover:bg-stone-200"
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Drawer Menu Section with smooth framer-motion */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`lg:hidden border-t overflow-hidden backdrop-blur-lg ${
                theme === "dark" ? "bg-stone-950/95 border-stone-800 text-stone-100" : "bg-white/95 border-stone-200 text-stone-800"
              }`}
            >
              <nav className="px-6 py-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab("discovery");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider transition-all uppercase font-semibold text-left flex items-center justify-between cursor-pointer ${
                    activeTab === "discovery"
                      ? (theme === "dark" ? "bg-stone-800 text-[#c5a880] border border-stone-700/80" : "bg-stone-950 text-white")
                      : (theme === "dark" ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <span>Discover</span>
                  <span className="text-[10px] opacity-60">Directory</span>
                </button>
                <button
                  id="tab-ai-concierge-mobile"
                  onClick={() => {
                    setActiveTab("concierge");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider transition-all uppercase font-semibold text-left flex items-center justify-between cursor-pointer ${
                    activeTab === "concierge"
                      ? (theme === "dark" ? "bg-stone-800 text-[#c5a880] border border-stone-700/80" : "bg-stone-950 text-white")
                      : (theme === "dark" ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a880] fill-current" /> AI Concierge
                  </span>
                  <span className="text-[10px] opacity-60">Consultant</span>
                </button>
                <button
                  id="tab-aura-quiz-mobile"
                  onClick={() => {
                    setActiveTab("quiz");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider transition-all uppercase font-semibold text-left flex items-center justify-between cursor-pointer ${
                    activeTab === "quiz"
                      ? (theme === "dark" ? "bg-stone-800 text-[#c5a880] border border-stone-700/80" : "bg-stone-950 text-white")
                      : (theme === "dark" ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#c5a880]" /> Aura Quiz
                  </span>
                  <span className="text-[10px] opacity-60">Diagnostic</span>
                </button>
                <button
                  id="tab-diagnostic-camera-mobile"
                  onClick={() => {
                    setActiveTab("vision");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider transition-all uppercase font-semibold text-left flex items-center justify-between cursor-pointer ${
                    activeTab === "vision"
                      ? (theme === "dark" ? "bg-stone-800 text-[#c5a880] border border-stone-700/80" : "bg-stone-950 text-white")
                      : (theme === "dark" ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#c5a880]" /> Symmetry Vision
                  </span>
                  <span className="text-[10px] opacity-60">Symmetry Scan</span>
                </button>
                <button
                  id="tab-wishlist-mobile"
                  onClick={() => {
                    setActiveTab("wishlist");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider transition-all uppercase font-semibold text-left flex items-center justify-between cursor-pointer ${
                    activeTab === "wishlist"
                      ? (theme === "dark" ? "bg-stone-800 text-[#c5a880] border border-stone-700/80" : "bg-stone-950 text-white")
                      : (theme === "dark" ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Heart className={`w-3.5 h-3.5 ${activeTab === "wishlist" ? "text-rose-500 fill-rose-500" : "text-stone-400"}`} />
                    Wishlist
                  </span>
                  {wishlist.length > 0 ? (
                    <span className="bg-[#a48259] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-60">0 items</span>
                  )}
                </button>
                <button
                  id="tab-my-appointments-mobile"
                  onClick={() => {
                    setActiveTab("appointments");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider transition-all uppercase font-semibold text-left flex items-center justify-between cursor-pointer ${
                    activeTab === "appointments"
                      ? (theme === "dark" ? "bg-stone-800 text-[#c5a880] border border-stone-700/80" : "bg-stone-950 text-white")
                      : (theme === "dark" ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                    My Appointments
                  </span>
                  {bookings.length > 0 ? (
                    <span className="bg-[#a48259] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {bookings.length}
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-60">Empty</span>
                  )}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* Dynamic Inner Tab Switchers container */}
        {activeTab === "discovery" && (
          <div className="w-full flex flex-col items-center">
            
            {/* HERO CAROUSEL BLOCK with Gilded Mane interior asset */}
            <section className="relative w-full h-[380px] sm:h-[480px] bg-stone-950 flex items-center justify-center text-center overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWnLHL6kS32WyQobeTVQypDbzViyT1QIqpo4v8AGoVqdop3UX1ln8e9jM1Ydrbpx-61p8soEHuYTwOx2RXJuEU_BIWm4UwTFpt8BKlbVRj2COxIO_HUeFJzfs-OW8h144LxX6a6Z23qjCGmz2625iJXfvEMv3_ttQfL2625G-EQjyA03Y9MshIA8OtF0_UfGyvmbo_ByXJO5yzAMqzXRbgqXyBB8W_eKRXaDD1jS-zSCEnWR4EmqzFPwL_zJH7kkJl7mXvGdO4idY"
                alt="Luxury Salon Interior Backdrop"
                className="absolute inset-0 w-full h-full object-cover opacity-35 scale-100 transform filter brightness-95"
                referrerPolicy="no-referrer"
              />
              
              {/* Inner ambient glow gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/30 to-stone-950/40 pointer-events-none" />

              <div className="relative max-w-4xl px-6 flex flex-col items-center z-10 animate-fade-in">
                <span className="font-mono text-[10px] tracking-widest text-[#c5a880] uppercase mb-3 font-semibold flex items-center gap-1.5 bg-stone-900/80 p-2.5 px-4 rounded-full border border-stone-800">
                  <Shield className="w-3.5 h-3.5" /> LUXURY BEAUTY DIRECTORY &amp; AI DIAGNOSTIC STUDIO
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight max-w-3xl mt-1">
                  Aesthetic sanctuaries tailored to your natural frame
                </h1>
                <p className="text-stone-300 text-xs sm:text-base max-w-xl mx-auto mt-4 leading-relaxed font-sans font-light">
                  Explore local high-end salons, consult our elite Gemini AI Personal Stylist, and secure bespoke treatment times instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8 items-center justify-center">
                  <button
                    onClick={scrollToSelector}
                    className="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-950 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 text-xs tracking-wider uppercase font-mono font-bold py-3.5 px-7 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Explore Sanctuaries
                  </button>
                  <button
                    onClick={() => setActiveTab("vision")}
                    className="w-full sm:w-auto bg-stone-900/80 hover:bg-stone-900 border border-[#c5a880]/30 text-[#c5a880] text-xs tracking-wider uppercase font-mono font-bold py-3.5 px-7 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> Analyze Symmetry
                  </button>
                </div>
              </div>
            </section>

            {/* NEIGHBORHOOD CURATED GRID */}
            <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16 w-full">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2.5 border-b border-stone-200 dark:border-stone-800 pb-5 mb-10">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-[#a48259] uppercase font-bold">LOCALIZED CITIES</p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mt-1">
                    Discover local hues
                  </h2>
                </div>
                <p className="text-stone-500 text-xs sm:text-sm max-w-sm mt-0.5">
                  Filter localized salon hubs across four highly distinct designer neighbourhoods in Bengaluru
                </p>
              </div>

              {/* Grid mapping neighborhoods list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {neighborhoods.map((hood) => {
                  const isActive = selectedNeighborhood === hood.name;
                  return (
                    <div
                      key={hood.id}
                      onClick={() => {
                        setSelectedNeighborhood(isActive ? "" : hood.name);
                        scrollToSelector();
                      }}
                      className={`group relative rounded-xl overflow-hidden aspect-video shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border ${
                        isActive
                          ? "border-[#a48259] ring-2 ring-[#a48259]/30 shadow-lg"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <img
                        src={hood.image}
                        alt={hood.name}
                        className="w-full h-full object-cover origin-center duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/25 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="font-mono text-[8px] uppercase text-[#c5a880] tracking-widest font-semibold bg-stone-900/60 py-0.5 px-2 rounded">
                          {hood.hubs} LUXE SANCTUARY
                        </span>
                        <h3 className="font-serif text-base font-bold mt-1 text-[#e5e0d8]">{hood.name}</h3>
                        <p className="text-[10.5px] text-stone-300 mt-0.5 truncate">{hood.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DIRECTORIES AND MAP PORTALS LISTING */}
            <section
              ref={interactivePortalRef}
              id="portal-listings"
              className="w-full border-t border-stone-200 dark:border-stone-800 py-16 sm:py-20 max-w-7xl mx-auto px-6"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-5 mb-10 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-[#a48259] uppercase font-bold">DIRECTORY PORTAL</p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mt-1">
                    Exquisite Havens
                  </h2>
                </div>
                
                {/* Search Bar HUD */}
                <div className="relative w-full max-w-md shrink-0">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="salon-search-textbox"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sanctuary names, features, hair treatments..."
                    className="w-full text-stone-800 dark:text-stone-100 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-[#a48259] bg-white dark:bg-stone-900 placeholder-stone-400"
                  />
                </div>
              </div>

              {/* Filtering pilles Row */}
              <div className="flex flex-wrap items-center gap-1.5 mb-8">
                {["ALL", "HAIR", "SKIN", "SPA", "GROOMING"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`py-1.5 px-3.5 rounded-full border text-[11px] font-mono tracking-wider uppercase transition-all duration-300 font-semibold ${
                      activeCategory === cat
                        ? "bg-stone-950 dark:bg-stone-800 border-stone-950 dark:border-stone-700 text-white shadow"
                        : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {selectedNeighborhood && (
                  <button
                    onClick={() => setSelectedNeighborhood("")}
                    className="py-1.5 px-3 rounded-full border border-[#c5a880]/30 bg-[#a48259]/5 text-[#a48259] text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1"
                  >
                    hood: {selectedNeighborhood} <span>×</span>
                  </button>
                )}
              </div>

              {/* Big Interactive Directories split rows */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Real-time matched salons catalogue rows (Col span 5) */}
                <div className="lg:col-span-5 flex flex-col gap-4 max-h-[620px] overflow-y-auto pr-1">
                  {filteredSalons.length > 0 ? (
                    filteredSalons.map((salon) => {
                      const isFocused = selectedMapSalon?.id === salon.id;                      return (
                        <div
                          key={salon.id}
                          id={`salon-list-card-${salon.id}`}
                          onClick={() => setSelectedMapSalon(salon)}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                            isFocused
                              ? "bg-stone-50 dark:bg-stone-900 border-[#a48259] ring-1 ring-[#a48259]/20 shadow-md text-stone-900 dark:text-stone-100"
                              : "bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 text-stone-800 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-sm"
                          }`}
                        >
                          <img
                            src={salon.image}
                            alt={salon.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-stone-100 dark:border-stone-800 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-mono text-[8.5px] uppercase text-[#a48259] tracking-widest font-bold">
                                    {salon.neighborhood} HUB
                                  </span>
                                  {salon.badge && (
                                    <span className="bg-[#D4AF37]/20 text-[#a48259] text-[8.5px] px-2 py-0.5 font-bold font-mono uppercase tracking-wide border border-[#D4AF37]/30 flex items-center gap-0.5">
                                      ★ {salon.badge}
                                    </span>
                                  )}
                                  {salon.tag && (
                                    <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[8.5px] px-2 py-0.5 font-semibold font-mono uppercase tracking-wide">
                                      {salon.tag}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  id={`wishlist-toggle-list-${salon.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(salon.id);
                                  }}
                                  className="text-stone-400 hover:text-rose-500 p-1 rounded-full transition-all cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                                  title={wishlist.includes(salon.id) ? "Remove from wishlist" : "Save to wishlist"}
                                >
                                  <Heart
                                    className={`w-3.5 h-3.5 transition-transform duration-200 active:scale-125 ${
                                      wishlist.includes(salon.id) ? "text-rose-500 fill-rose-500" : ""
                                    }`}
                                  />
                                </button>
                              </div>
                              <h3 className="font-serif text-sm font-bold text-stone-950 dark:text-stone-100 mt-0.5 truncate">
                                {salon.name}
                              </h3>
                              <p className="text-stone-400 text-[10.5px] line-clamp-2 mt-0.5 leading-snug">
                                {salon.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-1.5 pt-2 mt-auto border-t border-stone-100 dark:border-stone-800 flex-wrap">
                              <span className="flex items-center gap-0.5 font-medium text-xs text-amber-500 font-serif">
                                <Star className="w-3 h-3 fill-current" /> {salon.rating}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFocusedSalon(salon);
                                    setPreselectedStylistId(null);
                                    setModalInitialTab("contact");
                                    setIsDetailModalOpen(true);
                                  }}
                                  className="text-[10px] text-stone-600 dark:text-stone-400 hover:text-[#a48259] dark:hover:text-[#c5a880] font-mono uppercase tracking-wider font-semibold border border-stone-200 dark:border-stone-800 hover:border-[#a48259]/30 rounded px-2 py-0.5 transition-colors duration-200 cursor-pointer"
                                  title="Connect directly or send VIP inquiry"
                                >
                                  Contact Us
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFocusedSalon(salon);
                                    setPreselectedStylistId(null);
                                    setModalInitialTab("services");
                                    setIsDetailModalOpen(true);
                                  }}
                                  className="text-[10px] text-[#a48259] hover:text-[#8e7251] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-0.5"
                                >
                                  Book &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-stone-100 border border-stone-200 text-stone-600 rounded-xl p-8 text-center my-auto">
                      <Compass className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="font-serif font-bold text-sm">No sanctuary matches</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Try altering your diagnostic specialty categories or search keywords.</p>
                      <button
                        onClick={() => {
                          setSelectedNeighborhood("");
                          setSearchTerm("");
                          setActiveCategory("ALL");
                        }}
                        className="mt-4 text-xs underline text-[#a48259] font-semibold"
                      >
                        Reset Filter Options
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Side: Map Viewer matching coordinate markers (Col span 7) */}
                <div className="lg:col-span-7">
                  <MapContainer
                    salons={filteredSalons}
                    selectedSalon={selectedMapSalon}
                    onSelectSalon={(sl) => setSelectedMapSalon(sl)}
                    onViewSalonDetails={(sl) => {
                      setFocusedSalon(sl);
                      setPreselectedStylistId(null);
                      setModalInitialTab("services");
                      setIsDetailModalOpen(true);
                    }}
                  />
                </div>
              </div>
            </section>

            {/* CURATED RECOMMENDED SERVICES BLOCK mapping Card 1 - Card 4 */}
            <section className="bg-stone-900 text-white py-16 sm:py-20 w-full">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-5 mb-10 border-b border-stone-800">
                  <div>
                    <p className="font-mono text-[9px] tracking-widest text-[#c5a880] uppercase font-bold">LUXURY SPECIAliTIES</p>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#e5e0d8] mt-1">Curated Specialty Treatments</h2>
                  </div>
                  <p className="text-stone-400 text-xs sm:text-sm max-w-sm mt-0.5">
                    Click any curated specialty below to launch priority calendar reservation checkouts prefilled automatically
                  </p>
                </div>

                {/* Grid mapping treatments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {treatments.map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => handleQuickBookTreatment(tr)}
                      className="group bg-stone-950 rounded-xl overflow-hidden border border-stone-800 hover:border-[#c5a880]/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={tr.image}
                          alt={tr.title}
                          className="w-full h-full object-cover duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-950/20" />
                        <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold tracking-wider text-white bg-stone-950/70 py-1 px-3.5 rounded">
                          {tr.tag}
                        </span>
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-serif text-sm font-semibold text-[#e5e0d8] group-hover:text-[#c5a880] mt-0.5 leading-snug">
                          {tr.title}
                        </h4>
                        <p className="text-stone-400 text-[11px] leading-relaxed mt-2 line-clamp-3">
                          {tr.desc}
                        </p>
                        
                        <div className="flex items-center justify-between gap-2 border-t border-stone-800/60 pt-3.5 mt-auto">
                          <span className="text-[#c5a880] font-serif font-bold text-sm">₹{tr.price.toLocaleString("en-IN")}</span>
                          <span className="text-[10.5px] text-stone-500 font-mono font-medium">{tr.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* EDITORS PICKS GALLERY GRID */}
            <section className="py-16 sm:py-20 w-full max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-5 mb-10 border-b border-stone-200">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-[#a48259] uppercase font-bold">CRITICS CHOICE</p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-1">Editor's Chosen Picks</h2>
                </div>
                <p className="text-stone-500 text-xs sm:text-sm max-w-sm mt-0.5">
                  The absolute highest rated sanctuaries selected for outstanding service mastery this season
                </p>
              </div>

              {/* Curated Grid matching pics 1 - pics 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {editorsPicks.map((pick) => (
                  <div
                    key={pick.id}
                    className="group bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={pick.image}
                        alt={pick.title}
                        className="w-full h-full object-cover duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/80 text-white font-mono text-[8px] uppercase tracking-wider py-1 px-3.5 rounded font-bold">
                        {pick.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm shadow border border-stone-200 py-1 px-2.5 rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="font-serif text-stone-900 text-xs font-bold leading-none">{pick.rating}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <span className="font-mono text-[8.5px] uppercase font-bold text-[#a48259]">{pick.salon}</span>
                      <h4 className="font-serif text-stone-950 font-bold mt-1 text-sm leading-snug">{pick.title}</h4>
                      <p className="text-stone-400 text-[10.5px] mt-1">Specially endorsed by aesthetic advisory committees.</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Beauty Concierge panel */}
        {activeTab === "concierge" && (
          <section className="w-full max-w-4xl px-4 py-8 md:py-12 flex flex-col gap-8 animate-fade-in">
            <AIConcierge salons={salons} onBookRecommended={handleBookStylistMatch} />
          </section>
        )}

        {/* Tab 3: Facial Diagnostic Webcam Scanning panel */}
        {activeTab === "vision" && (
          <section className="w-full max-w-4xl px-4 py-8 md:py-12 flex flex-col gap-8 animate-fade-in">
            <WebcamDiagnostic salons={salons} onBookRecommended={handleBookStylistMatch} />
          </section>
        )}

        {/* Tab 4: My Wishlist panel */}
        {activeTab === "wishlist" && (
          <section className="w-full max-w-6xl px-6 py-12 flex flex-col gap-8 animate-fade-in">
            <div className="border-b border-stone-200 pb-5">
              <p className="font-mono text-[9px] tracking-widest text-[#a48259] uppercase font-bold">SAVED SANCTUARIES</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-1">My Curated Wishlist</h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Your personally selected luxury havens across Bengaluru. Reserve bespoke styling treatments instantly.
              </p>
            </div>

            {salons.filter((s) => wishlist.includes(s.id)).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {salons
                  .filter((s) => wishlist.includes(s.id))
                  .map((salon) => (
                    <div
                      key={salon.id}
                      id={`wishlist-card-${salon.id}`}
                      className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300"
                    >
                      {/* Image header with quick action heart button overlays */}
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={salon.image}
                          alt={salon.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                        
                        {/* Remove heart action overlay */}
                        <button
                          type="button"
                          id={`wishlist-remove-overlay-${salon.id}`}
                          onClick={() => toggleWishlist(salon.id)}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-full p-2 shadow-md transition-all cursor-pointer flex items-center justify-center border-none"
                          title="Remove from Wishlist"
                        >
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </button>

                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <span className="font-mono text-[8px] uppercase text-[#c5a880] tracking-widest font-semibold bg-stone-950/70 py-0.5 px-2 rounded">
                            {salon.neighborhood} HUB
                          </span>
                          <h3 className="font-serif text-sm font-bold mt-1.5">{salon.name}</h3>
                        </div>
                      </div>

                      {/* Info & services trigger */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                        <div>
                          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                            {salon.description}
                          </p>
                          <div className="flex items-center gap-3 mt-3 text-stone-500 text-xs">
                            <span className="flex items-center gap-0.5 font-medium text-amber-500 font-serif">
                              <Star className="w-3.5 h-3.5 fill-current" /> {salon.rating}
                            </span>
                            <span>•</span>
                            <span className="text-[#a48259] font-mono text-[10.5px] font-semibold">{salon.priceTier}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-stone-100 mt-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setFocusedSalon(salon);
                              setPreselectedStylistId(null);
                              setModalInitialTab("services");
                              setIsDetailModalOpen(true);
                            }}
                            className="bg-stone-900 hover:bg-stone-950 text-white text-xs font-mono py-2 px-4 rounded-xl shadow-sm hover:scale-[1.02] transition-all uppercase tracking-wider font-semibold text-center w-full cursor-pointer"
                          >
                            Reserve Treatment &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto w-full my-8">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-sm mx-auto">
                  As you browse our exquisite sanctuaries directories, tap the heart icon on any venue to save it to your personal favorites catalog here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("discovery")}
                  className="mt-6 bg-[#a48259] hover:bg-[#8e7251] text-white text-xs font-mono font-semibold py-3 px-6 rounded-xl transition-all uppercase tracking-wider cursor-pointer shadow-md inline-block"
                >
                  Explore Sanctuaries Now
                </button>
              </div>
            )}
          </section>
        )}

        {/* Tab: My Appointments / Bookings */}
        {activeTab === "appointments" && (
          <section className="w-full max-w-6xl px-6 py-12 flex flex-col gap-8 animate-fade-in" id="aura-appointments-section">
            <div className="border-b border-stone-200 pb-5">
              <p className="font-mono text-[9px] tracking-widest text-[#a48259] uppercase font-bold">RESERVATION VAULT</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-1">My Secure Appointments</h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Review your upcoming bespoke treatments, download calendar invites, or manage active luxury bookings.
              </p>
            </div>

            {bookings.length > 0 ? (
              <div className="flex flex-col gap-6 w-full">
                {bookings.map((booking, idx) => {
                  const basePrice = booking.service.price;
                  const luxuryTaxRate = 0.18;
                  const serviceCharge = basePrice > 0 ? 150 : 0;
                  const totalTaxOutput = Math.round(basePrice * luxuryTaxRate);
                  const grandTotalDecimal = basePrice > 0 ? basePrice + totalTaxOutput + serviceCharge : 0;
                  const formatPrice = (value: number) => "₹" + Math.round(value).toLocaleString("en-IN");
                  
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300"
                    >
                      {/* Salon image on the side / top */}
                      <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 bg-stone-150">
                        <img
                          src={booking.salon.image}
                          alt={booking.salon.name}
                          className="w-full h-full object-cover transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-neutral-950/20" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <span className="font-mono text-[8px] uppercase text-[#c5a880] tracking-widest font-semibold bg-stone-950/80 py-0.5 px-2 rounded border border-[#c5a880]/30">
                            {booking.salon.neighborhood} HUB
                          </span>
                          <h3 className="font-serif text-sm font-bold mt-1.5">{booking.salon.name}</h3>
                        </div>
                      </div>

                      {/* Content main */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-stone-600 font-sans">
                          {/* Section 1: Treatment & Salon details */}
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-1">
                              <span className="bg-[#a48259]/10 text-[#a48259] text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {booking.service.category}
                              </span>
                              <span className="bg-stone-100 text-stone-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Bespoke Session
                              </span>
                            </div>
                            <h4 className="font-serif text-stone-900 font-bold text-sm leading-snug mt-1">
                              {booking.service.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mt-0.5">
                              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span>Duration: {booking.service.duration}</span>
                            </div>
                            <p className="text-[10px] text-stone-400 mt-1.5 leading-relaxed bg-stone-50 p-2 rounded">
                              <strong className="text-stone-600">Venue Address:</strong><br />
                              {booking.salon.address}
                            </p>
                          </div>

                          {/* Section 2: Date, Time & Stylist */}
                          <div className="flex flex-col gap-2.5">
                            <p className="font-mono text-[9px] tracking-wider text-stone-400 font-semibold uppercase">Schedule Details & Host</p>
                            <div className="flex flex-col gap-2 mt-1">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[#a48259] shrink-0 border border-stone-200">
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-stone-900 font-semibold text-xs">{booking.date}</p>
                                  <p className="text-stone-400 text-[10px] uppercase font-mono tracking-wider">{booking.time}</p>
                                </div>
                              </div>
                              {booking.stylist && (
                                <div className="flex items-center gap-2 mt-1">
                                  <img
                                    src={booking.stylist.image}
                                    alt={booking.stylist.name}
                                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <p className="text-stone-900 font-semibold text-xs">{booking.stylist.name}</p>
                                    <p className="text-stone-400 text-[10px] uppercase font-mono tracking-wider">{booking.stylist.role}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Section 3: Client info & Receipt Sum */}
                          <div className="flex flex-col gap-2.5 md:border-l md:border-stone-150 md:pl-6">
                            <p className="font-mono text-[9px] tracking-wider text-stone-400 font-semibold uppercase">Secured Account & Invoice</p>
                            <div className="flex flex-col gap-1 mt-0.5 text-[11px]">
                              <p className="text-stone-900"><span className="text-stone-400">Guest Name:</span> {booking.customerName}</p>
                              <p className="text-stone-900"><span className="text-stone-400">Guest Phone:</span> {booking.customerPhone}</p>
                              {booking.notes && (
                                <p className="text-stone-400 italic line-clamp-1 mt-1 font-sans text-[10px]">"{booking.notes}"</p>
                              )}
                            </div>
                            <div className="border-t border-stone-100 pt-2.5 mt-2">
                              <div className="flex justify-between items-baseline">
                                <span className="text-[10px] text-stone-400 font-mono font-bold uppercase">GRAND TOTAL</span>
                                <span className="font-serif text-sm font-bold text-[#a48259]">{formatPrice(grandTotalDecimal)}</span>
                              </div>
                              <span className="text-[8.5px] text-stone-400 block text-right">Tax & service fee included</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-stone-100 items-center justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-mono text-[10px] bg-emerald-50 px-3 py-1 border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>RESERVATION SECURED</span>
                          </div>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Send Calendar Invite Button */}
                            <button
                              onClick={() => handleSendCalendarInvite(booking)}
                              type="button"
                              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-950 text-[#c5a880] hover:text-[#e5e0d8] text-xs font-mono font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm border border-stone-800"
                              title="Download .ics Calendar File"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Send Calendar Invite</span>
                            </button>

                            {/* Cancel Booking Button */}
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to cancel this booking? This action is irreversible.")) {
                                  setBookings((prev) => prev.filter((_b, bIdx) => bIdx !== idx));
                                }
                              }}
                              type="button"
                              className="p-2 border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-xl transition-all"
                              title="Cancel Appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto w-full my-8">
                <div className="w-12 h-12 bg-stone-100 text-[#a48259] rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">No appointments scheduled</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-sm mx-auto">
                  Your booking vault is empty. View our exclusive list of exquisite sanctuaries, select a therapeutic service and specialist, and book your session!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("discovery")}
                  className="mt-6 bg-[#a48259] hover:bg-[#8e7251] text-white text-xs font-mono font-semibold py-3 px-6 rounded-xl transition-all uppercase tracking-wider cursor-pointer shadow-md inline-block"
                >
                  Meet Our Master Stylists
                </button>
              </div>
            )}
          </section>
        )}

        {/* Tab 5: AI Onboarding beauty quiz */}
        {activeTab === "quiz" && (
          <section className="w-full max-w-6xl px-6 py-6 flex flex-col gap-8 animate-fade-in" id="aura-quiz-section">
            <AuraQuiz
              salons={salons}
              onOpenSalonDetails={(salon) => {
                setFocusedSalon(salon);
                setPreselectedStylistId(null);
                setModalInitialTab("services");
                setIsDetailModalOpen(true);
              }}
              onBookTreatment={(salon, stylistId, serviceId) => {
                setFocusedSalon(salon);
                setPreselectedStylistId(stylistId);
                setModalInitialTab("services");
                setIsDetailModalOpen(true);
              }}
            />
          </section>
        )}
      </main>

      {/* Global MODAL POPUPS */}
       {focusedSalon && (
        <SalonDetailModal
          salon={focusedSalon}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setPreselectedStylistId(null);
          }}
          onConfirmBooking={handleConfirmReservation}
          preselectedStylistId={preselectedStylistId}
          isWishlisted={wishlist.includes(focusedSalon.id)}
          onToggleWishlist={() => toggleWishlist(focusedSalon.id)}
          initialTab={modalInitialTab}
        />
      )}

      {lastBookingConfirmed && (
        <BookingConfirmationModal
          booking={lastBookingConfirmed}
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setLastBookingConfirmed(null);
          }}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-12 px-6 border-t border-stone-850 w-full mt-auto text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-serif text-sm font-semibold tracking-wide text-white">
              Aura <span className="text-[#c5a880]">&amp;</span> Gilt
            </p>
            <p className="text-[10px] text-stone-500 mt-1">Curated beauty directories &amp; personalized AI stylus consultations.</p>
          </div>
          <div className="flex gap-4 text-stone-500 font-mono text-[10px]">
            <span>© 2026 AURA &amp; GILT LTD. ALL RESERVED RIGHTS.</span>
            <span>•</span>
            <span>PRIVACY REGULATION</span>
            <span>•</span>
            <span>TERMS OF ENGAGEMENT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
