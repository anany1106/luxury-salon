import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass, User, DollarSign, MapPin, Star, Bookmark, Calendar } from "lucide-react";
import { Salon, Service, Stylist } from "../types";

interface OnboardingAnswers {
  hairOrSkinType: string;
  concern: string;
  philosophy: string;
  budget: string;
  location: string;
}

interface QuizResult {
  recommendedSalonId: string;
  recommendedSalonName: string;
  recommendedTreatmentId: string;
  recommendedTreatmentName: string;
  recommendedStylistId: string | null;
  recommendedStylistName: string;
  quizPersonaTitle: string;
  quizPersonaDescription: string;
  personalizedExplanation: string;
  actionableTips: string[];
}

interface AuraQuizProps {
  salons: Salon[];
  onOpenSalonDetails: (salon: Salon) => void;
  onBookTreatment: (salon: Salon, stylistId: string | null, serviceId: string) => void;
}

const QUESTIONS = [
  {
    id: "hairOrSkinType",
    title: "Classify Your Somatic Profile",
    subtitle: "Understanding your biological canvas is crucial for tailored longevity and vibrance.",
    options: [
      {
        value: "Fine & Straight / Sensitive Skin",
        label: "Fine & Straight / Sensitive Skin",
        desc: "Delicate fiber density or hyper-reactive skin desiring calming, nourishing equilibrium.",
        badge: "BALANCED CLEANSE"
      },
      {
        value: "Thick & Textured / Dry-Dehydrated Skin",
        label: "Thick & Textured / Dry-Dehydrated Skin",
        desc: "Robust hair volume or moisture-craving skin tissue in need of cellular lipid injection.",
        badge: "DEEP INTRALIPID"
      },
      {
        value: "Curly & Coiled / Acne-Prone & Pore-Clearing",
        label: "Curly & Coiled / Acne-Prone & Pore-Clearing",
        desc: "High-movement curls or detox-primed pores wanting clarifying botanical moisture.",
        badge: "BOTANICAL THERAPY"
      },
      {
        value: "Waves & Volume / Balanced Normal",
        label: "Waves & Volume / Balanced Normal",
        desc: "Dynamic flow waves and stable moisture margins suited for precision sculpted cuts.",
        badge: "SCULPTED FINISH"
      }
    ]
  },
  {
    id: "concern",
    title: "Focus of Aesthetic Attention",
    subtitle: "Identify your primary goal. Where should our diagnostic experts concentrate?",
    options: [
      {
        value: "Vivid couture coloring & dimensional balayage",
        label: "Vivid couture coloring & balayage",
        desc: "Bespoke hand-tinted highlights, metallic glazing, or high-definition tone transitions.",
        badge: "HAIR ARTISTRY"
      },
      {
        value: "Deep cellular skin purification & glow rejuvenation",
        label: "Deep cellular skin purification",
        desc: "Unveiling unmatched light reflecting profiles via micro-needling and premium gold dusts.",
        badge: "SKIN CLINICAL"
      },
      {
        value: "Stress release, somatic head spa & hair follicle care",
        label: "Stress release & head spa",
        desc: "Immersive relaxation, specialized warm water washes, and cortical pressure-point flows.",
        badge: "SOMATIC HEALTH"
      },
      {
        value: "Bespoke minimalist nail artistry & premium hand grooming",
        label: "Minimalist nail artistry",
        desc: "Sculpting pristine gel overlays and delicate hand-painted fine geometric line arts.",
        badge: "HAND ARTISTRY"
      }
    ]
  },
  {
    id: "philosophy",
    title: "Select Your Aesthetic Environment",
    subtitle: "We prioritize spaces that reflect your personality: from quiet green corners to elite skies.",
    options: [
      {
        value: "Ultra-Sleek Botanical Minimalist",
        label: "Botanical Minimalist",
        desc: "Clean geometry, leaf-rich organic compounds, and airy quietness with raw stone details.",
        badge: "ESSENTIAL SIMPLICITY"
      },
      {
        value: "Opulent Gilded Architectural Heritage",
        label: "Gilded Architectural",
        desc: "Bespoke floating mirror towers, premium acoustics, and magnificent high-cielings.",
        badge: "GRAND MAJESTY"
      },
      {
        value: "Discreet Private Club Confidential",
        label: "Discreet Confidential",
        desc: "Hidden tranquil lanes, absolute personal acoustic isolation, and elite VIP sky-decks.",
        badge: "EXCLUSIVE RETREAT"
      },
      {
        value: "Modern High-Tech Symmetry & Diagnostics",
        label: "High-Tech Precision",
        desc: "Algorithmic scanning, webcam diagnostics, and high-performance color metrics.",
        badge: "AESTHETIC CODING"
      }
    ]
  },
  {
    id: "budget",
    title: "Define Your Tier of Indulgence",
    subtitle: "Select the degree of curated styling and specialty ingredients for your visit.",
    options: [
      {
        value: "Comfort Premium (₹₹ - ₹₹₹)",
        label: "Comfort Premium (₹₹ - ₹₹₹)",
        desc: "Exceptional modern styling treatments executed by senior beauty practitioners.",
        badge: "ELITE BASE"
      },
      {
        value: "High-End Prestige (₹₹₹ - ₹₹₹₹)",
        label: "High-End Prestige (₹₹₹ - ₹₹₹₹)",
        desc: "Advanced treatment-grade protocols with custom trichology and private lounges.",
        badge: "CURATED SECRETS"
      },
      {
        value: "Elite Uncompromised Splurge (₹₹₹₹)",
        label: "Elite Uncompromised Splurge (₹₹₹₹)",
        desc: "VIP penthouse suites, master artistic directors, and top-shelf molecular elements.",
        badge: "ULTIMATE SPLURGE"
      }
    ]
  },
  {
    id: "location",
    title: "Preferred Physical Bengaluru Coordinate",
    subtitle: "Find luxury salons in your neighborhood or broaden coordinates to scan all.",
    options: [
      { value: "Indiranagar", label: "Indiranagar", desc: "Bustling architectural design hubs and vivid color studios.", badge: "EAST FLANK" },
      { value: "Lavelle Road", label: "Lavelle Road", desc: "Quiet, historical green-canopies of peak residential prestige.", badge: "HERITAGE CENTER" },
      { value: "UB City", label: "UB City", desc: "Exclusive luxury complex skyway suites and high-flying views.", badge: "LUXURY PEAK" },
      { value: "Koramangala", label: "Koramangala", desc: "Lush layout corners specializing in botanical and organic remedies.", badge: "SOUTH GARDENS" },
      { value: "Any Location / Surprise Me", label: "Any Location / Surprise Me", desc: "Broaden matching boundaries. Let our algorithm find your ideal sanctuary.", badge: "GLOBAL HUB" }
    ]
  }
];

function getClientMockQuizHeuristics(answers: OnboardingAnswers): QuizResult {
  const concern = (answers.concern || "").toLowerCase();
  const location = (answers.location || "").toLowerCase();
  const budget = (answers.budget || "").toLowerCase();
  const philosophy = (answers.philosophy || "").toLowerCase();

  let recommendedSalonId = "gilded-mane";
  let recommendedSalonName = "Gilded Mane";
  let recommendedTreatmentId = "s1_3";
  let recommendedTreatmentName = "Balayage";
  let recommendedStylistId: string | null = "rohan-varma";
  let recommendedStylistName = "Rohan Varma";
  let quizPersonaTitle = "The Absolute Gilded Purist";
  let quizPersonaDescription = "An advocate of elegant precision, you balance structural symmetry with rich, dimensional accents.";
  let personalizedExplanation = "Based on your focus on custom styling and Indiranagar's bustling artistic layout, Gilded Mane stands as your optimal sanctuary. Rohan Varma represents your ideal match: his world-class balayage expertise brings vibrant movement to fine and straight locks alike, matching your dream of opulent architectural precision.";
  let actionableTips = [
    "Schedule your structural balayage touch-ups every 8-10 weeks to prevent brassiness.",
    "Utilize a sulfate-free amino hair cleanse to preserve organic dye vibrance.",
    "Apply rich hydration balms after somatic hair washes to lock in structural moisture."
  ];

  if (concern.includes("skin") || concern.includes("dermal") || concern.includes("purification") || concern.includes("glow")) {
    recommendedSalonId = "gilded-chair";
    recommendedSalonName = "The Gilded Chair";
    recommendedTreatmentId = "s2_5";
    recommendedTreatmentName = "Facial/cleanup";
    recommendedStylistId = "priya-nair";
    recommendedStylistName = "Priya Nair";
    quizPersonaTitle = "The Luminous Dermal Alchemist";
    quizPersonaDescription = "You demand elite, uncompromised molecular skincare, seeking the supreme biological glow of botanical micro-treatments.";
    personalizedExplanation = "With your focus on skin glow and Lavelle Road's quiet heritage lanes, Priya Nair represents your aesthetic soulmate. Her award-winning collagen infusions and face sculpting methodologies will nurture your skin cells to mirror glassy perfections in a deeply confidential environment.";
    actionableTips = [
      "Avoid direct sun exposure for 48 hours post-needling to protect the cellular lipid barrier.",
      "Incorporate high-concentration peptide and squalane serums into your nightly beauty ritual.",
      "Sip warm adaptogenic botanic teas before your sessions to soothe skin nervous responses."
    ];
  } else if (concern.includes("somatic") || concern.includes("head spa") || concern.includes("stress")) {
    recommendedSalonId = "velvet-room";
    recommendedSalonName = "The Velvet Room";
    recommendedTreatmentId = "s4_7";
    recommendedTreatmentName = "Luxury spa package";
    recommendedStylistId = "ananya-iyer-velvet";
    recommendedStylistName = "Ananya Iyer";
    quizPersonaTitle = "The Botanical Serene Naturalist";
    quizPersonaDescription = "A devotee of holistic somatic therapies, organic hair remedies, and quiet meditative mindfulness.";
    personalizedExplanation = "Your focus on somatic stress relief and sensory balance aligns flawlessly with The Velvet Room's botanical sanctuary. Ananya Iyer is the ideal practitioner to guide your scalp revitalization; her mastery of trichological pressure-point trigger sequences guarantees a meditative escape.";
    actionableTips = [
      "Perform a three-minute pressure point scalp massage using pure cold-pressed rosemary oil weekly.",
      "Avoid heavy synthetics or silicone-heavy shampoo; embrace organic cold-process botanical washes.",
      "Pair your deep scalp restores with periodic steam micro-mists to optimize follicle pore breathability."
    ];
  } else if (location.includes("ub city") || budget.includes("uncompromised") || philosophy.includes("private club")) {
    recommendedSalonId = "aura-gilt-ub";
    recommendedSalonName = "Aura & Gilt — UB City";
    recommendedTreatmentId = "s3_8";
    recommendedTreatmentName = "Gold facial (24K)";
    recommendedStylistId = "arjun-shetty";
    recommendedStylistName = "Arjun Shetty";
    quizPersonaTitle = "The Elite VIP Sky-Suite Sovereign";
    quizPersonaDescription = "An uncompromised connoisseur of ultimate discretion, spectacular panoramic skywards views, and custom gold-dust therapies.";
    personalizedExplanation = "Finding a match in our UB City cloud-deck chambers matches your love of ultimate gilded opulence. Seeking treatment-grade 24K gold misting and private suite isolation from the busiest districts will maximize your professional tranquility and high-status aesthetic.";
    actionableTips = [
      "Indulge in our soundproof sky-deck suite therapy when scheduling for absolute personal focus.",
      "Maintain active hydrolifting effects by misting with molecular thermal waters daily.",
      "Complement your luxury therapy with bespoke couture styling trims pre-sessions."
    ];
  }

  return {
    recommendedSalonId,
    recommendedSalonName,
    recommendedTreatmentId,
    recommendedTreatmentName,
    recommendedStylistId,
    recommendedStylistName,
    quizPersonaTitle,
    quizPersonaDescription,
    personalizedExplanation,
    actionableTips
  };
}

export default function AuraQuiz({ salons, onOpenSalonDetails, onBookTreatment }: AuraQuizProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    hairOrSkinType: "",
    concern: "",
    philosophy: "",
    budget: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSelectOption = (value: string) => {
    const key = QUESTIONS[currentStep].id as keyof OnboardingAnswers;
    setAnswers((prev) => ({ ...prev, [key]: value }));

    // Small delay for smooth auto-advance feedback
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 200);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const activeQuestionValue = answers[QUESTIONS[currentStep].id as keyof OnboardingAnswers];

  const submitQuiz = async () => {
    setIsLoading(true);

    const steps = [
      "Analyzing biological profile variables...",
      "Mapping priority concerns against treatment diagnostics...",
      "Comparing space preferences with architecturally styled sanctuaries...",
      "Matching salon databases in Bengaluru...",
      "Finalizing your Bespoke Beauty Persona..."
    ];

    let stepIdx = 0;
    setLoadingText(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingText(steps[stepIdx]);
      }
    }, 700);

    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} status`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn("Quiz API submission error, using client-side fallback:", err);
      const fallback = getClientMockQuizHeuristics(answers);
      setResult(fallback);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({
      hairOrSkinType: "",
      concern: "",
      philosophy: "",
      budget: "",
      location: "",
    });
    setCurrentStep(0);
    setResult(null);
  };

  const handleOpenSalon = () => {
    if (!result) return;
    const found = salons.find((s) => s.id === result.recommendedSalonId);
    if (found) {
      onOpenSalonDetails(found);
    }
  };

  const handleBookCurated = () => {
    if (!result) return;
    const found = salons.find((s) => s.id === result.recommendedSalonId);
    if (found) {
      onBookTreatment(found, result.recommendedStylistId, result.recommendedTreatmentId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none" id="aura-onboarding-quiz">
      
      {/* HEADER SECTION */}
      {!result && !isLoading && (
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1 bg-[#a48259]/10 text-[#a48259] text-[9.5px] font-semibold font-mono tracking-widest uppercase px-3 py-1 rounded-full border border-[#a48259]/20 mb-3 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880] fill-current" />
            Bespoke Diagnostic Scan
          </span>
          <h1 className="font-serif text-3xl sm:text-4.5xl text-stone-900 tracking-tight leading-none">
            Aura <span className="italic font-medium">&amp;</span> Skin Matchmaker
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-3.5 max-w-xl mx-auto leading-relaxed">
            Answer 5 high-fidelity aesthetic questions to deduce your personalized beauty profile. Our AI matching model maps your biological style with Indiranagar, UB City and Lavelle Road sanctuaries.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* LOADING ANIMATION CONTAINER */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="bg-white border border-stone-200/80 rounded-3xl p-12 text-center shadow-xl space-y-8 max-w-xl mx-auto flex flex-col justify-center items-center min-h-[350px]"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-3 border-stone-100 border-t-[#a48259] rounded-full animate-spin" />
              <Sparkles className="w-8 h-8 text-[#a48259] absolute animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-stone-900 text-lg font-semibold uppercase tracking-wide">
                Calibrating Aesthetic DNA
              </h3>
              <p className="text-[#a48259] font-mono text-[10.5px] tracking-widest animate-pulse h-6 px-4">
                {loadingText}
              </p>
            </div>
            <p className="text-stone-400 text-[10.5px] leading-relaxed max-w-xs">
              Aligning hair volume indices, deep dermal mists, and luxury stylist metrics across prime coordinates.
            </p>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {result && !isLoading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full flex flex-col gap-8"
          >
            {/* Header Persona Badge */}
            <div className="bg-stone-950 border border-[#c5a880]/30 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.03] bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <span className="font-mono text-[9px] tracking-widest text-[#c5a880] uppercase font-bold bg-[#c5a880]/10 border border-[#c5a880]/20 py-1 px-3 rounded-full">
                  AI Deduced Persona Profile
                </span>
                <h2 className="font-serif text-2xl sm:text-3.5xl text-[#c5a880] tracking-tight font-bold mt-1">
                  {result.quizPersonaTitle}
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed font-sans">
                  {result.quizPersonaDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={resetQuiz}
                className="font-mono text-[9.5px] uppercase tracking-widest text-stone-400 hover:text-white border border-stone-800 hover:border-stone-400 py-2.5 px-4 rounded-xl transition-all cursor-pointer bg-stone-900/55 shrink-0"
              >
                Re-take Quiz
              </button>
            </div>

            {/* Curated Grid matching Salon + Treatment specifics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
              
              {/* Box 1: Recommendations Deep Consultation */}
              <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <Compass className="w-5 h-5 text-[#a48259]" />
                    <h3 className="font-serif text-[15px] font-bold tracking-wide">
                      Your Precision Aesthetic Recommendation
                    </h3>
                  </div>
                  <div className="text-stone-600 text-xs sm:text-sm leading-relaxed space-y-4 font-sans">
                    <p>{result.personalizedExplanation}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 space-y-4">
                  <h4 className="font-mono text-[10px] text-[#a48259] uppercase tracking-widest font-bold">
                    Daily Rituals &amp; Actionable Advices
                  </h4>
                  <ul className="space-y-3">
                    {result.actionableTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-stone-500 text-xs leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-[#a48259] rounded-full mt-2 shrink-0 animate-pulse" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Box 2: Salon & Treatment Curated Action card */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Salon details highlight */}
                <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <span className="font-mono text-[8.5px] text-stone-400 uppercase tracking-widest font-bold">Recommended Sanctuary</span>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">{result.recommendedSalonName}</h4>
                    <div className="flex items-center gap-1.5 text-stone-500 text-xs mt-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">Bengaluru Premium Hub</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200/50 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-mono text-[9px] uppercase tracking-widest">Matched Specialist</span>
                      <span className="text-stone-800 font-serif font-bold flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#a48259]" /> {result.recommendedStylistName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-mono text-[9px] uppercase tracking-widest">Curated Treatment</span>
                      <span className="text-stone-800 font-mono text-[11px] font-semibold text-right max-w-[180px] truncate" title={result.recommendedTreatmentName}>
                        {result.recommendedTreatmentName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleBookCurated}
                    className="w-full bg-[#a48259] hover:bg-[#8e7251] text-white font-mono text-xs py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    Book Personalized Session
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenSalon}
                    className="w-full bg-stone-905 bg-stone-900 hover:bg-stone-950 text-white font-mono text-xs py-4 px-6 rounded-2xl shadow-sm hover:scale-[1.01] transition-all uppercase tracking-widest font-semibold flex items-center justify-center gap-1 cursor-pointer border-none"
                  >
                    Explore Salon Details &rarr;
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* INTERACTIVE QUESTION SLIDER */}
        {!result && !isLoading && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-lg"
          >
            {/* Steps tracker progress row */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <span className="bg-[#a48259]/20 text-[#a48259] text-[9.5px] font-mono py-1 px-2.5 rounded-md font-bold">
                  STEP {currentStep + 1} OF {QUESTIONS.length}
                </span>
                <span className="text-stone-400 text-xs hidden sm:inline">•</span>
                <span className="text-stone-500 font-mono text-[10.5px] uppercase tracking-wider hidden sm:inline">
                  {QUESTIONS[currentStep].id.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>

              {/* Progress dots bar */}
              <div className="flex items-center gap-1.5">
                {QUESTIONS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-350 ${
                      idx === currentStep ? "w-8 bg-[#a48259]" : idx < currentStep ? "w-3 bg-stone-600" : "w-1.5 bg-stone-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Questions header */}
            <div className="space-y-1.5 mb-6 sm:mb-8">
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold tracking-tight">
                {QUESTIONS[currentStep].title}
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {QUESTIONS[currentStep].subtitle}
              </p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUESTIONS[currentStep].options.map((opt) => {
                const isSelected = activeQuestionValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group shrink-0 ${
                      isSelected
                        ? "bg-stone-50 border-[#a48259] shadow-sm"
                        : "bg-white hover:bg-stone-50/50 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[8px] tracking-widest text-[#a48259] font-bold uppercase py-0.5 px-2 bg-[#a48259]/10 rounded-full border border-[#a48259]/10">
                          {opt.badge}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 bg-[#a48259] text-white rounded-full flex items-center justify-center p-0.5">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-stone-900 mt-1 group-hover:text-[#a48259] transition-all">
                        {opt.label}
                      </h4>
                    </div>

                    <p className="text-stone-500 font-sans text-xs tracking-normal leading-normal line-clamp-2">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation handles */}
            <div className="flex items-center justify-between border-t border-stone-100 pt-6 mt-8 sm:mt-10">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50/65 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer font-sans disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {currentStep === QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={!activeQuestionValue}
                  className="bg-stone-900 hover:bg-stone-950 text-white font-mono text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none"
                >
                  <Sparkles className="w-4 h-4 text-[#c5a880]" />
                  Compute Diagnosis
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (activeQuestionValue) {
                      setCurrentStep((prev) => prev + 1);
                    }
                  }}
                  disabled={!activeQuestionValue}
                  className="font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 hover:bg-stone-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Advance
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
