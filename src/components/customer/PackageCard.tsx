import React from 'react';
import { TourPackage } from '../../types';
import { Star, Clock, Users, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface PackageCardProps {
  pkg: TourPackage;
  onSelect: (pkg: TourPackage) => void;
  onEnquire: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect, onEnquire }) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Photo Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelect(pkg)}>
        <img
          src={pkg.heroImage}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80';
          }}
        />
        {/* Subtle gradient overlay at bottom for clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />

        {/* Quiet destination note in bottom left of image */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow-xs">
          <span>{pkg.destination}</span>
          <span className="mx-1.5 opacity-70">·</span>
          <span>{pkg.country}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Zero-pill discipline (plain text with separators) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
            <span className="capitalize">{pkg.travelStyle} Tour</span>
            <span aria-hidden="true">·</span>
            <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{pkg.rating.toFixed(2)}</span>
              <span className="text-stone-400">({pkg.reviewsCount})</span>
            </span>
          </div>

          <h3
            onClick={() => onSelect(pkg)}
            className="text-lg font-semibold text-stone-900 hover:text-stone-700 cursor-pointer leading-snug line-clamp-1"
          >
            {pkg.title}
          </h3>

          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {pkg.tagline}
          </p>

          {/* Key highlights (1-2 points max) */}
          <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            <div className="truncate">✓ {pkg.highlights[0]}</div>
            {pkg.highlights[1] && <div className="truncate">✓ {pkg.highlights[1]}</div>}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Starting from</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                ${pkg.discountedPriceUSD ? pkg.discountedPriceUSD.toLocaleString() : pkg.basePriceUSD.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500">/ person</span>
            </div>
            {pkg.discountedPriceUSD && (
              <span className="text-[11px] text-stone-400 line-through font-mono">
                ${pkg.basePriceUSD.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEnquire(pkg)}
              className="py-2 px-3 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Enquire
            </button>
            <button
              onClick={() => onSelect(pkg)}
              className="py-2 px-3.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <span>Itinerary</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
