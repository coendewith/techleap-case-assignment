# Task 2: Data Engineering Design Document (Revised)

## Executive Summary

This document presents a **simplified star schema** for Techleap's Dealroom data pipeline. After evaluating 8 different data modeling approaches (see Appendix A), this design balances simplicity with analytical capability—avoiding both over-engineering (Data Vault, full bridge tables) and under-engineering (pure OBT without historical tracking).

**Key insight:** Techleap's Finder platform is already powered by Dealroom.co, making alignment with their data structure natural.

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
| **Bridge tables for M:N relationships** | Adds 2+ tables and join complexity; JSON arrays in modern warehouses handle this adequately |
| **Investor deduplication** | Real problem ("a16z" vs "Andreessen Horowitz"), but premature optimization—note it as future enhancement |
| **Streaming/CDC architecture** | Case specifies daily batch exports; streaming adds unnecessary complexity |
| **Full medallion architecture detail** | Focus is on data model, not pipeline orchestration |

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

## 7. Questions I Would Ask

Before finalizing implementation:

1. **Query patterns:** What are the top 5 questions analysts ask? (Informs indexing/clustering)
2. **Investor analysis depth:** Do you need "all deals by Investor X"? (Would justify bridge table)
3. **History depth:** How far back do you need company-state-at-funding-date analysis?
4. **Refresh timing:** Is daily sufficient? Some dashboards might need intraday.
5. **Deduplication rules:** How should we handle "Peak Capital" vs "PEAK" vs "Peak Capital B.V."?

---

## 8. Summary

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
