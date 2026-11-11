import React from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { ShieldCheck, Award, Globe, Users, HeartHandshake, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { users } = useTravelStore();
  const salesTeam = users.filter((u) => u.role === 'sales' || u.role === 'admin');

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-16">
      {/* Hero statement */}
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
          About VoyageCRM
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-stone-900 leading-tight">
          Where Uncompromising Travel Meets Enterprise Precision.
        </h1>
        <p className="mt-4 text-stone-600 text-base leading-relaxed">
          Founded on the principle that luxury travel should never be standard, VoyageCRM pairs world-class local destination custodians with an intelligent sales platform. We ensure every quotation, itinerary tweak, and on-ground reservation is executed with clockwork reliability.
        </p>
      </div>

      {/* Metrics Row - adhering to §1.H Claim-to-Proof Adjacency */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white rounded-xl border border-stone-200">
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">48+</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Curated Expeditions</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">98.6%</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Guest Satisfaction Score</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">&lt; 4 hrs</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Average Quote Turnaround</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">100%</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">On-Ground Support (24/7)</div>
        </div>
      </div>

      {/* Three Core Pillars */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-stone-900">Our Triad of Excellence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <Compass className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-semibold text-stone-900">Bespoke Curation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every itinerary is authored by destination veterans who have lived the routes—from high-alpine private chalets in Zermatt to hidden sacred springs in Bali.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <ShieldCheck className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-semibold text-stone-900">Integrated CRM Intelligence</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our proprietary sales and quotation platform guarantees that no client preference is lost. Dietary needs, room orientations, and flight transfers are tracked end-to-end.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3">
            <HeartHandshake className="w-6 h-6 text-stone-900" />
            <h3 className="text-base font-semibold text-stone-900">Personal Executive Ownership</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              You are assigned a dedicated senior specialist from your first inquiry through to your return flight. No call centers, no automated phone trees.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-stone-900">The Operations & Sales Leadership</h2>
          <p className="text-xs text-stone-500 mt-1">
            Seasoned travel consultants ready to design your next journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {salesTeam.map((member) => (
            <div key={member.id} className="p-5 bg-white rounded-xl border border-stone-200 flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 rounded-full object-cover border border-stone-200 shrink-0"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div>
                <h4 className="text-sm font-semibold text-stone-900">{member.name}</h4>
                <div className="text-xs text-stone-500 mt-0.5">{member.title}</div>
                <div className="text-[11px] text-stone-400 font-mono mt-1">{member.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
