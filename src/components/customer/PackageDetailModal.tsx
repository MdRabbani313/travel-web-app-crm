import React, { useState } from 'react';
import { TourPackage, QuoteAddon } from '../../types';
import { useTravelStore } from '../../context/TravelStoreContext';
import {
  X,
  Star,
  Clock,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
  CreditCard,
  Sparkles,
  PhoneCall,
  Utensils,
  Bed,
} from 'lucide-react';

interface PackageDetailModalProps {
  pkg: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'itinerary' | 'enquire' | 'book';
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  isOpen,
  onClose,
  initialTab = 'itinerary',
}) => {
  const { addLead, createBooking, currentUser, addToast } = useTravelStore();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'pricing' | 'enquire'>(
    initialTab === 'enquire' ? 'enquire' : 'itinerary'
  );
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Enquiry / Booking Form State
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+1 (555) 019-2834');
  const [travelDate, setTravelDate] = useState('2026-08-15');
  const [paxCount, setPaxCount] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBookingRef, setSubmittedBookingRef] = useState<string | null>(null);

  // Interactive Pricing Addons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  if (!isOpen || !pkg) return null;

  const currentPricePerPax = pkg.discountedPriceUSD || pkg.basePriceUSD;

  const availableAddons: QuoteAddon[] = [
    { id: 'add-suite', title: '5-Star Penthouse Luxury Suite Upgrade', price: 550 },
    { id: 'add-vip-transfer', title: 'Private Helicopter / Chauffeur Airport Transit', price: 420 },
    { id: 'add-wine', title: 'Private Sommelier Wine & Truffle Pairing Experience', price: 280 },
    { id: 'add-spa', title: 'Unlimited Thermal Spa & Mineral Bath Access', price: 190 },
  ];

  const totalAddonsCost = selectedAddons.reduce((sum, id) => {
    const addon = availableAddons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const calculatedBase = currentPricePerPax * paxCount;
  const calculatedTotal = calculatedBase + totalAddonsCost;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create lead directly into CRM
      const newLead = addLead({
        customerName,
        customerEmail,
        customerPhone,
        packageId: pkg.id,
        packageName: pkg.title,
        source: 'website_enquiry',
        estimatedPax: paxCount,
        travelDate,
        estimatedBudget: calculatedTotal,
        specialNotes: specialNotes || `Customer submitted website enquiry for ${pkg.title} with estimated budget $${calculatedTotal.toLocaleString()}.`,
        leadScore: 75,
      });

      setIsSubmitting(false);
      addToast(`Enquiry submitted! Sales specialist assigned to lead #${newLead.leadCode}.`, 'success');
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleDirectBooking = () => {
    setIsSubmitting(true);
    // Create lead first
    const lead = addLead({
      customerName,
      customerEmail,
      customerPhone,
      packageId: pkg.id,
      packageName: pkg.title,
      source: 'booking_request',
      estimatedPax: paxCount,
      travelDate,
      estimatedBudget: calculatedTotal,
      specialNotes: `Direct online booking request for ${pkg.title}. Addons selected: ${selectedAddons.length}`,
      leadScore: 95,
    });

    // Create booking
    const startDate = travelDate;
    const endDate = new Date(new Date(travelDate).getTime() + pkg.durationDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const booking = createBooking({
      customerId: currentUser.id,
      customerName,
      customerEmail,
      customerPhone,
      leadId: lead.id,
      packageId: pkg.id,
      packageName: pkg.title,
      travelStartDate: startDate,
      travelEndDate: endDate,
      adultsCount: paxCount,
      childrenCount: 0,
      totalAmount: calculatedTotal,
      amountPaid: Math.round(calculatedTotal * 0.3), // 30% deposit
      bookingStatus: 'confirmed',
      paymentStatus: 'deposit_paid',
      specialRequests: specialNotes || 'VIP Arrival & Dietary preferences requested',
    });

    setIsSubmitting(false);
    setSubmittedBookingRef(booking.bookingReference);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-5xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4 bg-stone-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span>{pkg.destination}</span>
              <span>·</span>
              <span>{pkg.country}</span>
              <span>·</span>
              <span className="capitalize">{pkg.travelStyle}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug line-clamp-1">
              {pkg.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View if booking completed */}
        {submittedBookingRef ? (
          <div className="p-8 text-center space-y-4 max-w-lg mx-auto my-auto">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-stone-900">
              Booking Request Confirmed!
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Your reservation reference is{' '}
              <span className="font-mono font-bold text-stone-900">{submittedBookingRef}</span>. Our sales specialist has been notified and linked this booking to your account.
            </p>
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 text-left space-y-1">
              <div><strong>Tour:</strong> {pkg.title}</div>
              <div><strong>Travelers:</strong> {paxCount} Guests</div>
              <div><strong>Departure:</strong> {travelDate}</div>
              <div><strong>Total Amount:</strong> ${calculatedTotal.toLocaleString()}</div>
              <div><strong>Status:</strong> 30% Deposit Registered (Confirmed)</div>
            </div>
            <button
              onClick={() => {
                setSubmittedBookingRef(null);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Done & Return to Packages
            </button>
          </div>
        ) : (
          <>
            {/* Modal Navigation Tabs */}
            <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'itinerary'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Day-by-Day Itinerary ({pkg.itinerary.length} Days)
              </button>
              <button
                onClick={() => setActiveTab('inclusions')}
                className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'inclusions'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Inclusions & Exclusions
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'pricing'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Price Calculator & Addons
              </button>
              <button
                onClick={() => setActiveTab('enquire')}
                className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'enquire'
                    ? 'border-amber-700 text-amber-900 font-semibold'
                    : 'border-transparent text-amber-800 hover:text-amber-950'
                }`}
              >
                Direct CRM Enquiry & Booking
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Photo Showcase Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 relative aspect-16/9 rounded-lg overflow-hidden bg-stone-100">
                  <img
                    src={selectedGalleryImg || pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                  {pkg.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGalleryImg(img)}
                      className={`relative aspect-16/9 md:aspect-auto md:h-24 w-28 md:w-full rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                        (selectedGalleryImg || pkg.heroImage) === img
                          ? 'border-stone-900 ring-2 ring-stone-900/10'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Gallery preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: Day-wise Itinerary */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-stone-900">
                      Curated Day-by-Day Journey
                    </h3>
                    <div className="text-xs text-stone-500">
                      Click any day to expand activities & accommodations
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pkg.itinerary.map((day) => {
                      const isExpanded = expandedDay === day.dayNumber;
                      return (
                        <div
                          key={day.dayNumber}
                          className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50/50"
                        >
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                            className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-stone-100/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-md bg-stone-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                D{day.dayNumber}
                              </span>
                              <div>
                                <h4 className="font-semibold text-sm text-stone-900">
                                  {day.title}
                                </h4>
                                <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                                  {day.summary}
                                </div>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-4 pt-2 border-t border-stone-200/80 bg-white space-y-3 text-xs">
                              <p className="text-stone-700 leading-relaxed">{day.summary}</p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                                <div className="flex items-start gap-2 text-stone-600">
                                  <Utensils className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="font-medium text-stone-800">Meals Included:</span>{' '}
                                    {day.mealsIncluded}
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-stone-600">
                                  <Bed className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="font-medium text-stone-800">Accommodation:</span>{' '}
                                    {day.accommodation}
                                  </div>
                                </div>
                              </div>

                              {day.activities && day.activities.length > 0 && (
                                <div className="pt-2 border-t border-stone-100">
                                  <div className="font-medium text-stone-800 mb-1.5">
                                    Day Highlights & Activities:
                                  </div>
                                  <ul className="space-y-1 text-stone-600 pl-4 list-disc">
                                    {day.activities.map((act, i) => (
                                      <li key={i}>{act}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Inclusions & Exclusions */}
              {activeTab === 'inclusions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Inclusions */}
                  <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>What is Included</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-stone-700">
                      {pkg.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div className="p-5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-3">
                    <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>What is Not Included</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-stone-700">
                      {pkg.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold shrink-0">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: Pricing Calculator & Addons */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Customise Travelers & VIP Add-ons
                      </h3>

                      {/* Number of Pax selector */}
                      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-stone-900">Adult Travelers</div>
                          <div className="text-xs text-stone-500">
                            Base rate: ${currentPricePerPax.toLocaleString()} per person
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                            className="w-8 h-8 rounded-md bg-white border border-stone-300 font-bold hover:bg-stone-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-sm text-stone-900 w-6 text-center">
                            {paxCount}
                          </span>
                          <button
                            onClick={() => setPaxCount(Math.min(pkg.maxTravelers, paxCount + 1))}
                            className="w-8 h-8 rounded-md bg-white border border-stone-300 font-bold hover:bg-stone-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Optional Add-ons */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                          Select Bespoke Upgrades
                        </label>
                        <div className="space-y-2">
                          {availableAddons.map((addon) => {
                            const isChecked = selectedAddons.includes(addon.id);
                            return (
                              <button
                                key={addon.id}
                                onClick={() => toggleAddon(addon.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between text-xs ${
                                  isChecked
                                    ? 'border-stone-900 bg-stone-50 font-medium'
                                    : 'border-stone-200 hover:border-stone-300 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                                      isChecked
                                        ? 'bg-stone-900 border-stone-900 text-white'
                                        : 'border-stone-300'
                                    }`}
                                  >
                                    {isChecked && '✓'}
                                  </div>
                                  <span className="text-stone-800">{addon.title}</span>
                                </div>
                                <span className="font-mono font-semibold text-stone-900">
                                  +${addon.price}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown Summary Card */}
                    <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 h-fit space-y-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Estimated Quotation
                      </div>
                      <div className="space-y-2 text-xs border-b border-stone-200 pb-3">
                        <div className="flex justify-between text-stone-600">
                          <span>
                            Base Tour (${currentPricePerPax.toLocaleString()} × {paxCount})
                          </span>
                          <span className="font-mono">${calculatedBase.toLocaleString()}</span>
                        </div>
                        {selectedAddons.length > 0 && (
                          <div className="flex justify-between text-stone-600">
                            <span>Selected Add-ons ({selectedAddons.length})</span>
                            <span className="font-mono">+${totalAddonsCost.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-semibold text-stone-900">Total Estimate</span>
                        <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                          ${calculatedTotal.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('enquire')}
                        className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Proceed to Enquiry & Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Direct Enquiry & Booking Form (linked to CRM) */}
              {activeTab === 'enquire' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">
                      Submit Enquiry to CRM
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Your request is automatically captured in our Sales CRM pipeline. A dedicated specialist will prepare a customized quotation within 4 hours.
                    </p>

                    <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3 text-xs">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            Target Travel Date
                          </label>
                          <input
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            Travelers (Pax)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={pkg.maxTravelers}
                            value={paxCount}
                            onChange={(e) => setPaxCount(parseInt(e.target.value) || 1)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          Special Requests & Preferences
                        </label>
                        <textarea
                          rows={3}
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          placeholder="Dietary requirements, honeymoon setup, room preferences, flight booking assistance..."
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit CRM Enquiry</span>
                      </button>
                    </form>
                  </div>

                  {/* Direct Booking Column */}
                  <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Instant Booking Guarantee</span>
                      </div>
                      <h4 className="text-base font-semibold text-stone-900">
                        Lock In Your Dates Today
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Secure this departure immediately with a 30% refundable reservation deposit. Full booking voucher and concierge briefing issued immediately.
                      </p>

                      <div className="mt-4 pt-4 border-t border-stone-200 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Selected Departure:</span>
                          <span className="font-medium text-stone-800">{travelDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Travelers:</span>
                          <span className="font-medium text-stone-800">{paxCount} Guests</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Total Price:</span>
                          <span className="font-mono font-bold text-stone-900">
                            ${calculatedTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Required 30% Deposit:</span>
                          <span className="font-mono">${Math.round(calculatedTotal * 0.3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
                      <button
                        onClick={handleDirectBooking}
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Confirm Direct Reservation</span>
                      </button>
                      <div className="text-[11px] text-center text-stone-400">
                        🔒 100% Secure Transaction · Direct link to Sales CRM
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
