import React, { useState } from "react";
import { Check, Calendar, MapPin, User, FileText, Send, X, Phone, Download } from "lucide-react";
import { Booking } from "../types";

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

interface BookingConfirmationModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingConfirmationModal({
  booking,
  isOpen,
  onClose,
}: BookingConfirmationModalProps) {
  if (!isOpen) return null;

  const [whatsappSent, setWhatsappSent] = useState(false);

  // Generate a premium customized passcode
  const bookingPassCode = `AURA-${booking.salon.id.substring(0,3).toUpperCase()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  const basePrice = booking.service.price;
  const luxuryTaxRate = 0.18;
  const serviceCharge = basePrice > 0 ? 150 : 0;
  const totalTaxOutput = Math.round(basePrice * luxuryTaxRate);
  const grandTotalDecimal = basePrice > 0 ? basePrice + totalTaxOutput + serviceCharge : 0;

  const formatPrice = (value: number) => "₹" + Math.round(value).toLocaleString("en-IN");

  // Simulated WhatsApp notification text
  const whatsappMessage = `Hello ${booking.customerName}! Your luxury reservation at ${
    booking.salon.name
  } is secure under code *${bookingPassCode}*. Date: ${booking.date} at ${
    booking.time
  }. Treating Specialist: ${
    booking.stylist ? booking.stylist.name : "Our master team"
  }. Amount due: ${formatPrice(grandTotalDecimal)}. We await your presence!`;

  const handleSendWhatsApp = () => {
    // Generate valid WhatsApp send URL
    const cleanedPhone = booking.customerPhone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(whatsappMessage);
    const url = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
    
    // Simulate or trigger browser opens
    setWhatsappSent(true);
    try {
      window.open(url, "_blank");
    } catch (e) {
      console.log("Direct pop-up window.open blocked. Simulated alert instead.");
    }
  };

  const grandTotalString = formatPrice(grandTotalDecimal);

  return (
    <div className="fixed inset-0 bg-stone-900/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        id="booking-confirmation-dialog"
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 overflow-hidden animate-fade-in"
      >
        {/* Decorative Success Header Banner */}
        <div className="bg-stone-900 text-[#c5a880] p-6 text-center relative">
          <div className="w-12 h-12 bg-[#a48259] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border border-[#c5a880]/30 animate-pulse">
            <Check className="w-6 h-6 text-white" />
          </div>
          <p className="font-mono text-[9px] tracking-widest text-[#c5a880] font-bold">RESERVATION SECURED</p>
          <h2 className="font-serif text-lg font-bold text-white mt-1">Your Luxury Sanctuary Awaits</h2>
          <span className="absolute top-4 right-4 text-stone-500 font-serif italic text-xs">Aura & Gilt</span>
        </div>

        {/* Invoice Reservation Details */}
        <div className="p-6 flex flex-col gap-5 text-xs text-stone-600 font-sans">
          
          {/* Booking Referral Passcode Code */}
          <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl p-3.5 text-center">
            <p className="text-stone-400 text-[9px] tracking-wider font-mono font-semibold uppercase">PRIORITY ENTRY PASSCODE</p>
            <p className="text-stone-900 font-mono text-base font-bold tracking-widest mt-0.5">{bookingPassCode}</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Salon Details */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#a48259] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-stone-900 font-serif font-bold text-xs">{booking.salon.name}</h4>
                <p className="text-stone-400 text-[10px] mt-0.5">{booking.salon.address}</p>
              </div>
            </div>

            {/* Date time details */}
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#a48259] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-stone-900 font-semibold text-xs">
                  {booking.date} at {booking.time}
                </h4>
                <p className="text-stone-400 text-[10px] mt-0.5">Please arrive 10 minutes prior to session</p>
              </div>
            </div>

            {/* Client and treating master details */}
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-[#a48259] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-stone-900 font-semibold text-xs">
                  Guest: {booking.customerName}
                </h4>
                <p className="text-stone-500 text-[10.5px] mt-0.5">
                  Treating Master: <span className="font-semibold text-stone-900">{booking.stylist ? booking.stylist.name : "Our Luxury Master Team"}</span>
                </p>
              </div>
            </div>

            {/* Service matching details */}
            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#a48259] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-stone-900 font-semibold text-xs">
                  Service Selection: {booking.service.name}
                </h4>
                <span className="font-mono text-[9px] text-[#a48259] font-bold bg-[#a48259]/5 px-2 rounded-full mt-1 inline-block">
                  {booking.service.category}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout final sum */}
          <div className="border-t border-stone-200 pt-4 mt-1 flex justify-between items-center text-stone-900">
            <div>
              <p className="text-stone-400 text-[9px] uppercase tracking-wider font-mono font-semibold">Total Invoice Amount</p>
              <p className="text-stone-400 text-[10px] italic mt-0.5">includes 18% tax & service fees</p>
            </div>
            <p className="font-serif text-lg font-bold text-[#a48259]">{grandTotalString}</p>
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-stone-100">
            {/* Calendar invitation .ics file loader */}
            <button
              id="confirm-ics-calendar-btn"
              onClick={() => handleSendCalendarInvite(booking)}
              type="button"
              className="w-full py-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-950 text-[#c5a880] text-xs font-mono font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              Send Calendar Invite
            </button>

            {/* WhatsApp Alert Button */}
            <button
              id="confirm-whatsapp-btn"
              onClick={handleSendWhatsApp}
              type="button"
              className={`w-full py-2.5 rounded-xl text-xs font-mono font-semibold tracking-wider flex items-center justify-center gap-2 border shadow-sm transition-all ${
                whatsappSent
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-emerald-600 border-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {whatsappSent ? "Sent to WhatsApp!" : "Priority WhatsApp Notification"}
            </button>

            {/* Return card button callback */}
            <button
              id="close-confirm-btn"
              onClick={onClose}
              type="button"
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-all"
            >
              Close Invoice Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
