import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { RoleSwitcherModal } from '../common/RoleSwitcherModal';
import { ChevronDown, Shield, Briefcase, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnquiryModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, currentRole } = useTravelStore();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Brand title, single element */}
          <button
            onClick={() => setActiveTab('packages')}
            className="text-xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
          >
            VoyageCRM
          </button>

          {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('packages')}
              className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'packages' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : ''
              }`}
            >
              Tour Packages
            </button>
            <button
              onClick={() => setActiveTab('destinations')}
              className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'destinations' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : ''
              }`}
            >
              Destinations
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'about' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : ''
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'contact' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : ''
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'portal' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : ''
              }`}
            >
              My Inquiries
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Switch user account or role"
            >
              {currentRole === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              ) : currentRole === 'sales' ? (
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span className="hidden sm:inline font-semibold capitalize">{currentRole}:</span>
              <span className="truncate max-w-[110px]">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>
          </div>
        </div>

        {/* Workspace Toolbar / Mode Switcher bar directly below header */}
        <div className="bg-stone-100/90 border-t border-stone-200/80 px-6 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0 text-stone-500">
              <span className="font-semibold text-stone-700">App Views:</span>
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-stone-200/70 rounded-md shrink-0">
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                  ['packages', 'destinations', 'about', 'contact', 'portal'].includes(activeTab)
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                1. Customer Website
              </button>
              <button
                onClick={() => setActiveTab('sales_crm')}
                className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'sales_crm'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Briefcase className="w-3 h-3 text-blue-600" />
                2. Sales Panel (CRM)
              </button>
              <button
                onClick={() => setActiveTab('admin_panel')}
                className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'admin_panel'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Shield className="w-3 h-3 text-purple-600" />
                3. Admin Panel
              </button>
            </div>
          </div>
        </div>
      </header>

      <RoleSwitcherModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </>
  );
};
