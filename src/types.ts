export type ServiceCategory = "HAIR" | "SKIN" | "SPA" | "NAILS" | "BRIDAL" | "GROOMING";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: ServiceCategory;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  rating: number;
  specialties: string[];
  image: string;
  showcase: string; // direct portfolio photo URL
  slots?: string[];
  experience?: string;
}

export interface Salon {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  reviewsCount: number;
  priceTier: string;
  image: string;
  images?: string[];
  badge?: string;
  tag?: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  services: Service[];
  stylists?: Stylist[];
}

export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image: string;
  hubs: number;
}

export interface Treatment {
  id: string;
  title: string;
  tag: string;
  desc: string;
  price: number;
  duration: string;
  image: string;
}

export interface EditorsPick {
  id: string;
  title: string;
  category: string;
  salon: string;
  rating: number;
  image: string;
}

export interface Booking {
  salon: Salon;
  service: Service;
  stylist: Stylist | null;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export interface AIConciergeResult {
  recommendedSalonId: string;
  recommendedSalonName: string;
  recommendedStylistId: string | null;
  recommendedStylistName: string;
  suitabilityScore: number;
  facialHarmonyAnalysis: string;
  stylingAdvice: string;
  curatedTreatmentPlan: string[];
}

export interface AIScanResult {
  detectedFaceShape: string;
  detectedHairType: string;
  facialHarmonyAnalysis: string;
  recommendedColorPalette: string[];
  perfectStyleMatch: string;
  recommendedSalonId: string;
  recommendedSalonName: string;
  recommendedStylistId: string;
  recommendedStylistName: string;
  confidenceScore: number;
}
