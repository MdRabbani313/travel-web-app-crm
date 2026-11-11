-- ============================================================================
-- VoyageCRM - PostgreSQL Relational Database Schema & Backup DDL
-- Scope: Multi-Role Travel Platform & Enterprise Sales CRM
-- Roles: Customer, Sales Executive, Admin
-- Compatible with PostgreSQL 14+, Neon, Supabase, Cloud SQL, and Vercel Postgres
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS & ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('customer', 'sales', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 2. DESTINATIONS & REGIONS
-- ----------------------------------------------------------------------------
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL, -- e.g., 'Europe', 'Southeast Asia', 'East Africa'
    description TEXT,
    hero_image_url TEXT NOT NULL,
    best_season VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'USD',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. TOUR PACKAGES
-- ----------------------------------------------------------------------------
CREATE TYPE travel_style AS ENUM ('luxury', 'adventure', 'cultural', 'nature', 'honeymoon', 'wellness');
CREATE TYPE package_difficulty AS ENUM ('easy', 'moderate', 'challenging');

CREATE TABLE tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(300),
    description TEXT NOT NULL,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    duration_nights INT NOT NULL CHECK (duration_nights >= 0),
    base_price_usd NUMERIC(10, 2) NOT NULL CHECK (base_price_usd >= 0),
    discounted_price_usd NUMERIC(10, 2),
    travel_style travel_style NOT NULL DEFAULT 'cultural',
    difficulty package_difficulty NOT NULL DEFAULT 'easy',
    max_travelers INT DEFAULT 12,
    hero_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tour_packages_style ON tour_packages(travel_style);
CREATE INDEX idx_tour_packages_price ON tour_packages(base_price_usd);
CREATE INDEX idx_tour_packages_destination ON tour_packages(destination_id);

-- ----------------------------------------------------------------------------
-- 4. DAY-WISE ITINERARY
-- ----------------------------------------------------------------------------
CREATE TABLE itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    day_number INT NOT NULL CHECK (day_number > 0),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    meals_included VARCHAR(100), -- e.g., 'Breakfast, Lunch'
    accommodation VARCHAR(255),
    activities TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(package_id, day_number)
);

CREATE INDEX idx_itinerary_package ON itinerary_days(package_id, day_number);

-- ----------------------------------------------------------------------------
-- 5. SALES CRM - LEADS PIPELINE
-- ----------------------------------------------------------------------------
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');
CREATE TYPE lead_source AS ENUM ('website_enquiry', 'booking_request', 'whatsapp', 'direct_call', 'referral', 'campaign');

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_code VARCHAR(30) UNIQUE NOT NULL, -- e.g., 'LEAD-2026-001'
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    package_id UUID REFERENCES tour_packages(id) ON DELETE SET NULL,
    assigned_sales_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status lead_status NOT NULL DEFAULT 'new',
    source lead_source NOT NULL DEFAULT 'website_enquiry',
    estimated_pax INT DEFAULT 2,
    travel_date DATE,
    estimated_budget NUMERIC(10, 2),
    special_notes TEXT,
    lead_score INT DEFAULT 50 CHECK (lead_score BETWEEN 0 AND 100),
    last_contacted_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_sales_id);
CREATE INDEX idx_leads_email ON leads(customer_email);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at);

-- ----------------------------------------------------------------------------
-- 6. SALES CRM - LEAD ACTIVITIES & FOLLOW-UP LOG
-- ----------------------------------------------------------------------------
CREATE TYPE activity_type AS ENUM ('note', 'call', 'email', 'meeting', 'whatsapp', 'quote_sent', 'status_change');

CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type activity_type NOT NULL DEFAULT 'note',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);

-- ----------------------------------------------------------------------------
-- 7. QUOTATIONS
-- ----------------------------------------------------------------------------
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'QT-2026-104'
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE RESTRICT,
    prepared_by_sales_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    adults_count INT NOT NULL DEFAULT 2,
    children_count INT NOT NULL DEFAULT 0,
    base_rate NUMERIC(10, 2) NOT NULL,
    custom_addons JSONB DEFAULT '[]', -- array of { title: string, price: number }
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) DEFAULT 10.00, -- percentage
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status quote_status NOT NULL DEFAULT 'sent',
    valid_until DATE NOT NULL,
    customer_notes TEXT,
    terms_and_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotations_lead ON quotations(lead_id);
CREATE INDEX idx_quotations_sales ON quotations(prepared_by_sales_id);

-- ----------------------------------------------------------------------------
-- 8. BOOKINGS & CUSTOMER RECORDS
-- ----------------------------------------------------------------------------
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'deposit_paid', 'fully_paid', 'refunded');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'VYG-2026-981'
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
    package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE RESTRICT,
    travel_start_date DATE NOT NULL,
    travel_end_date DATE NOT NULL,
    adults_count INT NOT NULL DEFAULT 2,
    children_count INT NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 0.00,
    booking_status booking_status NOT NULL DEFAULT 'confirmed',
    payment_status payment_status NOT NULL DEFAULT 'deposit_paid',
    special_requests TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);

-- ----------------------------------------------------------------------------
-- 9. CONTENT MANAGEMENT (BANNERS & TESTIMONIALS)
-- ----------------------------------------------------------------------------
CREATE TABLE promotional_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline VARCHAR(255) NOT NULL,
    subtext VARCHAR(350),
    coupon_code VARCHAR(50),
    link_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    package_name VARCHAR(200),
    rating INT CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 10. SYSTEM SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUDIT & TRIGGER FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_tour_packages_updated_at BEFORE UPDATE ON tour_packages FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_quotations_updated_at BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================
CREATE OR REPLACE VIEW view_sales_performance AS
SELECT 
    u.id AS sales_id,
    u.full_name AS sales_name,
    COUNT(l.id) AS total_assigned_leads,
    COUNT(CASE WHEN l.status = 'won' THEN 1 END) AS won_leads,
    COUNT(CASE WHEN l.status = 'lost' THEN 1 END) AS lost_leads,
    COALESCE(ROUND(COUNT(CASE WHEN l.status = 'won' THEN 1 END)::NUMERIC / NULLIF(COUNT(l.id), 0) * 100, 1), 0) AS conversion_rate_percent,
    COALESCE(SUM(CASE WHEN l.status = 'won' THEN b.total_amount ELSE 0 END), 0) AS total_revenue
FROM users u
LEFT JOIN leads l ON l.assigned_sales_id = u.id
LEFT JOIN bookings b ON b.lead_id = l.id
WHERE u.role = 'sales'
GROUP BY u.id, u.full_name;

-- ============================================================================
-- SEED DATA
-- ============================================================================
INSERT INTO promotional_banners (headline, subtext, coupon_code, link_url, is_active)
VALUES ('Early Summer Odyssey', 'Enjoy 15% off Alpine Express & Mediterranean tours booked 60 days ahead.', 'SUMMER15', '#packages', true);

INSERT INTO testimonials (guest_name, location, package_name, rating, comment, is_approved)
VALUES 
('David & Claire M.', 'London, UK', 'Swiss Alps & Glacier Express Grand Tour', 5, 'Flawless execution. Every panoramic train, mountain chalet, and private mountain guide was curated to perfection. Marcus from the sales team was responsive within minutes.', true),
('Sophia Zhang', 'San Francisco, USA', 'Bali Rainforest Sanctuary & Cultural Haven', 5, 'Our private Ubud pool villa was breathtaking. The day-wise itinerary struck the exact balance between spiritual temples and rejuvenating spa afternoons.', true),
('Marco Bianchi', 'Milan, Italy', 'Kyoto Bamboo Trails & Historic Ryokans', 5, 'Remarkable attention to detail. Having high-speed shinkansen passes and traditional tea master ceremonies pre-arranged gave us complete peace of mind.', true);
