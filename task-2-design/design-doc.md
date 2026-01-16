# Data Engineering Design Document

## Techleap Ecosystem Data Pipeline

### Overview

This document outlines a production-ready data architecture for processing Dealroom's daily data exports (~5GB NDJSON files) and making ecosystem data queryable for analysts. The design prioritizes analytical flexibility, historical tracking, and scalability.

---

## 1. Architecture Overview

### High-Level Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Dealroom      │     │    Staging      │     │  Transformation │     │   Analytics     │
│   NDJSON        │────▶│    Layer        │────▶│    (dbt)        │────▶│   Data Mart     │
│   (~5GB/day)    │     │   (raw data)    │     │                 │     │   (Star Schema) │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │   Historical    │
                        │   Snapshots     │
                        │   (SCD Type 2)  │
                        └─────────────────┘
```

### Technology Stack Recommendation

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Storage | PostgreSQL (current scale) / BigQuery (future) | Mature, SQL-native, cost-effective for 5GB daily |
| Orchestration | Airflow / dbt Cloud | Industry standard, good monitoring |
| Transformation | dbt | Version-controlled SQL, lineage tracking |
| Visualization | Metabase / Looker | Self-service analytics for team |

---

## 2. Data Model Design

### Star Schema for Analytics

I've chosen a **star schema** over a normalized design for several reasons:

1. **Query Performance**: Analysts need fast ad-hoc queries; star schemas minimize joins
2. **Simplicity**: Business users can understand and navigate the model
3. **Tool Compatibility**: Works well with BI tools like Metabase, Tableau, Power BI

#### Trade-off Acknowledged
Star schemas introduce data redundancy. For a 5GB daily load, this is acceptable. If data volume grows significantly (>100GB), we'd consider a more normalized approach with materialized views.

---

### Entity Relationship Diagram

```
                                    ┌─────────────────────┐
                                    │     dim_date        │
                                    ├─────────────────────┤
                                    │ date_id (PK)        │
                                    │ full_date           │
                                    │ year                │
                                    │ quarter             │
                                    │ month               │
                                    │ week                │
                                    │ day_of_week         │
                                    │ is_weekend          │
                                    └──────────┬──────────┘
                                               │
┌─────────────────────┐                        │                    ┌─────────────────────┐
│    dim_company      │                        │                    │   dim_investor      │
├─────────────────────┤                        │                    ├─────────────────────┤
│ company_sk (PK)     │                        │                    │ investor_id (PK)    │
│ company_id (NK)     │◄───────────────────────┼───────────────────▶│ investor_name       │
│ company_name        │                        │                    │ investor_type       │
│ founding_date       │                        │                    │ headquarters_country│
│ employee_count      │         ┌──────────────┴──────────────┐     │ total_investments   │
│ total_funding_eur   │         │    fact_funding_rounds      │     │ aum_eur             │
│ current_status      │         ├─────────────────────────────┤     └─────────────────────┘
│ geography_id (FK)   │         │ funding_round_id (PK)       │
│ valid_from          │         │ company_sk (FK)             │     ┌─────────────────────┐
│ valid_to            │         │ investor_id (FK)            │     │   dim_geography     │
│ is_current          │         │ date_id (FK)                │     ├─────────────────────┤
└─────────────────────┘         │ round_type                  │     │ geography_id (PK)   │
                                │ round_sequence              │────▶│ city                │
┌─────────────────────┐         │ amount_eur                  │     │ region              │
│  bridge_company_    │         │ is_lead_investor            │     │ country             │
│  industry           │         │ valuation_eur               │     │ country_code        │
├─────────────────────┤         │ source_file                 │     │ continent           │
│ company_sk (FK)     │◄────────│ loaded_at                   │     └─────────────────────┘
│ industry_name       │         └─────────────────────────────┘
│ is_primary          │
└─────────────────────┘
```

---

## 3. Table Definitions

### Fact Table: `fact_funding_rounds`

The central fact table captures each funding round as a separate record, enabling flexible analysis of investment patterns.

```sql
CREATE TABLE fact_funding_rounds (
    funding_round_id    BIGSERIAL PRIMARY KEY,
    company_sk          BIGINT NOT NULL REFERENCES dim_company(company_sk),
    investor_id         BIGINT REFERENCES dim_investor(investor_id),
    date_id             INT NOT NULL REFERENCES dim_date(date_id),

    -- Round details
    round_type          VARCHAR(50) NOT NULL,  -- seed, series_a, series_b, etc.
    round_sequence      INT,                    -- 1st, 2nd, 3rd round for this company
    amount_eur          DECIMAL(18,2),
    valuation_eur       DECIMAL(18,2),
    is_lead_investor    BOOLEAN DEFAULT FALSE,

    -- Metadata
    source_file         VARCHAR(255),
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for common query patterns
    CONSTRAINT valid_round_type CHECK (round_type IN (
        'pre_seed', 'seed', 'series_a', 'series_b', 'series_c',
        'series_d', 'series_e', 'series_f', 'growth', 'ipo',
        'debt', 'grant', 'convertible_note', 'secondary', 'unknown'
    ))
);

CREATE INDEX idx_funding_rounds_company ON fact_funding_rounds(company_sk);
CREATE INDEX idx_funding_rounds_date ON fact_funding_rounds(date_id);
CREATE INDEX idx_funding_rounds_type ON fact_funding_rounds(round_type);
CREATE INDEX idx_funding_rounds_loaded ON fact_funding_rounds(loaded_at);
```

### Dimension: `dim_company` (SCD Type 2)

Slowly Changing Dimension Type 2 allows us to track how company attributes change over time.

```sql
CREATE TABLE dim_company (
    company_sk          BIGSERIAL PRIMARY KEY,  -- Surrogate key
    company_id          VARCHAR(50) NOT NULL,   -- Natural key from Dealroom
    company_name        VARCHAR(255) NOT NULL,
    founding_date       DATE,
    employee_count      INT,
    total_funding_eur   DECIMAL(18,2),
    current_status      VARCHAR(50),            -- operating, acquired, closed
    website_url         VARCHAR(500),
    linkedin_url        VARCHAR(500),
    description         TEXT,

    -- Foreign keys
    geography_id        INT REFERENCES dim_geography(geography_id),

    -- SCD Type 2 tracking
    valid_from          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to            TIMESTAMP DEFAULT '9999-12-31'::TIMESTAMP,
    is_current          BOOLEAN NOT NULL DEFAULT TRUE,

    -- Metadata
    source_file         VARCHAR(255),
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_natural_key ON dim_company(company_id);
CREATE INDEX idx_company_current ON dim_company(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_company_name ON dim_company(company_name);
```

### Bridge Table: `bridge_company_industry`

Handles the many-to-many relationship between companies and industries.

```sql
CREATE TABLE bridge_company_industry (
    company_sk          BIGINT NOT NULL REFERENCES dim_company(company_sk),
    industry_name       VARCHAR(100) NOT NULL,
    is_primary          BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (company_sk, industry_name)
);

CREATE INDEX idx_bridge_industry ON bridge_company_industry(industry_name);
```

### Dimension: `dim_investor`

```sql
CREATE TABLE dim_investor (
    investor_id         BIGSERIAL PRIMARY KEY,
    investor_name       VARCHAR(255) NOT NULL,
    investor_type       VARCHAR(50),            -- vc, angel, corporate, government
    headquarters_city   VARCHAR(100),
    headquarters_country VARCHAR(100),
    total_investments   INT,
    assets_under_mgmt   DECIMAL(18,2),
    website_url         VARCHAR(500),

    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investor_name ON dim_investor(investor_name);
CREATE INDEX idx_investor_type ON dim_investor(investor_type);
```

### Dimension: `dim_geography`

```sql
CREATE TABLE dim_geography (
    geography_id        SERIAL PRIMARY KEY,
    city                VARCHAR(100),
    region              VARCHAR(100),
    country             VARCHAR(100) NOT NULL,
    country_code        CHAR(3),
    continent           VARCHAR(50),

    UNIQUE(city, country)
);

CREATE INDEX idx_geography_country ON dim_geography(country);
CREATE INDEX idx_geography_city ON dim_geography(city);
```

### Dimension: `dim_date`

```sql
CREATE TABLE dim_date (
    date_id             INT PRIMARY KEY,        -- Format: YYYYMMDD
    full_date           DATE NOT NULL,
    year                INT NOT NULL,
    quarter             INT NOT NULL,
    month               INT NOT NULL,
    week                INT NOT NULL,
    day_of_week         INT NOT NULL,
    day_name            VARCHAR(10),
    month_name          VARCHAR(10),
    is_weekend          BOOLEAN,
    is_holiday          BOOLEAN DEFAULT FALSE
);

-- Pre-populate for years 2000-2030
```

---

## 4. Handling Nested Arrays

### Challenge

The source NDJSON contains nested arrays:
```json
{
  "funding_rounds": [
    {"date": "2019-06-01", "type": "seed", "amount_eur": 500000},
    {"date": "2023-09-01", "type": "series-b", "amount_eur": 8000000}
  ],
  "investors": [{"name": "Peak Capital", "type": "vc", "lead": true}]
}
```

### Solution: Flatten During ETL

**Python extraction pseudocode:**

```python
def flatten_funding_rounds(company_record):
    """Flatten nested funding_rounds into separate rows."""
    company_id = company_record['company_id']

    for seq, round in enumerate(company_record.get('funding_rounds', []), 1):
        yield {
            'company_id': company_id,
            'round_date': round.get('date'),
            'round_type': normalize_round_type(round.get('type')),
            'amount_eur': round.get('amount_eur'),
            'round_sequence': seq
        }

def flatten_investors(company_record):
    """Create company-investor associations."""
    company_id = company_record['company_id']

    for investor in company_record.get('investors', []):
        yield {
            'company_id': company_id,
            'investor_name': investor.get('name'),
            'investor_type': investor.get('type'),
            'is_lead': investor.get('lead', False)
        }
```

---

## 5. Change Data Capture (CDC) Strategy

### Requirements
- Track how companies change over time (employee count, funding, status)
- Support "as-of" queries (what did this company look like on date X?)
- Maintain audit trail for data lineage

### Implementation: SCD Type 2 + Daily Snapshots

**SCD Type 2** on `dim_company`:
- Each change creates a new row with updated `valid_from`/`valid_to`
- `is_current = TRUE` flags the latest version
- Enables point-in-time queries

**Daily ETL Logic:**

```sql
-- 1. Identify changed records
WITH incoming AS (
    SELECT * FROM staging.companies_daily
),
changes AS (
    SELECT
        i.*,
        c.company_sk as existing_sk
    FROM incoming i
    LEFT JOIN dim_company c ON i.company_id = c.company_id AND c.is_current = TRUE
    WHERE c.company_sk IS NULL  -- New company
       OR c.employee_count != i.employee_count  -- Changed
       OR c.total_funding_eur != i.total_funding_eur
       OR c.current_status != i.current_status
)

-- 2. Close old records
UPDATE dim_company
SET valid_to = CURRENT_TIMESTAMP,
    is_current = FALSE
WHERE company_id IN (SELECT company_id FROM changes WHERE existing_sk IS NOT NULL)
  AND is_current = TRUE;

-- 3. Insert new versions
INSERT INTO dim_company (company_id, company_name, ..., valid_from, is_current)
SELECT company_id, company_name, ..., CURRENT_TIMESTAMP, TRUE
FROM changes;
```

---

## 6. Integration Points for Additional Data Sources

### Planned Integrations

| Source | Join Strategy | New Tables |
|--------|---------------|------------|
| Patent filings (EPO) | Company name fuzzy match + founding date | `fact_patents` |
| Scientific publications | Author affiliation matching | `fact_publications` |
| News articles | Company name NER extraction | `fact_news_mentions` |
| KvK (Dutch registry) | KvK number direct join | Enrich `dim_company` |

### Implementation Pattern

```sql
-- New fact table for patents
CREATE TABLE fact_patents (
    patent_id           BIGSERIAL PRIMARY KEY,
    company_sk          BIGINT REFERENCES dim_company(company_sk),
    patent_number       VARCHAR(50),
    filing_date_id      INT REFERENCES dim_date(date_id),
    grant_date_id       INT REFERENCES dim_date(date_id),
    patent_title        TEXT,
    patent_abstract     TEXT,
    ipc_codes           VARCHAR(255)[],        -- Array of classification codes

    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fuzzy matching view for integration
CREATE VIEW company_name_variants AS
SELECT
    company_sk,
    company_name,
    LOWER(REGEXP_REPLACE(company_name, '[^a-zA-Z0-9]', '', 'g')) as normalized_name
FROM dim_company
WHERE is_current = TRUE;
```

---

## 7. Sample Queries

### Query 1: Total Funding by Sector (Last 12 Months)

```sql
SELECT
    bci.industry_name,
    COUNT(DISTINCT c.company_sk) as company_count,
    SUM(f.amount_eur) as total_funding,
    AVG(f.amount_eur) as avg_round_size
FROM fact_funding_rounds f
JOIN dim_company c ON f.company_sk = c.company_sk AND c.is_current = TRUE
JOIN bridge_company_industry bci ON c.company_sk = bci.company_sk
JOIN dim_date d ON f.date_id = d.date_id
WHERE d.full_date >= CURRENT_DATE - INTERVAL '12 months'
  AND bci.is_primary = TRUE
GROUP BY bci.industry_name
ORDER BY total_funding DESC
LIMIT 10;
```

### Query 2: Dutch Startups Funding Progression

```sql
SELECT
    c.company_name,
    c.founding_date,
    COUNT(f.funding_round_id) as total_rounds,
    SUM(f.amount_eur) as total_funding,
    MAX(f.round_type) as latest_round
FROM dim_company c
JOIN dim_geography g ON c.geography_id = g.geography_id
LEFT JOIN fact_funding_rounds f ON c.company_sk = f.company_sk
WHERE g.country = 'Netherlands'
  AND c.is_current = TRUE
GROUP BY c.company_sk, c.company_name, c.founding_date
ORDER BY total_funding DESC;
```

### Query 3: Point-in-Time Query (Company State on Specific Date)

```sql
SELECT
    c.company_name,
    c.employee_count,
    c.total_funding_eur,
    c.current_status
FROM dim_company c
WHERE c.company_id = 'abc123'
  AND '2023-06-15'::TIMESTAMP BETWEEN c.valid_from AND c.valid_to;
```

---

## 8. Trade-offs and Decisions

| Decision | Alternative | Rationale |
|----------|-------------|-----------|
| Star schema | Normalized/3NF | Query performance > storage efficiency at this scale |
| SCD Type 2 | SCD Type 1 (overwrite) | Historical analysis is critical for ecosystem tracking |
| PostgreSQL | BigQuery | Cost-effective for 5GB; migrate if >50GB or need real-time |
| Daily batch | Streaming | Dealroom provides daily exports; streaming adds complexity without benefit |
| Bridge tables for arrays | JSON columns | SQL-native querying; better BI tool compatibility |

---

## 9. Scalability Considerations

### Current Scale (5GB/day)
- PostgreSQL on managed service (RDS/Cloud SQL)
- Single daily batch job
- Standard indexes sufficient

### Future Scale (50GB+/day)
- Migrate to BigQuery/Snowflake
- Partition fact tables by date
- Consider column-oriented storage
- Implement incremental processing

### Growth Triggers
- Query response time >30s for standard dashboards
- Daily ETL window exceeds 4 hours
- Storage costs exceed compute costs

---

## 10. Next Steps

1. **Infrastructure Setup**: Provision PostgreSQL instance, set up dbt project
2. **Staging Layer**: Build NDJSON parser, staging tables
3. **Core Dimensions**: Implement dim_date, dim_geography first (static)
4. **Fact Tables**: Build fact_funding_rounds with SCD logic
5. **Testing**: Unit tests for transformations, data quality checks
6. **Documentation**: Generate dbt docs, data dictionary
7. **Monitoring**: Set up Airflow alerts, data freshness checks
