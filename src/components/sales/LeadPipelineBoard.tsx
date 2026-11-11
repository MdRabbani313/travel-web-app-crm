import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { useTravelStore } from '../../context/TravelStoreContext';
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  PhoneCall,
  FileText,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface LeadPipelineBoardProps {
  onSelectLead: (lead: Lead) => void;
  onCreateQuoteForLead: (lead: Lead) => void;
  selectedExecutiveId: string;
}

export const LeadPipelineBoard: React.FC<LeadPipelineBoardProps> = ({
  onSelectLead,
  onCreateQuoteForLead,
  selectedExecutiveId,
}) => {
  const { leads, updateLeadStatus } = useTravelStore();

  const stages: { key: LeadStatus; label: string; color: string }[] = [
    { key: 'new', label: 'New Inquiries', color: 'border-t-sky-500' },
    { key: 'contacted', label: 'Contacted', color: 'border-t-blue-500' },
    { key: 'quoted', label: 'Quotation Sent', color: 'border-t-amber-500' },
    { key: 'won', label: 'Won / Confirmed', color: 'border-t-emerald-500' },
    { key: 'lost', label: 'Closed / Lost', color: 'border-t-stone-400' },
  ];

  // Filter by sales executive if selected
  const filteredLeads = selectedExecutiveId === 'all'
    ? leads
    : leads.filter((l) => l.assignedSalesId === selectedExecutiveId);

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    switch (current) {
      case 'new':
        return 'contacted';
      case 'contacted':
        return 'quoted';
      case 'quoted':
        return 'won';
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
        const stageTotalValue = stageLeads.reduce((sum, l) => sum + (l.estimatedBudget || 0), 0);

        return (
          <div
            key={stage.key}
            className={`bg-stone-100/70 rounded-xl border border-stone-200 border-t-4 ${stage.color} p-3 flex flex-col min-w-[240px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-3">
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  {stage.label}
                </h3>
                <div className="text-[11px] font-mono text-stone-500">
                  ${stageTotalValue.toLocaleString()}
                </div>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white border border-stone-200 font-semibold text-stone-700">
                {stageLeads.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh]">
              {stageLeads.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400 italic">
                  No leads in this stage
                </div>
              ) : (
                stageLeads.map((lead) => {
                  const nextStage = getNextStage(lead.status);

                  return (
                    <div
                      key={lead.id}
                      className="p-3.5 bg-white rounded-lg border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2 text-xs group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] text-stone-500 font-semibold">
                          {lead.leadCode}
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          ${lead.estimatedBudget.toLocaleString()}
                        </span>
                      </div>

                      <div
                        onClick={() => onSelectLead(lead)}
                        className="font-semibold text-sm text-stone-900 hover:text-stone-700 cursor-pointer line-clamp-1"
                      >
                        {lead.customerName}
                      </div>

                      <div className="text-stone-500 line-clamp-1">
                        {lead.packageName || 'Custom Itinerary'}
                      </div>

                      {/* Travel Date & Pax */}
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                        <span>{lead.travelDate || 'Flexible Date'}</span>
                        <span>{lead.estimatedPax} Guests</span>
                      </div>

                      {/* Follow-up / rep info */}
                      <div className="flex items-center justify-between text-[11px] pt-1 text-stone-400">
                        <span className="truncate max-w-[120px] text-stone-600 font-medium">
                          {lead.assignedSalesName.split(' ')[0]}
                        </span>
                        {lead.nextFollowUpAt && (
                          <span className="flex items-center gap-1 text-amber-700 font-mono text-[10px]">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(lead.nextFollowUpAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}</span>
                          </span>
                        )}
                      </div>

                      {/* Card Action strip */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="py-1 px-2 text-[11px] text-stone-600 hover:text-stone-900 font-medium rounded hover:bg-stone-50"
                        >
                          Details
                        </button>

                        <div className="flex items-center gap-1">
                          {lead.status !== 'quoted' && lead.status !== 'won' && (
                            <button
                              onClick={() => onCreateQuoteForLead(lead)}
                              title="Generate Quote"
                              className="p-1 text-amber-700 hover:bg-amber-50 rounded"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {nextStage && (
                            <button
                              onClick={() => updateLeadStatus(lead.id, nextStage)}
                              className="py-1 px-2 text-[11px] bg-stone-900 hover:bg-stone-800 text-white rounded font-medium flex items-center gap-1 transition-colors"
                            >
                              <span>{nextStage}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
