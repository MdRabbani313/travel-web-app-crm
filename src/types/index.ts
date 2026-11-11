export type UserRole = 'customer' | 'sales' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  title?: string;
}

export type TravelStyle = 'luxury' | 'adventure' | 'cultural' | 'nature' | 'honeymoon' | 'wellness';
export type PackageDifficulty = 'easy' | 'moderate' | 'challenging';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  summary: string;
  mealsIncluded: string;
  accommodation: string;
  activities: string[];
  imageUrl?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  destination: string;
  country: string;
  region: string;
  durationDays: number;
  durationNights: number;
  basePriceUSD: number;
  discountedPriceUSD?: number;
  travelStyle: TravelStyle;
  difficulty: PackageDifficulty;
  maxTravelers: number;
  heroImage: string;
  galleryImages: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  isPublished: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  itinerary: ItineraryDay[];
}

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
export type LeadSource = 'website_enquiry' | 'booking_request' | 'whatsapp' | 'direct_call' | 'referral';

export interface Lead {
  id: string;
  leadCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  packageId?: string;
  packageName?: string;
  assignedSalesId: string;
  assignedSalesName: string;
  status: LeadStatus;
  source: LeadSource;
  estimatedPax: number;
  travelDate?: string;
  estimatedBudget: number;
  specialNotes?: string;
  leadScore: number;
  createdAt: string;
  nextFollowUpAt?: string;
  lastContactedAt?: string;
}

export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'whatsapp' | 'quote_sent' | 'status_change';

export interface LeadActivity {
  id: string;
  leadId: string;
  createdByUserId: string;
  createdByName: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface QuoteAddon {
  id: string;
  title: string;
  price: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface Quotation {
  id: string;
  quoteNumber: string;
  leadId: string;
  packageId: string;
  packageName: string;
  preparedBySalesId: string;
  preparedByName: string;
  adultsCount: number;
  childrenCount: number;
  baseRate: number;
  addons: QuoteAddon[];
  discountAmount: number;
  taxRate: number;
  totalAmount: number;
  status: QuoteStatus;
  validUntil: string;
  customerNotes?: string;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';

export interface Booking {
  id: string;
  bookingReference: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  leadId?: string;
  quotationId?: string;
  packageId: string;
  packageName: string;
  travelStartDate: string;
  travelEndDate: string;
  adultsCount: number;
  childrenCount: number;
  totalAmount: number;
  amountPaid: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface PromotionalBanner {
  id: string;
  headline: string;
  subtext: string;
  couponCode: string;
  linkUrl: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  guestName: string;
  location: string;
  packageName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
}

export interface DestinationInfo {
  id: string;
  name: string;
  country: string;
  region: string;
  heroImage: string;
  packageCount: number;
  bestSeason: string;
}

export interface SystemSettings {
  currency: 'USD' | 'EUR' | 'GBP' | 'AUD';
  currencySymbol: string;
  taxRate: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  emergencyContact: string;
}
