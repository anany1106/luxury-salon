import { Salon, Neighborhood, Treatment, EditorsPick } from "./types";

export const SALONS_DATA: Salon[] = [
  {
    id: "aura-gilt-ub",
    name: "Aura & Gilt — UB City",
    neighborhood: "UB City",
    rating: 5.0,
    reviewsCount: 412,
    priceTier: "₹₹₹₹",
    badge: "Flagship",
    tag: "Celebrity Favourite",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Our flagship ultra-luxury sanctuary nestled in the heart of UB City — Bangalore's most prestigious address. Home to celebrity stylists and exclusive bridal ateliers.",
    address: "Level 2, UB City Mall, 24 Vittal Mallya Road, Bangalore 560001",
    phone: "+91 80 4567 8901",
    hours: "10:00 AM - 09:00 PM (Everyday)",
    services: [
      { id: "s3_1", name: "Basic haircut", price: 800, duration: "45 mins", category: "HAIR" },
      { id: "s3_2", name: "Hair color", price: 5000, duration: "90 mins", category: "HAIR" },
      { id: "s3_3", name: "Balayage", price: 8000, duration: "120 mins", category: "HAIR" },
      { id: "s3_4", name: "Keratin treatment", price: 12000, duration: "110 mins", category: "HAIR" },
      { id: "s3_5", name: "Hair botox treatment", price: 15000, duration: "120 mins", category: "HAIR" },
      { id: "s3_6", name: "Facial/cleanup", price: 2800, duration: "50 mins", category: "SKIN" },
      { id: "s3_7", name: "Pre-bridal facial", price: 5000, duration: "90 mins", category: "SKIN" },
      { id: "s3_8", name: "Gold facial (24K)", price: 8000, duration: "90 mins", category: "SKIN" },
      { id: "s3_9", name: "Advanced skin therapy", price: 5500, duration: "75 mins", category: "SKIN" },
      { id: "s3_10", name: "Luxury spa package", price: 5000, duration: "120 mins", category: "SPA" },
      { id: "s3_11", name: "Head massage", price: 1200, duration: "50 mins", category: "SPA" },
      { id: "s3_12", name: "VIP spa ritual (3 hours)", price: 12000, duration: "180 mins", category: "SPA" },
      { id: "s3_13", name: "Scalp rejuvenation therapy", price: 5500, duration: "90 mins", category: "SPA" },
      { id: "s3_14", name: "Manicure & pedicure", price: 1800, duration: "60 mins", category: "NAILS" },
      { id: "s3_15", name: "Nail art", price: 2500, duration: "75 mins", category: "NAILS" },
      { id: "s3_16", name: "Diamond manicure & pedicure", price: 4500, duration: "90 mins", category: "NAILS" },
      { id: "s3_17", name: "Bridal makeup package", price: 35000, duration: "180 mins", category: "BRIDAL" },
      { id: "s3_18", name: "Pre-bridal package", price: 15000, duration: "120 mins", category: "BRIDAL" },
      { id: "s3_19", name: "Luxury bridal package", price: 75000, duration: "240 mins", category: "BRIDAL" },
      { id: "s3_20", name: "Men's haircut", price: 700, duration: "45 mins", category: "GROOMING" },
      { id: "s3_21", name: "Beard grooming", price: 500, duration: "30 mins", category: "GROOMING" },
      { id: "s3_22", name: "Waxing", price: 2000, duration: "60 mins", category: "GROOMING" },
      { id: "s3_23", name: "Celebrity blowout", price: 3500, duration: "60 mins", category: "GROOMING" }
    ],
    stylists: [
      {
        id: "ishaan-khanna",
        name: "Ishaan Khanna",
        role: "Celebrity Hair Stylist",
        rating: 5.0,
        specialties: ["Celebrity Hair Styling", "Couture Cuts", "Red-Carpet Blowouts"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        showcase: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
        slots: ["11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
        experience: "12 Years"
      },
      {
        id: "meera-nair",
        name: "Meera Nair",
        role: "Luxury Bridal Specialist",
        rating: 4.9,
        specialties: ["Luxury Bridal Makeup", "High-Definition Aesthetics", "Bridal Glows"],
        image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=400&q=80",
        showcase: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        slots: ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
        experience: "10 Years"
      },
      {
        id: "arjun-shetty",
        name: "Arjun Shetty",
        role: "Aesthetic Skin Alchemist",
        rating: 4.9,
        specialties: ["Advanced Skin Therapies", "Molecular Facials", "Dermal Lift"],
        image: "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?auto=format&fit=crop&w=400&q=80",
        showcase: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
        slots: ["11:00 AM", "01:00 PM", "04:00 PM", "06:00 PM"],
        experience: "8 Years"
      }
    ]
  },
  {
    id: "gilded-mane",
    name: "Gilded Mane",
    neighborhood: "Indiranagar",
    rating: 4.9,
    reviewsCount: 324,
    priceTier: "₹₹₹",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A breathtaking high-ceiling architectural masterpiece. Gilded Mane features individual floating mirror stations, bespoke acoustics, and specializes in couture balayages, luxury scalp spas, and state-of-the-art hair diagnostics.",
    address: "83-A, Elite Blvd, Indiranagar, Bengaluru, 560038",
    phone: "+91 80 4321 0987",
    hours: "09:00 AM - 08:00 PM (Closed Mondays)",
    services: [
      { id: "s1_1", name: "Basic haircut", price: 750, duration: "45 mins", category: "HAIR" },
      { id: "s1_2", name: "Hair color", price: 3500, duration: "90 mins", category: "HAIR" },
      { id: "s1_3", name: "Balayage", price: 6800, duration: "120 mins", category: "HAIR" },
      { id: "s1_4", name: "Keratin treatment", price: 5500, duration: "100 mins", category: "HAIR" },
      { id: "s1_5", name: "Facial/cleanup", price: 1200, duration: "45 mins", category: "SKIN" },
      { id: "s1_6", name: "Pre-bridal facial", price: 3500, duration: "75 mins", category: "SKIN" },
      { id: "s1_7", name: "Luxury spa package", price: 3800, duration: "90 mins", category: "SPA" },
      { id: "s1_8", name: "Head massage", price: 800, duration: "45 mins", category: "SPA" },
      { id: "s1_9", name: "Manicure & pedicure", price: 1200, duration: "60 mins", category: "NAILS" },
      { id: "s1_10", name: "Nail art", price: 1500, duration: "60 mins", category: "NAILS" },
      { id: "s1_11", name: "Bridal makeup package", price: 25000, duration: "180 mins", category: "BRIDAL" },
      { id: "s1_12", name: "Pre-bridal package", price: 10000, duration: "120 mins", category: "BRIDAL" },
      { id: "s1_13", name: "Men's haircut", price: 500, duration: "30 mins", category: "GROOMING" },
      { id: "s1_14", name: "Beard grooming", price: 350, duration: "30 mins", category: "GROOMING" },
      { id: "s1_15", name: "Waxing", price: 1200, duration: "60 mins", category: "GROOMING" }
    ],
    stylists: [
      {
        id: "rohan-varma",
        name: "Rohan Varma",
        role: "Artistic Color Director",
        rating: 4.97,
        specialties: ["Balayage", "High-Volume Cuts", "Platinum Tones"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWBoZtFk2GfsdECSIrc6T8rQVubR0rTja3AP_HdVj_b582Y7I5ckcwosp8eJl7QGHK3jowccqFuwjo0CLAUFKX4e6y2c-gmnsMffJUGc35z9ujOKqKdRyJvsfkOx1f70aMCQIhHdwzWHR8rGJb6xsUkduX_-E5jSXce9U_Ogf4j5SmTnOHoKC19lx85SOd7GW8zagbl-cyNR6hFwgsyRvjD8cR6XboVcnpIK0-Uf1YlO01fof_84o61z7ssGKJARuqdCEtmpCt4bA",
        showcase: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFtv3_2TMTpcCkdrkjvzz92jk8FqNih20V9QPGnVRFlphwAMDe9W3D3peImXSrl0Kdtn_WeW8Wm1EJT5Ef2dEkQoCl7YJsfPSRU45arspFSDTyM_gtoX5a5qLVSKjjeWZuWrD-PiqhESTy_9ETSQnAuX9iBqCe4V1Xr2bGI4NZPeeXsRnAYpHmV-u6BjZYj-HqhrvnfsrpThd4KGNsOSBY0wloMpjRLQroIGvUvwDH04Q06cJ8UGTjK8pTh8HfDyyTD6oUENiMXZo",
        slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
        experience: "9 Years"
      },
      {
        id: "ananya-iyer",
        name: "Ananya Iyer",
        role: "Principal Trichology Consultant",
        rating: 4.95,
        specialties: ["Scalp Therapy", "Somatic Spa", "Textured Hair Cuts"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaF9uyxtuITrxys-GBShQ5e8JgCikXl8Hd6rSLavrKYdIb3cfxnJ9bWrvoFc50EV75bgzOEJ4YbbxVxLRCXCsumjFQvbjwks-dAUnWH_pIO6x8pHG2utvm4z5IR4ofUTJlEaG7RuMHUKZCZXk0zXVBP7dnVcyb1IGycGsK5tkTpCM6GBwWs7id4ZWL69EkXV0BZSuEBXbwWJMUBI03SHcDx-j524tRCOugw-EPx2MZb9AGbdeTWO6zOQgyScFnEBY_GPPJm-ECyXQ",
        showcase: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDptAAMSUWtGxxFp0CkUXm5Nv3tqBr1uX0O2Cm25a08L4XfZfPNlBpWryuNWvT8Zktg3oUhlBzNq-YOXS2IM2jr3ESXZLgeoT95MqiiN_yger2oep0dNPVulcd0cbTXVAIliBCVTtXwSxonZWLQEVaXjauOKx-F0WLrKjCxhM3wCno2sdlbZsW_5QwvYPZNAwGnNpsi1NGJhLjRfVzMX9geqyLiveZxhrd6viDFABnm_9AfcP838qqo4SOurKLqE-drECWqUb1FA",
        slots: ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"],
        experience: "7 Years"
      }
    ]
  },
  {
    id: "gilded-chair",
    name: "The Gilded Chair",
    neighborhood: "Lavelle Road",
    rating: 4.8,
    reviewsCount: 189,
    priceTier: "₹₹₹₹",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Hidden in Bengaluru's most premium luxury green lane, The Gilded Chair offers ultimate discretion. Popular amongst high-profile individuals, it focuses on custom skincare, revolutionary organic facials, and couture nail design sessions.",
    address: "12, Lavelle Green, Lavelle Road, Bengaluru, 560001",
    phone: "+91 80 5001 2040",
    hours: "09:00 AM - 08:00 PM (Closed Mondays)",
    services: [
      { id: "s2_1", name: "Basic haircut", price: 800, duration: "45 mins", category: "HAIR" },
      { id: "s2_2", name: "Hair color", price: 4500, duration: "90 mins", category: "HAIR" },
      { id: "s2_3", name: "Balayage", price: 7200, duration: "120 mins", category: "HAIR" },
      { id: "s2_4", name: "Keratin treatment", price: 7500, duration: "100 mins", category: "HAIR" },
      { id: "s2_5", name: "Facial/cleanup", price: 1800, duration: "45 mins", category: "SKIN" },
      { id: "s2_6", name: "Pre-bridal facial", price: 4200, duration: "75 mins", category: "SKIN" },
      { id: "s2_7", name: "Luxury spa package", price: 4500, duration: "90 mins", category: "SPA" },
      { id: "s2_8", name: "Head massage", price: 950, duration: "45 mins", category: "SPA" },
      { id: "s2_9", name: "Manicure & pedicure", price: 1400, duration: "60 mins", category: "NAILS" },
      { id: "s2_10", name: "Nail art", price: 1800, duration: "60 mins", category: "NAILS" },
      { id: "s2_11", name: "Bridal makeup package", price: 28000, duration: "180 mins", category: "BRIDAL" },
      { id: "s2_12", name: "Pre-bridal package", price: 12000, duration: "120 mins", category: "BRIDAL" },
      { id: "s2_13", name: "Men's haircut", price: 600, duration: "30 mins", category: "GROOMING" },
      { id: "s2_14", name: "Beard grooming", price: 400, duration: "30 mins", category: "GROOMING" },
      { id: "s2_15", name: "Waxing", price: 1500, duration: "60 mins", category: "GROOMING" }
    ],
    stylists: [
      {
        id: "priya-nair",
        name: "Priya Nair",
        role: "Chief Aesthetician",
        rating: 4.96,
        specialties: ["Facial Sculpting", "Collagen Infusion", "Aesthetics"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl7TWynPuvkPym5DqjXj82KqprfKEwe5iZ5xRe09578hIYv7D3tBhPGwGnbdqUpnmWnElLiTgNnyXifun5ZfNXqJjY46o2eVBKPyY-9ItzHOWLnfL3ka1iMfo_JvmCxmMtwBQHY4vR7aYa00hQt4TpZvSlcS5-LYwt2SyuyDi9w9TPk7ONkjsdvueqT3QBzt_W6a_5dTJKJJiUFPxTBq_lCSOiwLg2IrWYnMF3-w0DSbBghRSSLxrFXPRU9i3W2CBzPcegHjH3j9g",
        showcase: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDptAAMSUWtGxxFp0CkUXm5Nv3tqBr1uX0O2Cm25a08L4XfZfPNlBpWryuNWvT8Zktg3oUhlBzNq-YOXS2IM2jr3ESXZLgeoT95MqiiN_yger2oep0dNPVulcd0cbTXVAIliBCVTtXwSxonZWLQEVaXjauOKx-F0WLrKjCxhM3wCno2sdlbZsW_5QwvYPZNAwGnNpsi1NGJhLjRfVzMX9geqyLiveZxhrd6viDFABnm_9AfcP838qqo4SOurKLqE-drECWqUb1FA",
        slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
        experience: "9 Years"
      },
      {
        id: "vivek-sen",
        name: "Vivek Sen",
        role: "Senior Skin Specialist",
        rating: 4.8,
        specialties: ["Dermal Therapies", "Advanced Cleanups", "Chemical Peels"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        showcase: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        slots: ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"],
        experience: "7 Years"
      }
    ]
  },
  {
    id: "velvet-room",
    name: "The Velvet Room",
    neighborhood: "Koramangala",
    rating: 4.7,
    reviewsCount: 245,
    priceTier: "₹₹",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
    ],
    description: "An ultra-sleek, minimalist haven employing organic science and botanical hair remedies in Koramangala. Popular for precision cuts, daily pampering, and active-coal facial treatments.",
    address: "447, Boulevard 80-Feet, Koramangala, Bengaluru, 560034",
    phone: "+91 80 5055 3010",
    hours: "09:00 AM - 08:00 PM (Closed Mondays)",
    services: [
      { id: "s4_1", name: "Basic haircut", price: 400, duration: "40 mins", category: "HAIR" },
      { id: "s4_2", name: "Hair color", price: 2500, duration: "90 mins", category: "HAIR" },
      { id: "s4_3", name: "Balayage", price: 4000, duration: "120 mins", category: "HAIR" },
      { id: "s4_4", name: "Keratin treatment", price: 4800, duration: "100 mins", category: "HAIR" },
      { id: "s4_5", name: "Facial/cleanup", price: 800, duration: "45 mins", category: "SKIN" },
      { id: "s4_6", name: "Pre-bridal facial", price: 2400, duration: "75 mins", category: "SKIN" },
      { id: "s4_7", name: "Luxury spa package", price: 2800, duration: "90 mins", category: "SPA" },
      { id: "s4_8", name: "Head massage", price: 500, duration: "45 mins", category: "SPA" },
      { id: "s4_9", name: "Manicure & pedicure", price: 600, duration: "60 mins", category: "NAILS" },
      { id: "s4_10", name: "Nail art", price: 500, duration: "60 mins", category: "NAILS" },
      { id: "s4_11", name: "Bridal makeup package", price: 18000, duration: "180 mins", category: "BRIDAL" },
      { id: "s4_12", name: "Pre-bridal package", price: 8000, duration: "120 mins", category: "BRIDAL" },
      { id: "s4_13", name: "Men's haircut", price: 300, duration: "30 mins", category: "GROOMING" },
      { id: "s4_14", name: "Beard grooming", price: 200, duration: "30 mins", category: "GROOMING" },
      { id: "s4_15", name: "Waxing", price: 800, duration: "60 mins", category: "GROOMING" }
    ],
    stylists: [
      {
        id: "ananya-iyer-velvet",
        name: "Ananya Iyer",
        role: "Principal Trichology Consultant",
        rating: 4.95,
        specialties: ["Scalp Therapy", "Somatic Spa", "Textured Hair Cuts"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaF9uyxtuITrxys-GBShQ5e8JgCikXl8Hd6rSLavrKYdIb3cfxnJ9bWrvoFc50EV75bgzOEJ4YbbxVxLRCXCsumjFQvbjwks-dAUnWH_pIO6x8pHG2utvm4z5IR4ofUTJlEaG7RuMHUKZCZXk0zXVBP7dnVcyb1IGycGsK5tkTpCM6GBwWs7id4ZWL69EkXV0BZSuEBXbwWJMUBI03SHcDx-j524tRCOugw-EPx2MZb9AGbdeTWO6zOQgyScFnEBY_GPPJm-ECyXQ",
        showcase: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDptAAMSUWtGxxFp0CkUXm5Nv3tqBr1uX0O2Cm25a08L4XfZfPNlBpWryuNWvT8Zktg3oUhlBzNq-YOXS2IM2jr3ESXZLgeoT95MqiiN_yger2oep0dNPVulcd0cbTXVAIliBCVTtXwSxonZWLQEVaXjauOKx-F0WLrKjCxhM3wCno2sdlbZsW_5QwvYPZNAwGnNpsi1NGJhLjRfVzMX9geqyLiveZxhrd6viDFABnm_9AfcP838qqo4SOurKLqE-drECWqUb1FA",
        slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
        experience: "7 Years"
      },
      {
        id: "karan-malhotra",
        name: "Karan Malhotra",
        role: "Senior Barber & Stylist",
        rating: 4.86,
        specialties: ["Classic Fades", "Beard Sculpting", "Somatic Head Massages"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        showcase: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
        slots: ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"],
        experience: "6 Years"
      }
    ]
  }
];

export const NEIGHBORHOODS_DATA: Neighborhood[] = [
  {
    id: "lavelle-road",
    name: "Lavelle Road",
    description: "Quiet tree-lined avenues of exclusive heritage and prestige",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZB3__S9FG0hucWXqx7RwgNZHwCIKRrFSvCdaMWeLr_7oprt-lO1yBwFooayHo41xGEXUgveLGnxQD0rw3_xLp2nip8K4ktVESIwZHI656R9Thf70e0Y-X1j_grsVrvNmBBSYHjEb1UOPMZAOtxpIbV1fB1loafrzC8ViEGrIqqSxY9QowkDafmWLxO72KeM06hTbRbeVzZED30ZOnsH5d7BVeEyW7PzczpVifWqsAynl0cdX2OKf5y0HUuQffN6eiexlF7g_ke9w",
    hubs: 1
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    description: "Architectural showpieces, high cul-de-sacs, and elite portals",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5idQPzhG4i9-b2-nhpvjAu9gHNdtM-LE7lbuFUha8fNtnDGUuBh4Lf7U15aICZVgIqTeVlThjBIKu_2Hwi_WcwSuBLeDTNbxNBgb6rxVl_YlhIfe0TJLmwK7YPBegQYwiq4mGvzAYiFpIN2EHOTMXXRxSxprGzuAMVz41WssoqEJghCnmHGXqFHtkm3uTCG-C4xL6fka8UkYT1sqWH4gVxmASeTOJoMhIdUUU5_WFhxjDYAlk5xh3yyVT3TcvBLORkOEnbhqH9jw",
    hubs: 1
  },
  {
    id: "ub-city",
    name: "UB City",
    description: "High-flying skyways, luxury retail, and sweeping private salons",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0Y_B-IW2fFGNVVZciaXV4gGeRnMYQ89Kvl_QWWVXNgjNRQk97gmcr0qWcsizjKVMS8jGZm1d-EzyKJFnIg2SA4wd0K3_2B3vSjSR7koOgHd4fFbF4uOpWOvhx1mHfQ-VpuYC3FDx9_5R1VhZDQRRiA1EJR-re7QVMqPVEyIRED_1JYcofOUV_60ChOKuGXfJvtoWUdJb4xFgUITyqmkrTm8PfcUSKvdiXOynadeHwNTRMVce1dDZ6Cm-7Iv1UV2YhfHWwJGvk5Uo",
    hubs: 1
  },
  {
    id: "koramangala",
    name: "Koramangala",
    description: "Leafy layouts, modern design sanctuaries, and green botanic clinics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGWCITySmNZdWAaee00K0Ci4XdavP3gwlRVeu7ltBpQG0rHsswNZdOPG_0wRezfQjUQT0CAVI6canRccatMjx2Y2sNyNzFyErj7QCWu7atbBqsTmTBLc5DjQf4qURoMxjjLNz1ACOHH50GQBoCez6_tQ1qmF2M3qErjKpWUjfHmP10vwdi25p77CU4pRbDbSOMW4bSAY4muts-oeRqeFEeBfBUvxLGuTvPzxTtcNTqgn1m-qJZRKGbIfca6AbfnbV0YS2QRlBv2ok",
    hubs: 1
  }
];

export const TREATMENT_CARDS: Treatment[] = [
  {
    id: "tr1",
    title: "Haute Couture Hair Transformation",
    tag: "HAIR MASTERY",
    desc: "A personalized full-spectrum analysis, organic pigment infusion, custom tone balancing, and sculptural botanical finish.",
    price: 6800,
    duration: "120 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA61Zn4XvKvqIJ3oTKMn8D1qC30fk0dOhyLqfBtwlI6QkDbn8j_g27igNY-ADmS9xrYAPbZibCi_6D8RYfUir8duhI8zfm0Hk541KgrcxR9fPURaS5_ixbJ7nPeYzC4chSkHmmDi5FD_4zZ1ceAIA--IkSZguUbPdN8RzkDsFp5p3oAaEgk4dOmKuElhEQO6FcH6f1ws0pf2UakRZWBRrTDyzGrz7ziQxkBly_5-RKSrLzy3VTsNjtcPzxldo1bZKeaJJ2LVfSj8Rs"
  },
  {
    id: "tr2",
    title: "Advanced Dermal Glow & Resurfacing",
    tag: "SKIN LUSTER",
    desc: "Highly-specialized multi-layer collagen replenishment, cellular micro-needling, and micro-particle skin polish.",
    price: 2900,
    duration: "75 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCg2MEob-0ajO-ljXI21T3Toa8G-QUN_1Eer6QNalLDnIu2p0KFw1AtuA6AcBK_BjurEBDT_-0lqOW_MvvFny0ZhtNkBrB_fCc0RVEGvYikfNMR6RgHuatKpfienKIB48e6wrcU9pvpsKEIYBNDDPBC-C97MChw5rg7iSItZGtAE7oAaubAShJNn7GCf34sKiTp1an32mZ3UjBSEzHL8Jlv7GkxJ3KSPOasfupHRgvWzHSOP4LvG-KbYGf3eM-RF8clvaT20xi0Z-U"
  },
  {
    id: "tr3",
    title: "Somatic Head Spa & Quiet Escapes",
    tag: "TRICHOLOGY PORTAL",
    desc: "Micro-mist warm scalp cleanse, heavy scalp pressure-point somatic flow, deep oil nourishment, and blowout.",
    price: 3800,
    duration: "75 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmRvnmh2N6n6gWP6IrlARbwnZNkPI04jgEKsivw27jVwj9iMzwnw3mvUScGj_JiG2DNawcxaIvMKgSJjD-Z_vLl9r1Rb84sQbbjhSJYs8oTKDadwOnpijE1sjLTF7M-lX0vaZodmH7vlutXWaRF9EhWW12-itmRX8itNRigDeYkmeI6eT0g6YgQk7sPEqy11vRN_KMp2gSpyjxl9ia5bhkh5Cb0MUPGzLTS3VgrDHx1LluHWJtq9lYaCALi85ptUiMIm3-FbubvCc"
  },
  {
    id: "tr4",
    title: "Bespoke Grooming & Nail Artistry",
    tag: "PREMIUM FINISH",
    desc: "Tailored modern hand contours, organic gel overlays, minimalist hand-painted line art, and hydrating hand wrap.",
    price: 1800,
    duration: "60 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsI7rvMJ3eI_fjckwsdwNxV9WCue_AYkMZe0MpkbxRe_QNjA6C5bUZbOFhvijZD-VLuSRaDyVc7GV6oG5rbQ8YGNO6pH-mtcN32xlmD0lFNdtBUC0_VB-_Zr1QuX8rJh836EKLE19St_xKaImAY1jDIf1nQJajS8ERTlH5qZqHeo_10w1Ry_P7eRO8tvP6IfmnUErd3ze-5P_V-1hK4HmO-X91CUtSX-zOhSoiNhabmQuASqWa3_zjgow-5JsZ1EGoYDpekchPr-I"
  }
];

export const EDITORS_PICKS: EditorsPick[] = [
  {
    id: "ep1",
    title: "Celestial Scalp Revitalization",
    category: "SPA OF THE YEAR",
    salon: "Gilded Mane (Indiranagar)",
    rating: 4.98,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYZLsHvDIrnAw2fur192Lcwjib7mQixB2AXWQSL5AyVSi1UT4RnpGyB6rjWyHiGO8pwdS6Sbjph6u3BuuRSf4vR6gMS6uL_Z9lJWGgMHZweahHeeSTlfCXDurrGYnLAXNOVwJj3w24MSwhXwOZDlA_cEj4A9pSkVz6JHM3UxAUzO0baC85eki-o-tRnkoKkcH74xkeAWkXgRNnGAe2MZv_DD15moFDsJDN5AZyIChI9jBEG2B8JOgnb55HQNTVJqxGLWzKxlXGbm4"
  },
  {
    id: "ep2",
    title: "Ultra-precise Airbrush Face Sculpting",
    category: "ELITE SKIN",
    salon: "The Velvet Room (Koramangala)",
    rating: 4.96,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn69mix4bHiBfJX0BP0v9dyQMeryLET3wN1aZh-AZcDk6gppCmUmfShu76Vzpdu6Dc0KJUKbDTocI90znnKyHou7L25UmBmIK2WlYllIun9IjBbLjSeSf031gAxp17kfD08kU0KDJCDtqTqd1oyvL83F-7X_5b5KfOrzr8blS_VmahNIqEIX5RfV5CFESqpng1hz8NgbXqTmJAl5ccqBYeLP56re62WfKuCn2FdnDcZtsWJIYzvXvFiAZ_0jjixkVj4wZq_XF9gdQ"
  },
  {
    id: "ep3",
    title: "Hyper-Gloss Dermal Luster Treatment",
    category: "CLINICAL FACIAL",
    salon: "The Gilded Chair (Lavelle Road)",
    rating: 4.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpgnS9kagsissVhulAyadhDmKJ6oVP7zWANgEWo0lk1rhjYyFVMQM7LDVcUWaHGuG6aClg4imujTj1qxqiAG_0PcQ8IaBZaZpQPo2ohY0MJ2tM_Qw1x1HnOD5wJBZqcovWNZaLkkvfl-rdAEMhz34JBFIKvWgBnppc6S6W3DGeWycaNgXwC2HyJ_Hl1cBgI0k_llp-9z5ZEPNph_-iYlDSSeH3yk4l5AopmH7XDF-ZmrLJyxx4kPq7wDtaPVOK_FmShVHDIS-M4js"
  },
  {
    id: "ep4",
    title: "Couture Balayage Melt & Glaze",
    category: "COLOR MASTERPIECE",
    salon: "Aura & Gilt (UB City)",
    rating: 4.97,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE0dey4bIZo6lMBM4bvIWmoExygiFDtTMqquRXE90NJJ4OZBql7_BYh4dp-kigmPyoaoJWVJUO7ms6c977I5i2MBMVSSoXc27bwXLv-HpFDHGLClO5lxXQeRbAN_XYqpyTHr6L3W5q45CREoE1hrDk5-tOIU14i_p58t_BrYnIgFKS1a27JvViBVMQzdDKe8TTWeby22UtAYZY5iekCd5jrhkullkhWM3BfNXqJXKM8stbSPOAuQ6RsyWO0O4F1bZOtBhyYe-PFX8"
  }
];
