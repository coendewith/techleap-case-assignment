# Data Modeling Approach Comparison for Techleap Task 2

## Context Recap: What Does Techleap Actually Need?

From the case study:
- **Data volume:** 35-40GB daily NDJSON exports (4 files)
- **Source:** Dealroom data (startup ecosystem)
- **Deliverable:** "Simple diagram or description" + "brief notes"
- **Evaluation:** "Practical data model, clear trade-off reasoning" (30% weight)
- **Key phrase:** "We're looking for your thinking, not a production-ready design"
- **Use case:** Make data queryable for analysts (ecosystem reports, ministry briefings)
- **Team size:** Small nonprofit analytics team at Techleap

---

## 8 Data Modeling Approaches Compared

### Approach 1: Star Schema with Bridge Tables (Kimball)

**Description:** Central fact table (funding_rounds) surrounded by dimension tables (companies, investors, industries), with bridge tables to resolve many-to-many relationships. SCD Type 2 for temporal tracking.

**Pros:**
- Industry standard since 1996 - universally understood
- Excellent for BI tools (Looker, Tableau, Power BI)
- Handles historical tracking natively via SCD Type 2
- Clean separation of concerns (facts vs dimensions)
- Extensible - can add new dimensions/facts easily
- Well-documented patterns for M:N relationships (bridge tables)

**Cons:**
- Requires multiple tables (7+ in our design)
- Bridge tables add join complexity
- SCD Type 2 increases storage and ETL complexity
- Overkill for a small team with simple reporting needs
- Requires understanding of dimensional modeling concepts
- ETL pipeline more complex than alternatives

**Best For:** Enterprise BI, regulated industries, complex historical analysis

**Complexity Score:** 7/10
**Time to Implement:** 4-5 weeks

---

### Approach 2: One Big Table (OBT) / Wide Table

**Description:** Single denormalized table containing all company attributes, with funding rounds and investors flattened into repeated columns or arrays.

**Pros:**
- Maximum simplicity - one table to query
- No joins required - fastest query performance (25-50% faster per Fivetran study)
- Easy for analysts to understand
- Quick to implement (days, not weeks)
- Works excellently with modern columnar databases
- Low maintenance burden

**Cons:**
- Historical tracking is complex (no native SCD support)
- High data redundancy and storage costs
- M:N relationships are awkward (repeated columns or arrays)
- Difficult to maintain as schema evolves
- Not suitable if you need "company state at funding date" analysis
- Data governance challenges (all data in one place)

**Best For:** Small teams, rapid prototyping, ML feature stores, simple current-state reporting

**Complexity Score:** 2/10
**Time to Implement:** 1 week

---

### Approach 3: Simplified Star Schema (No Bridge Tables)

**Description:** Star schema but with arrays/JSON stored in dimension tables instead of separate bridge tables. Leverage modern warehouse native JSON support.

**Pros:**
- Fewer tables than full Kimball (4-5 vs 7+)
- Still gets benefits of dimensional modeling
- Modern warehouses handle JSON arrays natively
- Simpler ETL than full normalization
- Easier for analysts than full bridge table approach
- Balances structure with simplicity

**Cons:**
- Arrays in dimensions limit some aggregation patterns
- Less flexible for investor-level analytics
- Not "pure" Kimball - may confuse experienced DW practitioners
- JSON querying syntax varies by warehouse

**Best For:** Teams wanting structure without full complexity

**Complexity Score:** 5/10
**Time to Implement:** 2-3 weeks

---

### Approach 4: Data Vault 2.0

**Description:** Highly normalized model with Hubs (business keys), Links (relationships), and Satellites (attributes). Designed for enterprise-scale integration and full audit trails.

**Pros:**
- Best-in-class for audit trails and compliance
- Highly scalable and flexible
- Excellent for multiple source integration
- Full historical tracking by design
- Parallel development possible
- Handles schema changes gracefully

**Cons:**
- Most complex to implement and understand
- Requires specialized expertise
- Many tables (typically 2-3x more than star schema)
- Query performance requires optimization (PIT tables, bridge tables)
- Massive overkill for single-source ecosystem data
- Long implementation timeline (months)

**Best For:** Large enterprises, regulated industries (finance, healthcare), multi-source EDW

**Complexity Score:** 10/10
**Time to Implement:** 3-6 months

---

### Approach 5: Activity Schema

**Description:** Single time-series table with ~11 columns representing all business events. Uses temporal joins instead of foreign keys.

**Pros:**
- Extremely simple structure (one table)
- Designed for messy data without clean FKs
- Easy to add new event types
- Good for behavioral/event analytics
- True ad-hoc querying across events

**Cons:**
- Requires temporal join logic (different SQL patterns)
- Not widely adopted - limited tooling support
- Better suited for event streams than entity-centric data
- Doesn't map well to "company" as central entity
- Limited BI tool compatibility
- Unfamiliar to most analysts

**Best For:** Event-driven businesses (SaaS, e-commerce), product analytics

**Complexity Score:** 4/10 (structure) but 7/10 (query patterns)
**Time to Implement:** 2-3 weeks

---

### Approach 6: 3NF (Inmon/Normalized)

**Description:** Fully normalized relational model minimizing redundancy. Enterprise Data Warehouse approach.

**Pros:**
- Maximum data integrity
- Minimum storage (no redundancy)
- Academically "correct" design
- Good for OLTP-style access patterns

**Cons:**
- Complex queries with many joins
- Poor BI tool compatibility
- Slow analytical query performance
- Not designed for OLAP workloads
- Harder for business users to understand
- Requires extensive transformation for reporting

**Best For:** Source system integration layer, never as final reporting layer

**Complexity Score:** 8/10
**Time to Implement:** 4-6 weeks

---

### Approach 7: Snowflake Schema

**Description:** Star schema with normalized dimension tables (dimensions broken into sub-dimensions).

**Pros:**
- Lower storage than star schema
- Better data integrity than star
- Handles complex hierarchies

**Cons:**
- More joins than star schema
- Slower queries
- Higher maintenance
- Kimball himself recommends against it in most cases
- Complexity without proportional benefit

**Best For:** Almost never recommended in modern practice

**Complexity Score:** 8/10
**Time to Implement:** 4-5 weeks

---

### Approach 8: Hybrid: OBT on Star Schema Foundation

**Description:** Build a lightweight star schema as the semantic layer, then materialize OBTs for specific use cases (e.g., one wide "companies_with_funding" table).

**Pros:**
- Best of both worlds: structure + simplicity
- Star schema provides single source of truth
- OBTs provide fast analyst access
- Can handle historical tracking in star, current-state in OBT
- Flexible - add more OBTs as needs emerge
- Recommended by many practitioners (Hightouch, dbt community)

**Cons:**
- Two layers to maintain
- Potential for OBT to drift from source star schema
- More storage than pure star or pure OBT
- Requires discipline to keep in sync

**Best For:** Teams that need both governed reporting and analyst flexibility

**Complexity Score:** 6/10
**Time to Implement:** 3-4 weeks

---

## Weighted Scoring Matrix

| Criterion | Weight | Star+Bridge | OBT | Simple Star | Data Vault | Activity | 3NF | Snowflake | Hybrid |
|-----------|--------|-------------|-----|-------------|------------|----------|-----|-----------|--------|
| **Simplicity for analysts** | 25% | 6 | 10 | 8 | 3 | 5 | 4 | 5 | 8 |
| **Implementation speed** | 20% | 5 | 10 | 7 | 2 | 6 | 4 | 4 | 6 |
| **Historical tracking** | 15% | 10 | 3 | 7 | 10 | 6 | 8 | 9 | 8 |
| **Extensibility** | 15% | 9 | 4 | 7 | 10 | 6 | 8 | 8 | 8 |
| **Query performance** | 10% | 7 | 10 | 8 | 5 | 7 | 4 | 6 | 9 |
| **Industry recognition** | 10% | 10 | 6 | 7 | 8 | 4 | 7 | 6 | 7 |
| **Small team suitability** | 5% | 5 | 10 | 8 | 2 | 5 | 4 | 4 | 7 |

### Weighted Scores:

| Approach | Score |
|----------|-------|
| **OBT** | **7.65** |
| **Hybrid (OBT on Star)** | **7.55** |
| **Simplified Star Schema** | **7.35** |
| **Star Schema + Bridge** | 7.00 |
| Activity Schema | 5.70 |
| Data Vault | 5.45 |
| 3NF | 5.30 |
| Snowflake Schema | 5.85 |

---

## Analysis: What Does Techleap Actually Need?

### Critical Requirements (from the case):
1. ✅ Make data queryable for analysts
2. ✅ Handle nested JSON (funding_rounds, investors, industries)
3. ✅ Support "how companies change over time" analysis
4. ✅ Extensible for additional data sources (patents, publications, news)
5. ✅ "Practical" - not over-engineered
6. ✅ Clear trade-off reasoning (the actual deliverable)

### What Eliminates Approaches:

| Approach | Eliminated? | Reason |
|----------|-------------|--------|
| Data Vault | ❌ ELIMINATED | Massive overkill for single-source nonprofit |
| 3NF | ❌ ELIMINATED | Not suitable for analytics/reporting |
| Snowflake Schema | ❌ ELIMINATED | Complexity without benefit |
| Activity Schema | ❌ ELIMINATED | Poor fit for entity-centric (company) data |
| Full Star + Bridge | ⚠️ BORDERLINE | May signal over-engineering for case |

### Top 3 Candidates:

1. **OBT** - Fastest, simplest, but struggles with historical tracking
2. **Simplified Star Schema** - Good balance, but still 4-5 tables
3. **Hybrid** - Most flexible but more complex explanation

---

## Recommendation for Techleap

### Winner: **Simplified Star Schema with Native JSON Arrays**

**Why this approach:**

1. **Matches the ask:** "Simple diagram or description" - 4 tables is digestible
2. **Handles the requirements:**
   - Nested JSON → Funding rounds as fact table, industries/investors as JSON arrays in dimension
   - Temporal tracking → SCD Type 2 on companies (dbt snapshots)
   - Extensibility → Add new fact tables (patents, publications) linked via company_id
3. **Not over-engineered:** No bridge tables, no Data Vault complexity
4. **Shows trade-off thinking:** Can explain why NOT full normalization, why NOT OBT
5. **Industry credible:** Based on Kimball but adapted for modern stack

### The Simplified Design:

```
┌─────────────────────────────────────────────────────────────────┐
│                    dim_companies (SCD Type 2)                   │
│  • company_id, name, founding_date, employee_count              │
│  • city, country                                                │
│  • industries[] (JSON array - no bridge table needed)           │
│  • valid_from, valid_to, is_current                             │
└─────────────────────────────────────────────────────────────────┘
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    fact_funding_rounds                           │
│  • funding_round_id, company_id (FK)                            │
│  • round_date, round_type, amount_eur                           │
│  • investors[] (JSON array with lead flag)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    dim_date (standard)                           │
│  • date_key, full_date, year, quarter, month                    │
└─────────────────────────────────────────────────────────────────┘

Future extensions:
┌─────────────────────────────────────────────────────────────────┐
│  fact_patents, fact_publications, fact_news_mentions            │
│  (all linked via company_id)                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Trade-offs to Articulate:

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Industries/Investors | JSON arrays, not bridge tables | Less flexible aggregation, but simpler schema and faster queries |
| Temporal tracking | SCD Type 2 only on companies | Storage cost, but enables "company state at funding date" |
| Fact grain | One row per funding round | Requires aggregation for company-level totals |
| Investor deduplication | Deferred to future phase | Acknowledge the problem, note fuzzy matching as enhancement |

### Why Not OBT?

Even though OBT scored highest, it fails the **"track how companies change over time"** requirement. The case explicitly asks for temporal analysis, which OBT handles poorly. This is the critical disqualifier.

### Why Not Full Star + Bridge?

Bridge tables are elegant but add complexity without proportional value for Techleap's use case. If analysts rarely need "all funding rounds where Investor X participated as lead," the bridge table is premature optimization.

---

## Implementation Note

For the actual Techleap submission, I recommend:

1. **Design doc:** Present the simplified star schema (4 tables)
2. **Diagram:** Clean Mermaid ERD showing the relationships
3. **Trade-off section:** Explicitly state what was NOT done and why
4. **Extension section:** Show how patents/publications would add
5. **Questions section:** Ask about investor deduplication rules, query patterns

This demonstrates **practical thinking** (the actual evaluation criterion) rather than textbook recitation.
