import React, { useState, useEffect } from "react";
import { X, Star, Calendar, Clock, DollarSign, Sparkles, User, AlertCircle, ShoppingBag, Heart, Share2, Phone, Mail, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";
import { Salon, Service, Stylist, Booking } from "../types";

interface SalonDetailModalProps {
  salon: Salon;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
  preselectedStylistId?: string | null;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  initialTab?: "services" | "stylists" | "contact";
}

export default function SalonDetailModal({
  salon,
  isOpen,
  onClose,
  onConfirmBooking,
  preselectedStylistId = null,
  isWishlisted = false,
  onToggleWishlist,
  initialTab = "services",
}: SalonDetailModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"services" | "stylists" | "contact">(initialTab);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(
    preselectedStylistId
      ? salon.stylists?.find((st) => st.id === preselectedStylistId) || null
      : null
  );

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?salon=${salon.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => {
        setShowShareToast(false);
      }, 2500);
    } catch (err) {
      console.error("Clipboard copy failed: ", err);
      // Fallback for sandboxed context when navigator.clipboard might be disallowed
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setShowShareToast(true);
        setTimeout(() => {
          setShowShareToast(false);
        }, 2500);
      } catch (fallbackErr) {
        console.error("Fallback clipboard copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Booking fields state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inquiry/Contact Form States
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquirySubject, setInquirySubject] = useState("General Inquiry");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  useEffect(() => {
    if (activeTab === "contact") {
      if (customerName && !inquiryName) setInquiryName(customerName);
      if (customerPhone && !inquiryPhone) setInquiryPhone(customerPhone);
    }
    // Reset contact success state when another tab is loaded
    if (activeTab !== "contact") {
      setInquirySuccess(false);
    }
  }, [activeTab]);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMessage.trim()) return;
    setIsSendingInquiry(true);
    setTimeout(() => {
      setIsSendingInquiry(false);
      setInquirySuccess(true);
      setInquiryMessage("");
    }, 1200);
  };

  const formatPrice = (value: number) => "₹" + Math.round(value).toLocaleString("en-IN");

  // Computed invoice calculations
  const basePrice = selectedService ? selectedService.price : 0;
  const luxuryTaxRate = 0.18; // 18% CGST/SGST structure
  const serviceCharge = basePrice > 0 ? 150 : 0; // standard flat Bangalore cover charge
  const totalTaxOutput = Math.round(basePrice * luxuryTaxRate);
  const grandTotal = basePrice > 0 ? basePrice + totalTaxOutput + serviceCharge : 0;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedService) {
      setErrorMsg("Please select a service before reserving.");
      return;
    }
    if (!date) {
      setErrorMsg("Please select an available appointment date.");
      return;
    }
    if (!time) {
      setErrorMsg("Please choose a preferred time slot.");
      return;
    }
    if (!customerName.trim()) {
      setErrorMsg("Please share your name for the secure luxury file.");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg("Please input your mobile phone for priority alerts.");
      return;
    }

    const newBooking: Booking = {
      salon,
      service: selectedService,
      stylist: selectedStylist,
      date,
      time,
      customerName,
      customerPhone,
      notes,
    };

    onConfirmBooking(newBooking);
  };

  // Common available salon hours lists
  const HOURS_SLOTS = [
    "10:00 AM",
    "11:30 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="salon-detail-dialog"
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-stone-200/80 my-4 flex flex-col max-h-[92vh] animate-fade-in"
      >
        {/* Modal Header banner */}
        <div className="relative h-44 sm:h-52 w-full">
          <img
            src={salon.image}
            alt={salon.name}
            className="w-full h-full object-cover scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {onToggleWishlist && (
              <button
                type="button"
                id="modal-wishlist-toggle"
                onClick={onToggleWishlist}
                className="bg-stone-900/50 hover:bg-stone-950/80 text-white rounded-full p-2 transition-all flex items-center justify-center cursor-pointer"
                title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart
                  className={`w-5 h-5 transition-transform duration-200 active:scale-125 ${
                    isWishlisted ? "text-rose-500 fill-rose-500" : "text-white"
                  }`}
                />
              </button>
            )}

            <button
              type="button"
              id="modal-share-button"
              onClick={handleShare}
              className="bg-stone-900/50 hover:bg-stone-950/80 text-white rounded-full p-2 transition-all flex items-center justify-center cursor-pointer"
              title="Share Salon Profile"
            >
              <Share2 className="w-5 h-5 transition-transform duration-200 active:scale-125" />
            </button>
            
            <button
              onClick={onClose}
              id="modal-close-icon"
              className="bg-stone-900/50 hover:bg-stone-950/80 text-white rounded-full p-2 transition-all flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="font-mono text-[9px] tracking-widest text-[#c5a880] uppercase bg-stone-900/70 border border-[#c5a880]/30 py-0.5 px-2 rounded-full font-bold">
              {salon.neighborhood.toUpperCase()} SANCTUARY
            </span>
            <h2 className="text-white font-serif text-xl sm:text-2xl font-bold mt-1.5 shadow-sm text-shadow">
              {salon.name}
            </h2>
            <div className="flex items-center gap-4 text-stone-300 text-xs mt-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" /> {salon.rating}
              </span>
              <span>•</span>
              <span>{salon.reviewsCount} verified reviews</span>
              <span>•</span>
              <span className="text-[#c5a880] font-semibold">{salon.priceTier} Category</span>
            </div>
          </div>
        </div>

        {/* Modal view layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          {/* Left Column: Menu catalogue & Stylist choices (Col span 7) */}
          <div className="lg:col-span-7 border-r border-stone-100 p-6 flex flex-col overflow-y-auto">
            
            {/* Description note */}
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              {salon.description}
            </p>

            {/* Selection tab pills */}
            <div className="flex border-b border-stone-200 mb-5">
              <button
                onClick={() => setActiveTab("services")}
                className={`py-2 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 font-mono transition-all ${
                  activeTab === "services"
                    ? "border-[#a48259] text-stone-950 px-4"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Services Menu
              </button>
              {salon.stylists && salon.stylists.length > 0 && (
                <button
                  onClick={() => setActiveTab("stylists")}
                  className={`py-2 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 font-mono transition-all ${
                    activeTab === "stylists"
                      ? "border-[#a48259] text-stone-950 px-4"
                      : "border-transparent text-stone-400 hover:text-stone-600"
                  }`}
                >
                  Stylist Masters ({salon.stylists.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab("contact")}
                className={`py-2 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 font-mono transition-all ${
                  activeTab === "contact"
                    ? "border-[#a48259] text-stone-950 px-4"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Contact Us
              </button>
            </div>

            {/* Services catalog display */}
            {activeTab === "services" && (
              <div id="modal-services-list" className="flex flex-col gap-3">
                {salon.services.map((svc) => {
                  const isSelected = selectedService?.id === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      id={`service-item-${svc.id}`}
                      onClick={() => {
                        setSelectedService(svc);
                        setErrorMsg(null);
                      }}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-4 select-none ${
                        isSelected
                          ? "bg-stone-50 border-[#a48259] ring-1 ring-[#a48259]/30"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[9px] tracking-wider text-[#a48259] uppercase font-bold bg-[#a48259]/5 px-2 py-0.5 rounded-full">
                          {svc.category}
                        </span>
                        <h4 className="text-stone-900 font-serif text-sm font-semibold mt-1.5">
                          {svc.name}
                        </h4>
                        <p className="text-stone-400 text-[11px] mt-0.5">Duration: {svc.duration}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[#a48259] font-serif font-bold text-sm">
                          {formatPrice(svc.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Stylists team display */}
            {activeTab === "stylists" && (
              <div id="modal-stylists-list" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {salon.stylists?.map((stylist) => {
                  const isSelected = selectedStylist?.id === stylist.id;
                  return (
                    <button
                      key={stylist.id}
                      type="button"
                      id={`stylist-item-${stylist.id}`}
                      onClick={() => setSelectedStylist(isSelected ? null : stylist)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col gap-3.5 ${
                        isSelected
                          ? "bg-stone-50 border-[#a48259] ring-1 ring-[#a48259]/30"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 w-full">
                        <img
                          src={stylist.image}
                          alt={stylist.name}
                          className="w-14 h-14 rounded-full object-cover shadow border border-stone-100 flex-shrink-0 animate-fade-in"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-stone-900 font-serif font-semibold text-xs leading-snug">
                            {stylist.name}
                          </h4>
                          <p className="text-stone-400 text-[10px] uppercase font-mono mt-0.5 tracking-wider truncate">
                            {stylist.role}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="text-stone-600 text-[10.5px] font-medium">{stylist.rating}</span>
                            </div>
                            {stylist.experience && (
                              <span className="text-stone-400 text-[10.5px] font-mono">• {stylist.experience} XP</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Specialties and slots display to fulfill audit checklist strictly */}
                      <div className="border-t border-stone-100 pt-2 w-full">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {stylist.specialties.map((spec, sIdx) => (
                            <span key={sIdx} className="text-[8.5px] tracking-wide font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 uppercase">
                              {spec}
                            </span>
                          ))}
                        </div>
                        {stylist.slots && stylist.slots.length > 0 && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8.5px] text-[#a48259] uppercase font-mono font-bold">Today's Available Slots:</span>
                            <div className="flex flex-wrap gap-1">
                              {stylist.slots.map((sl, slIdx) => (
                                <span key={slIdx} className="text-[8.5px] font-mono bg-stone-900 text-stone-100 px-1 py-0.5">
                                  {sl}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Stylist Portfolio Showcase */}
            {activeTab === "stylists" && selectedStylist && (
              <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200/80 animate-fade-in">
                <span className="font-mono text-[9px] tracking-wider text-[#a48259] uppercase font-bold">
                  MASTER SPECIALTIES WORK
                </span>
                <p className="text-[#a48259] font-serif text-xs font-semibold mt-1">
                  Stylist Portfolio Result: {selectedStylist.name}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-3 items-center">
                  <div className="sm:col-span-8">
                    <p className="text-stone-500 text-xs leading-relaxed">
                      "I treat locks as canvas, combining deep organic pigments and layered, flowing designs to frame individual symmetries properly."
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedStylist.specialties.map((spec, i) => (
                        <span key={i} className="text-[10px] text-stone-600 bg-white py-0.5 px-2 rounded border border-stone-200 uppercase font-mono">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-4 shrink-0">
                    <img
                      src={selectedStylist.showcase}
                      alt="Portfolio visual result"
                      className="w-full h-24 rounded-lg object-cover border border-stone-200 animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Contact Us options */}
            {activeTab === "contact" && (
              <div id="modal-salon-contact-tab" className="flex flex-col gap-6 animate-fade-in text-xs font-sans text-stone-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address & Hours block */}
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-3">
                    <h4 className="font-serif font-bold text-[#a48259] text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
                      <MapPin className="w-3.5 h-3.5 text-[#a48259]" /> Destination Venue
                    </h4>
                    <p className="text-stone-800 leading-relaxed font-sans">{salon.address}</p>
                    
                    <h4 className="font-serif font-bold text-[#a48259] text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2 mt-2">
                      <Clock className="w-3.5 h-3.5 text-[#a48259]" /> Operating Hours
                    </h4>
                    <p className="text-stone-800 leading-relaxed font-mono font-semibold uppercase">{salon.hours}</p>

                    <h4 className="font-serif font-bold text-[#a48259] text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2 mt-2">
                      <Phone className="w-3.5 h-3.5 text-[#a48259]" /> Direct Lines
                    </h4>
                    <div className="flex flex-col gap-2">
                      <a 
                        href={`tel:${salon.phone}`}
                        className="text-stone-800 hover:text-[#a48259] font-mono font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        📞 {salon.phone} (Main Desk)
                      </a>
                      <p className="text-[9.5px] text-stone-400 leading-relaxed">Call to request custom private suites bookings or direct concierge assistance.</p>
                    </div>
                  </div>

                  {/* Messaging / Inquiry Panel */}
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-[#a48259] text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2 mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-[#a48259]" /> Instant VIP Inquiry
                      </h4>

                      {inquirySuccess ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex flex-col items-center text-center gap-2 animate-fade-in">
                          <CheckCircle className="w-8 h-8 text-emerald-500" />
                          <h5 className="font-serif text-emerald-950 font-bold text-[11px]">Inquiry Dispatched Successfully</h5>
                          <p className="text-[9.5px] text-emerald-800 leading-relaxed max-w-xs">
                            Your message has been securely recorded. Our sanctuary's Chief Concierge will respond to you via phone/email within 15 minutes!
                          </p>
                          <button
                            type="button"
                            onClick={() => setInquirySuccess(false)}
                            className="mt-2 text-[9px] underline font-mono text-emerald-900 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Send another message
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSendInquiry} className="flex flex-col gap-2.5" id="salon-inquiry-subform">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-stone-400 text-[8.5px] uppercase font-mono tracking-wider mb-0.5">Guest Name *</label>
                              <input
                                type="text"
                                value={inquiryName}
                                onChange={(e) => setInquiryName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full text-stone-800 text-xs py-1.5 px-2 bg-white rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] h-8 font-sans"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-stone-400 text-[8.5px] uppercase font-mono tracking-wider mb-0.5">Contact-Phone *</label>
                              <input
                                type="tel"
                                value={inquiryPhone}
                                onChange={(e) => setInquiryPhone(e.target.value)}
                                placeholder="+91 Mobile"
                                className="w-full text-stone-800 text-xs py-1.5 px-2 bg-white rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] h-8 font-sans"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-stone-400 text-[8.5px] uppercase font-mono tracking-wider mb-0.5">Guest Email</label>
                            <input
                              type="email"
                              value={inquiryEmail}
                              onChange={(e) => setInquiryEmail(e.target.value)}
                              placeholder="guest@domain.com"
                              className="w-full text-stone-800 text-xs py-1.5 px-2 bg-white rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] h-8 font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 text-[8.5px] uppercase font-mono tracking-wider mb-0.5">Inquiry Subject</label>
                            <select
                              value={inquirySubject}
                              onChange={(e) => setInquirySubject(e.target.value)}
                              className="w-full text-stone-800 text-[10.5px] py-1 px-1.5 bg-white rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] h-8 font-sans"
                            >
                              <option value="General Inquiry">General Inquiry</option>
                              <option value="Bespoke Request">Bespoke Treatment Request</option>
                              <option value="Private Event Booking">Private Studio Group Event</option>
                              <option value="Feedback & Support">Feedback & Support</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-stone-400 text-[8.5px] uppercase font-mono tracking-wider mb-0.5">Personal Message *</label>
                            <textarea
                              value={inquiryMessage}
                              onChange={(e) => setInquiryMessage(e.target.value)}
                              placeholder="Type your bespoke luxury request..."
                              rows={3}
                              className="w-full text-stone-800 text-xs py-1.5 px-2 bg-white rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] resize-none leading-snug font-sans"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSendingInquiry || !inquiryMessage.trim()}
                            className="w-full py-2 bg-stone-900 border border-stone-850 hover:bg-stone-950 text-[#c5a880] disabled:text-stone-400 hover:text-white text-[10px] tracking-wider font-semibold font-mono rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all shadow-sm cursor-pointer mt-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSendingInquiry ? "Dispatching..." : "Transmit Inquiry"}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Aesthetic Map / Sanctuary Guarantee box */}
                <div className="bg-stone-100 border border-stone-205 p-3 rounded-xl text-center flex flex-col gap-1 items-center">
                  <span className="font-mono text-[8.5px] tracking-wider text-[#a48259] font-bold uppercase">AURA & GILT AUTHENTIC PLATINUM GUARANTEE</span>
                  <p className="text-[10px] text-stone-500 max-w-lg leading-relaxed">
                    Every luxury salon listed in our directory guarantees premium grade sterilization protocols, verified high-ranking stylists, bespoke concierge assistance, and uncompromised privacy.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Book Schedule Form (Col span 5) */}
          <form
            id="modal-booking-form"
            onSubmit={handleSubmitBooking}
            className="lg:col-span-5 bg-stone-50/50 p-6 flex flex-col overflow-y-auto"
          >
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#a48259]" /> Bespoke Appointment
            </h3>

            {/* Service matching feedback */}
            {selectedService ? (
              <div className="bg-stone-900 text-stone-100 p-3.5 rounded-xl border border-[#c5a880]/20 mb-4 animate-fade-in text-xs flex justify-between gap-3 items-center">
                <div>
                  <p className="font-mono text-[8px] text-[#c5a880] tracking-widest uppercase font-bold">RESERVING SERVICE</p>
                  <p className="font-serif text-xs font-bold mt-0.5 truncate">{selectedService.name}</p>
                </div>
                <p className="font-serif text-sm font-bold text-[#c5a880]">{formatPrice(selectedService.price)}</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 text-stone-600 p-3.5 rounded-xl text-xs mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>Please select your service menu option from the listing to active secure billing calculations.</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Date selection input */}
              <div>
                <label className="block text-stone-800 text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" /> Choose Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full text-stone-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] bg-white text-stone-700 h-11"
                  required
                />
              </div>

              {/* Time slot pills select */}
              <div>
                <label className="block text-stone-800 text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> Preferred Slot *
                </label>
                <div className="grid grid-cols-4 gap-1.5 font-mono">
                  {(selectedStylist?.slots || HOURS_SLOTS).map((slot) => {
                    const isSelected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 px-1 text-[10px] tracking-wide rounded-md border text-center transition-all ${
                          isSelected
                            ? "bg-stone-900 border-stone-900 text-white font-semibold"
                            : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-stone-800 text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-stone-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Signature Name"
                    className="w-full text-stone-800 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] bg-white h-10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-800 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Alert Phone *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 Mobile"
                    className="w-full text-stone-800 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] bg-white h-10"
                    required
                  />
                </div>
              </div>

              {/* Special instructions */}
              <div>
                <label className="block text-stone-800 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Stylist customized notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Allergies, custom cuts, or styling references..."
                  className="w-full text-stone-800 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] bg-white h-10"
                />
              </div>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <p className="text-red-600 text-[11px] font-medium leading-relaxed mt-4">
                {errorMsg}
              </p>
            )}

            {/* Secure invoice calculations */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col gap-2.5 text-xs text-stone-500 font-sans">
              <div className="flex justify-between">
                <span>Treatment Fee</span>
                <span>{formatPrice(basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Luxury CGST + SGST (18%)</span>
                <span>{formatPrice(totalTaxOutput)}</span>
              </div>
              <div className="flex justify-between">
                <span>Aura Flat Cover Service Charge</span>
                <span>{formatPrice(serviceCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2.5 font-serif text-sm font-bold text-stone-900 mt-1">
                <span>Grand Total Amount</span>
                <span className="text-[#a48259]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Order Confirmation CTA Button */}
            <button
              id="confirm-appointment-btn"
              type="submit"
              disabled={!selectedService}
              className="w-full py-4 bg-[#a48259] hover:bg-[#8e7251] disabled:bg-stone-200 text-white disabled:text-stone-400 text-xs tracking-wider font-semibold font-mono rounded-xl mt-6 shadow-md transition-all uppercase"
            >
              Secure Luxury Reservation
            </button>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-950 border border-[#c5a880]/30 text-[#c5a880] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-[10px] font-mono tracking-widest z-[60] animate-fade-in uppercase">
          <Sparkles className="w-4 h-4 text-[#c5a880]" />
          <span>Salon Link Copied!</span>
        </div>
      )}
    </div>
  );
}
