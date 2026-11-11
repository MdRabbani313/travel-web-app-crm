import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { LeadPipelineBoard } from './LeadPipelineBoard';
import { LeadDetailModal } from './LeadDetailModal';
import { QuotationBuilderModal } from './QuotationBuilderModal';
import { CustomerDirectory } from './CustomerDirectory';
import { Lead, TourPackage } from '../../types';
import {
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Filter,
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Table,
} from 'lucide-react';

export const SalesDashboard: React.FC = () => {
  const { leads, quotations, bookings, users, currentUser, addLead, packages, addToast } =
    useTravelStore();

  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'table' | 'quotes' | 'customers'>(
    'pipeline'
  );
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string>('all');
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<Lead | null>(null);
  const [isManualLeadModalOpen, setIsManualLeadModalOpen] = useState(false);

  // Manual Lead Form State
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualBudget, setManualBudget] = useState(6500);
  const [manualPax, setManualPax] = useState(2);
  const [manualPkgId, setManualPkgId] = useState(packages[0]?.id || '');
  const [manualNotes, setManualNotes] = useState('');

  const salesExecutives = users.filter((u) => u.role === 'sales');

  // Filter leads by executive
  const currentLeads = selectedExecutiveId === 'all'
    ? leads
    : leads.filter((l) => l.assignedSalesId === selectedExecutiveId);

  // KPIs
  const totalLeadsCount = currentLeads.length;
  const activePipelineLeads = currentLeads.filter((l) => ['new', 'contacted', 'quoted'].includes(l.status));
  const wonLeads = currentLeads.filter((l) => l.status === 'won');
  const conversionRate = totalLeadsCount > 0 ? Math.round((wonLeads.length / totalLeadsCount) * 100) : 0;
  const pipelineValue = activePipelineLeads.reduce((sum, l) => sum + (l.estimatedBudget || 0), 0);
  const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.estimatedBudget || 0), 0);

  // Upcoming follow-up reminders
  const pendingFollowups = currentLeads.filter(
    (l) => l.nextFollowUpAt && ['new', 'contacted', 'quoted'].includes(l.status)
  );

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find((p) => p.id === manualPkgId);
    const newLead = addLead({
      customerName: manualName,
      customerEmail: manualEmail,
      customerPhone: manualPhone,
      packageId: manualPkgId,
      packageName: pkg?.title,
      source: 'direct_call',
      estimatedBudget: manualBudget,
      estimatedPax: manualPax,
      specialNotes: manualNotes,
      assignedSalesId: currentUser.role === 'sales' ? currentUser.id : undefined,
    });

    setIsManualLeadModalOpen(false);
    setManualName('');
    setManualEmail('');
    setManualPhone('');
    setManualNotes('');
    addToast(`Manual Lead #${newLead.leadCode} created and assigned!`, 'success');
  };

  const handleInitiateLeadFromDirectory = (name: string, email: string) => {
    setManualName(name);
    setManualEmail(email);
    setIsManualLeadModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Top Bar with Title, Rep Selector & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Sales Operations & Pipeline Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-stone-900 mt-0.5">
            Travel Sales CRM Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Executive Filter */}
          <div className="flex items-center gap-2 text-xs bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium">Rep:</span>
            <select
              value={selectedExecutiveId}
              onChange={(e) => setSelectedExecutiveId(e.target.value)}
              className="bg-transparent font-semibold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Sales Executives</option>
              {salesExecutives.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Lead Button */}
          <button
            onClick={() => setIsManualLeadModalOpen(true)}
            className="py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Manual Lead Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Active Pipeline Leads</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            {activePipelineLeads.length}{' '}
            <span className="text-xs font-normal text-stone-400">/ {totalLeadsCount} total</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Inquiries in active negotiation</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Pipeline Deal Value</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            ${pipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Weighted conversion forecast
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Won Closed Revenue</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            ${wonRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {wonLeads.length} successful bookings
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500">Lead Conversion Rate</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Industry benchmark: ~22%
          </div>
        </div>
      </div>

      {/* Follow-up Reminder Banner if there are pending reminders */}
      {pendingFollowups.length > 0 && (
        <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingFollowups.length} scheduled follow-ups pending:</strong>{' '}
              {pendingFollowups.map((l) => `${l.customerName} (${l.leadCode})`).slice(0, 3).join(', ')}
              {pendingFollowups.length > 3 ? '...' : ''}
            </span>
          </div>
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className="font-semibold text-amber-900 hover:underline shrink-0"
          >
            Review Reminders →
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-stone-200 flex items-center gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`pb-3 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'pipeline'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Stage Pipeline Board</span>
        </button>

        <button
          onClick={() => setActiveSubTab('table')}
          className={`pb-3 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'table'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Leads Data Grid ({currentLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quotes')}
          className={`pb-3 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'quotes'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations Archive ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('customers')}
          className={`pb-3 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'customers'
              ? 'border-b-2 border-stone-900 text-stone-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Records</span>
        </button>
      </div>

      {/* VIEW 1: Pipeline Kanban Board */}
      {activeSubTab === 'pipeline' && (
        <LeadPipelineBoard
          onSelectLead={(lead) => setSelectedLeadForDetail(lead)}
          onCreateQuoteForLead={(lead) => setSelectedLeadForQuote(lead)}
          selectedExecutiveId={selectedExecutiveId}
        />
      )}

      {/* VIEW 2: Leads Table View */}
      {activeSubTab === 'table' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Lead Code</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Tour Package</th>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3">Assigned To</th>
                  <th className="px-5 py-3 text-right">Budget</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {currentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-stone-600">
                      {lead.leadCode}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-stone-900">{lead.customerName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{lead.customerEmail}</div>
                    </td>
                    <td className="px-5 py-3 text-stone-800">
                      {lead.packageName || 'Custom Itinerary'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium capitalize text-stone-800 px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-stone-800">
                      {lead.assignedSalesName}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-stone-900 tabular-nums">
                      ${lead.estimatedBudget.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className="py-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setSelectedLeadForQuote(lead)}
                        className="py-1 px-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium transition-colors"
                      >
                        Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Quotations Archive */}
      {activeSubTab === 'quotes' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Quote #</th>
                  <th className="px-5 py-3">Tour Package</th>
                  <th className="px-5 py-3">Prepared By</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Validity</th>
                  <th className="px-5 py-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {q.quoteNumber}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-stone-900">
                      {q.packageName} ({q.adultsCount} Adults)
                    </td>
                    <td className="px-5 py-3.5 text-stone-600">{q.preparedByName}</td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-800">
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-stone-500">{q.validUntil}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                      ${q.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: Customer Directory */}
      {activeSubTab === 'customers' && (
        <CustomerDirectory onInitiateLeadForCustomer={handleInitiateLeadFromDirectory} />
      )}

      {/* Manual Lead Entry Modal */}
      {isManualLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900">Manual Lead Entry (Sales CRM)</h2>
              <button
                onClick={() => setIsManualLeadModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jonathan Vance"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jonathan@example.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tour Package Interest</label>
                <select
                  value={manualPkgId}
                  onChange={(e) => setManualPkgId(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estimated Budget ($)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={manualBudget}
                    onChange={(e) => setManualBudget(parseInt(e.target.value) || 5000)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Travelers (Pax)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={manualPax}
                    onChange={(e) => setManualPax(parseInt(e.target.value) || 2)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes / Call Summary</label>
                <textarea
                  rows={2}
                  placeholder="Inquiry received via direct phone consultation..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualLeadModalOpen(false)}
                  className="py-2 px-3 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail Inspection Modal */}
      <LeadDetailModal
        lead={selectedLeadForDetail}
        isOpen={!!selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onCreateQuote={(lead) => setSelectedLeadForQuote(lead)}
      />

      {/* Quotation Builder Modal */}
      <QuotationBuilderModal
        lead={selectedLeadForQuote}
        isOpen={!!selectedLeadForQuote}
        onClose={() => setSelectedLeadForQuote(null)}
      />
    </div>
  );
};
