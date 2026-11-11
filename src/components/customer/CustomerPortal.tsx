import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import {
  User,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  DollarSign,
  Printer,
  Compass,
  ArrowRight,
  Shield,
  MessageSquare,
} from 'lucide-react';

interface CustomerPortalProps {
  onExplorePackages: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onExplorePackages }) => {
  const { currentUser, leads, quotations, bookings, updateQuotationStatus, updateBooking, addToast } =
    useTravelStore();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'quotes' | 'bookings'>('enquiries');
  const [selectedQuoteForPrint, setSelectedQuoteForPrint] = useState<string | null>(null);

  // Filter items for current user (matching by email or name)
  const myLeads = leads.filter(
    (l) =>
      l.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      l.customerName.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  const myQuotes = quotations.filter((q) =>
    myLeads.some((l) => l.id === q.leadId)
  );

  const myBookings = bookings.filter(
    (b) =>
      b.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      b.customerName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      b.customerId === currentUser.id
  );

  const handleAcceptQuote = (quoteId: string) => {
    updateQuotationStatus(quoteId, 'accepted');
    addToast('Quotation accepted! Our sales specialist is issuing your travel vouchers.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Customer Header */}
      <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-full object-cover border border-stone-200"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <div className="text-xs text-stone-400 font-medium">Logged in Traveler</div>
            <h1 className="text-xl font-bold text-stone-900">{currentUser.name}</h1>
            <div className="text-xs text-stone-500 mt-0.5">{currentUser.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExplorePackages}
            className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Tour Packages</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-stone-200 flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-b-2 border-stone-900 text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>My Enquiries</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
            {myLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'quotes'
              ? 'border-b-2 border-stone-900 text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Received Quotations</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
            {myQuotes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-b-2 border-stone-900 text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Confirmed Bookings</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
            {myBookings.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="mt-6 space-y-4">
          {myLeads.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 space-y-3">
              <MessageSquare className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-sm font-semibold text-stone-800">No active enquiries yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explore our curated tour packages and submit an enquiry. Your inquiry will appear here with live CRM tracking!
              </p>
              <button
                onClick={onExplorePackages}
                className="mt-2 py-2 px-4 bg-stone-900 text-white rounded-lg text-xs font-medium"
              >
                Browse Journeys
              </button>
            </div>
          ) : (
            myLeads.map((lead) => {
              const statusStep =
                lead.status === 'new'
                  ? 1
                  : lead.status === 'contacted'
                  ? 2
                  : lead.status === 'quoted'
                  ? 3
                  : lead.status === 'won'
                  ? 4
                  : 1;

              return (
                <div
                  key={lead.id}
                  className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                        <span>{lead.leadCode}</span>
                        <span>·</span>
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-semibold text-stone-900 mt-0.5">
                        {lead.packageName || 'Custom Tailored Expedition'}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-stone-500">Assigned Travel Specialist:</div>
                      <div className="text-sm font-semibold text-stone-800">
                        {lead.assignedSalesName}
                      </div>
                    </div>
                  </div>

                  {/* Stage Timeline */}
                  <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-xs font-semibold text-stone-700 mb-2">
                      Live CRM Processing Status:
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium">
                      <div
                        className={`p-2 rounded ${
                          statusStep >= 1
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        1. Captured
                      </div>
                      <div
                        className={`p-2 rounded ${
                          statusStep >= 2
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        2. Contacted
                      </div>
                      <div
                        className={`p-2 rounded ${
                          statusStep >= 3
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        3. Quoted
                      </div>
                      <div
                        className={`p-2 rounded ${
                          statusStep >= 4
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        4. Confirmed (Won)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <div>
                      <strong>Target Date:</strong> {lead.travelDate || 'Flexible'} ·{' '}
                      <strong>Travelers:</strong> {lead.estimatedPax} Guests ·{' '}
                      <strong>Est. Budget:</strong> ${lead.estimatedBudget.toLocaleString()}
                    </div>
                    {lead.status === 'quoted' && (
                      <button
                        onClick={() => setActiveTab('quotes')}
                        className="text-stone-900 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Received Quotation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Quotations */}
      {activeTab === 'quotes' && (
        <div className="mt-6 space-y-4">
          {myQuotes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 space-y-3">
              <FileText className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-sm font-semibold text-stone-800">No proposals issued yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Once our sales executive reviews your enquiry, a branded quotation with itemized pricing will be delivered here!
              </p>
            </div>
          ) : (
            myQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span>{quote.quoteNumber}</span>
                      <span>·</span>
                      <span>Prepared by {quote.preparedByName}</span>
                      <span>·</span>
                      <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                      {quote.packageName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase ${
                        quote.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                </div>

                {/* Itemized breakdown */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between text-stone-700">
                    <span>Base Package Rate ({quote.adultsCount} Adults)</span>
                    <span className="font-mono font-medium">
                      ${(quote.baseRate * quote.adultsCount).toLocaleString()}
                    </span>
                  </div>
                  {quote.addons &&
                    quote.addons.map((add, i) => (
                      <div key={i} className="flex justify-between text-stone-600">
                        <span>+ {add.title}</span>
                        <span className="font-mono font-medium">+${add.price}</span>
                      </div>
                    ))}
                  {quote.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>- Special Early Booking Discount</span>
                      <span className="font-mono font-medium">
                        -${quote.discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-stone-900 text-sm">
                    <span>Total Inclusive Amount</span>
                    <span className="text-xl font-mono tabular-nums text-stone-900">
                      ${quote.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {quote.customerNotes && (
                  <div className="text-xs text-stone-500 italic">
                    Note from consultant: "{quote.customerNotes}"
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => window.print()}
                    className="py-2 px-3 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Quotation</span>
                  </button>

                  {quote.status !== 'accepted' && (
                    <button
                      onClick={() => handleAcceptQuote(quote.id)}
                      className="py-2 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Accept & Confirm Itinerary
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Confirmed Bookings */}
      {activeTab === 'bookings' && (
        <div className="mt-6 space-y-4">
          {myBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 space-y-3">
              <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-sm font-semibold text-stone-800">No confirmed bookings yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Once a quote is accepted or direct booking is finalized, your official travel voucher and reservation certificate will appear here.
              </p>
            </div>
          ) : (
            myBookings.map((b) => (
              <div
                key={b.id}
                className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span>Booking Voucher #{b.bookingReference}</span>
                      <span>·</span>
                      <span>Confirmed on {new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mt-0.5">{b.packageName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                      {b.bookingStatus.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                      {b.paymentStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 bg-stone-50 p-4 rounded-lg border border-stone-200">
                  <div>
                    <div className="text-stone-400 uppercase text-[10px] font-semibold">Travel Dates</div>
                    <div className="font-medium text-stone-900 mt-0.5">
                      {b.travelStartDate} → {b.travelEndDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase text-[10px] font-semibold">Guest Party</div>
                    <div className="font-medium text-stone-900 mt-0.5">
                      {b.adultsCount} Adults {b.childrenCount > 0 ? `· ${b.childrenCount} Children` : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase text-[10px] font-semibold">Total Amount / Deposit</div>
                    <div className="font-mono font-medium text-stone-900 mt-0.5">
                      ${b.totalAmount.toLocaleString()} (${b.amountPaid.toLocaleString()} Paid)
                    </div>
                  </div>
                </div>

                {b.specialRequests && (
                  <div className="text-xs text-stone-500">
                    <strong>Special Arrangements:</strong> {b.specialRequests}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>24/7 Global Concierge Pass Activated</span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="py-1.5 px-3 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Download Travel Voucher</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
