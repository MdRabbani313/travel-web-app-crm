import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { PackageManagerModal } from './PackageManagerModal';
import { PostgreSqlViewer } from './PostgreSqlViewer';
import { TourPackage, User } from '../../types';
import {
  Shield,
  Layers,
  FileText,
  Users,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  TrendingUp,
  Tag,
  DollarSign,
  BarChart3,
  Award,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    packages,
    deletePackage,
    leads,
    bookings,
    users,
    addUser,
    updateUser,
    banners,
    updateBanner,
    testimonials,
    toggleTestimonialApproval,
    deleteTestimonial,
    settings,
    updateSettings,
    addToast,
  } = useTravelStore();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'reports' | 'packages' | 'cms' | 'users' | 'database' | 'settings'
  >('reports');

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPkgToEdit, setSelectedPkgToEdit] = useState<TourPackage | null>(null);

  // New Team Member Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'sales' | 'admin'>('sales');
  const [newUserTitle, setNewUserTitle] = useState('Travel Specialist');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // System Settings Form
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [companyEmail, setCompanyEmail] = useState(settings.companyEmail);
  const [companyPhone, setCompanyPhone] = useState(settings.companyPhone);
  const [taxRate, setTaxRate] = useState(settings.taxRate);

  // Total Business Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'won').length;
  const globalConversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  // Lead Source Breakdown
  const sourceStats = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  // Sales Executive Performance Leaderboard
  const salesUsers = users.filter((u) => u.role === 'sales');
  const repPerformance = salesUsers.map((rep) => {
    const assignedLeads = leads.filter((l) => l.assignedSalesId === rep.id);
    const wonCount = assignedLeads.filter((l) => l.status === 'won').length;
    const repRevenue = assignedLeads
      .filter((l) => l.status === 'won')
      .reduce((sum, l) => sum + l.estimatedBudget, 0);
    const repConversion = assignedLeads.length > 0 ? Math.round((wonCount / assignedLeads.length) * 100) : 0;
    return {
      rep,
      totalLeads: assignedLeads.length,
      wonCount,
      repRevenue,
      repConversion,
    };
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      title: newUserTitle,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    });
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      companyEmail,
      companyPhone,
      taxRate: Number(taxRate),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-purple-700 font-semibold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Master Administration Console</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-stone-900 mt-0.5">
            Executive Control & Operations
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedPkgToEdit(null);
              setPackageModalOpen(true);
            }}
            className="py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Tour Package</span>
          </button>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Total Bookings Revenue</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">{bookings.length} confirmed bookings</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Global Conversion Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            {globalConversionRate}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">{wonLeads} won out of {totalLeads} leads</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Active Tour Packages</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            {packages.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Live in customer catalog</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Sales Representatives</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            {salesUsers.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Active workload capacity</div>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="border-b border-stone-200 flex items-center gap-3 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`pb-3 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeAdminTab === 'reports'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Sales Reports</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('packages')}
          className={`pb-3 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeAdminTab === 'packages'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tour Packages & Itineraries ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('cms')}
          className={`pb-3 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeAdminTab === 'cms'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>CMS (Banners & Testimonials)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeAdminTab === 'users'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & RBAC ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('database')}
          className={`pb-3 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeAdminTab === 'database'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL Schema Hub</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`pb-3 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeAdminTab === 'settings'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </button>
      </div>

      {/* TAB 1: Reports & Performance */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-6">
          {/* Executive Performance Leaderboard */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-stone-900">
                  Sales Team Performance & Conversion Leaderboard
                </h3>
                <p className="text-xs text-stone-500">
                  Individual executive pipeline metrics, won volume, and close efficiency
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Sales Specialist</th>
                    <th className="px-5 py-3 text-center">Assigned Leads</th>
                    <th className="px-5 py-3 text-center">Won Bookings</th>
                    <th className="px-5 py-3 text-center">Conversion %</th>
                    <th className="px-5 py-3 text-right">Generated Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {repPerformance.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-stone-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.rep.avatar}
                            alt={item.rep.name}
                            className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <div className="font-semibold">{item.rep.name}</div>
                            <div className="text-[11px] text-stone-400">{item.rep.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-medium">
                        {item.totalLeads}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-emerald-800">
                        {item.wonCount}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-stone-900">
                        {item.repConversion}%
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                        ${item.repRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Source Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-stone-900">
                Inbound Lead Capture by Channel
              </h3>
              <div className="space-y-3">
                {Object.entries(sourceStats).map(([src, count]) => {
                  const pct = Math.round((count / totalLeads) * 100);
                  return (
                    <div key={src} className="space-y-1 text-xs">
                      <div className="flex justify-between text-stone-700">
                        <span className="capitalize font-medium">{src.replace('_', ' ')}</span>
                        <span className="font-mono text-stone-500">
                          {count} leads ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-900 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales Pipeline Conversion Funnel */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-stone-900">
                CRM Pipeline Funnel Stage Progression
              </h3>
              <div className="space-y-2 text-xs">
                {['new', 'contacted', 'quoted', 'won'].map((stg, i) => {
                  const count = leads.filter((l) => l.status === stg).length;
                  const pct = Math.round((count / totalLeads) * 100);
                  return (
                    <div
                      key={stg}
                      className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between"
                    >
                      <div className="font-semibold capitalize text-stone-800">
                        Stage {i + 1}: {stg}
                      </div>
                      <div className="font-mono font-bold text-stone-900">
                        {count} Leads <span className="text-stone-400 font-normal">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Tour Packages & Itineraries Management */}
      {activeAdminTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900">
              Active Tour Packages Directory
            </h3>
            <button
              onClick={() => {
                setSelectedPkgToEdit(null);
                setPackageModalOpen(true);
              }}
              className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Tour Package</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Tour Package</th>
                    <th className="px-5 py-3">Destination</th>
                    <th className="px-5 py-3">Duration</th>
                    <th className="px-5 py-3">Itinerary Days</th>
                    <th className="px-5 py-3 text-right">Price / Pax</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.heroImage}
                            alt={pkg.title}
                            className="w-12 h-9 rounded object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-stone-900">{pkg.title}</div>
                            <div className="text-[11px] text-stone-400 capitalize">{pkg.travelStyle} Tour</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-stone-800">
                        {pkg.destination}, {pkg.country}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600">
                        {pkg.durationDays}D / {pkg.durationNights}N
                      </td>
                      <td className="px-5 py-3.5 font-mono font-medium text-stone-700">
                        {pkg.itinerary.length} Days Built
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                        ${(pkg.discountedPriceUSD || pkg.basePriceUSD).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPkgToEdit(pkg);
                            setPackageModalOpen(true);
                          }}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="Edit package & itinerary"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePackage(pkg.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                          title="Delete package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CMS (Banners & Testimonials) */}
      {activeAdminTab === 'cms' && (
        <div className="space-y-8">
          {/* Promotional Banner Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">
              Promotional Announcement Banners
            </h3>
            <div className="space-y-3">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{banner.headline}</span>
                      {banner.couponCode && (
                        <span className="font-mono bg-stone-100 px-2 py-0.5 rounded font-bold">
                          {banner.couponCode}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500">{banner.subtext}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                      className={`py-1 px-3 rounded-lg font-medium transition-colors ${
                        banner.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {banner.isActive ? 'Active on Website' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Moderation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">
              Customer Testimonials & Verified Reviews
            </h3>
            <div className="space-y-3">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{test.guestName}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{test.location}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-amber-500">★ {test.rating}/5</span>
                    </div>
                    <div className="text-stone-500 font-medium">{test.packageName}</div>
                    <p className="text-stone-700 italic">"{test.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleTestimonialApproval(test.id)}
                      className={`py-1 px-3 rounded-lg font-medium transition-colors ${
                        test.isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {test.isApproved ? 'Approved (Visible)' : 'Pending Approval'}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(test.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Users & RBAC */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900">
              Users & Role-Based Access Control (RBAC)
            </h3>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Team Member</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Member Name</th>
                    <th className="px-5 py-3">Email Address</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Title / Scope</th>
                    <th className="px-5 py-3 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-stone-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span className="font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-stone-600">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : u.role === 'sales'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-600">{u.title || 'General Account'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => updateUser(u.id, { role: e.target.value as any })}
                          className="p-1 bg-stone-50 border border-stone-300 rounded text-stone-800 text-[11px] font-medium"
                        >
                          <option value="customer">Customer</option>
                          <option value="sales">Sales Executive</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add User Modal */}
          {isAddUserOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
              <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900 text-sm">Add Team Member / Specialist</h3>
                  <button onClick={() => setIsAddUserOpen(false)} className="text-stone-400">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                      >
                        <option value="sales">Sales Executive</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newUserTitle}
                        onChange={(e) => setNewUserTitle(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="py-1.5 px-3 bg-stone-100 text-stone-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-1.5 px-4 bg-stone-900 text-white rounded-lg font-semibold"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PostgreSQL Database Viewer */}
      {activeAdminTab === 'database' && <PostgreSqlViewer />}

      {/* TAB 6: System Settings */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs max-w-2xl space-y-5">
          <div>
            <h3 className="font-semibold text-sm text-stone-900">Global System Settings</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure company contact identity, default currency, and quote tax rates
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Company Email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hotline Phone</label>
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Default Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* Package Creator / Editor Modal */}
      <PackageManagerModal
        packageToEdit={selectedPkgToEdit}
        isOpen={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
      />
    </div>
  );
};
