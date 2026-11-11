import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addLead, settings, addToast } = useTravelStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('Swiss Alps & Zermatt');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lead = addLead({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      packageName: `Custom Travel Enquiry: ${destination}`,
      source: 'website_enquiry',
      estimatedPax: 2,
      estimatedBudget: 6000,
      specialNotes: message,
      leadScore: 70,
    });

    setIsSubmitting(false);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    addToast(`Thank you! Lead #${lead.leadCode} received. An assigned specialist will call or email you promptly.`, 'success');
  };

  const faqs = [
    {
      q: 'How quickly will I receive a customized itinerary quotation?',
      a: 'Our sales specialists typically prepare and send a bespoke, itemized quotation within 4 business hours. If your request is urgent, please include your departure date in the notes.',
    },
    {
      q: 'Can itineraries be customized with extra days or private guides?',
      a: 'Absolutely. Every day of our itineraries can be adjusted. You can request room upgrades, private helicopter transfers, custom dining arrangements, and extra nights.',
    },
    {
      q: 'How does payment and booking protection work?',
      a: 'We require a 30% deposit to lock in your reservation and hotel allocations. The remaining balance is due 45 days prior to departure. All payments are protected with top-tier travel bond certification.',
    },
    {
      q: 'Do you assist with flights and entry visas?',
      a: 'Yes. Our concierge team assists with international flight routing, airport fast-track clearance, and provides visa advisory documents for all destinations.',
    },
  ];

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-16">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
          Contact Our Concierge
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-stone-900 leading-tight">
          Let’s Plan Your Next Unforgettable Odyssey.
        </h1>
        <p className="mt-4 text-stone-600 text-base leading-relaxed">
          Whether you have a specific departure in mind or require a completely custom route designed from scratch, our specialist team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column - 7 cols */}
        <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-stone-200 shadow-xs">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Send an Enquiry to Sales CRM</h2>
          <p className="text-xs text-stone-500 mb-6">
            Directly enters our sales pipeline for immediate review by an assigned travel consultant.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alexandra Wright"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alexandra@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Destination of Interest</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
                >
                  <option value="Swiss Alps & Zermatt">Swiss Alps & Zermatt (Switzerland)</option>
                  <option value="Bali & Ubud Rainforest">Bali Rainforest & Clifftop (Indonesia)</option>
                  <option value="Amalfi Coast & Capri">Amalfi Coast & Capri Yacht (Italy)</option>
                  <option value="Kyoto & Historic Ryokans">Kyoto Bamboo & Ryokans (Japan)</option>
                  <option value="Custom Worldwide Request">Other / Bespoke Multi-Country</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Tell Us About Your Vision & Timeline
              </label>
              <textarea
                rows={4}
                required
                placeholder="Number of travelers, approximate travel month, celebrations (anniversary, honeymoon), desired pace or hotel preferences..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Direct Enquiry</span>
            </button>
          </form>
        </div>

        {/* Global Offices - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 text-white p-6 rounded-xl space-y-4">
            <h3 className="text-base font-semibold">24/7 Global Concierge</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              For urgent traveler assistance or immediate departure requests, our operations desk is manned around the clock.
            </p>
            <div className="pt-2 border-t border-stone-800 space-y-2 text-xs text-stone-200">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.companyPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.companyEmail}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider text-xs">
              Representative Offices
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-stone-600">
              <div>
                <div className="font-semibold text-stone-800">Geneva (HQ)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Rue du Rhône 42, 1204 Geneva</div>
              </div>
              <div>
                <div className="font-semibold text-stone-800">London</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Mayfair, Berkeley Square W1J</div>
              </div>
              <div>
                <div className="font-semibold text-stone-800">New York</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Fifth Avenue, NY 10022</div>
              </div>
              <div>
                <div className="font-semibold text-stone-800">Singapore</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Marina Bay Financial Centre</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 pt-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-stone-900">Frequently Asked Questions</h2>
          <p className="text-xs text-stone-500 mt-1">
            Common questions regarding bookings, quotations, and private custom itineraries.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-sm text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-100 mt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
