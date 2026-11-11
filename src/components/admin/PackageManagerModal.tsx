import React, { useState } from 'react';
import { TourPackage, TravelStyle, PackageDifficulty, ItineraryDay } from '../../types';
import { useTravelStore } from '../../context/TravelStoreContext';
import { X, Plus, Trash2, Check, Sparkles, MapPin, DollarSign, Calendar } from 'lucide-react';

interface PackageManagerModalProps {
  packageToEdit: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PackageManagerModal: React.FC<PackageManagerModalProps> = ({
  packageToEdit,
  isOpen,
  onClose,
}) => {
  const { addPackage, updatePackage, addToast } = useTravelStore();

  const [title, setTitle] = useState(packageToEdit?.title || '');
  const [tagline, setTagline] = useState(packageToEdit?.tagline || '');
  const [description, setDescription] = useState(packageToEdit?.description || '');
  const [destination, setDestination] = useState(packageToEdit?.destination || '');
  const [country, setCountry] = useState(packageToEdit?.country || '');
  const [region, setRegion] = useState(packageToEdit?.region || 'Europe');
  const [durationDays, setDurationDays] = useState(packageToEdit?.durationDays || 7);
  const [durationNights, setDurationNights] = useState(packageToEdit?.durationNights || 6);
  const [basePriceUSD, setBasePriceUSD] = useState(packageToEdit?.basePriceUSD || 3200);
  const [discountedPriceUSD, setDiscountedPriceUSD] = useState<number | undefined>(
    packageToEdit?.discountedPriceUSD || 2800
  );
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(
    packageToEdit?.travelStyle || 'luxury'
  );
  const [difficulty, setDifficulty] = useState<PackageDifficulty>(
    packageToEdit?.difficulty || 'easy'
  );
  const [maxTravelers, setMaxTravelers] = useState(packageToEdit?.maxTravelers || 10);
  const [heroImage, setHeroImage] = useState(
    packageToEdit?.heroImage || '/src/assets/images/hero_travel_alps_1794378293361.jpg'
  );

  const [inclusionsText, setInclusionsText] = useState(
    packageToEdit?.inclusions.join('\n') ||
      'Luxury hotel accommodations\nDaily breakfast & 3 dinners\nPrivate Mercedes chauffeur\nFirst-class train passes'
  );
  const [exclusionsText, setExclusionsText] = useState(
    packageToEdit?.exclusions.join('\n') ||
      'International airfare\nPersonal travel insurance\nGratuities'
  );

  // Day-wise itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    packageToEdit?.itinerary || [
      {
        dayNumber: 1,
        title: 'Arrival & Welcome Dinner',
        summary: 'Private chauffeur transfer to boutique hotel. Evening welcome reception with wine pairing.',
        mealsIncluded: 'Welcome Dinner',
        accommodation: 'Luxury Hotel',
        activities: ['Airport greeting', 'Welcome orientation'],
      },
    ]
  );

  if (!isOpen) return null;

  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        dayNumber: nextDayNum,
        title: `Day ${nextDayNum}: Cultural Discovery & Highlights`,
        summary: 'Guided morning exploration followed by leisurely afternoon and regional tasting.',
        mealsIncluded: 'Breakfast',
        accommodation: 'Heritage Hotel',
        activities: ['Guided walking tour', 'Local artisan visit'],
      },
    ]);
  };

  const handleRemoveDay = (dayNum: number) => {
    setItinerary(itinerary.filter((d) => d.dayNumber !== dayNum));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inclusions = inclusionsText.split('\n').filter((s) => s.trim().length > 0);
    const exclusions = exclusionsText.split('\n').filter((s) => s.trim().length > 0);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const pkgData = {
      title,
      slug,
      tagline,
      description,
      destination,
      country,
      region,
      durationDays,
      durationNights,
      basePriceUSD,
      discountedPriceUSD: discountedPriceUSD ? Number(discountedPriceUSD) : undefined,
      travelStyle,
      difficulty,
      maxTravelers,
      heroImage,
      galleryImages: [heroImage],
      highlights: [
        'Curated 5-Star accommodations',
        'Private licensed cultural guide',
        '24/7 dedicated concierge desk',
      ],
      inclusions,
      exclusions,
      isPublished: true,
      isFeatured: true,
      rating: 4.95,
      reviewsCount: 24,
      itinerary,
    };

    if (packageToEdit) {
      updatePackage(packageToEdit.id, pkgData);
    } else {
      addPackage(pkgData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-4xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {packageToEdit ? 'Edit Tour Package & Itinerary' : 'Create New Tour Package'}
            </h2>
            <p className="text-xs text-stone-500">
              Manage package specifications, pricing, day-by-day itinerary, and inclusions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-900 text-sm border-b border-stone-100 pb-2">
              1. General Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Swiss Alps & Glacier Express Grand Tour"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Zermatt & Swiss Alps"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Catchy Tagline</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Brief summary line shown on cards"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rich narrative describing the traveler experience..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-900 text-sm border-b border-stone-100 pb-2">
              2. Duration, Pricing & Style
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Days</label>
                <input
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nights</label>
                <input
                  type="number"
                  min="0"
                  value={durationNights}
                  onChange={(e) => setDurationNights(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  min="100"
                  value={basePriceUSD}
                  onChange={(e) => setBasePriceUSD(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Discounted Price ($)</label>
                <input
                  type="number"
                  min="0"
                  value={discountedPriceUSD || ''}
                  onChange={(e) =>
                    setDiscountedPriceUSD(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="Optional promo"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                >
                  <option value="luxury">Luxury</option>
                  <option value="cultural">Cultural</option>
                  <option value="wellness">Wellness</option>
                  <option value="adventure">Adventure</option>
                  <option value="honeymoon">Honeymoon</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as PackageDifficulty)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                >
                  <option value="easy">Easy / Relaxed</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hero Image Path</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 truncate"
                />
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-semibold text-stone-900 text-sm">
                3. Day-by-Day Itinerary ({itinerary.length} Days)
              </h3>
              <button
                type="button"
                onClick={handleAddDay}
                className="py-1 px-2.5 bg-stone-900 text-white rounded font-medium text-[11px] flex items-center gap-1 hover:bg-stone-800"
              >
                <Plus className="w-3 h-3" />
                <span>Add Day</span>
              </button>
            </div>

            <div className="space-y-3">
              {itinerary.map((day, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-stone-800 font-mono">Day {day.dayNumber}</span>
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(day.dayNumber)}
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Day Title"
                    value={day.title}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].title = e.target.value;
                      setItinerary(updated);
                    }}
                    className="w-full p-1.5 bg-white border border-stone-200 rounded font-medium text-stone-900"
                  />

                  <textarea
                    rows={2}
                    placeholder="Day Summary and Highlights"
                    value={day.summary}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].summary = e.target.value;
                      setItinerary(updated);
                    }}
                    className="w-full p-1.5 bg-white border border-stone-200 rounded text-stone-800"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Meals (e.g. Breakfast, Dinner)"
                      value={day.mealsIncluded}
                      onChange={(e) => {
                        const updated = [...itinerary];
                        updated[idx].mealsIncluded = e.target.value;
                        setItinerary(updated);
                      }}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded text-stone-700 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Hotel / Accommodation"
                      value={day.accommodation}
                      onChange={(e) => {
                        const updated = [...itinerary];
                        updated[idx].accommodation = e.target.value;
                        setItinerary(updated);
                      }}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded text-stone-700 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Inclusions (1 per line)
              </label>
              <textarea
                rows={4}
                value={inclusionsText}
                onChange={(e) => setInclusionsText(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Exclusions (1 per line)
              </label>
              <textarea
                rows={4}
                value={exclusionsText}
                onChange={(e) => setExclusionsText(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold"
            >
              {packageToEdit ? 'Save Changes' : 'Publish Tour Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
