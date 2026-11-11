import React from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { Mail, Phone, MapPin, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { settings } = useTravelStore();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-white font-display">VoyageCRM</span>
            <p className="text-sm text-stone-400 leading-relaxed">
              Curators of bespoke luxury and cultural expeditions. Integrated with our enterprise travel sales CRM for instantaneous quotes and personal concierge attention.
            </p>
            <div className="pt-2 text-xs text-stone-500">
              Licensed Tour Operator & Virtuoso Global Travel Partner
            </div>
          </div>

          {/* Curated Journeys */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Featured Journeys</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="hover:text-white transition-colors"
                >
                  Swiss Alps & Glacier Express
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="hover:text-white transition-colors"
                >
                  Bali Rainforest & Clifftop Haven
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="hover:text-white transition-colors"
                >
                  Amalfi Coast & Capri Yacht Charter
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="hover:text-white transition-colors"
                >
                  Kyoto Bamboo Trails & Ryokans
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Company & Portals</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  About Our Concierge Team
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-white transition-colors">
                  Contact & Global Offices
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portal')} className="hover:text-white transition-colors">
                  Customer Portal & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('sales_crm')} className="hover:text-white transition-colors">
                  Sales Panel (CRM Pipeline)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin_panel')} className="hover:text-white transition-colors">
                  Admin Management Console
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Concierge Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">24/7 Global Concierge</h4>
            <div className="space-y-2 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.companyPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.companyEmail}</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Geneva · London · Singapore · New York</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} VoyageCRM Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure SSL & RBAC Protected
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-400">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Certified Travel Agency
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
