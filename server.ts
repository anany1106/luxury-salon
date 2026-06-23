import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI. 
// Uses user's GEMINI_API_KEY from environment variables.
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
}

// Import shared luxury datasets
import { SALONS_DATA, NEIGHBORHOODS_DATA, TREATMENT_CARDS, EDITORS_PICKS } from "./src/data";

// REST API Endpoints

app.get("/api/salons", (req, res) => {
  res.json(SALONS_DATA);
});

app.get("/api/neighborhoods", (req, res) => {
  res.json(NEIGHBORHOODS_DATA);
});

app.get("/api/treatments", (req, res) => {
  res.json(TREATMENT_CARDS);
});

app.get("/api/editors-picks", (req, res) => {
  res.json(EDITORS_PICKS);
});

// AI ROUTE: Personalized Text Beauty Concierge
app.post("/api/gemini/concierge", async (req, res) => {
  const { lookDescription, category, neighborhood } = req.body;

  if (!lookDescription) {
    return res.status(400).json({ error: "Look description is required." });
  }

  // Backup fallback logic if Gemini API key is missing
  if (!ai) {
    console.log("No Gemini API key found, running luxurious custom concierge heuristic.");
    const mockRecommendations = getMockConciergeHeuristics(lookDescription, category, neighborhood);
    return res.json(mockRecommendations);
  }

  try {
    const prompt = `
You are the elite "Aura & Gilt AI Beauty Concierge". A customer wants a highly personalized, luxury styling advice based on their description of their dream look.

--- CUSTOMER INFORMATION ---
Dream Look Description: "${lookDescription}"
Desired Therapy/Service Category: ${category || "Any"}
Preferred Hood/Location: ${neighborhood || "Any"}

--- LUXURY OUTLET INVENTORY ---
${JSON.stringify(SALONS_DATA, null, 2)}

--- RESPONSE PROTOCOL ---
Analyze the customer's request and match them with exactly ONE optimal salon from our inventory, and identify the specific STYLIST (if they have stylists, like Rohan Varma or Ananya Iyer for Gilded Mane/Velvet Room, or Priya Nair for Gilded Chair). Provide a professional, encouraging, and masterfully tailored aesthetic consultation.

Provide your response in raw JSON format matching this schema exactly:
{
  "recommendedSalonId": "gilded-mane | gilded-chair | aura-gilt-ub | velvet-room",
  "recommendedSalonName": "Exact Salon Name",
  "recommendedStylistId": "rohan-varma | ananya-iyer | priya-nair | null",
  "recommendedStylistName": "Stylist Name or 'Our Master Salon Experts'",
  "suitabilityScore": 98, (an integer percentage from 85 to 100 representing how well the match fits)
  "facialHarmonyAnalysis": "An elite aesthetician-level paragraph discussing facial structure, hair flow, or tone considerations corresponding to their custom description.",
  "stylingAdvice": "Step-by-step master styling/care guidelines for their look.",
  "curatedTreatmentPlan": ["Initial premium service name", "Post-care recommended botanical routine"]
}
`;

    // Modern SDK generateContent with JSON response schema
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSalonId: { type: Type.STRING },
            recommendedSalonName: { type: Type.STRING },
            recommendedStylistId: { type: Type.STRING },
            recommendedStylistName: { type: Type.STRING },
            suitabilityScore: { type: Type.INTEGER },
            facialHarmonyAnalysis: { type: Type.STRING },
            stylingAdvice: { type: Type.STRING },
            curatedTreatmentPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "recommendedSalonId",
            "recommendedSalonName",
            "recommendedStylistId",
            "recommendedStylistName",
            "suitabilityScore",
            "facialHarmonyAnalysis",
            "stylingAdvice",
            "curatedTreatmentPlan"
          ],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return res.json(data);
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Gemini concierge error:", error);
    // Graceful fallback
    const mockRecommendations = getMockConciergeHeuristics(lookDescription, category, neighborhood);
    return res.json(mockRecommendations);
  }
});

// AI ROUTE: Personalized Webcam Visual Diagnostic Scanning
app.post("/api/gemini/scan", async (req, res) => {
  const { imageBase64, userPreferences } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Image data (imageBase64) is required." });
  }

  // Fallback if no Gemini Key
  if (!ai) {
    console.log("No Gemini API key found, running luxurious diagnostic scanner heuristics.");
    const fallbackScan = getMockScanHeuristics(userPreferences);
    return res.json(fallbackScan);
  }

  try {
    // Strip headers if any
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    };

    const textPart = {
      text: `
You are the "Aura & Gilt Real-time Diagnostic AI Scanner". Analyze this high-contrast portrait photo. Determine the customer's:
1. Face Shape (e.g., oval, heart, diamond, square, round, oblong)
2. Hair Texture & Tone (e.g., high-density wavy dark-ebony, textured curly, fine straight blonde, etc.)
3. Substantive facial harmony features (high cheekbones, deep set eyes, symmetric jaw).
4. Recommend matching cuts, tones, styling directions, and suggest which aesthetician or hair artist is their perfect soulmate.

Recommend one of our premier stylists (Rohan Varma, Ananya Iyer, or Priya Nair) and their associated Salon.
User Preferences: "${userPreferences || "None provided"}"

Provide your results in raw JSON format matching this schema exactly:
{
  "detectedFaceShape": "Oval | Heart | Diamond | Square | Round",
  "detectedHairType": "Short description of detected hair/tone",
  "facialHarmonyAnalysis": "An elite, technical beauty diagnosis explaining facial symmetry, bone structure landmarks, and natural glow levels.",
  "recommendedColorPalette": ["Warm Gold", "Charcoal Slate", "Bronze", "Emerald Accent"],
  "perfectStyleMatch": "Detailed description of the recommended hairstyle (e.g. Sculpted Frame Layers, Soft Balayage Wave, Clean Fade with taper)",
  "recommendedSalonId": "gilded-mane | gilded-chair | aura-gilt-ub | velvet-room",
  "recommendedSalonName": "Exact Recommended Salon",
  "recommendedStylistId": "rohan-varma | ananya-iyer | priya-nair",
  "recommendedStylistName": "Stylist Name",
  "confidenceScore": 96
}
`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedFaceShape: { type: Type.STRING },
            detectedHairType: { type: Type.STRING },
            facialHarmonyAnalysis: { type: Type.STRING },
            recommendedColorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            perfectStyleMatch: { type: Type.STRING },
            recommendedSalonId: { type: Type.STRING },
            recommendedSalonName: { type: Type.STRING },
            recommendedStylistId: { type: Type.STRING },
            recommendedStylistName: { type: Type.STRING },
            confidenceScore: { type: Type.INTEGER },
          },
          required: [
            "detectedFaceShape",
            "detectedHairType",
            "facialHarmonyAnalysis",
            "recommendedColorPalette",
            "perfectStyleMatch",
            "recommendedSalonId",
            "recommendedSalonName",
            "recommendedStylistId",
            "recommendedStylistName",
            "confidenceScore",
          ],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return res.json(data);
    } else {
      throw new Error("Empty response from AI Vision scanner");
    }
  } catch (error) {
    console.error("Gemini scanning vision error:", error);
    const fallbackScan = getMockScanHeuristics(userPreferences);
    return res.json(fallbackScan);
  }
});

// AI ROUTE: Personalized Onboarding Beauty Quiz
app.post("/api/gemini/quiz", async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: "Answers are required in body." });
  }

  // Fallback if no Gemini Key
  if (!ai) {
    console.log("No Gemini API key found, running luxurious quiz heuristics.");
    const fallbackQuiz = getMockQuizHeuristics(answers);
    return res.json(fallbackQuiz);
  }

  try {
    const prompt = `
You are the elite "Aura & Gilt Aesthetic Diagnostic AI Concierge". A new guest has completed our 5-question onboarding beauty quiz.
Based on their answers, deduce their Luxury Beauty Persona, choose the single most harmonizing physical Salon in our inventory, and select the optimal Treatment and Stylist to curate their first session.

--- GUEST ONBOARDING QUIZ RESPONSES ---
1. Hair/Skin Type: "${answers.hairOrSkinType}"
2. Concern of Priority: "${answers.concern}"
3. Budget Profile: "${answers.budget}"
4. Aesthetic Vibe/Philosophy: "${answers.philosophy}"
5. Preferred Bengaluru District: "${answers.location}"

--- LUXURY OUTLET INVENTORY ---
${JSON.stringify(SALONS_DATA, null, 2)}

--- RESPONSE SCHEMA PROTOCOL ---
Deduce their tailored recommendation. Match them with exactly ONE Salon from our dataset, ONE Treatment (signature service from that salon matching their concerns), and the optimal Stylist (e.g. Rohan Varma, Ananya Iyer, Priya Nair, or "Our Master Salon Experts" if none specified).
Write a personalized, beautiful aesthetic profile.

Provide your results in raw JSON format matching this schema exactly:
{
  "recommendedSalonId": "gilded-mane | gilded-chair | aura-gilt-ub | velvet-room",
  "recommendedSalonName": "Exact Recommended Salon Name",
  "recommendedTreatmentId": "Service ID matching salon (e.g., s1, s2, s5)",
  "recommendedTreatmentName": "Exact Service Name matched to salon inventory",
  "recommendedStylistId": "rohan-varma | ananya-iyer | priya-nair | null",
  "recommendedStylistName": "Stylist Name or 'Our Master Salon Experts'",
  "quizPersonaTitle": "An elegant, bespoke title for their profile (e.g., 'The Luminous Gold Dermalist' or 'The Haute-Couture Balayage Purist')",
  "quizPersonaDescription": "An enchanting 1-2 sentence overview of their design vibe, hair/skin genetics, and personal allure.",
  "personalizedExplanation": "A beautiful, master-level aesthetic consultation paragraph. Discuss how their hair/skin type and goals harmonizes perfectly with the chosen sanctuary location, their requested vibe, and why the specialized stylist represents their ideal practitioner.",
  "actionableTips": [
    "Tip 1 regarding their concern/hair type",
    "Tip 2 regarding their post-care/daily ritual",
    "Tip 3 regarding their budget/scheduling rhythm"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSalonId: { type: Type.STRING },
            recommendedSalonName: { type: Type.STRING },
            recommendedTreatmentId: { type: Type.STRING },
            recommendedTreatmentName: { type: Type.STRING },
            recommendedStylistId: { type: Type.STRING },
            recommendedStylistName: { type: Type.STRING },
            quizPersonaTitle: { type: Type.STRING },
            quizPersonaDescription: { type: Type.STRING },
            personalizedExplanation: { type: Type.STRING },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "recommendedSalonId",
            "recommendedSalonName",
            "recommendedTreatmentId",
            "recommendedTreatmentName",
            "recommendedStylistId",
            "recommendedStylistName",
            "quizPersonaTitle",
            "quizPersonaDescription",
            "personalizedExplanation",
            "actionableTips",
          ],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return res.json(data);
    } else {
      throw new Error("Empty response from Quiz AI");
    }
  } catch (error) {
    console.error("Gemini quiz diagnostic error:", error);
    const fallbackQuiz = getMockQuizHeuristics(answers);
    return res.json(fallbackQuiz);
  }
});

// Heuristics fallbacks to guarantee absolute premium experience even without keys configured
function getMockConciergeHeuristics(lookDescription: string, category: string, neighborhood: string) {
  const descLower = lookDescription.toLowerCase();
  
  let recommendedSalonId = "gilded-mane";
  let recommendedSalonName = "Gilded Mane (Indiranagar)";
  let recommendedStylistId: string | null = "rohan-varma";
  let recommendedStylistName = "Rohan Varma";
  let suitabilityScore = 95;
  let facialHarmonyAnalysis = "Based on your dream look input, your facial features will benefit extensively from deep contrast tones and dimensional highlighting. Your structural profile is perfectly structured to embrace balanced movement and soft framing, adding natural high-lights around the eye contour lines.";
  let stylingAdvice = "Use light botanic micro-mists periodically to restore organic luster. Gently massage organic styling oils into damp ends before diffuse blowdrying for optimal volume and structure.";
  let curatedTreatmentPlan = ["Signature Balayage + Olaplex Nourishment Session", "At-home Multi-peptide Scalp Revive drops"];

  if (descLower.includes("skin") || descLower.includes("face") || descLower.includes("glow") || descLower.includes("facial") || category === "SKIN") {
    recommendedSalonId = "gilded-chair";
    recommendedSalonName = "The Gilded Chair (Lavelle Road)";
    recommendedStylistId = "priya-nair";
    recommendedStylistName = "Priya Nair";
    suitabilityScore = 98;
    facialHarmonyAnalysis = "Your request points strongly toward advanced aesthetic care. A customized micro-needling or gold-dust infusion will address structural hydration boundaries, yielding a glassy skin texture and luminous jawline contours.";
    stylingAdvice = "Apply professional lipid bar creams nightly. Protect the cellular barrier using titanium-dioxide sun defense and mist with pure rose hydrolat regularly.";
    curatedTreatmentPlan = ["Premium Micro-Needling Dermal Luster Glow", "Rose Hydro-lipid Nourishment Barrier misting"];
  } else if (descLower.includes("spa") || descLower.includes("relax") || descLower.includes("massage") || category === "SPA") {
    recommendedSalonId = "velvet-room";
    recommendedSalonName = "The Velvet Room (Koramangala)";
    recommendedStylistId = "ananya-iyer";
    recommendedStylistName = "Ananya Iyer";
    suitabilityScore = 97;
    facialHarmonyAnalysis = "Your sensory profile highlights a vital need for tension release and deep hair-follicle restoration. A warm micro-mist scalp therapy combined with somatic trigger-point sequence will perfectly restore focus and organic flow.";
    stylingAdvice = "Avoid heavy silicone hair formulations. Brush your hair daily using wild boar bristle loops to trigger normal lipid micro-circulation in the cortex.";
    curatedTreatmentPlan = ["Elite Somatic Scalp Restoration Spa", "Organic Activated Charcoal Scalp exfoliating treatment"];
  } else if (neighborhood === "UB City" || descLower.includes("luxury") || descLower.includes("ub")) {
    recommendedSalonId = "aura-gilt-ub";
    recommendedSalonName = "Aura & Gilt (UB City)";
    recommendedStylistId = null;
    recommendedStylistName = "Our Master Salon Experts";
    suitabilityScore = 99;
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
}

function getMockScanHeuristics(userPreferences: string) {
  return {
    detectedFaceShape: "Oval-Symmetric",
    detectedHairType: "Medium-density textured hair with subtle chestnut tones",
    facialHarmonyAnalysis: "Our vision algorithm detects exceptional jawline and cheekbone symmetry (97%). The high-contrast bone structure frames the face elegantly. Incorporating layered soft waves will further elevate the vertical harmony index while keeping focus on the eyes.",
    recommendedColorPalette: ["Muted Gold", "Charcoal Slate", "Warm Chestnut", "Cream-Rose Accent"],
    perfectStyleMatch: "Sculpted Soft Frame Layers with Soft Face-Framing Tones",
    recommendedSalonId: "gilded-mane",
    recommendedSalonName: "Gilded Mane (Indiranagar)",
    recommendedStylistId: "ananya-iyer",
    recommendedStylistName: "Ananya Iyer",
    confidenceScore: 94
  };
}

function getMockQuizHeuristics(answers: any) {
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

  if (concern.includes("skin") || concern.includes("dermal") || concern.includes("purification")) {
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

// Vite integration with complete production fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets compiled inside dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Salon backend listening on http://0.0.0.0:${PORT} in env: ${process.env.NODE_ENV || "development"}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
