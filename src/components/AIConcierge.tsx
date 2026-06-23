import React, { useState } from "react";
import { Sparkles, Loader2, ArrowRight, CheckCircle2, Award, Compass, MessageSquare } from "lucide-react";
import { AIConciergeResult, Salon } from "../types";

interface AIConciergeProps {
  salons: Salon[];
  onBookRecommended: (salonId: string, stylistId: string | null, serviceId?: string) => void;
}

export default function AIConcierge({ salons, onBookRecommended }: AIConciergeProps) {
  const [lookDescription, setLookDescription] = useState("");
  const [category, setCategory] = useState("HAIR");
  const [neighborhood, setNeighborhood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIConciergeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick preset suggestions matching luxury aesthetics
  const PRESET_LOOKS = [
    {
      text: "Warm copper-honey balayage with dimensional volume waves for high density layering.",
      cat: "HAIR",
    },
    {
      text: "Glassy hydrate facial dermal glow to target structural moisture with active lipid protection.",
      cat: "SKIN",
    },
    {
      text: "Deep somatic warm oil hair-follicle release with high density scalp misting.",
      cat: "SPA",
    },
    {
      text: "Minimalist hand-sculpted gel nail overlays with fine negative space geometric lines.",
      cat: "GROOMING",
    }
  ];

  const handlePresetClick = (preset: typeof PRESET_LOOKS[0]) => {
    setLookDescription(preset.text);
    setCategory(preset.cat);
  };

  const getClientMockConciergeHeuristics = (lookDesc: string, cat: string, hood: string): AIConciergeResult => {
    const descLower = lookDesc.toLowerCase();
    
    let recommendedSalonId = "gilded-mane";
    let recommendedSalonName = "Gilded Mane (Indiranagar)";
    let recommendedStylistId: string | null = "rohan-varma";
    let recommendedStylistName = "Rohan Varma";
    let suitabilityScore = 95;
    let facialHarmonyAnalysis = "Based on your dream look input, your facial features will benefit extensively from deep contrast tones and dimensional highlighting. Your structural profile is perfectly structured to embrace balanced movement and soft framing, adding natural highlights around the eye contour lines.";
    let stylingAdvice = "Use light botanic micro-mists periodically to restore organic luster. Gently massage organic styling oils into damp ends before diffuse blowdrying for optimal volume and structure.";
    let curatedTreatmentPlan = ["Signature Balayage + Olaplex Nourishment Session", "At-home Multi-peptide Scalp Revive drops"];

    if (descLower.includes("skin") || descLower.includes("face") || descLower.includes("glow") || descLower.includes("facial") || cat === "SKIN") {
      recommendedSalonId = "gilded-chair";
      recommendedSalonName = "The Gilded Chair (Lavelle Road)";
      recommendedStylistId = "priya-nair";
      recommendedStylistName = "Priya Nair";
      suitabilityScore = 98;
      facialHarmonyAnalysis = "Your request points strongly toward advanced aesthetic care. A customized micro-needling or gold-dust infusion will address structural hydration boundaries, yielding a glassy skin texture and luminous jawline contours.";
      stylingAdvice = "Apply professional lipid bar creams nightly. Protect the cellular barrier using titanium-dioxide sun defense and mist with pure rose hydrolat regularly.";
      curatedTreatmentPlan = ["Premium Micro-Needling Dermal Luster Glow", "Rose Hydro-lipid Nourishment Barrier misting"];
    } else if (descLower.includes("spa") || descLower.includes("relax") || descLower.includes("massage") || cat === "SPA") {
      recommendedSalonId = "velvet-room";
      recommendedSalonName = "The Velvet Room (Koramangala)";
      recommendedStylistId = "ananya-iyer-velvet";
      recommendedStylistName = "Ananya Iyer";
      suitabilityScore = 97;
      facialHarmonyAnalysis = "Your sensory profile highlights a vital need for tension release and deep hair-follicle restoration. A warm micro-mist scalp therapy combined with somatic trigger-point sequence will perfectly restore focus and organic flow.";
      stylingAdvice = "Avoid heavy silicone hair formulations. Brush your hair daily using wild boar bristle loops to trigger normal lipid micro-circulation in the cortex.";
      curatedTreatmentPlan = ["Elite Somatic Scalp Restoration Spa", "Organic Activated Charcoal Scalp exfoliating treatment"];
    } else if (hood === "UB City" || descLower.includes("luxury") || descLower.includes("ub")) {
      recommendedSalonId = "aura-gilt-ub";
      recommendedSalonName = "Aura & Gilt (UB City)";
      recommendedStylistId = "arjun-shetty";
      recommendedStylistName = "Arjun Shetty";
      suitabilityScore = 99;
      facialHarmonyAnalysis = "Finding a match in our UB City cloud-deck chambers matches your love of ultimate gilded opulence. Seeking treatment-grade 24K gold misting and private suite isolation from the busiest districts will maximize your professional tranquility and high-status aesthetic.";
      stylingAdvice = "Indulge in our soundproof sky-deck suite therapy when scheduling for absolute personal focus. Maintain active lift effects by misting with molecular thermal waters daily.";
      curatedTreatmentPlan = ["24K Gold Dust Facial & Lift", "Bespoke Sculpting Consultation"];
    }

    return {
      recommendedSalonId,
      recommendedSalonName,
      recommendedStylistId,
      recommendedStylistName,
      suitabilityScore,
      facialHarmonyAnalysis,
      stylingAdvice,
      curatedTreatmentPlan
    };
  };

  const handleQueryAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookDescription.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookDescription, category, neighborhood }),
      });

      if (!response.ok) {
        throw new Error("Beauty Concierge endpoint returned an error response");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.warn("Concierge API issue, using client-side fallback:", err);
      const fallback = getClientMockConciergeHeuristics(lookDescription, category, neighborhood);
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-concierge-panel" className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-stone-900 border border-[#c5a880]/30 shadow-inner">
          <Sparkles className="w-5 h-5 text-[#c5a880]" />
        </div>
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-stone-900">
            Aura AI Beauty Concierge
          </h2>
          <p className="text-stone-500 text-xs md:text-sm mt-0.5">
            Describe your look in plain terms and let premium AI curate your salon and stylist match
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters panel */}
        <form onSubmit={handleQueryAI} className="lg:col-span-6 flex flex-col gap-5">
          <div>
            <label className="block text-stone-800 text-xs font-semibold uppercase tracking-wider mb-2">
              Desirable aesthetic or treatment goals
            </label>
            <textarea
              id="concierge-look-textbox"
              value={lookDescription}
              onChange={(e) => setLookDescription(e.target.value)}
              placeholder="e.g. I desire a textured face-framing layer cut, blended with soft biscuit-cream highlights, and a lightweight somatic scalp repair therapy..."
              rows={4}
              maxLength={400}
              className="w-full text-stone-800 text-sm p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] focus:border-[#a48259] bg-stone-50/50 resize-none placeholder-stone-400"
            />
            <div className="flex justify-end text-stone-400 text-[10px] mt-1">
              {lookDescription.length}/400 characters
            </div>
          </div>

          {/* Quick presets list */}
          <div>
            <p className="text-stone-500 text-xs font-medium mb-2.5">
              Or, try a curated master preset suggestion:
            </p>
            <div className="flex flex-wrap gap-2 text-left">
              {PRESET_LOOKS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(p)}
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-medium py-1.5 px-3 rounded-lg border border-stone-200/80 hover:border-stone-300 transition-all text-left max-w-full truncate"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-800 text-xs font-semibold uppercase tracking-wider mb-2">
                Primary Specialty Focus
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-stone-700 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] focus:border-[#a48259] bg-stone-50/50 h-11"
              >
                <option value="HAIR">Hair Mastery</option>
                <option value="SKIN">Skin Luster / Aesthetics</option>
                <option value="SPA">Somatic Trichology & Head Spa</option>
                <option value="GROOMING">Premium Finishing Craft</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-800 text-xs font-semibold uppercase tracking-wider mb-2">
                Neighborhood
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-stone-700 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#a48259] focus:border-[#a48259] bg-stone-50/50 h-11"
              >
                <option value="">Any Premium Hub</option>
                <option value="Indiranagar">Indiranagar</option>
                <option value="Lavelle Road">Lavelle Road</option>
                <option value="UB City">UB City</option>
                <option value="Koramangala">Koramangala</option>
              </select>
            </div>
          </div>

          <button
            id="query-ai-concierge-btn"
            type="submit"
            disabled={loading || !lookDescription.trim()}
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white disabled:text-stone-400 font-medium text-xs tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border border-stone-800"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#c5a880]" />
                <span className="animate-pulse">CONSULTING ENSEMBLE SYSTEM...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#c5a880] fill-current" />
                <span>GENERATE MASTER CONSULTATION</span>
              </>
            )}
          </button>
        </form>

        {/* Real-time result panel right side */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          {loading && (
            <div className="h-full min-h-[340px] flex flex-col items-center justify-center bg-stone-50/80 rounded-2xl border border-dashed border-stone-200 p-8 text-center animate-pulse">
              <Compass className="w-10 h-10 text-[#a48259]/60 animate-spin mb-4" />
              <p className="font-serif text-base italic text-stone-700">"Harmonizing structural landmarks..."</p>
              <p className="text-[11px] text-[#a48259] font-mono tracking-widest mt-2 uppercase">Aesthetic matching in progress</p>
              <div className="max-w-xs space-y-2 mt-4 text-[11px] text-stone-400 leading-relaxed font-sans">
                <p>• Scanning localized luxury inventory indices</p>
                <p>• Reviewing master stylist scheduling capacities</p>
                <p>• Processing face-shape suitability metrics</p>
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="h-full min-h-[340px] flex flex-col items-center justify-center bg-stone-50/30 rounded-2xl border border-stone-200 p-8 text-center">
              <Award className="w-10 h-10 text-stone-300 mb-3" />
              <p className="font-serif text-stone-800 text-sm font-medium mb-1">
                Your bespoke aesthetic report will display here
              </p>
              <p className="text-[11px] text-stone-400 max-w-sm mt-0.5">
                Input your desire or pick a luxury preset look on the left, then trigger our Gemini AI suite to scan optimal pairings.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 text-center my-auto">
              <p className="text-red-700 text-xs font-semibold">{error}</p>
            </div>
          )}

          {!loading && result && (
            <div
              id="concierge-outcome-report"
              className="bg-stone-50/70 border border-stone-200/80 rounded-2xl p-5 md:p-6 shadow-inner animate-fade-in flex flex-col gap-5 h-full"
            >
              {/* Suitability Badge Header */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-[#a48259] font-bold">YOUR SIGNATURE REPORT</p>
                  <h4 className="text-stone-900 font-serif text-lg font-bold mt-0.5">Aesthetic Consultation</h4>
                </div>
                <div className="bg-white border border-[#c5a880]/30 py-2 px-3.5 rounded-xl shadow-sm text-center">
                  <p className="text-stone-400 text-[9px] uppercase font-mono tracking-wider font-semibold">SUITABILITY</p>
                  <p className="text-stone-900 font-serif text-xl font-bold mt-0.5">{result.suitabilityScore}%</p>
                </div>
              </div>

              {/* Match description and info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-stone-200/60 p-4 rounded-xl shadow-sm">
                <div>
                  <p className="text-stone-400 text-[10px] font-mono uppercase tracking-wider">MATCHeD SANCTUARY</p>
                  <h5 className="text-stone-800 font-serif text-sm font-semibold mt-0.5">{result.recommendedSalonName}</h5>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px] font-mono uppercase tracking-wider">RECOMMENDED MASTER</p>
                  <h5 className="text-stone-[#a48259] font-serif text-sm font-bold mt-0.5">{result.recommendedStylistName}</h5>
                </div>
              </div>

              {/* Deep Analysis Text items */}
              <div className="flex flex-col gap-4 text-xs text-stone-600 leading-relaxed font-sans">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#a48259] tracking-wider font-semibold mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-current" /> Facial Harmony Analysis
                  </p>
                  <p className="text-stone-600 text-xs bg-white/50 border border-stone-100 p-3 rounded-lg">{result.facialHarmonyAnalysis}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase text-[#a48259] tracking-wider font-semibold mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-400" /> Professional Styling Advice
                  </p>
                  <p className="text-stone-600 text-xs bg-white/50 border border-stone-100 p-3 rounded-lg">{result.stylingAdvice}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase text-stone-500 tracking-wider font-semibold mb-1.5">Curated Treatment Steps</p>
                  <div className="flex flex-col gap-1.5">
                    {result.curatedTreatmentPlan.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-stone-100/50 py-1.5 px-3 rounded-md text-stone-700 text-xs">
                        <span className="font-mono font-bold text-[#c5a880] w-4 shrink-0 text-right">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="pt-4 border-t border-stone-200 mt-auto">
                <button
                  id="concierge-book-stylist-btn"
                  onClick={() => onBookRecommended(result.recommendedSalonId, result.recommendedStylistId)}
                  className="w-full py-3 bg-[#a48259] hover:bg-[#8e7251] text-white font-medium text-xs tracking-wider rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-[#8e7251]"
                >
                  <span>Book {result.recommendedStylistName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
