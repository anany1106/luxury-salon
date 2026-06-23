import React, { useState } from "react";
import { MapPin, Star, Phone, Clock, ArrowRight } from "lucide-react";
import { Salon } from "../types";

interface MapContainerProps {
  salons: Salon[];
  selectedSalon: Salon | null;
  onSelectSalon: (salon: Salon) => void;
  onViewSalonDetails: (salon: Salon) => void;
}

export default function MapContainer({
  salons,
  selectedSalon,
  onSelectSalon,
  onViewSalonDetails,
}: MapContainerProps) {
  // Mock positioning of coordinates relative to the background map for premium touchpoints
  const coordinates: Record<string, { top: string; left: string }> = {
    "gilded-mane": { top: "35%", left: "62%" },
    "gilded-chair": { top: "55%", left: "40%" },
    "aura-gilt-ub": { top: "45%", left: "52%" },
    "velvet-room": { top: "72%", left: "30%" },
  };

  return (
    <div id="map-section-container" className="relative w-full h-[620px] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
      {/* Background Graphic representing the neighborhood directory */}
      <img
        id="bg-map-image"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_txRwihOTXjAfLYNrMeQ3WTQsV139_4Hbeg8Fp6LvTDpQTAsN9uNZvz8eWNV_RSKFhrq9_5UxHO_VIoUHecn_G7e1XLbWW53Y9AYUDFvBQTbNs34X3pz5suFXBZ6BpUiURjvStByJjbsZWX3IK6QJEBDAaw-w0XVAkSW1afrNImFD5uRxmaCZYnw60zdH0tQa_N_25QXyeTLpmvRX6SNMrcDgFmqu5hQsZTYZI-hsVggqsgBx1lyQCL3npyOM92cy5L2_14IB45k"
        alt="Aesthetic Luxury Map"
        className="w-full h-full object-cover grayscale opacity-95 brightness-[0.98]"
        referrerPolicy="no-referrer"
      />

      {/* Decorative Golden Ambient Overlay of maps */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-stone-100/40 pointer-events-none" />

      {/* Elegant HUD Map Title bar */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg border border-stone-200/80 shadow-md">
        <p className="font-mono text-[10px] tracking-widest text-[#a48259] font-bold">INTERACTIVE DIRECTORY & MAP</p>
        <p className="text-stone-800 text-xs font-medium">Click pins to explore localized sanctuaries</p>
      </div>

      {/* Salon Interactive Map Pins */}
      {salons.map((salon) => {
        const coords = coordinates[salon.id] || { top: "50%", left: "50%" };
        const isActive = selectedSalon?.id === salon.id;

        return (
          <div
            key={salon.id}
            id={`pin-marker-${salon.id}`}
            style={{ top: coords.top, left: coords.left }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            {/* Outer golden halo */}
            <button
              onClick={() => onSelectSalon(salon)}
              className={`relative flex items-center justify-center p-3 rounded-full transition-all duration-300 focus:outline-none group ${
                isActive
                  ? "bg-[#a48259] text-white shadow-lg scale-125"
                  : "bg-white text-[#a48259] border border-stone-200 hover:border-[#a48259] shadow-md hover:scale-110"
              }`}
            >
              {/* Spinning pulse glow effect */}
              <span className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                isActive ? "bg-[#a48259]" : "bg-[#c5a880]"
              }`} />
              <MapPin className="w-5 h-5 absolute" />
            </button>

            {/* Quick label on hover or when selected */}
            <div className={`absolute top-11 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white text-[10.5px] font-medium tracking-wide py-1 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-300 ${
              isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-1 group-hover:opacity-100 group-hover:scale-100"
            }`}>
              {salon.name}
            </div>
          </div>
        );
      })}

      {/* Elegant Split View Card Overlay at the bottom for Selected Salon previews */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        {selectedSalon ? (
          <div
            id="map-selected-salon-card"
            className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-xl overflow-hidden p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 max-w-3xl mx-auto transition-all duration-300 transform translate-y-0 animate-fade-in"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={selectedSalon.image}
                alt={selectedSalon.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-inner border border-stone-200 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[#a48259] bg-stone-100 py-0.5 px-2 rounded-full font-bold">
                  {selectedSalon.neighborhood.toUpperCase()}
                </span>
                <h3 className="text-stone-900 font-serif text-base font-semibold mt-1">
                  {selectedSalon.name}
                </h3>
                <div className="flex items-center gap-3 text-stone-500 text-xs mt-1">
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedSalon.rating}
                  </span>
                  <span>•</span>
                  <span>{selectedSalon.reviewsCount} reviews</span>
                  <span>•</span>
                  <span className="text-[#a48259] font-semibold">{selectedSalon.priceTier}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0">
              <div className="text-left md:text-right hidden xl:block mr-2 text-stone-500 text-xs">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-stone-400" /> {selectedSalon.hours}</span>
                <span className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-stone-400" /> {selectedSalon.phone}</span>
              </div>
              <button
                id="map-detail-btn"
                onClick={() => onViewSalonDetails(selectedSalon)}
                className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs py-2.5 px-5 rounded-lg shadow transition-all duration-300"
              >
                View Services & Stylists
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-stone-900/90 backdrop-blur-md text-[#c5a880] py-4 px-6 rounded-xl border border-stone-800 shadow-2xl max-w-md mx-auto text-center">
            <p className="font-serif text-sm italic">
              "Every corner of the city hides a localized salon sanctuary."
            </p>
            <p className="text-[11px] text-stone-400 font-sans mt-1">
              Select or hover localized coordinates above to view our signature directory cards
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
