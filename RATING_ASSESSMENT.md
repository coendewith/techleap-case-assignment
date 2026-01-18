# Rating Assessment: Techleap Senior Data Analyst Case

Self-assessment against the **exact evaluation criteria** from the case PDF.

**Last Updated:** After major revisions to report, dashboard, and notebook

---

## Evaluation Criteria (from PDF)

| Component | Weight | Criteria |
|-----------|--------|----------|
| **Task 1: Analysis** | 50% | Insight quality, clarity of communication, honest about limitations |
| **Task 2: Design** | 30% | Practical data model, clear trade-off reasoning |
| **Tool Choices** | 20% | Justified tool selection, pragmatic approach |
| **Bonus** | Extra | Clean code, creative insights, thoughts on unstructured data |

---

## Task 1: Analysis (50%)

### What the Case Asked For:
1. **Tells a story** - patterns/trends that are meaningful
2. **Considers implications** - for policymakers and founders
3. **Acknowledges limitations** - what data can't tell us
4. **2-3 visualizations** supporting the narrative
5. **"What's Missing" section** - additional analysis, data, expertise needed

### Assessment

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Tells a story | ✅ | "What I Expected vs Found" + personal journey |
| Time between rounds | ✅ | NL 14.4 months vs Global 12.6 months |
| Sector/geography patterns | ✅ | Leiden vs Amsterdam (37.5% vs 3.6%) |
| Investor concentration | ⚠️ Partial | Data gap acknowledged (no investor names), funding type diversity analyzed |
| Survival rates | ✅ | Funnel analysis, cohort exit rates, 6.2% Seed→A |
| Policymaker implications | ✅ | "How Policymakers Think" mental model + 4 recommendations |
| Founder implications | ✅ | "How Founders Think" mental model + tactical advice |
| Limitations acknowledged | ✅ | "Where I'm Still Uncertain" table + confidence levels |
| 2-3 visualizations | ✅ | 16 figures generated, key ones embedded |
| "What's Missing" section | ✅ | Data gaps, external factors, "What I'd Do With More Time" |

### Insight Quality Score

| Finding | Novelty | Data Support | Actionable? |
|---------|---------|--------------|-------------|
| **Seed→A = 6.2%** (vs USA 16.1%) | **High** | Verified | Yes - intervention point |
| Leiden > Amsterdam (37.5% vs 3.6%) | **High** | Verified | Yes - cluster policy |
| Capital efficiency paradox (300x = 4pp) | **High** | Verified | Yes - founder quality focus |
| 2008 crisis hit NL 1.5x harder | Medium | Verified | Yes - counter-cyclical support |
| O3b + Mobileye = 47% of NL funding | Medium | Verified | Yes - data quality caveat |

**Insight Quality: 9.0/10**
- 4 counterintuitive findings that challenge conventional wisdom
- All insights are Dutch-specific and actionable
- Explicitly tested and rejected common assumptions

### Communication Score

| Aspect | Score | Notes |
|--------|-------|-------|
| Clarity | 9/10 | Clear structure, tables, bullets |
| Audience awareness | 9/10 | Policymaker AND founder mental models |
| Personal voice | 9/10 | "How I Got Here" journey, explicit uncertainty |
| Story arc | 9/10 | Hypothesis → Test → Finding → Pivot methodology |

**Communication: 9.0/10**

### Limitations Honesty Score

| What's Acknowledged | ✅/❌ |
|---------------------|-------|
| No investor names | ✅ |
| Data ends 2014 | ✅ |
| Exit valuations unknown | ✅ |
| Selection bias toward US | ✅ |
| External factors (regulations, rates) | ✅ + ECB analysis |
| O3b/Mobileye data concentration | ✅ |
| Sample size warnings | ✅ |
| Confidence intervals / uncertainty | ✅ (Where I'm Still Uncertain table) |

**Limitations Honesty: 9.0/10**

### Task 1 Overall: **9.0/10**

**Strengths:**
- 4 counterintuitive findings (vs "Valley of Death is real")
- Explicit hypothesis → test → finding → pivot structure
- Separate mental models for policymakers AND founders
- Honest about uncertainty (with confidence table)
- Personal narrative showing analytical journey

**Minor gaps:**
- Statistical confidence intervals not computed (bootstrap)
- Investor concentration analysis limited by data

---

## Task 2: Design (30%)

### What the Case Asked For:
1. **SQL-based data model** for nested JSON (funding_rounds, investors)
2. **Track company changes over time**
3. **Integrate additional sources** (patents, publications, news)
4. **Simple diagram or description**
5. **Trade-offs and extension notes**

### Assessment

| Requirement | Status | Evidence |
|-------------|--------|----------|
| SQL data model | ✅ | Simplified star schema (4 tables) |
| Handle nested arrays | ✅ | Multi-warehouse syntax (Snowflake, BigQuery, PostgreSQL, DuckDB) |
| Track changes over time | ✅ | SCD Type 2 on dim_companies |
| Additional sources | ✅ | 3-phase entity resolution approach |
| Simple diagram | ✅ | data-model.png + data-model.mmd |
| Trade-off reasoning | ✅ | Decision matrix with 8 alternatives evaluated |

### Technical Design Score

| Aspect | Score | Notes |
|--------|-------|-------|
| Schema correctness | 9/10 | Star schema is appropriate choice |
| JSON handling | 9/10 | 4 warehouse syntaxes provided |
| Temporal tracking | 9/10 | SCD Type 2 with late-arriving facts handling |
| Extensibility | 9/10 | Clear pattern for new fact tables |
| Practical for scale | 8/10 | Retention policy included |

**Technical Design: 8.8/10**

### Trade-off Reasoning Score

| Decision | Alternative Considered | Reasoning Clear? |
|----------|----------------------|------------------|
| Star schema | Data Vault, OBT, Full Kimball | ✅ Clear matrix |
| SCD Type 2 | Type 1, snapshot, Type 4 | ✅ Clear |
| Arrays in columns | Bridge tables | ✅ With PostgreSQL variant |
| dbt | Stored procedures, custom ETL | ✅ Clear |

**Trade-off Reasoning: 9.0/10**

### Task 2 Overall: **8.8/10**

**Strengths:**
- Every decision has explicit reasoning against alternatives
- Multi-warehouse syntax shows production awareness
- "What I'd Ask Before Building" shows consulting mindset
- Conceptual vs production distinction is clear

**Minor gaps:**
- No incremental processing strategy detail
- No explicit cost estimates

---

## Tool Choices (20%)

### Assessment

| Tool | Justification | Pragmatic? |
|------|---------------|------------|
| Python + Pandas | Industry standard, Techleap likely uses | ✅ |
| Jupyter Notebook | Narrative + code + analytical journey | ✅ |
| Matplotlib/Seaborn | Simple, reproducible, Techleap colors | ✅ |
| Next.js + Recharts | Interactive dashboard bonus | ✅ |
| Star Schema | Right complexity for team size | ✅ |
| dbt | Version control, testing, portability | ✅ |
| Markdown report | Accessible, git-trackable | ✅ |

### AI Tool Disclosure

| Aspect | Status |
|--------|--------|
| Disclosed in tools.md | ✅ |
| What AI was used for | ✅ Listed |
| What AI was NOT used for | ✅ Listed |
| Human validation stated | ✅ |

**Tool Choices: 8.5/10**

---

## Bonus Points

| Bonus Area | Status | Evidence |
|------------|--------|----------|
| Clean code | ✅ | Notebook runs end-to-end |
| Creative insights | ✅ | 4 counterintuitive findings |
| Unstructured data thoughts | ✅ | Design doc Section 9 |
| Interactive dashboard | ✅ | Next.js + Recharts with stakeholder tagging |
| Personal narrative | ✅ | "How I Got Here", "My Point of View" |

**Bonus: +0.7**

---

## Overall Assessment

### Weighted Calculation

| Component | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Task 1: Analysis | 50% | 9.0/10 | 4.50 |
| Task 2: Design | 30% | 8.8/10 | 2.64 |
| Tool Choices | 20% | 8.5/10 | 1.70 |
| **Subtotal** | 100% | - | **8.84** |
| Bonus | +7% | 0.7 | +0.70 |
| **Total** | - | - | **9.0/10** |

---

## What's Strong

### 1. Counterintuitive Findings That Challenge Conventional Wisdom
- "Dutch startups don't need more capital" (300x = 4pp)
- "Leiden beats Amsterdam 10x" (37.5% vs 3.6%)
- "Seed→A is the real crisis" (6.2% vs 16.1%)

### 2. Stakeholder-Specific Mental Models
- "How Policymakers Think" - budget cycles, political risk, metrics
- "How Founders Think" - opportunity cost, personal runway, location

### 3. Analytical Journey Transparency
- Explicit hypotheses tested and rejected
- "Where I'm Still Uncertain" with confidence levels
- "What I'd Do With More Time"

### 4. Personal Point of View
- "The Dutch startup ecosystem doesn't have a capital problem — it has a matching problem"
- Clear recommendation against conventional "more capital" narrative

---

## Minor Improvements Still Possible

| Improvement | Effort | Impact |
|-------------|--------|--------|
| Bootstrap confidence intervals | Medium | Low - adds statistical rigor |
| Interview quotes from founders | High | Medium - adds qualitative depth |
| Dealroom cross-validation | High | High - validates 2014 findings still hold |

---

## Honest Self-Assessment

**Current likelihood of impressing:**
- Analysis depth: 90%
- Communication: 90%
- Design thinking: 85%
- Overall: **88%**

**What hiring managers will notice:**
- ✅ Counterintuitive, data-supported findings
- ✅ Separate stakeholder mental models
- ✅ Honest about uncertainty and limitations
- ✅ Personal analytical journey with clear point of view
- ✅ Multi-warehouse SQL knowledge
- ⚠️ Data is 10+ years old (acknowledged)

**Bottom line:** Strong, memorable submission. The 4 counterintuitive findings + stakeholder mental models + personal point of view differentiate this from a generic "here's what the data shows" analysis.

---

## Comparison to "What Great Looks Like"

| Aspect | Current Submission | Excellent Submission |
|--------|-------------------|---------------------|
| Headline insight | Seed→A crisis (6.2%) | ✅ Match |
| Counterintuitive findings | 4 findings with data | ✅ Match |
| Data validation | O3b/Mobileye caveat | ✅ Match |
| Visualization | 16 charts + interactive dashboard | ✅ Exceeds |
| Length | Report + dashboard | ✅ Match |
| Voice | Clear POV, explicit uncertainty | ✅ Match |
| Stakeholder awareness | Dual mental models | ✅ Match |
