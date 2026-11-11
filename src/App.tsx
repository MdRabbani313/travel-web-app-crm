import React, { useState } from 'react';
import { TravelStoreProvider, useTravelStore } from './context/TravelStoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { HeroSection } from './components/customer/HeroSection';
import { PackageCard } from './components/customer/PackageCard';
import { PackageDetailModal } from './components/customer/PackageDetailModal';
import { DestinationsView } from './components/customer/DestinationsView';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AboutPage } from './components/customer/AboutPage';
import { ContactPage } from './components/customer/ContactPage';
import { SalesDashboard } from './components/sales/SalesDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TourPackage } from './types';
import {
  Compass,
  Filter,
  Star,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';

function TravelApp() {
  const { packages, testimonials, currentRole } = useTravelStore();

  const [activeTab, setActiveTab] = useState<string>('packages');

  // Search & Filter state for customer package listings
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Modal State
  const [selectedPackageForDetail, setSelectedPackageForDetail] = useState<TourPackage | null>(null);
  const [packageModalTab, setPackageModalTab] = useState<'itinerary' | 'enquire' | 'book'>('itinerary');

  // Filter logic
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      searchQuery === '' ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStyle = selectedStyle === 'all' || pkg.travelStyle === selectedStyle;

    const matchesDuration =
      selectedDuration === 'all' ||
      (selectedDuration === 'short' && pkg.durationDays <= 6) ||
      (selectedDuration === 'medium' && pkg.durationDays >= 7);

    return matchesSearch && matchesStyle && matchesDuration;
  });

  // Sort logic
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortBy === 'price_low') {
      const pA = a.discountedPriceUSD || a.basePriceUSD;
      const pB = b.discountedPriceUSD || b.basePriceUSD;
      return pA - pB;
    }
    if (sortBy === 'price_high') {
      const pA = a.discountedPriceUSD || a.basePriceUSD;
      const pB = b.discountedPriceUSD || b.basePriceUSD;
      return pB - pA;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // default featured order
  });

  const handleOpenDetailModal = (pkg: TourPackage, tab: 'itinerary' | 'enquire' | 'book' = 'itinerary') => {
    setSelectedPackageForDetail(pkg);
    setPackageModalTab(tab);
  };

  const handleSelectDestination = (destName: string) => {
    setSearchQuery(destName.split(' ')[0]);
    setActiveTab('packages');
  };

  const approvedTestimonials = testimonials.filter((t) => t.isApproved);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Primary Top Bar Contract */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area based on active view */}
      <main className="flex-1">
        {/* VIEW 1: Sales Panel (CRM) */}
        {activeTab === 'sales_crm' && <SalesDashboard />}

        {/* VIEW 2: Admin Panel */}
        {activeTab === 'admin_panel' && <AdminDashboard />}

        {/* VIEW 3: Destinations Catalog */}
        {activeTab === 'destinations' && (
          <DestinationsView
            onSelectDestination={handleSelectDestination}
            onSelectPackage={(pkg) => handleOpenDetailModal(pkg, 'itinerary')}
          />
        )}

        {/* VIEW 4: About Us */}
        {activeTab === 'about' && <AboutPage />}

        {/* VIEW 5: Contact Page */}
        {activeTab === 'contact' && <ContactPage />}

        {/* VIEW 6: Customer Portal */}
        {activeTab === 'portal' && (
          <CustomerPortal onExplorePackages={() => setActiveTab('packages')} />
        )}

        {/* VIEW 7: Home & Tour Packages Catalog */}
        {activeTab === 'packages' && (
          <div className="space-y-16 pb-16">
            {/* Cinematic Hero with Search Bar */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              onExploreClick={() => {
                const target = document.getElementById('package-listings');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Tour Packages Section with Filters */}
            <div id="package-listings" className="max-w-7xl mx-auto px-6 space-y-8 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
                    Verified Itineraries
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                    Bespoke Tour Packages
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Every journey includes day-by-day itineraries, private guides, and instant quotation linked to our sales CRM.
                  </p>
                </div>

                {/* Filter and Sort Bar */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Style Filter */}
                  <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-medium">
                    <button
                      onClick={() => setSelectedStyle('all')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        selectedStyle === 'all'
                          ? 'bg-white text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      All Styles
                    </button>
                    <button
                      onClick={() => setSelectedStyle('luxury')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        selectedStyle === 'luxury'
                          ? 'bg-white text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Luxury
                    </button>
                    <button
                      onClick={() => setSelectedStyle('cultural')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        selectedStyle === 'cultural'
                          ? 'bg-white text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Cultural
                    </button>
                    <button
                      onClick={() => setSelectedStyle('wellness')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        selectedStyle === 'wellness'
                          ? 'bg-white text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Wellness
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="text-xs">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-hidden cursor-pointer"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Guest Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Package Grid */}
              {sortedPackages.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-xl border border-stone-200 space-y-3">
                  <Search className="w-8 h-8 text-stone-400 mx-auto" />
                  <h3 className="text-base font-semibold text-stone-800">
                    No packages match your search
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try adjusting your keyword or reset filters to view all available expeditions.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStyle('all');
                      setSelectedDuration('all');
                    }}
                    className="py-1.5 px-4 bg-stone-900 text-white rounded-lg text-xs font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      onSelect={(p) => handleOpenDetailModal(p, 'itinerary')}
                      onEnquire={(p) => handleOpenDetailModal(p, 'enquire')}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Verified Testimonials Section - Adhering to §1.H Claim-to-Proof */}
            <div className="bg-white py-16 border-y border-stone-200">
              <div className="max-w-7xl mx-auto px-6 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
                      Guest Proof & Reviews
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                      Unfiltered Traveler Endorsements
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-stone-900">4.96 out of 5</span>
                    <span>across 140+ bespoke departures</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {approvedTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-6 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                          "{t.comment}"
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-200 text-xs">
                        <div className="font-bold text-stone-900">{t.guestName}</div>
                        <div className="text-stone-500 text-[11px]">{t.location}</div>
                        <div className="text-stone-700 font-medium text-[11px] mt-1">
                          Tour: {t.packageName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why VoyageCRM Guarantee Banner */}
            <div className="max-w-7xl mx-auto px-6">
              <div className="p-8 sm:p-12 bg-stone-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                    The Voyage CRM Difference
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold leading-tight">
                    Every Trip Backed by a Dedicated Sales Specialist.
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Submit an enquiry or customize dates in seconds. Our integrated CRM ensures you receive a customized quotation and a direct telephone briefing within hours.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-colors text-center"
                  >
                    Speak with a Specialist
                  </button>
                  <button
                    onClick={() => setActiveTab('sales_crm')}
                    className="py-3 px-6 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 rounded-lg text-xs font-semibold transition-colors text-center"
                  >
                    Inspect Sales CRM Pipeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Package Detail, Itinerary & Booking Modal */}
      <PackageDetailModal
        pkg={selectedPackageForDetail}
        isOpen={!!selectedPackageForDetail}
        onClose={() => setSelectedPackageForDetail(null)}
        initialTab={packageModalTab}
      />

      {/* Notification Toast Stack */}
      <ToastContainer />

      {/* Primary Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <TravelStoreProvider>
      <TravelApp />
    </TravelStoreProvider>
  );
}
