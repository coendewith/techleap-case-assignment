# Data Engineering Design

**Task**: Structure Dealroom's daily NDJSON exports (35-40GB, 4 files) for SQL-based analysis.

---

## The Data

Each record looks like this:

```json
{
  "company_id": "abc123",
  "name": "TechStartup B.V.",
  "industries": ["logistics", "artificial-intelligence"],
  "founding_date": "2018-03-15",
  "employee_count": 85,
  "total_funding_eur": 12500000,
  "funding_rounds": [
    {"date": "2019-06-01", "type": "seed", "amount_eur": 500000},
    {"date": "2023-09-01", "type": "series-b", "amount_eur": 8000000}
  ],
  "investors": [{"name": "Peak Capital", "type": "vc", "lead": true}],
  "headquarters": {"city": "Amsterdam", "country": "Netherlands"},
  "updated_at": "2024-01-15T08:30:00Z"
}
```

---

## How would you model this for SQL-based analysis?

I would split the data into separate tables using common identifiers (UUIDs).

Based on the sample data, I would create the following tables:

### Table 1: dim_company

| Column | Type | Description |
|--------|------|-------------|
| company_uuid | varchar | Primary key |
| name | varchar | Company name |
| industries | varchar[] | Array of industry tags |
| founding_date | date | When founded |
| employee_count | int | Current headcount |
| total_funding_eur | decimal | Cumulative funding |
| hq_city | varchar | Headquarters city |
| hq_country | varchar | Headquarters country |
| updated_at | timestamp | Source system timestamp |
| valid_from | timestamp | When this version became active |
| valid_to | timestamp | When superseded (NULL if current) |
| is_current | boolean | TRUE for latest version |

### Table 2: fact_funding

| Column | Type | Description |
|--------|------|-------------|
| funding_uuid | varchar | Primary key |
| company_uuid | varchar | FK → dim_company |
| investor_uuid | varchar | FK → dim_investor |
| funding_date | date | Round date |
| funding_type | varchar | seed, series-a, series-b, etc. |
| amount_eur | decimal | Amount raised |

### Table 3: dim_investor

| Column | Type | Description |
|--------|------|-------------|
| investor_uuid | varchar | Primary key |
| investor_name | varchar | e.g., "Peak Capital" |
| investor_type | varchar | vc, angel, corporate, etc. |
| is_lead | boolean | Lead investor in the round |

---

## How would you handle the nested arrays (funding_rounds, investors)?

For ease of querying, there should be a separate table for company data, funding data, and investor data.

- For investors: create an `investor_uuid` to uniquely identify each investor
- For funding data: create a `funding_uuid`, but also include the `company_uuid` and `investor_uuid` as foreign keys

This way, a single funding round with multiple investors becomes multiple rows in `fact_funding`—one per investor. This allows queries like "all rounds where Peak Capital participated."

---

## What if we want to track how companies change over time?

`dim_company` should have an `is_current` boolean where the most recent record is set to `TRUE` and all old records are set to `FALSE`.

This way we:
- Maintain historical records
- Can track changes such as total funding, headquarters city/country, and even name changes
- Always know which record is the current state

When Dealroom sends updated data:
1. Compare to existing records
2. If anything changed, insert a new row with `is_current = TRUE`
3. Mark the old row as `is_current = FALSE` and set `valid_to` to the current timestamp

---

## How would you integrate additional data sources?

For patents, scientific publications, and news articles, I would create dedicated tables:

### dim_patents

| Column | Type | Description |
|--------|------|-------------|
| patent_uuid | varchar | Primary key |
| company_uuid | varchar | FK → dim_company |
| patent_office | varchar | USPTO, EPO, etc. |
| patent_date | date | Filing/grant date |
| is_pending | boolean | Pending vs granted |
| updated_at | timestamp | Last update |
| is_current | boolean | For tracking changes |

### fact_news_articles

| Column | Type | Description |
|--------|------|-------------|
| article_uuid | varchar | Primary key |
| company_uuid | varchar | FK → dim_company |
| article_date | date | Publication date |
| news_outlet | varchar | Source name |
| sentiment_score | decimal | -1 to +1 sentiment |

### fact_publications

| Column | Type | Description |
|--------|------|-------------|
| publication_uuid | varchar | Primary key |
| company_uuid | varchar | FK → dim_company |
| publication_date | date | Publication date |
| title | varchar | Paper title |
| source | varchar | Journal/conference |

---

## Trade-offs

| Decision | Alternative | Why I Chose This |
|----------|-------------|------------------|
| Separate `dim_investor` table | Keep investors as JSON array | Enables "all deals by Investor X" queries |
| No `dim_date` table | Traditional date dimension | Modern warehouses handle date functions natively |
| SCD Type 2 for companies | Overwrite with latest data | Need to track how companies change over time |
| Separate tables per data source | Generic catch-all table | Each source has unique attributes (patents have `is_pending`, news has `sentiment_score`) |
| UUIDs as keys | Auto-increment integers | Portable across systems, no collision risk |

---

## Data Model Diagram

![Data Model](data-model.png)

```dbml
// Core tables
Table dim_company {
  company_uuid varchar [pk]
  name varchar
  industries "varchar[]"
  founding_date date
  employee_count int
  total_funding_eur decimal
  hq_city varchar
  hq_country varchar
  updated_at timestamp
  valid_from timestamp
  valid_to timestamp
  is_current boolean
}

Table dim_investor {
  investor_uuid varchar [pk]
  investor_name varchar
  investor_type varchar
  is_lead boolean
}

Table fact_funding {
  funding_uuid varchar [pk]
  company_uuid varchar [ref: > dim_company.company_uuid]
  investor_uuid varchar [ref: > dim_investor.investor_uuid]
  funding_date date
  funding_type varchar
  amount_eur decimal
}

// Additional data sources
Table dim_patents {
  patent_uuid varchar [pk]
  company_uuid varchar [ref: > dim_company.company_uuid]
  patent_office varchar
  patent_date date
  is_pending boolean
  updated_at timestamp
  is_current boolean
}

Table fact_news_articles {
  article_uuid varchar [pk]
  company_uuid varchar [ref: > dim_company.company_uuid]
  article_date date
  news_outlet varchar
  sentiment_score decimal
}

Table fact_publications {
  publication_uuid varchar [pk]
  company_uuid varchar [ref: > dim_company.company_uuid]
  publication_date date
  title varchar
  source varchar
}
```

---

*A simple solution that works beats a complex solution that doesn't get built.*
