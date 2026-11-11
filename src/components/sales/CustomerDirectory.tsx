import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { User, Lead, Booking } from '../../types';
import { Search, Mail, Phone, Calendar, Plus, DollarSign, UserCheck } from 'lucide-react';

interface CustomerDirectoryProps {
  onInitiateLeadForCustomer: (customerName: string, customerEmail: string) => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
  onInitiateLeadForCustomer,
}) => {
  const { leads, bookings, users } = useTravelStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique customers from leads and bookings
  const customerMap = new Map<
    string,
    {
      name: string;
      email: string;
      phone?: string;
      totalLeads: number;
      totalBookings: number;
      totalSpend: number;
      lastActive: string;
    }
  >();

  leads.forEach((l) => {
    const key = l.customerEmail.toLowerCase().trim();
    const existing = customerMap.get(key) || {
      name: l.customerName,
      email: l.customerEmail,
      phone: l.customerPhone,
      totalLeads: 0,
      totalBookings: 0,
      totalSpend: 0,
      lastActive: l.createdAt,
    };
    existing.totalLeads += 1;
    if (l.status === 'won') {
      existing.totalSpend += l.estimatedBudget;
    }
    customerMap.set(key, existing);
  });

  bookings.forEach((b) => {
    const key = b.customerEmail.toLowerCase().trim();
    const existing = customerMap.get(key) || {
      name: b.customerName,
      email: b.customerEmail,
      phone: b.customerPhone,
      totalLeads: 0,
      totalBookings: 0,
      totalSpend: 0,
      lastActive: b.createdAt,
    };
    existing.totalBookings += 1;
    existing.totalSpend += b.totalAmount;
    customerMap.set(key, existing);
  });

  const customersList = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
          />
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Total Registered Customers: <span className="font-mono text-stone-900">{customersList.length}</span>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-5 py-3">Contact Email & Phone</th>
                <th className="px-5 py-3 text-center">Inquiries</th>
                <th className="px-5 py-3 text-center">Confirmed Trips</th>
                <th className="px-5 py-3 text-right">Lifetime Value</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {customersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-stone-400 italic">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                customersList.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-stone-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                          {cust.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{cust.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-stone-800">{cust.email}</div>
                      {cust.phone && <div className="text-[11px] text-stone-400">{cust.phone}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-medium">
                      {cust.totalLeads}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-medium">
                      {cust.totalBookings}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                      ${cust.totalSpend.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onInitiateLeadForCustomer(cust.name, cust.email)}
                        className="py-1 px-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Lead</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
