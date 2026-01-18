# Task 2: Data Engineering Design Document (Revised)

## Executive Summary

This document presents a **simplified star schema** for Techleap's Dealroom data pipeline. After evaluating 8 different data modeling approaches (see Appendix A), this design balances simplicity with analytical capability—avoiding both over-engineering (Data Vault, full bridge tables) and under-engineering (pure OBT without historical tracking).

**Key insight:** Techleap's Finder platform is already powered by Dealroom.co, making alignment with their data structure natural.

---

### Diagram Reference

This design includes two ERD representations:

| Diagram | Purpose | File |
|---------|---------|------|
| **Conceptual** | Simple explanation for stakeholders | `data-model.mmd` (Mermaid) |
| **Production** | Full implementation reference | `data-model.dbml` (dbdiagram.io) |

**To generate the production ERD:**
1. Copy contents of `data-model.dbml`
2. Paste at [dbdiagram.io](https://dbdiagram.io)
3. Export as PNG/PDF

---

## 1. Data Model Overview

### Design Philosophy: "Simple But Not Simplistic"

The case asks to track "how companies change over time" while keeping things practical. This eliminates purely denormalized approaches (OBT) while the small team context eliminates enterprise approaches (Data Vault).

**Result:** 4 core tables instead of 7+, using JSON arrays instead of bridge tables.

### Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         dim_companies                                    │
│                      (SCD Type 2 for history)                           │
├─────────────────────────────────────────────────────────────────────────┤
│  company_sk         INT        PK (surrogate key)                       │
│  company_id         STRING     (natural key from Dealroom)              │
│  name               STRING                                               │
│  founding_date      DATE                                                 │
│  employee_count     INT                                                  │
│  total_funding_eur  DECIMAL                                              │
│  city               STRING                                               │
│  country            STRING                                               │
│  industries         ARRAY<STRING>   ["logistics", "ai"]                 │
│  valid_from         TIMESTAMP  (SCD2)                                   │
│  valid_to           TIMESTAMP  (SCD2)                                   │
│  is_current         BOOLEAN    (SCD2)                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       fact_funding_rounds                                │
│                    (grain: one funding event)                           │
├─────────────────────────────────────────────────────────────────────────┤
│  funding_round_sk   INT        PK                                       │
│  company_sk         INT        FK → dim_companies                       │
│  round_date         DATE                                                 │
│  round_type         STRING     (seed, series-a, series-b, etc.)        │
│  amount_eur         DECIMAL                                              │
│  investors          ARRAY<STRUCT<name STRING, type STRING, lead BOOL>> │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           dim_date                                       │
│                    (standard date dimension)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  date_sk            INT        PK                                       │
│  full_date          DATE                                                 │
│  year               INT                                                  │
│  quarter            INT                                                  │
│  month              INT                                                  │
│  month_name         STRING                                               │
│  is_weekend         BOOLEAN                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Design Decisions & Trade-offs

| Decision | Choice Made | Alternative Rejected | Why |
|----------|-------------|---------------------|-----|
| **Schema pattern** | Simplified star schema (4 tables) | Full Kimball with bridge tables (7+ tables) | Bridge tables add complexity without proportional value for small team |
| **Industries storage** | JSON array in dim_companies | Separate dim_industries + bridge table | Enables simple queries like `WHERE 'ai' IN industries`; sacrifices investor-level aggregation |
| **Investors storage** | JSON array in fact_funding_rounds | Separate dim_investors + bridge table | Round-investor relationship is captured; deduplication deferred to future phase |
| **Temporal tracking** | SCD Type 2 on companies only | SCD Type 2 on all dimensions, or full Data Vault | Companies change (employee count, funding totals); industries/investors relatively static |
| **Overall approach** | Star schema | One Big Table (OBT) | Case requires "how companies change over time"—OBT struggles with historical tracking |

### What I'm NOT Doing (And Why)

| Omission | Rationale |
|----------|-----------|
| **Data Vault (Hubs/Links/Satellites)** | Overkill for single-source data; requires specialized expertise; 3-6 month implementation |
| **Streaming/CDC architecture** | Case specifies daily batch exports; streaming adds unnecessary complexity |
| **Full medallion architecture detail** | Focus is on data model, not pipeline orchestration |

### Design vs Implementation Note

**This document presents the conceptual model** (JSON arrays for simplicity). The accompanying `schema.sql` provides a **production-ready PostgreSQL implementation** that uses bridge tables for industries (`bridge_company_industry`) and a proper investor dimension (`dim_investor`).

**Why the difference?**

| Aspect | Design Doc (Conceptual) | schema.sql (Production) |
|--------|------------------------|-------------------------|
| **Industries** | `ARRAY<STRING>` | `bridge_company_industry` table |
| **Investors** | `ARRAY<STRUCT>` in fact table | `dim_investor` + FK relationship |
| **Rationale** | Optimized for explanation | Optimized for PostgreSQL (no native array search) |

**When to use which:**
- **Snowflake/BigQuery**: JSON array approach works well (native array functions)
- **PostgreSQL/DuckDB**: Bridge table approach in schema.sql is more performant
- **Hybrid**: Start with JSON arrays, migrate to bridge tables when investor analysis becomes critical

---

## 3. Handling the Nested JSON

### Source Structure
```json
{
  "company_id": "abc123",
  "name": "TechStartup B.V.",
  "industries": ["logistics", "artificial-intelligence"],
  "funding_rounds": [
    {"date": "2019-06-01", "type": "seed", "amount_eur": 500000, 
     "investors": [{"name": "Peak Capital", "type": "vc", "lead": true}]}
  ],
  "headquarters": {"city": "Amsterdam", "country": "Netherlands"},
  "updated_at": "2024-01-15T08:30:00Z"
}
```

### Transformation Approach

```sql
-- Snowflake example: Flatten funding_rounds to fact table
SELECT 
    src.company_id,
    f.value:date::DATE AS round_date,
    f.value:type::STRING AS round_type,
    f.value:amount_eur::DECIMAL AS amount_eur,
    f.value:investors AS investors  -- Keep as ARRAY
FROM raw_companies src,
LATERAL FLATTEN(input => src:funding_rounds) f;

-- Query example: Find all Series A rounds with lead investor
SELECT
    c.name,
    f.round_date,
    f.amount_eur,
    inv.value:name::STRING AS lead_investor
FROM fact_funding_rounds f
JOIN dim_companies c ON f.company_sk = c.company_sk AND c.is_current = TRUE
, LATERAL FLATTEN(input => f.investors) inv
WHERE f.round_type = 'series-a'
  AND inv.value:lead::BOOLEAN = TRUE;
```

### Multi-Warehouse Syntax Reference

The same transformation logic works across warehouses with minor syntax differences:

| Warehouse | JSON Flatten Syntax |
|-----------|---------------------|
| **Snowflake** | `LATERAL FLATTEN(input => column)` |
| **BigQuery** | `UNNEST(column)` |
| **PostgreSQL** | `jsonb_array_elements(column)` |
| **DuckDB** | `UNNEST(column)` |

#### BigQuery Equivalent
```sql
-- BigQuery: Flatten funding_rounds to fact table
SELECT
    src.company_id,
    CAST(JSON_VALUE(f, '$.date') AS DATE) AS round_date,
    JSON_VALUE(f, '$.type') AS round_type,
    CAST(JSON_VALUE(f, '$.amount_eur') AS NUMERIC) AS amount_eur,
    JSON_QUERY(f, '$.investors') AS investors
FROM raw_companies src,
UNNEST(JSON_QUERY_ARRAY(src.funding_rounds)) AS f;

-- Query: Series A with lead investor
SELECT
    c.name,
    f.round_date,
    f.amount_eur,
    JSON_VALUE(inv, '$.name') AS lead_investor
FROM fact_funding_rounds f
JOIN dim_companies c ON f.company_sk = c.company_sk AND c.is_current = TRUE,
UNNEST(JSON_QUERY_ARRAY(f.investors)) AS inv
WHERE f.round_type = 'series-a'
  AND CAST(JSON_VALUE(inv, '$.lead') AS BOOL) = TRUE;
```

#### PostgreSQL Equivalent
```sql
-- PostgreSQL: Flatten funding_rounds to fact table
SELECT
    src.company_id,
    (f->>'date')::DATE AS round_date,
    f->>'type' AS round_type,
    (f->>'amount_eur')::NUMERIC AS amount_eur,
    f->'investors' AS investors
FROM raw_companies src,
jsonb_array_elements(src.funding_rounds) AS f;

-- Query: Series A with lead investor
SELECT
    c.name,
    f.round_date,
    f.amount_eur,
    inv->>'name' AS lead_investor
FROM fact_funding_rounds f
JOIN dim_companies c ON f.company_sk = c.company_sk AND c.is_current = TRUE,
jsonb_array_elements(f.investors) AS inv
WHERE f.round_type = 'series-a'
  AND (inv->>'lead')::BOOLEAN = TRUE;
```

---

## 4. Extension for Additional Data Sources

The schema extends naturally by adding fact tables linked via `company_sk`:

```
                    ┌─────────────────────┐
                    │   dim_companies     │
                    │    (existing)       │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ fact_funding_    │ │ fact_patent_     │ │ fact_news_       │
│ rounds           │ │ filings          │ │ mentions         │
│ (existing)       │ │ (future)         │ │ (future)         │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Pattern:** Each new source becomes its own fact table. The company dimension serves as the conformed dimension across all fact tables.

| Future Source | Fact Table | Key Fields |
|---------------|------------|------------|
| Patent filings | fact_patents | company_sk, filing_date, patent_number, classification |
| Scientific publications | fact_publications | company_sk, publication_date, doi, citation_count |
| News articles | fact_news_mentions | company_sk, article_date, source, sentiment_score |

---

## 5. Implementation Approach

### Recommended Stack
- **Warehouse:** Snowflake, BigQuery, or DuckDB (all handle JSON arrays natively)
- **Transformation:** dbt (snapshots for SCD Type 2)
- **Orchestration:** dbt Cloud or Airflow (for daily refresh)

### Phased Delivery

| Phase | Timeline | Output |
|-------|----------|--------|
| 1. Raw ingestion | Week 1 | NDJSON → raw table with VARIANT column |
| 2. Staging + fact | Week 2 | Flattened funding_rounds, cleaned companies |
| 3. SCD Type 2 | Week 3 | dim_companies with history tracking |
| 4. Testing + docs | Week 4 | dbt tests, auto-generated docs |

### dbt Snapshot Example
```yaml
{% snapshot dim_companies_snapshot %}
{{
    config(
      target_schema='analytics',
      unique_key='company_id',
      strategy='timestamp',
      updated_at='source_updated_at',
    )
}}
SELECT * FROM {{ ref('stg_companies') }}
{% endsnapshot %}
```

---

## 5b. Data Retention Policy

### SCD Type 2 History Retention

| Data Category | Retention Period | Rationale |
|---------------|------------------|-----------|
| **Active companies** | Full history (indefinite) | Business value in tracking company evolution |
| **Closed companies** | 5 years post-closure | Regulatory compliance + cohort analysis |
| **Acquired companies** | 7 years post-acquisition | Exit analysis, investor returns tracking |
| **Orphaned records** | 90 days | Allow time for data quality fixes |

### Implementation

```sql
-- Archive old SCD2 records for closed companies older than 5 years
INSERT INTO dim_company_archive
SELECT * FROM dim_company
WHERE is_current = FALSE
  AND current_status = 'closed'
  AND valid_to < CURRENT_DATE - INTERVAL '5 years';

DELETE FROM dim_company
WHERE is_current = FALSE
  AND current_status = 'closed'
  AND valid_to < CURRENT_DATE - INTERVAL '5 years';
```

### Monthly Snapshot Retention

| Snapshot Type | Granularity | Retention |
|---------------|-------------|-----------|
| **fact_company_snapshot** | Monthly | 10 years |
| **Raw source files** | Daily | 90 days (then archive to cold storage) |
| **dbt run logs** | Daily | 30 days |

---

## 5c. Late-Arriving Facts Handling

### The Problem

Dealroom data may include funding rounds that occurred months ago but are only now being reported. Example: A Series A from June 2024 appears in the December 2024 export.

### Strategy: Idempotent Upserts with Backdating

```sql
-- Insert or update funding round based on natural key
-- This handles late-arriving facts by matching on company + round_date + round_type
INSERT INTO fact_funding_rounds (
    company_sk,
    date_id,
    round_type,
    amount_eur,
    source_file,
    loaded_at
)
SELECT
    c.company_sk,
    TO_CHAR(s.round_date, 'YYYYMMDD')::INT as date_id,
    s.round_type,
    s.amount_eur,
    'dealroom_export_2024_12.json' as source_file,
    CURRENT_TIMESTAMP as loaded_at
FROM stg_funding_rounds s
JOIN dim_company c ON s.company_id = c.company_id AND c.is_current = TRUE
ON CONFLICT ON CONSTRAINT uq_funding_natural_key DO UPDATE SET
    amount_eur = EXCLUDED.amount_eur,
    loaded_at = CURRENT_TIMESTAMP;
```

### Required Schema Addition

```sql
-- Add natural key constraint to fact_funding_rounds
ALTER TABLE fact_funding_rounds
ADD CONSTRAINT uq_funding_natural_key
UNIQUE (company_sk, date_id, round_type, investor_id);
```

### SCD2 Implications

When a late-arriving fact requires updating a company's historical state:

| Scenario | Action |
|----------|--------|
| **New funding round arrives late** | Insert into fact table with historical date_id; no SCD2 change needed |
| **Company metrics change retroactively** | This is rare; if needed, create a new SCD2 record with `valid_from` set to the historical date |
| **Historical snapshot incorrect** | Do NOT modify; add data quality flag; address in next snapshot |

### dbt Incremental Strategy

```sql
-- In dbt model: stg_funding_rounds
{{
    config(
        materialized='incremental',
        unique_key=['company_id', 'round_date', 'round_type'],
        merge_update_columns=['amount_eur', 'investors', 'loaded_at']
    )
}}

SELECT * FROM {{ source('dealroom', 'raw_funding_rounds') }}
{% if is_incremental() %}
WHERE loaded_at > (SELECT MAX(loaded_at) FROM {{ this }})
   OR (company_id, round_date, round_type) IN (
       SELECT company_id, round_date, round_type
       FROM {{ source('dealroom', 'raw_funding_rounds') }}
       WHERE amount_eur != (
           SELECT amount_eur FROM {{ this }} t
           WHERE t.company_id = raw_funding_rounds.company_id
             AND t.round_date = raw_funding_rounds.round_date
             AND t.round_type = raw_funding_rounds.round_type
       )
   )
{% endif %}
```

---

## 6. Approaches Considered But Rejected

### Full Evaluation Summary

| Approach | Verdict | Reason |
|----------|---------|--------|
| **One Big Table (OBT)** | ❌ Rejected | Cannot handle "how companies change over time" requirement |
| **Data Vault 2.0** | ❌ Rejected | 3-6 month implementation; requires specialized expertise; overkill |
| **Full Kimball + Bridge Tables** | ❌ Rejected | 7+ tables adds complexity without proportional value |
| **Activity Schema** | ❌ Rejected | Designed for event streams, not entity-centric company data |
| **3NF (Inmon)** | ❌ Rejected | Poor BI tool compatibility; complex queries |
| **Snowflake Schema** | ❌ Rejected | Kimball recommends against; complexity without benefit |
| **Hybrid OBT on Star** | ⚠️ Considered | Good approach but adds second layer to explain |
| **Simplified Star Schema** | ✅ Selected | Optimal balance of simplicity and capability |

---

## 7. What I'd Ask Before Writing a Single Line of SQL

**A lesson from Uber**: The best data pipelines aren't the most sophisticated — they're the ones that answer the right questions. Before building anything, I'd want to understand:

### Discovery Questions

1. **Query patterns**: What are the top 5 questions analysts ask every week? (This drives indexing, not schema design)
2. **Investor analysis depth**: Do you need "all deals by Investor X" queries? (This determines whether the JSON array approach is sufficient or if a proper bridge table is needed)
3. **History depth**: How far back does "company state at funding date" analysis need to go? (Affects SCD Type 2 retention policy)
4. **Refresh timing**: Is daily sufficient? Some dashboards might need intraday. (Changes architecture significantly)
5. **Deduplication priority**: How painful is "Peak Capital" vs "PEAK" vs "Peak Capital B.V." today? (Determines whether entity resolution is Phase 1 or Phase 3)

### Context Questions

6. **Team capacity**: Who maintains this after I build it? A 4-person team can't maintain a 15-table schema.
7. **Dealroom quirks**: What data quality issues exist today? (Investor name variations, missing fields, timezone handling)
8. **Integration targets**: What BI tools connect to this? (Looker, Tableau, Metabase have different SQL dialect preferences)

### The Meta-Question

**What decision would this data help you make that you can't make today?**

If the answer is vague, the schema will be overbuilt. If the answer is specific ("I want to see which investors consistently back companies that reach Series B"), I can optimize for exactly that query.

**Without these answers, I've optimized for flexibility over certainty.** That's a reasonable default, but it's not ideal.

---

## 8. Entity Resolution Strategy

### The Problem: Investor Name Matching

Investor names appear in multiple variations across sources:
- "a16z" vs "Andreessen Horowitz" vs "AH Capital Management"
- "Peak Capital" vs "PEAK" vs "Peak Capital B.V."
- "Sequoia Capital" vs "Sequoia" vs "Sequoia Capital China"

### Recommended Approach: Phased Deduplication

| Phase | Approach | Complexity | Accuracy |
|-------|----------|------------|----------|
| **Phase 1: Exact match** | String normalization (lowercase, remove punctuation, trim) | Low | ~60% |
| **Phase 2: Fuzzy match** | Levenshtein distance + token sorting | Medium | ~80% |
| **Phase 3: ML-based** | Trained classifier on investor pairs | High | ~95% |

### Implementation (Phase 1-2)

```sql
-- Create investor reference table with canonical names
CREATE TABLE dim_investors (
    investor_sk         INT PRIMARY KEY,
    canonical_name      STRING,  -- "Andreessen Horowitz"
    normalized_name     STRING,  -- "andreessen horowitz"
    aliases             ARRAY<STRING>,  -- ["a16z", "ah capital"]
    investor_type       STRING,
    website             STRING,
    created_at          TIMESTAMP
);

-- Matching logic using fuzzy matching
WITH normalized AS (
    SELECT
        LOWER(TRIM(REGEXP_REPLACE(investor_name, '[^a-zA-Z0-9 ]', ''))) as norm_name,
        original_name
    FROM raw_investors
)
SELECT
    n.original_name,
    d.canonical_name,
    EDITDISTANCE(n.norm_name, d.normalized_name) as distance
FROM normalized n
CROSS JOIN dim_investors d
WHERE EDITDISTANCE(n.norm_name, d.normalized_name) <= 3
ORDER BY distance;
```

### When to Implement

| Trigger | Action |
|---------|--------|
| "All deals by Investor X" queries frequent | Implement Phase 1-2 |
| Investor concentration analysis required | Implement Phase 1-2 |
| <100 unique investors | Manual curation sufficient |
| Regulatory reporting on investor activity | Implement Phase 3 (ML-based) |

**Current recommendation:** Defer until query patterns emerge. Note as technical debt.

---

## 9. Handling Unstructured Data (Bonus)

### Data Sources to Integrate

| Source | Data Type | Value |
|--------|-----------|-------|
| **News articles** | Unstructured text | Sentiment, funding announcements, executive changes |
| **Scientific publications** | Semi-structured | Innovation metrics, research output |
| **Social media** | Unstructured text | Brand sentiment, hiring signals |
| **Patent filings** | Structured + text | IP portfolio, technology focus |

### Architecture for Unstructured Data

```
┌─────────────────────────────────────────────────────────────────────┐
│                        UNSTRUCTURED DATA PIPELINE                   │
└─────────────────────────────────────────────────────────────────────┘

  News API / RSS          Scientific DBs           Patent APIs
       │                       │                        │
       ▼                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      RAW STORAGE (S3/GCS)                           │
│   • news_articles_raw/      • publications_raw/    • patents_raw/   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NLP PROCESSING                               │
│   • Entity extraction (company names, people)                       │
│   • Sentiment analysis                                              │
│   • Topic classification                                            │
│   • Embedding generation (for similarity search)                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STRUCTURED OUTPUT                              │
│   fact_news_mentions:                                               │
│   • company_sk (FK to dim_companies)                                │
│   • article_date                                                    │
│   • source (techcrunch, reuters, etc.)                              │
│   • sentiment_score (-1 to +1)                                      │
│   • topics ARRAY<STRING>                                            │
│   • article_embedding VECTOR(768)  -- for similarity search         │
└─────────────────────────────────────────────────────────────────────┘
```

### Entity Extraction for Company Matching

The key challenge is matching unstructured mentions to the `dim_companies` table.

#### SQL-Based Company Matching (PostgreSQL with pg_trgm)

```sql
-- Enable trigram extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_company_name_trgm
ON dim_company USING GIN (company_name gin_trgm_ops);

-- Function to find best company match for extracted entity
CREATE OR REPLACE FUNCTION match_company_entity(
    p_extracted_name TEXT,
    p_min_similarity NUMERIC DEFAULT 0.3
)
RETURNS TABLE (
    company_sk BIGINT,
    company_name VARCHAR,
    similarity_score NUMERIC,
    match_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH candidates AS (
        -- Try exact match first
        SELECT
            c.company_sk,
            c.company_name,
            1.0::NUMERIC as similarity_score,
            'exact'::VARCHAR as match_type
        FROM dim_company c
        WHERE c.is_current = TRUE
          AND LOWER(TRIM(c.company_name)) = LOWER(TRIM(p_extracted_name))

        UNION ALL

        -- Try prefix match (e.g., "Booking" matches "Booking.com")
        SELECT
            c.company_sk,
            c.company_name,
            0.9::NUMERIC as similarity_score,
            'prefix'::VARCHAR as match_type
        FROM dim_company c
        WHERE c.is_current = TRUE
          AND LOWER(c.company_name) LIKE LOWER(TRIM(p_extracted_name)) || '%'
          AND LOWER(TRIM(c.company_name)) != LOWER(TRIM(p_extracted_name))

        UNION ALL

        -- Fuzzy match using trigrams
        SELECT
            c.company_sk,
            c.company_name,
            SIMILARITY(LOWER(c.company_name), LOWER(p_extracted_name))::NUMERIC as similarity_score,
            'fuzzy'::VARCHAR as match_type
        FROM dim_company c
        WHERE c.is_current = TRUE
          AND c.company_name % p_extracted_name  -- trigram similarity operator
          AND SIMILARITY(LOWER(c.company_name), LOWER(p_extracted_name)) >= p_min_similarity
    )
    SELECT DISTINCT ON (candidates.company_sk)
        candidates.company_sk,
        candidates.company_name,
        candidates.similarity_score,
        candidates.match_type
    FROM candidates
    ORDER BY candidates.company_sk, candidates.similarity_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Usage example: Match entities from a news article
SELECT
    ne.extracted_entity,
    m.*
FROM news_extracted_entities ne
CROSS JOIN LATERAL match_company_entity(ne.extracted_entity, 0.4) m
WHERE ne.entity_type = 'ORG'
ORDER BY m.similarity_score DESC;
```

#### Handling Dutch Company Name Variations

Dutch company names have specific patterns that require special handling:

```sql
-- Normalize Dutch company name variations
CREATE OR REPLACE FUNCTION normalize_dutch_company_name(p_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(p_name,
                        '\s+(B\.?V\.?|N\.?V\.?|C\.?V\.?|V\.?O\.?F\.?)$', '', 'i'),  -- Remove legal suffixes
                    '\s+(BV|NV|CV|VOF)$', '', 'i'),
                '\s+', ' ', 'g'),  -- Normalize whitespace
            '^\s+|\s+$', '', 'g')  -- Trim
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Example matches this enables:
-- "TechStartup B.V." → "techstartup" → matches "TechStartup BV"
-- "My Company N.V." → "my company" → matches "My Company"
```

#### Batch Processing Pipeline

```python
# Pseudo-code for news article processing
def process_article(article_text, article_date, source):
    # 1. Extract company mentions using NER
    entities = ner_model.extract_entities(article_text, entity_type="ORG")

    # 2. Match to dim_companies using SQL function
    for entity in entities:
        # Call PostgreSQL function
        matches = db.execute("""
            SELECT * FROM match_company_entity(%s, 0.4)
            ORDER BY similarity_score DESC
            LIMIT 1
        """, [entity])

        if matches and matches[0].similarity_score >= 0.5:
            company_sk = matches[0].company_sk

            # 3. Sentiment analysis
            sentiment = sentiment_model.analyze(article_text)

            # 4. Insert into fact table
            db.execute("""
                INSERT INTO fact_news_mentions
                    (company_sk, mention_date_id, article_title, source_name, sentiment_score)
                VALUES (%s, %s, %s, %s, %s)
            """, [company_sk, date_to_id(article_date), article_title, source, sentiment])
```

### Recommended Tools

| Component | Tool Options | Recommendation |
|-----------|--------------|----------------|
| **NER/Entity Extraction** | spaCy, Hugging Face, AWS Comprehend | spaCy (free, fast, good accuracy) |
| **Sentiment Analysis** | VADER, TextBlob, FinBERT | FinBERT (tuned for financial text) |
| **Embeddings** | OpenAI, Cohere, sentence-transformers | sentence-transformers (free, local) |
| **Vector Storage** | Pinecone, Weaviate, pgvector | pgvector (if using Postgres) |

### When to Implement

| Trigger | Action |
|---------|--------|
| "What's the news about Company X?" queries | Implement news pipeline |
| Innovation scoring needed | Integrate patent + publication data |
| Competitive intelligence required | Full unstructured pipeline |

**Current recommendation:** Design the schema now, implement when business need emerges.

---

## 10. Sample Analytics Queries

Common queries analysts would run against this schema:

### Query 1: Funding Funnel by Country
```sql
-- How many companies reach each funding stage by country?
SELECT
    c.country,
    f.round_type,
    COUNT(DISTINCT c.company_sk) as companies,
    SUM(f.amount_eur) as total_funding
FROM fact_funding_rounds f
JOIN dim_companies c ON f.company_sk = c.company_sk AND c.is_current = TRUE
GROUP BY c.country, f.round_type
ORDER BY c.country,
    CASE f.round_type
        WHEN 'seed' THEN 1
        WHEN 'series-a' THEN 2
        WHEN 'series-b' THEN 3
        ELSE 4
    END;
```

### Query 2: Time Between Rounds
```sql
-- Average months between funding rounds
WITH round_gaps AS (
    SELECT
        company_sk,
        round_date,
        LAG(round_date) OVER (PARTITION BY company_sk ORDER BY round_date) as prev_round,
        DATEDIFF('month', LAG(round_date) OVER (PARTITION BY company_sk ORDER BY round_date), round_date) as months_gap
    FROM fact_funding_rounds
)
SELECT
    c.country,
    AVG(rg.months_gap) as avg_months_between_rounds,
    MEDIAN(rg.months_gap) as median_months
FROM round_gaps rg
JOIN dim_companies c ON rg.company_sk = c.company_sk AND c.is_current = TRUE
WHERE rg.months_gap IS NOT NULL
GROUP BY c.country
ORDER BY avg_months_between_rounds;
```

### Query 3: Top Investors by Deal Count
```sql
-- Which investors participate in the most deals?
SELECT
    inv.value:name::STRING as investor_name,
    inv.value:type::STRING as investor_type,
    COUNT(*) as deal_count,
    SUM(f.amount_eur) as total_invested,
    COUNT(CASE WHEN inv.value:lead::BOOLEAN THEN 1 END) as lead_deals
FROM fact_funding_rounds f,
LATERAL FLATTEN(input => f.investors) inv
GROUP BY 1, 2
ORDER BY deal_count DESC
LIMIT 20;
```

### Query 4: Company State at Funding Date (SCD2 Use Case)
```sql
-- What was company's employee count when they raised Series A?
SELECT
    c.name,
    c.employee_count as employees_at_funding,
    f.round_date,
    f.amount_eur
FROM fact_funding_rounds f
JOIN dim_companies c ON f.company_sk = c.company_sk
    AND f.round_date BETWEEN c.valid_from AND COALESCE(c.valid_to, '9999-12-31')
WHERE f.round_type = 'series-a';
```

---

## 11. Summary

This design delivers:
- ✅ **Queryable data** for analysts (simple star schema)
- ✅ **Nested JSON handling** (arrays in fact/dimension tables)
- ✅ **Temporal tracking** (SCD Type 2 on companies)
- ✅ **Extensibility** (add fact tables for patents, publications, news)
- ✅ **Practical simplicity** (4 tables, not 7+)
- ✅ **Clear trade-offs** (documented what was rejected and why)

The design follows the principle: **as simple as possible, but no simpler.**

---

## Appendix A: Full Approach Comparison

See separate document: `approach-comparison.md`

## Appendix B: Sources

### Data Modeling Methodology
1. Kimball Group - Dimensional Modeling Techniques
2. Fivetran - Star Schema vs OBT Performance Study (25-50% faster queries for OBT)
3. Databricks - Lakehouse Modeling Playbook
4. dbt Labs - Activity Schema presentation (Coalesce 2021)
5. Matillion - Data Vault vs Star Schema vs 3NF comparison

### Implementation References
6. dbt Documentation - Snapshots (SCD Type 2)
7. Snowflake Documentation - FLATTEN function
8. Dealroom - API and data structure documentation

### VC Data Infrastructure
9. SignatureBlock - Data Revolution in Venture Capital (EQT Motherbrain, Tribe Capital)
10. Standard Metrics - Why Every VC Needs a Data Warehouse
