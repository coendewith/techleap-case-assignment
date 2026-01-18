# Data Engineering Design

**Task**: Structure Dealroom's NDJSON data (35-40GB) for SQL-based analysis.

---

## The Challenge

Dealroom data looks like this:
```json
{
  "company_id": "abc123",
  "name": "TechStartup B.V.",
  "industries": ["logistics", "ai"],
  "employee_count": 85,
  "total_funding_eur": 12500000,
  "funding_rounds": [
    {"date": "2019-06-01", "type": "seed", "amount_eur": 500000},
    {"date": "2023-09-01", "type": "series-b", "amount_eur": 8000000}
  ],
  "investors": [{"name": "Peak Capital", "type": "vc", "lead": true}]
}
```

**Three problems to solve:**
1. Nested arrays (funding_rounds, investors) → SQL doesn't like nested data
2. Track changes over time → Employee count changes, funding totals grow
3. Keep it simple → Small team can't maintain 15 tables

---

## My Approach: Star Schema (4 Tables)

```
┌─────────────────────┐       ┌─────────────────────┐
│    dim_companies    │       │      dim_date       │
│  (SCD Type 2)       │       │                     │
├─────────────────────┤       ├─────────────────────┤
│ company_sk (PK)     │       │ date_sk (PK)        │
│ company_id          │       │ full_date           │
│ name                │       │ year, quarter, month│
│ industries []       │       └─────────────────────┘
│ employee_count      │
│ total_funding_eur   │
│ city, country       │
│ valid_from          │──┐
│ valid_to            │  │
│ is_current          │  │
└─────────────────────┘  │
         │               │
         │ 1:N           │
         ▼               │
┌─────────────────────┐  │
│ fact_funding_rounds │  │
├─────────────────────┤  │
│ funding_sk (PK)     │  │
│ company_sk (FK) ────┼──┘
│ round_date          │
│ round_type          │
│ amount_eur          │
│ investors [] (JSON) │
└─────────────────────┘
```

---

## Why This Design?

### Decision 1: Flatten funding_rounds into a fact table

**Problem**: Can't query nested arrays in SQL
**Solution**: One row per funding round

```sql
-- Now I can easily ask: "Show all Series A rounds in 2023"
SELECT * FROM fact_funding_rounds
WHERE round_type = 'series-a' AND YEAR(round_date) = 2023
```

### Decision 2: Keep investors as JSON array (not a separate table)

**Trade-off**:
- ✅ Simple—no bridge table complexity
- ❌ Can't easily get "all deals by Investor X"

**Why acceptable**: Most analysis is company-centric, not investor-centric. If investor analytics become critical, add a bridge table later.

### Decision 3: SCD Type 2 on companies (track history)

**Problem**: "What was company X's employee count when they raised Series A?"
**Solution**: Store snapshots with valid_from/valid_to dates

```sql
-- Find company state at time of funding
SELECT c.name, c.employee_count, f.amount_eur
FROM dim_companies c
JOIN fact_funding_rounds f ON c.company_sk = f.company_sk
WHERE f.round_date BETWEEN c.valid_from AND c.valid_to
```

---

## How to Load It (dbt)

```
dealroom_raw.ndjson
       │
       ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ stg_companies│───▶│dim_companies │───▶│    dbt       │
│              │    │  (snapshot)  │    │  snapshots   │
└──────────────┘    └──────────────┘    └──────────────┘
       │
       ▼
┌──────────────┐
│stg_funding   │───▶ LATERAL FLATTEN (investors array)
│   _rounds    │
└──────────────┘
```

**dbt snapshots** handle SCD Type 2 automatically—no manual SQL needed.

---

## Extending for Additional Data Sources

**Patent filings, publications, news articles?**

Add a `fact_external_mentions` table:

```
┌─────────────────────┐
│ fact_external_      │
│     mentions        │
├─────────────────────┤
│ mention_sk (PK)     │
│ company_sk (FK)     │  ← Link to dim_companies
│ source_type         │  ← "patent", "publication", "news"
│ mention_date        │
│ title               │
│ url                 │
│ sentiment_score     │
└─────────────────────┘
```

**Challenge**: Matching unstructured mentions to companies.
**Solution**: Fuzzy matching on company names using pg_trgm (PostgreSQL) or similar.

---

## Trade-offs Summary

| I Chose | Over | Because |
|---------|------|---------|
| 4 tables | 7+ tables with bridges | Small team can actually maintain it |
| JSON arrays for investors | Separate investor dimension | Most queries are company-centric |
| SCD Type 2 | Full Data Vault | Tracks history without enterprise complexity |
| Star schema | One Big Table | Need temporal queries the OBT can't handle |

---

## What I'd Ask Before Building

1. **Top 5 analyst questions?** → Drives indexing choices
2. **Need investor-level rollups?** → Determines if bridge table is needed
3. **How far back for history?** → Affects snapshot retention
4. **Who maintains this?** → Team size determines complexity ceiling

---

*A simple solution that works beats a complex solution that doesn't get built.*
