import React, { useState } from 'react';
import { Lead, ActivityType } from '../../types';
import { useTravelStore } from '../../context/TravelStoreContext';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  Send,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  FileText,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateQuote: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onCreateQuote,
}) => {
  const {
    users,
    activities,
    updateLead,
    updateLeadStatus,
    assignLead,
    addLeadActivity,
    scheduleFollowUp,
    currentUser,
  } = useTravelStore();

  const [newNote, setNewNote] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('call');
  const [followUpDate, setFollowUpDate] = useState('');

  if (!isOpen || !lead) return null;

  const salesUsers = users.filter((u) => u.role === 'sales');
  const leadActivities = activities.filter((a) => a.leadId === lead.id);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addLeadActivity(lead.id, {
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
      type: activityType,
      title: `${activityType.toUpperCase()} Logged`,
      description: newNote,
    });
    setNewNote('');
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;
    scheduleFollowUp(lead.id, followUpDate);
    setFollowUpDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-4xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4 bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
              {lead.leadCode}
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900">{lead.customerName}</h2>
              <div className="text-xs text-stone-500">{lead.packageName || 'Custom Itinerary'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onCreateQuote(lead);
              }}
              className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create Quote</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Lead Settings Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            {/* Status Change */}
            <div>
              <label className="block text-stone-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Pipeline Stage
              </label>
              <select
                value={lead.status}
                onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                className="w-full p-2 bg-white border border-stone-300 rounded-md font-medium text-stone-800 focus:outline-hidden"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="won">Won (Confirmed)</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* Sales Rep Assignment */}
            <div>
              <label className="block text-stone-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Assigned Specialist
              </label>
              <select
                value={lead.assignedSalesId}
                onChange={(e) => assignLead(lead.id, e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded-md font-medium text-stone-800 focus:outline-hidden"
              >
                {salesUsers.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lead Score & Source */}
            <div>
              <label className="block text-stone-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Lead Source & Score
              </label>
              <div className="p-2 bg-white border border-stone-200 rounded-md font-medium text-stone-800 flex items-center justify-between">
                <span className="capitalize">{lead.source.replace('_', ' ')}</span>
                <span className="font-mono text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                  Score: {lead.leadScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Travel Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 border border-stone-200 rounded-lg text-xs">
              <h3 className="font-semibold text-stone-900 text-sm">Customer Profile</h3>
              <div className="space-y-2 text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                  <a href={`mailto:${lead.customerEmail}`} className="hover:underline text-stone-900">
                    {lead.customerEmail}
                  </a>
                </div>
                {lead.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{lead.customerPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Captured on {new Date(lead.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 border border-stone-200 rounded-lg text-xs">
              <h3 className="font-semibold text-stone-900 text-sm">Trip Specifications</h3>
              <div className="space-y-2 text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Departure Target:</span>
                  <span className="font-medium text-stone-900">{lead.travelDate || 'Flexible'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Party Size:</span>
                  <span className="font-medium text-stone-900">{lead.estimatedPax} Travelers</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Estimated Budget:</span>
                  <span className="font-mono font-bold text-stone-900">
                    ${lead.estimatedBudget.toLocaleString()}
                  </span>
                </div>
                {lead.specialNotes && (
                  <div className="pt-2 border-t border-stone-100 text-stone-700 italic">
                    "{lead.specialNotes}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Follow-up Reminder Scheduler */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Next Scheduled Follow-up</span>
              </div>
              {lead.nextFollowUpAt && (
                <span className="text-xs font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  Scheduled for: {new Date(lead.nextFollowUpAt).toLocaleString()}
                </span>
              )}
            </div>

            <form onSubmit={handleScheduleFollowUp} className="flex items-center gap-2 text-xs">
              <input
                type="datetime-local"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="p-2 bg-white border border-amber-300 rounded-lg text-stone-900 focus:outline-hidden"
              />
              <button
                type="submit"
                className="py-2 px-3 bg-amber-900 hover:bg-amber-800 text-white rounded-lg font-medium transition-colors"
              >
                Set Follow-up
              </button>
            </form>
          </div>

          {/* Activity Log & History */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">
              Activity History & Sales Notes
            </h3>

            {/* Quick Activity Logger Form */}
            <form onSubmit={handleAddActivity} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs text-stone-800"
                >
                  <option value="call">📞 Phone Call</option>
                  <option value="email">✉️ Email</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="meeting">🤝 Consultation Meeting</option>
                  <option value="note">📝 Internal Note</option>
                </select>
                <input
                  type="text"
                  placeholder="Record summary of client interaction..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium shrink-0"
                >
                  Log
                </button>
              </div>
            </form>

            {/* Timeline */}
            <div className="space-y-2.5">
              {leadActivities.length === 0 ? (
                <div className="text-xs text-stone-400 italic">No notes logged yet.</div>
              ) : (
                leadActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-white rounded-lg border border-stone-200 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-medium text-stone-800">
                        <span>{act.title}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-[11px] text-stone-500 font-normal">
                          by {act.createdByName}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-1">{act.description}</p>
                    </div>
                    <span className="font-mono text-[10px] text-stone-400 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
