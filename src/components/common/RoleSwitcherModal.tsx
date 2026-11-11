import React from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { UserRole } from '../../types';
import { Shield, Briefcase, User as UserIcon, RefreshCw, X, Check } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentRole, users, switchRole, resetToDefaults } = useTravelStore();

  if (!isOpen) return null;

  const handleSelectUser = (role: UserRole, userId: string) => {
    switchRole(role, userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Switch User Account & Role</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Simulate role-based access for Customer, Sales CRM, and Admin Panel
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
              Select Demo User Account
            </label>
            <div className="space-y-2">
              {users.map((user) => {
                const isSelected = currentUser.id === user.id && currentRole === user.role;
                const roleBadge =
                  user.role === 'admin'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : user.role === 'sales'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.role, user.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                        onError={(e) => {
                          // Fallback
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-stone-900">{user.name}</span>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${roleBadge}`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500">{user.title || user.email}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => {
                resetToDefaults();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors py-1 px-2 rounded"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Seed Data
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
