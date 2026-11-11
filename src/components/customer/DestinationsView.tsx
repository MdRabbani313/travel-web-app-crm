import React from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { TourPackage } from '../../types';
import { MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';

interface DestinationsViewProps {
  onSelectDestination: (destName: string) => void;
  onSelectPackage: (pkg: TourPackage) => void;
}

export const DestinationsView: React.FC<DestinationsViewProps> = ({
  onSelectDestination,
  onSelectPackage,
}) => {
  const { destinations, packages } = useTravelStore();

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-12">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
          Global Destination Portfolios
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-stone-900 leading-tight">
          Handpicked Regions, Unrivaled Access.
        </h1>
        <p className="mt-4 text-stone-600 text-base leading-relaxed">
          Each destination in our portfolio is curated through direct partnerships with heritage ryokans, private alpine chalet proprietors, and coastal yacht captains.
        </p>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {destinations.map((dest) => {
          const destPackages = packages.filter((p) =>
            p.destination.toLowerCase().includes(dest.name.toLowerCase().split(' ')[0]) ||
            p.country.toLowerCase().includes(dest.country.toLowerCase())
          );

          return (
            <div
              key={dest.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xs text-amber-300 font-medium">{dest.region}</div>
                    <h3 className="text-2xl font-bold font-display">{dest.name}</h3>
                    <div className="text-xs text-stone-300 mt-0.5">{dest.country}</div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1.5 font-medium text-stone-700">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>Best Season: {dest.bestSeason}</span>
                    </span>
                    <span className="font-mono">{destPackages.length} Available Tours</span>
                  </div>

                  {/* List of packages in this destination */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="text-xs font-semibold text-stone-700">Curated Expeditions:</div>
                    {destPackages.length === 0 ? (
                      <div className="text-xs text-stone-400 italic">Seasonal departures being updated</div>
                    ) : (
                      destPackages.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPackage(p)}
                          className="p-2.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/60 cursor-pointer flex items-center justify-between transition-colors text-xs"
                        >
                          <div>
                            <div className="font-semibold text-stone-900">{p.title}</div>
                            <div className="text-[11px] text-stone-500">
                              {p.durationDays} Days · {p.travelStyle} style
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-stone-900">
                              ${(p.discountedPriceUSD || p.basePriceUSD).toLocaleString()}
                            </span>
                            <div className="text-[10px] text-stone-400">/ person</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => onSelectDestination(dest.name)}
                  className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1"
                >
                  <span>Filter All {dest.name} Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
