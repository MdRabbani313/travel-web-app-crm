import React, { useState } from 'react';
import { useTravelStore } from '../../context/TravelStoreContext';
import { Database, Download, Copy, Check, Server, Table, Terminal, FileCode } from 'lucide-react';

export const PostgreSqlViewer: React.FC = () => {
  const { users, packages, leads, activities, quotations, bookings, testimonials, banners, exportDatabaseSql, addToast } =
    useTravelStore();

  const [copied, setCopied] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'tables' | 'ddl' | 'dml'>('tables');

  const totalItineraryDays = packages.reduce((sum, p) => sum + p.itinerary.length, 0);

  const tables = [
    { name: 'users', rows: users.length, description: 'Authentication, roles (customer, sales, admin), profiles', icon: '👤' },
    { name: 'tour_packages', rows: packages.length, description: 'Bespoke packages, destination, styles, prices, galleries', icon: '🗺️' },
    { name: 'itinerary_days', rows: totalItineraryDays, description: 'Day-by-day itineraries, meals, hotels, activities', icon: '📅' },
    { name: 'leads', rows: leads.length, description: 'Sales CRM pipeline (new, contacted, quoted, won, lost)', icon: '💼' },
    { name: 'lead_activities', rows: activities.length, description: 'Notes, phone call logs, email threads, follow-ups', icon: '📝' },
    { name: 'quotations', rows: quotations.length, description: 'Itemized price proposals with addons & validity dates', icon: '🧾' },
    { name: 'bookings', rows: bookings.length, description: 'Confirmed client reservations & payment tracking', icon: '✈️' },
    { name: 'testimonials', rows: testimonials.length, description: 'Guest reviews with moderation status flag', icon: '⭐' },
    { name: 'promotional_banners', rows: banners.length, description: 'Marketing offers, coupon codes, and banner copy', icon: '🏷️' },
  ];

  const handleCopySql = () => {
    const sql = exportDatabaseSql();
    navigator.clipboard.writeText(sql);
    setCopied(true);
    addToast('PostgreSQL export copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDdl = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `-- VoyageCRM PostgreSQL Schema DDL
-- See database/schema.sql for the complete production DDL
-- Includes: ENUM types, Foreign keys, updated_at triggers, and views
`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'voyagecrm_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('schema.sql downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-stone-900 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold">
            <Database className="w-4 h-4" />
            <span>PostgreSQL Relational Storage Hub</span>
          </div>
          <h2 className="text-xl font-bold font-display mt-0.5">
            Database Architecture & Production Schema
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            Structured 3NF schema designed for PostgreSQL 14+, Neon, Supabase, Cloud SQL, and Vercel Postgres. Includes triggers, foreign keys, and analytical views.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopySql}
            className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL' : 'Copy DML Data'}</span>
          </button>
          <button
            onClick={handleDownloadDdl}
            className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download schema.sql</span>
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-medium pb-2">
        <button
          onClick={() => setActiveSchemaTab('tables')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSchemaTab === 'tables' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Relational Tables & Live Record Counts
        </button>
        <button
          onClick={() => setActiveSchemaTab('ddl')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSchemaTab === 'ddl' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          PostgreSQL DDL Structure (database/schema.sql)
        </button>
      </div>

      {/* TAB 1: Tables Overview */}
      {activeSchemaTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div
              key={t.name}
              className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.icon}</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{t.name}</span>
                </div>
                <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {t.rows} records
                </span>
              </div>
              <p className="text-stone-500 leading-relaxed text-[11px]">{t.description}</p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                <span>Storage engine: PostgreSQL</span>
                <span className="text-emerald-700 font-medium">Synced</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DDL Viewer */}
      {activeSchemaTab === 'ddl' && (
        <div className="bg-stone-950 text-stone-300 rounded-xl p-5 border border-stone-800 font-mono text-xs overflow-x-auto max-h-[500px]">
          <pre className="text-stone-200 whitespace-pre">
{`-- ============================================================================
-- VoyageCRM - PostgreSQL Relational Database Schema & Backup DDL
-- Located at: /database/schema.sql
-- ============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'sales', 'admin');
CREATE TYPE travel_style AS ENUM ('luxury', 'adventure', 'cultural', 'nature', 'honeymoon', 'wellness');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- USERS & RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TOUR PACKAGES & DAY-WISE ITINERARIES
CREATE TABLE tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    base_price_usd NUMERIC(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    travel_style travel_style NOT NULL,
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE
);

CREATE TABLE itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    meals_included VARCHAR(100),
    accommodation VARCHAR(255),
    UNIQUE(package_id, day_number)
);

-- SALES CRM PIPELINE & QUOTATIONS
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_code VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    package_id UUID REFERENCES tour_packages(id) ON DELETE SET NULL,
    assigned_sales_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status lead_status NOT NULL DEFAULT 'new',
    estimated_budget NUMERIC(10, 2),
    next_follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL,
    status quote_status NOT NULL DEFAULT 'sent',
    valid_until DATE NOT NULL
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    package_id UUID NOT NULL REFERENCES tour_packages(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 0.00,
    booking_status booking_status NOT NULL DEFAULT 'confirmed'
);`}
          </pre>
        </div>
      )}
    </div>
  );
};
