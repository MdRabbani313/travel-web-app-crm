import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Booking,
  DestinationInfo,
  Lead,
  LeadActivity,
  LeadStatus,
  PromotionalBanner,
  Quotation,
  QuoteStatus,
  SystemSettings,
  Testimonial,
  TourPackage,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_BANNERS,
  INITIAL_BOOKINGS,
  INITIAL_DESTINATIONS,
  INITIAL_LEADS,
  INITIAL_PACKAGES,
  INITIAL_QUOTATIONS,
  INITIAL_SETTINGS,
  INITIAL_TESTIMONIALS,
  INITIAL_USERS,
} from '../data/initialData';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface TravelStoreContextType {
  // Authentication & Role
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  switchRole: (role: UserRole, specificUserId?: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id'>) => void;

  // Tour Packages
  packages: TourPackage[];
  addPackage: (pkg: Omit<TourPackage, 'id'>) => void;
  updatePackage: (id: string, updates: Partial<TourPackage>) => void;
  deletePackage: (id: string) => void;

  // Destinations
  destinations: DestinationInfo[];

  // Sales CRM - Leads
  leads: Lead[];
  activities: LeadActivity[];
  addLead: (leadData: Partial<Lead>) => Lead;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  assignLead: (leadId: string, salesId: string) => void;
  addLeadActivity: (leadId: string, activity: Omit<LeadActivity, 'id' | 'timestamp' | 'leadId'>) => void;
  scheduleFollowUp: (leadId: string, dateStr: string) => void;

  // Quotations
  quotations: Quotation[];
  createQuotation: (quoteData: Omit<Quotation, 'id' | 'quoteNumber' | 'createdAt'>) => Quotation;
  updateQuotationStatus: (quoteId: string, status: QuoteStatus) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt'>) => Booking;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;

  // Content CMS
  banners: PromotionalBanner[];
  updateBanner: (id: string, updates: Partial<PromotionalBanner>) => void;
  addBanner: (banner: Omit<PromotionalBanner, 'id'>) => void;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  toggleTestimonialApproval: (id: string) => void;
  deleteTestimonial: (id: string) => void;

  // System Settings
  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportDatabaseSql: () => string;
}

const TravelStoreContext = createContext<TravelStoreContextType | null>(null);

const STORAGE_KEY = 'voyage_crm_data_v1';

export const TravelStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or defaults
  const [isInitialized, setIsInitialized] = useState(false);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem(`${STORAGE_KEY}_role`);
    const foundUser = users.find((u) => u.role === (savedRole || 'customer'));
    return foundUser || users[3]; // Elena by default
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser.role || 'customer';
  });

  const [packages, setPackages] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_packages`);
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [destinations] = useState<DestinationInfo[]>(INITIAL_DESTINATIONS);

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [activities, setActivities] = useState<LeadActivity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quotations`);
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [banners, setBanners] = useState<PromotionalBanner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_banners`);
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_testimonials`);
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_role`, currentRole);
    localStorage.setItem(`${STORAGE_KEY}_packages`, JSON.stringify(packages));
    localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
    localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    localStorage.setItem(`${STORAGE_KEY}_quotations`, JSON.stringify(quotations));
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
    localStorage.setItem(`${STORAGE_KEY}_banners`, JSON.stringify(banners));
    localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(testimonials));
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [users, currentRole, packages, leads, activities, quotations, bookings, banners, testimonials, settings, isInitialized]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch role seamlessly
  const switchRole = (role: UserRole, specificUserId?: string) => {
    setCurrentRole(role);
    if (specificUserId) {
      const match = users.find((u) => u.id === specificUserId);
      if (match) {
        setCurrentUser(match);
        addToast(`Switched view to ${match.name} (${role.toUpperCase()})`, 'info');
        return;
      }
    }
    const defaultForRole = users.find((u) => u.role === role) || users[0];
    setCurrentUser(defaultForRole);
    addToast(`Role switched to ${role.toUpperCase()} mode as ${defaultForRole.name}`, 'info');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
    addToast('User details updated', 'success');
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const id = `user-${Date.now()}`;
    const newUser: User = { id, ...userData };
    setUsers((prev) => [...prev, newUser]);
    addToast(`Added new team member: ${newUser.name}`, 'success');
  };

  // Packages CRUD
  const addPackage = (pkg: Omit<TourPackage, 'id'>) => {
    const id = `pkg-${Date.now()}`;
    const newPkg: TourPackage = { id, ...pkg };
    setPackages((prev) => [newPkg, ...prev]);
    addToast(`Tour package "${newPkg.title}" published!`, 'success');
  };

  const updatePackage = (id: string, updates: Partial<TourPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast('Tour package saved', 'success');
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addToast('Tour package removed', 'info');
  };

  // Leads CRM logic
  const addLead = (leadData: Partial<Lead>): Lead => {
    const nextNum = leads.length + 1;
    const leadCode = `LEAD-2026-${String(nextNum).padStart(3, '0')}`;
    
    // Assign to a sales executive
    const salesExecs = users.filter((u) => u.role === 'sales');
    const matched = leadData.assignedSalesId ? users.find((u) => u.id === leadData.assignedSalesId) : undefined;
    const assigned = matched || salesExecs[nextNum % (salesExecs.length || 1)] || users[0];

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      leadCode,
      customerName: leadData.customerName || 'Anonymous Traveler',
      customerEmail: leadData.customerEmail || '',
      customerPhone: leadData.customerPhone || '',
      packageId: leadData.packageId,
      packageName: leadData.packageName || (leadData.packageId ? packages.find((p) => p.id === leadData.packageId)?.title : undefined),
      assignedSalesId: assigned.id,
      assignedSalesName: assigned.name,
      status: 'new',
      source: leadData.source || 'website_enquiry',
      estimatedPax: leadData.estimatedPax || 2,
      travelDate: leadData.travelDate,
      estimatedBudget: leadData.estimatedBudget || 5000,
      specialNotes: leadData.specialNotes,
      leadScore: leadData.leadScore || 65,
      createdAt: new Date().toISOString(),
      nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    setLeads((prev) => [newLead, ...prev]);

    // Create activity record
    const initActivity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: newLead.id,
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
      type: 'note',
      title: 'Automatic Lead Captured in CRM',
      description: `New enquiry received via ${newLead.source.replace('_', ' ')} for ${newLead.packageName || 'Custom Itinerary'}. Assigned to ${newLead.assignedSalesName}.`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [initActivity, ...prev]);

    addToast(`New CRM Lead #${newLead.leadCode} captured from ${newLead.customerName}!`, 'success');
    return newLead;
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l)));
    addToast('Lead updated successfully', 'success');
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, status, lastContactedAt: new Date().toISOString() };
        }
        return l;
      })
    );

    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      const act: LeadActivity = {
        id: `act-${Date.now()}`,
        leadId,
        createdByUserId: currentUser.id,
        createdByName: currentUser.name,
        type: 'status_change',
        title: `Stage Updated: ${status.toUpperCase()}`,
        description: `Lead moved to ${status} stage by ${currentUser.name}.`,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [act, ...prev]);
      addToast(`Lead #${lead.leadCode} moved to ${status.toUpperCase()}`, 'info');
    }
  };

  const assignLead = (leadId: string, salesId: string) => {
    const targetSales = users.find((u) => u.id === salesId);
    if (!targetSales) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedSalesId: targetSales.id,
              assignedSalesName: targetSales.name,
            }
          : l
      )
    );

    const act: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId,
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
      type: 'note',
      title: 'Sales Representative Reassigned',
      description: `Reassigned to ${targetSales.name} (${targetSales.title || 'Sales Specialist'})`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [act, ...prev]);
    addToast(`Lead reassigned to ${targetSales.name}`, 'info');
  };

  const addLeadActivity = (leadId: string, activity: Omit<LeadActivity, 'id' | 'timestamp' | 'leadId'>) => {
    const newAct: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId,
      ...activity,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    // Also update lead's lastContactedAt if activity is call/email/meeting
    if (['call', 'email', 'meeting', 'whatsapp'].includes(activity.type)) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, lastContactedAt: new Date().toISOString() } : l))
      );
    }
    addToast(`Activity logged: ${activity.title}`, 'success');
  };

  const scheduleFollowUp = (leadId: string, dateStr: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, nextFollowUpAt: dateStr } : l))
    );
    const act: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId,
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
      type: 'note',
      title: 'Follow-up Scheduled',
      description: `Follow-up reminder set for ${new Date(dateStr).toLocaleString()}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [act, ...prev]);
    addToast(`Follow-up scheduled for ${new Date(dateStr).toLocaleDateString()}`, 'success');
  };

  // Quotations
  const createQuotation = (quoteData: Omit<Quotation, 'id' | 'quoteNumber' | 'createdAt'>): Quotation => {
    const quoteNumber = `QT-2026-${String(100 + quotations.length + 1)}`;
    const newQuote: Quotation = {
      id: `quote-${Date.now()}`,
      quoteNumber,
      ...quoteData,
      createdAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuote, ...prev]);

    // Move lead status to 'quoted'
    updateLeadStatus(quoteData.leadId, 'quoted');

    // Add activity
    const act: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: quoteData.leadId,
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
      type: 'quote_sent',
      title: `Bespoke Quotation #${quoteNumber} Issued`,
      description: `Generated proposal totaling $${newQuote.totalAmount.toLocaleString()} for ${newQuote.adultsCount} travelers. Valid until ${new Date(newQuote.validUntil).toLocaleDateString()}.`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [act, ...prev]);

    addToast(`Quotation #${quoteNumber} created and sent to customer!`, 'success');
    return newQuote;
  };

  const updateQuotationStatus = (quoteId: string, status: QuoteStatus) => {
    setQuotations((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status } : q)));
    addToast(`Quotation status updated to ${status}`, 'info');
  };

  // Bookings
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt'>): Booking => {
    const bookingReference = `VYG-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingReference,
      ...bookingData,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // If associated with a lead, mark lead as 'won'
    if (bookingData.leadId) {
      updateLeadStatus(bookingData.leadId, 'won');
    }

    addToast(`Booking #${bookingReference} confirmed! Voucher generated.`, 'success');
    return newBooking;
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b)));
    addToast('Booking status updated', 'success');
  };

  // CMS
  const updateBanner = (id: string, updates: Partial<PromotionalBanner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    addToast('Banner updated', 'success');
  };

  const addBanner = (banner: Omit<PromotionalBanner, 'id'>) => {
    setBanners((prev) => [{ id: `ban-${Date.now()}`, ...banner }, ...prev]);
    addToast('Promotional banner added', 'success');
  };

  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    setTestimonials((prev) => [{ id: `test-${Date.now()}`, ...testimonial }, ...prev]);
    addToast('Thank you for sharing your experience! Review submitted for curation.', 'success');
  };

  const toggleTestimonialApproval = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isApproved: !t.isApproved } : t))
    );
    addToast('Review visibility updated', 'info');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    addToast('Testimonial removed', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast('System settings updated', 'success');
  };

  // Reset to initial
  const resetToDefaults = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[3]);
    setCurrentRole('customer');
    setPackages(INITIAL_PACKAGES);
    setLeads(INITIAL_LEADS);
    setActivities(INITIAL_ACTIVITIES);
    setQuotations(INITIAL_QUOTATIONS);
    setBookings(INITIAL_BOOKINGS);
    setBanners(INITIAL_BANNERS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();
    addToast('Database reset to fresh demo seed state', 'info');
  };

  const exportDatabaseSql = (): string => {
    return `-- ==========================================================
-- VoyageCRM Live Snapshot SQL Export
-- Exported on: ${new Date().toISOString()}
-- ==========================================================

${leads
  .map(
    (l) =>
      `INSERT INTO leads (lead_code, customer_name, customer_email, status, estimated_budget) VALUES ('${l.leadCode}', '${l.customerName.replace("'", "''")}', '${l.customerEmail}', '${l.status}', ${l.estimatedBudget});`
  )
  .join('\n')}

${quotations
  .map(
    (q) =>
      `INSERT INTO quotations (quote_number, total_amount, status, valid_until) VALUES ('${q.quoteNumber}', ${q.totalAmount}, '${q.status}', '${q.validUntil}');`
  )
  .join('\n')}
`;
  };

  return (
    <TravelStoreContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        switchRole,
        updateUser,
        addUser,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        destinations,
        leads,
        activities,
        addLead,
        updateLead,
        updateLeadStatus,
        assignLead,
        addLeadActivity,
        scheduleFollowUp,
        quotations,
        createQuotation,
        updateQuotationStatus,
        bookings,
        createBooking,
        updateBooking,
        banners,
        updateBanner,
        addBanner,
        testimonials,
        addTestimonial,
        toggleTestimonialApproval,
        deleteTestimonial,
        settings,
        updateSettings,
        toasts,
        addToast,
        removeToast,
        resetToDefaults,
        exportDatabaseSql,
      }}
    >
      {children}
    </TravelStoreContext.Provider>
  );
};

export const useTravelStore = () => {
  const context = useContext(TravelStoreContext);
  if (!context) {
    throw new Error('useTravelStore must be used within a TravelStoreProvider');
  }
  return context;
};
