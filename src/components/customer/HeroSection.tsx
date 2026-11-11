import React from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { Search, MapPin, Calendar, Compass, Tag, ArrowRight } from 'lucide-react';
import { TravelStyle } from '../../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStyle,
  setSelectedStyle,
  onExploreClick,
}) => {
  const { banners } = useTravelStore();
  const activeBanner = banners.find((b) => b.isActive);

  return (
    <div className="relative">
      {/* Promotional Top Banner from Admin CMS */}
      {activeBanner && (
        <div className="bg-amber-950 text-amber-200 px-6 py-2.5 text-xs text-center border-b border-amber-900/40">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
            <span className="font-semibold text-white">{activeBanner.headline}</span>
            <span className="hidden md:inline text-amber-300/80">·</span>
            <span className="text-amber-200/90">{activeBanner.subtext}</span>
            {activeBanner.couponCode && (
              <span className="bg-amber-900/80 text-amber-100 font-mono text-[11px] px-2 py-0.5 rounded border border-amber-800">
                Code: {activeBanner.couponCode}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hero Visual Container */}
      <div className="relative min-h-[540px] md:min-h-[620px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Measured Scrim */}
        <img
          src="/src/assets/images/hero_travel_alps_1794378293361.jpg"
          alt="Majestic Alpine Grand Express Journey"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-stone-950/30" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-medium mb-3">
            <span>Bespoke Journeys</span>
            <span>·</span>
            <span>Private Concierge Service</span>
            <span>·</span>
            <span>Seamless CRM Booking</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight text-balance">
            Extraordinary Journeys, Crafted to the Final Detail.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-200/90 max-w-2xl mx-auto leading-relaxed">
            From the snow-peaked Swiss Alps to secluded Bali rainforest sanctuaries. Explore verified day-by-day itineraries with instant quotation and personal specialist support.
          </p>

          {/* Integrated Search Strip */}
          <div className="mt-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-stone-200 text-stone-900">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Destination Search */}
              <div className="flex items-center gap-2.5 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you want to explore?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
                />
              </div>

              {/* Travel Style Selector */}
              <div className="flex items-center gap-2.5 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200">
                <Compass className="w-4 h-4 text-stone-500 shrink-0" />
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-transparent text-sm text-stone-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Travel Styles</option>
                  <option value="luxury">Luxury & Premium</option>
                  <option value="cultural">Cultural Heritage</option>
                  <option value="wellness">Wellness & Sanctuary</option>
                  <option value="adventure">Alpine & Active</option>
                </select>
              </div>

              {/* Search Action */}
              <button
                onClick={onExploreClick}
                className="w-full py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search Tour Packages</span>
              </button>
            </div>
          </div>

          {/* Trust statistics below search */}
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 text-xs text-stone-300 font-medium flex-wrap">
            <span>98.6% Customer Satisfaction</span>
            <span>·</span>
            <span>Direct Sales Specialist Consultation</span>
            <span>·</span>
            <span>Transparent Quotations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
