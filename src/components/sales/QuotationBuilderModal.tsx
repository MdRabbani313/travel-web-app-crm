import React, { useState } from 'react';
import { Lead, TourPackage, QuoteAddon } from '../../types';
import { useTravelStore } from '../../context/TravelStoreContext';
import { X, FileText, Check, DollarSign, Calendar, Percent, Sparkles, Printer } from 'lucide-react';

interface QuotationBuilderModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationBuilderModal: React.FC<QuotationBuilderModalProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  const { packages, createQuotation, currentUser, settings, addToast } = useTravelStore();

  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    lead?.packageId || packages[0]?.id || ''
  );
  const [adultsCount, setAdultsCount] = useState<number>(lead?.estimatedPax || 2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [customDiscount, setCustomDiscount] = useState<number>(300);
  const [validDays, setValidDays] = useState<number>(14);
  const [consultantNotes, setConsultantNotes] = useState(
    'Private limousine transfers included on arrival and departure. Flexible cancellation up to 30 days prior.'
  );

  const availableAddons: QuoteAddon[] = [
    { id: 'add-suite', title: '5-Star Penthouse Luxury Suite Upgrade', price: 600 },
    { id: 'add-heli', title: 'Private Helicopter Panoramic Alpine Flight', price: 750 },
    { id: 'add-wine', title: 'Private Sommelier Wine & Truffle Pairing Experience', price: 280 },
    { id: 'add-spa', title: 'Couples Rejuvenation Spa & Thermal Mineral Bath', price: 320 },
  ];

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['add-suite']);

  if (!isOpen) return null;

  const currentPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const baseRate = currentPkg ? (currentPkg.discountedPriceUSD || currentPkg.basePriceUSD) : 2500;

  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const item = availableAddons.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = baseRate * adultsCount + (baseRate * 0.6 * childrenCount) + addonsTotal;
  const afterDiscount = Math.max(0, subtotal - customDiscount);
  const taxAmount = Math.round((afterDiscount * (settings.taxRate || 10)) / 100);
  const finalTotal = afterDiscount + taxAmount;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleGenerateQuote = () => {
    if (!lead) {
      addToast('Please select an active lead first.', 'warning');
      return;
    }

    const validUntilDate = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const activeAddonsList = availableAddons.filter((a) => selectedAddonIds.includes(a.id));

    createQuotation({
      leadId: lead.id,
      packageId: currentPkg.id,
      packageName: currentPkg.title,
      preparedBySalesId: currentUser.id,
      preparedByName: currentUser.name,
      adultsCount,
      childrenCount,
      baseRate,
      addons: activeAddonsList,
      discountAmount: customDiscount,
      taxRate: settings.taxRate || 10,
      totalAmount: finalTotal,
      status: 'sent',
      validUntil: validUntilDate,
      customerNotes: consultantNotes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-4xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4 bg-stone-50/70 shrink-0">
          <div>
            <div className="text-xs text-stone-500 font-medium">Bespoke Proposal Generator</div>
            <h2 className="text-base font-bold text-stone-900">
              Create Formal Quotation for {lead?.customerName || 'Client'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Configuration Inputs */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Tour Package</label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => setSelectedPkgId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium focus:outline-hidden"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} (${pkg.discountedPriceUSD || pkg.basePriceUSD}/person)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Adult Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(parseInt(e.target.value) || 1)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Children (Under 12)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              {/* Addons Selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Bespoke Upgrades & Add-ons
                </label>
                <div className="space-y-1.5">
                  {availableAddons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'border-stone-900 bg-stone-50 font-medium'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              isChecked ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-300'
                            }`}
                          >
                            {isChecked && '✓'}
                          </div>
                          <span>{addon.title}</span>
                        </div>
                        <span className="font-mono font-semibold">+${addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount & Validity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Special Discount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={validDays}
                    onChange={(e) => setValidDays(parseInt(e.target.value) || 14)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Consultant Notes & Guarantees
                </label>
                <textarea
                  rows={2}
                  value={consultantNotes}
                  onChange={(e) => setConsultantNotes(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
            </div>

            {/* Right: Live Branded Quotation Card Preview */}
            <div className="p-6 bg-stone-900 text-white rounded-xl flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                      Voyage Bespoke Quote Preview
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {currentPkg.title}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-stone-400 font-mono">
                    QT-2026-LIVE
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>
                      Adults ({adultsCount} × ${baseRate.toLocaleString()})
                    </span>
                    <span className="font-mono text-white">
                      ${(adultsCount * baseRate).toLocaleString()}
                    </span>
                  </div>

                  {childrenCount > 0 && (
                    <div className="flex justify-between">
                      <span>Children ({childrenCount} × ${Math.round(baseRate * 0.6).toLocaleString()})</span>
                      <span className="font-mono text-white">
                        ${(childrenCount * Math.round(baseRate * 0.6)).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedAddonIds.length > 0 && (
                    <div className="flex justify-between">
                      <span>Selected Upgrades ({selectedAddonIds.length})</span>
                      <span className="font-mono text-white">+${addonsTotal.toLocaleString()}</span>
                    </div>
                  )}

                  {customDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promotional Privilege Discount</span>
                      <span className="font-mono">-${customDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-400">
                    <span>Applicable Tax & VAT ({settings.taxRate}%)</span>
                    <span className="font-mono text-white">+${taxAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex justify-between items-baseline">
                  <div>
                    <div className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider">
                      Guaranteed Total Quote
                    </div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-white">
                      ${finalTotal.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-amber-300/80">
                    Valid for {validDays} days
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-800/80 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerateQuote}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Issue & Send to Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
