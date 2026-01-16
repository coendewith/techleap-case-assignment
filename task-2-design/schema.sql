-- =============================================================================
-- Techleap Ecosystem Data Warehouse Schema
-- Production-Ready DDL for PostgreSQL
-- =============================================================================

-- Drop existing objects if rebuilding
-- DROP SCHEMA IF EXISTS analytics CASCADE;
-- CREATE SCHEMA analytics;

-- SET search_path TO analytics;

-- =============================================================================
-- DIMENSION TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- dim_date: Calendar dimension (pre-populated)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_date (
    date_id             INT PRIMARY KEY,                -- Format: YYYYMMDD
    full_date           DATE NOT NULL UNIQUE,
    year                SMALLINT NOT NULL,
    quarter             SMALLINT NOT NULL CHECK (quarter BETWEEN 1 AND 4),
    month               SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
    week                SMALLINT NOT NULL CHECK (week BETWEEN 1 AND 53),
    day_of_month        SMALLINT NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
    day_of_week         SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    day_name            VARCHAR(10) NOT NULL,
    month_name          VARCHAR(10) NOT NULL,
    quarter_name        VARCHAR(6) NOT NULL,            -- Q1, Q2, Q3, Q4
    year_month          VARCHAR(7) NOT NULL,            -- YYYY-MM
    year_quarter        VARCHAR(7) NOT NULL,            -- YYYY-Q1
    is_weekend          BOOLEAN NOT NULL,
    is_month_start      BOOLEAN NOT NULL,
    is_month_end        BOOLEAN NOT NULL,
    is_quarter_start    BOOLEAN NOT NULL,
    is_quarter_end      BOOLEAN NOT NULL,
    is_year_start       BOOLEAN NOT NULL,
    is_year_end         BOOLEAN NOT NULL
);

-- Populate dim_date for 2000-2030
INSERT INTO dim_date (
    date_id, full_date, year, quarter, month, week, day_of_month, day_of_week,
    day_name, month_name, quarter_name, year_month, year_quarter,
    is_weekend, is_month_start, is_month_end, is_quarter_start, is_quarter_end,
    is_year_start, is_year_end
)
SELECT
    TO_CHAR(d, 'YYYYMMDD')::INT as date_id,
    d as full_date,
    EXTRACT(YEAR FROM d)::SMALLINT as year,
    EXTRACT(QUARTER FROM d)::SMALLINT as quarter,
    EXTRACT(MONTH FROM d)::SMALLINT as month,
    EXTRACT(WEEK FROM d)::SMALLINT as week,
    EXTRACT(DAY FROM d)::SMALLINT as day_of_month,
    EXTRACT(ISODOW FROM d)::SMALLINT as day_of_week,
    TO_CHAR(d, 'Day') as day_name,
    TO_CHAR(d, 'Month') as month_name,
    'Q' || EXTRACT(QUARTER FROM d)::TEXT as quarter_name,
    TO_CHAR(d, 'YYYY-MM') as year_month,
    EXTRACT(YEAR FROM d)::TEXT || '-Q' || EXTRACT(QUARTER FROM d)::TEXT as year_quarter,
    EXTRACT(ISODOW FROM d) IN (6, 7) as is_weekend,
    EXTRACT(DAY FROM d) = 1 as is_month_start,
    d = (DATE_TRUNC('MONTH', d) + INTERVAL '1 MONTH - 1 day')::DATE as is_month_end,
    EXTRACT(MONTH FROM d) IN (1, 4, 7, 10) AND EXTRACT(DAY FROM d) = 1 as is_quarter_start,
    EXTRACT(MONTH FROM d) IN (3, 6, 9, 12) AND
        d = (DATE_TRUNC('MONTH', d) + INTERVAL '1 MONTH - 1 day')::DATE as is_quarter_end,
    EXTRACT(MONTH FROM d) = 1 AND EXTRACT(DAY FROM d) = 1 as is_year_start,
    EXTRACT(MONTH FROM d) = 12 AND EXTRACT(DAY FROM d) = 31 as is_year_end
FROM GENERATE_SERIES('2000-01-01'::DATE, '2030-12-31'::DATE, '1 day'::INTERVAL) d
ON CONFLICT (date_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- dim_geography: Location hierarchy
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_geography (
    geography_id        SERIAL PRIMARY KEY,
    city                VARCHAR(100),
    region              VARCHAR(100),
    country             VARCHAR(100) NOT NULL,
    country_code        CHAR(3),
    continent           VARCHAR(50),

    -- Constraints
    CONSTRAINT uq_geography UNIQUE (city, region, country),

    -- Audit
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_geography_country ON dim_geography(country);
CREATE INDEX IF NOT EXISTS idx_geography_country_code ON dim_geography(country_code);
CREATE INDEX IF NOT EXISTS idx_geography_city ON dim_geography(city);

-- -----------------------------------------------------------------------------
-- dim_investor: Investor profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_investor (
    investor_id         BIGSERIAL PRIMARY KEY,
    investor_source_id  VARCHAR(100),           -- External ID from source system
    investor_name       VARCHAR(255) NOT NULL,
    investor_type       VARCHAR(50),            -- vc, angel, corporate, government, accelerator
    headquarters_city   VARCHAR(100),
    headquarters_country VARCHAR(100),
    founding_year       SMALLINT,
    total_investments   INT,
    assets_under_mgmt   DECIMAL(18,2),
    website_url         VARCHAR(500),
    linkedin_url        VARCHAR(500),
    description         TEXT,

    -- Constraints
    CONSTRAINT chk_investor_type CHECK (investor_type IN (
        'vc', 'angel', 'corporate', 'government', 'accelerator',
        'family_office', 'private_equity', 'hedge_fund', 'other', NULL
    )),

    -- Audit
    source_system       VARCHAR(50) DEFAULT 'dealroom',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_investor_name ON dim_investor(investor_name);
CREATE INDEX IF NOT EXISTS idx_investor_type ON dim_investor(investor_type);
CREATE INDEX IF NOT EXISTS idx_investor_source_id ON dim_investor(investor_source_id);

-- -----------------------------------------------------------------------------
-- dim_company: Company dimension with SCD Type 2
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_company (
    -- Keys
    company_sk          BIGSERIAL PRIMARY KEY,  -- Surrogate key
    company_id          VARCHAR(100) NOT NULL,  -- Natural key from source

    -- Attributes
    company_name        VARCHAR(255) NOT NULL,
    legal_name          VARCHAR(255),
    founding_date       DATE,
    employee_count      INT,
    employee_count_range VARCHAR(50),           -- 1-10, 11-50, 51-200, etc.
    total_funding_eur   DECIMAL(18,2),
    last_funding_date   DATE,
    last_funding_type   VARCHAR(50),
    current_status      VARCHAR(50),            -- operating, acquired, closed, ipo
    exit_date           DATE,
    exit_type           VARCHAR(50),            -- acquisition, ipo, merger, shutdown
    acquirer_name       VARCHAR(255),

    -- URLs and identifiers
    website_url         VARCHAR(500),
    linkedin_url        VARCHAR(500),
    crunchbase_url      VARCHAR(500),
    kvk_number          VARCHAR(20),            -- Dutch Chamber of Commerce number

    -- Text fields
    description         TEXT,
    tagline             VARCHAR(500),

    -- Foreign keys
    geography_id        INT REFERENCES dim_geography(geography_id),

    -- SCD Type 2 tracking columns
    valid_from          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to            TIMESTAMP NOT NULL DEFAULT '9999-12-31 23:59:59'::TIMESTAMP,
    is_current          BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit columns
    source_system       VARCHAR(50) DEFAULT 'dealroom',
    source_file         VARCHAR(255),
    record_hash         VARCHAR(64),            -- MD5 hash for change detection
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_company_status CHECK (current_status IN (
        'operating', 'acquired', 'closed', 'ipo', 'unknown', NULL
    ))
);

CREATE INDEX IF NOT EXISTS idx_company_natural_key ON dim_company(company_id);
CREATE INDEX IF NOT EXISTS idx_company_current ON dim_company(is_current) WHERE is_current = TRUE;
CREATE INDEX IF NOT EXISTS idx_company_name ON dim_company(company_name);
CREATE INDEX IF NOT EXISTS idx_company_status ON dim_company(current_status);
CREATE INDEX IF NOT EXISTS idx_company_geography ON dim_company(geography_id);
CREATE INDEX IF NOT EXISTS idx_company_valid_range ON dim_company(valid_from, valid_to);

-- -----------------------------------------------------------------------------
-- bridge_company_industry: Many-to-many company-industry relationship
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bridge_company_industry (
    company_sk          BIGINT NOT NULL REFERENCES dim_company(company_sk),
    industry_name       VARCHAR(100) NOT NULL,
    industry_category   VARCHAR(100),           -- Parent category if exists
    is_primary          BOOLEAN DEFAULT FALSE,
    confidence_score    DECIMAL(3,2),           -- 0.00 to 1.00

    PRIMARY KEY (company_sk, industry_name),

    -- Audit
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bridge_industry ON bridge_company_industry(industry_name);
CREATE INDEX IF NOT EXISTS idx_bridge_primary ON bridge_company_industry(is_primary) WHERE is_primary = TRUE;


-- =============================================================================
-- FACT TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- fact_funding_rounds: Core fact table for investment analysis
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fact_funding_rounds (
    -- Keys
    funding_round_id    BIGSERIAL PRIMARY KEY,
    company_sk          BIGINT NOT NULL REFERENCES dim_company(company_sk),
    investor_id         BIGINT REFERENCES dim_investor(investor_id),
    date_id             INT NOT NULL REFERENCES dim_date(date_id),

    -- Measures
    amount_eur          DECIMAL(18,2),
    amount_usd          DECIMAL(18,2),
    valuation_pre_eur   DECIMAL(18,2),
    valuation_post_eur  DECIMAL(18,2),
    equity_percentage   DECIMAL(5,2),

    -- Dimensions embedded for performance
    round_type          VARCHAR(50) NOT NULL,
    round_sequence      INT,                    -- 1st, 2nd, 3rd funding for company
    is_lead_investor    BOOLEAN DEFAULT FALSE,
    deal_status         VARCHAR(50) DEFAULT 'completed', -- completed, announced, rumored

    -- Source tracking
    source_system       VARCHAR(50) DEFAULT 'dealroom',
    source_file         VARCHAR(255),
    source_record_id    VARCHAR(100),
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_round_type CHECK (round_type IN (
        'pre_seed', 'seed', 'series_a', 'series_b', 'series_c',
        'series_d', 'series_e', 'series_f', 'series_g', 'series_h',
        'growth', 'bridge', 'convertible_note', 'debt', 'grant',
        'ipo', 'secondary', 'private_equity', 'unknown'
    ))
);

CREATE INDEX IF NOT EXISTS idx_funding_company ON fact_funding_rounds(company_sk);
CREATE INDEX IF NOT EXISTS idx_funding_investor ON fact_funding_rounds(investor_id);
CREATE INDEX IF NOT EXISTS idx_funding_date ON fact_funding_rounds(date_id);
CREATE INDEX IF NOT EXISTS idx_funding_type ON fact_funding_rounds(round_type);
CREATE INDEX IF NOT EXISTS idx_funding_loaded ON fact_funding_rounds(loaded_at);
CREATE INDEX IF NOT EXISTS idx_funding_sequence ON fact_funding_rounds(company_sk, round_sequence);

-- -----------------------------------------------------------------------------
-- fact_company_snapshot: Monthly company state snapshots
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fact_company_snapshot (
    snapshot_id         BIGSERIAL PRIMARY KEY,
    company_sk          BIGINT NOT NULL REFERENCES dim_company(company_sk),
    snapshot_date_id    INT NOT NULL REFERENCES dim_date(date_id),

    -- Point-in-time metrics
    employee_count      INT,
    total_funding_eur   DECIMAL(18,2),
    funding_rounds_count INT,
    current_status      VARCHAR(50),
    days_since_founding INT,
    days_since_last_funding INT,

    -- Calculated metrics
    avg_funding_per_round DECIMAL(18,2),
    funding_velocity    DECIMAL(18,2),         -- Funding per year since founding

    -- Audit
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one snapshot per company per month
    CONSTRAINT uq_company_snapshot UNIQUE (company_sk, snapshot_date_id)
);

CREATE INDEX IF NOT EXISTS idx_snapshot_company ON fact_company_snapshot(company_sk);
CREATE INDEX IF NOT EXISTS idx_snapshot_date ON fact_company_snapshot(snapshot_date_id);


-- =============================================================================
-- EXTENSION TABLES (for future data sources)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- fact_patents: Patent filings (future integration)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fact_patents (
    patent_id           BIGSERIAL PRIMARY KEY,
    company_sk          BIGINT REFERENCES dim_company(company_sk),

    patent_number       VARCHAR(50) NOT NULL,
    patent_office       VARCHAR(10),            -- EPO, USPTO, WIPO, etc.
    filing_date_id      INT REFERENCES dim_date(date_id),
    grant_date_id       INT REFERENCES dim_date(date_id),
    expiry_date_id      INT REFERENCES dim_date(date_id),

    patent_title        TEXT,
    patent_abstract     TEXT,
    ipc_codes           VARCHAR(50)[],          -- International Patent Classification
    cpc_codes           VARCHAR(50)[],          -- Cooperative Patent Classification
    inventor_names      TEXT[],
    assignee_name       VARCHAR(255),

    citation_count      INT DEFAULT 0,
    family_size         INT DEFAULT 1,

    -- Audit
    source_system       VARCHAR(50),
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patent_company ON fact_patents(company_sk);
CREATE INDEX IF NOT EXISTS idx_patent_number ON fact_patents(patent_number);
CREATE INDEX IF NOT EXISTS idx_patent_filing_date ON fact_patents(filing_date_id);

-- -----------------------------------------------------------------------------
-- fact_news_mentions: News/media coverage (future integration)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fact_news_mentions (
    mention_id          BIGSERIAL PRIMARY KEY,
    company_sk          BIGINT REFERENCES dim_company(company_sk),
    mention_date_id     INT REFERENCES dim_date(date_id),

    article_url         VARCHAR(1000),
    article_title       TEXT,
    source_name         VARCHAR(255),
    source_type         VARCHAR(50),            -- news, blog, press_release, etc.
    sentiment_score     DECIMAL(3,2),           -- -1.00 to 1.00
    relevance_score     DECIMAL(3,2),           -- 0.00 to 1.00

    -- Audit
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_company ON fact_news_mentions(company_sk);
CREATE INDEX IF NOT EXISTS idx_news_date ON fact_news_mentions(mention_date_id);


-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- v_current_companies: Current state of all companies
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_current_companies AS
SELECT
    c.company_sk,
    c.company_id,
    c.company_name,
    c.founding_date,
    c.employee_count,
    c.total_funding_eur,
    c.current_status,
    g.city,
    g.country,
    g.continent,
    STRING_AGG(DISTINCT bci.industry_name, ', ') FILTER (WHERE bci.is_primary) as primary_industries,
    COUNT(DISTINCT f.funding_round_id) as funding_rounds_count,
    MAX(d.full_date) as last_funding_date
FROM dim_company c
LEFT JOIN dim_geography g ON c.geography_id = g.geography_id
LEFT JOIN bridge_company_industry bci ON c.company_sk = bci.company_sk
LEFT JOIN fact_funding_rounds f ON c.company_sk = f.company_sk
LEFT JOIN dim_date d ON f.date_id = d.date_id
WHERE c.is_current = TRUE
GROUP BY c.company_sk, c.company_id, c.company_name, c.founding_date,
         c.employee_count, c.total_funding_eur, c.current_status,
         g.city, g.country, g.continent;

-- -----------------------------------------------------------------------------
-- v_funding_summary: Aggregated funding metrics
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_funding_summary AS
SELECT
    d.year,
    d.quarter_name,
    g.country,
    f.round_type,
    COUNT(DISTINCT f.funding_round_id) as deal_count,
    COUNT(DISTINCT f.company_sk) as company_count,
    SUM(f.amount_eur) as total_funding_eur,
    AVG(f.amount_eur) as avg_deal_size_eur,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY f.amount_eur) as median_deal_size_eur
FROM fact_funding_rounds f
JOIN dim_company c ON f.company_sk = c.company_sk AND c.is_current = TRUE
JOIN dim_geography g ON c.geography_id = g.geography_id
JOIN dim_date d ON f.date_id = d.date_id
GROUP BY d.year, d.quarter_name, g.country, f.round_type;


-- =============================================================================
-- STORED PROCEDURES FOR ETL OPERATIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- sp_upsert_company: SCD Type 2 upsert for companies
-- -----------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE sp_upsert_company(
    p_company_id VARCHAR(100),
    p_company_name VARCHAR(255),
    p_founding_date DATE,
    p_employee_count INT,
    p_total_funding_eur DECIMAL(18,2),
    p_current_status VARCHAR(50),
    p_geography_id INT,
    p_source_file VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_record_hash VARCHAR(64);
    v_existing_hash VARCHAR(64);
BEGIN
    -- Calculate hash of incoming record for change detection
    v_record_hash := MD5(
        COALESCE(p_company_name, '') ||
        COALESCE(p_founding_date::TEXT, '') ||
        COALESCE(p_employee_count::TEXT, '') ||
        COALESCE(p_total_funding_eur::TEXT, '') ||
        COALESCE(p_current_status, '')
    );

    -- Get existing record hash
    SELECT record_hash INTO v_existing_hash
    FROM dim_company
    WHERE company_id = p_company_id AND is_current = TRUE;

    -- If no existing record, insert new
    IF v_existing_hash IS NULL THEN
        INSERT INTO dim_company (
            company_id, company_name, founding_date, employee_count,
            total_funding_eur, current_status, geography_id,
            source_file, record_hash
        ) VALUES (
            p_company_id, p_company_name, p_founding_date, p_employee_count,
            p_total_funding_eur, p_current_status, p_geography_id,
            p_source_file, v_record_hash
        );

    -- If record changed, close old and insert new
    ELSIF v_existing_hash != v_record_hash THEN
        -- Close existing record
        UPDATE dim_company
        SET valid_to = CURRENT_TIMESTAMP,
            is_current = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE company_id = p_company_id AND is_current = TRUE;

        -- Insert new version
        INSERT INTO dim_company (
            company_id, company_name, founding_date, employee_count,
            total_funding_eur, current_status, geography_id,
            source_file, record_hash, valid_from
        ) VALUES (
            p_company_id, p_company_name, p_founding_date, p_employee_count,
            p_total_funding_eur, p_current_status, p_geography_id,
            p_source_file, v_record_hash, CURRENT_TIMESTAMP
        );
    END IF;
    -- If hash matches, no action needed (no change)
END;
$$;


-- =============================================================================
-- GRANTS (adjust schema/roles as needed)
-- =============================================================================

-- Example grants for analytics role
-- GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO analytics_readonly;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytics TO analytics_etl;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA analytics TO analytics_etl;
