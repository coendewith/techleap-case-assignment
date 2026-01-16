---
marp: true
theme: default
paginate: true
backgroundColor: #fff
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  h1 {
    color: #1a365d;
  }
  h2 {
    color: #3182ce;
  }
  .highlight {
    color: #d69e2e;
    font-weight: bold;
  }
---

<!-- _class: lead -->
<!-- _backgroundColor: #1a365d -->
<!-- _color: white -->

# Supporting the Dutch Startup Ecosystem

## Data-Driven Insights for Policy

**Ministry of Economic Affairs Briefing**

Techleap | January 2026

---

# Executive Summary

### Three Key Findings

1. **The Valley of Death**: 59% of startups never get a second funding round

2. **More Rounds = Success**: Companies with 4+ rounds have 3x higher acquisition rates

3. **Netherlands Position**: Competitive funding levels, room for growth in follow-on investment

### Recommendation
Focus policy on **bridging seed-to-Series A gap** and **encouraging follow-on investment**

---

# The Dutch Ecosystem at a Glance

| Metric | Netherlands | Global Average |
|--------|-------------|----------------|
| Companies in Dataset | 307 | - |
| Total Funding | $4.04B | - |
| Average per Company | $13.2M | $15.9M |
| Operating Rate | **86%** | 77% |
| Avg Funding Rounds | 1.57 | 1.70 |

**Strong survival rate, but fewer follow-on rounds than peers**

---

# Global Benchmark: Netherlands vs Peers

![bg right:55% 90%](figures/03_peer_benchmark.png)

### Key Observations

- Netherlands **outperforms** Germany and France on avg funding

- **Israel** leads in funding rounds per company

- Room to improve **follow-on investment** culture

---

# The Funding Funnel Problem

![bg right:60% 95%](figures/01_funding_funnel.png)

### The Valley of Death

- **54,294** total companies
- Only **25%** get seed funding
- Only **17%** reach Series A
- Only **5%** reach Series C

**Most startups die between rounds**

---

# Why Multiple Rounds Matter

![bg right:55% 90%](figures/02_outcomes_by_rounds.png)

### Outcomes by Funding Rounds

| Rounds | Acquired | Closed |
|--------|----------|--------|
| 1 | 4.5% | 6.2% |
| 3 | 9.8% | 3.8% |
| 5 | 14.2% | 2.1% |

**More investment = better exits**

---

# Sector Focus: Where to Invest

![bg right:55% 90%](figures/05_sector_analysis.png)

### Dutch Sector Strengths

1. **Biotechnology** - High funding, long cycles
2. **Software** - Many companies, faster growth
3. **Clean Technology** - Strategic priority
4. **E-Commerce** - Proven market

**Biotech attracts 3x more funding per company than Software**

---

# Market Resilience: 2008 Crisis Recovery

![bg right:60% 95%](figures/04_funding_timeline.png)

### Timeline Insights

- **2008-2009**: Crisis dip
- **2010-2013**: Strong recovery
- **Peak**: 8,972 new fundings in 2013

**Ecosystems recover when supported**

---

# Policy Recommendations

### 1. Bridge the Valley of Death
Create bridge funding programs for post-seed companies

### 2. Encourage Follow-on Investment
Tax incentives for investors who provide multiple rounds

### 3. Sector Focus
Continue Biotech and Clean Tech support

### 4. Exit Preparation
Programs to prepare companies for acquisition/IPO

---

# What We Need Next

### Data Gaps
- Investor concentration metrics
- Time between rounds
- Revenue/employee growth
- Exit valuations

### Recommended Actions
1. Integrate **Dealroom** data (current, Dutch-focused)
2. Add **KvK** data (company health metrics)
3. Include **patent/publication** data (innovation metrics)
4. **Interview** key investors and founders

---

<!-- _class: lead -->
<!-- _backgroundColor: #1a365d -->
<!-- _color: white -->

# Thank You

## Questions?

**Contact**: Techleap Data Analysis Team

*Full analysis code and methodology available on request*

---

# Appendix: Methodology

### Data Source
- Crunchbase startup investments dataset (Kaggle)
- 54,294 companies, 115 countries, 753 market categories
- Time period: 2005-2014

### Tools Used
- Python (pandas, matplotlib, seaborn)
- Jupyter Notebook for reproducibility

### Limitations
- Data ends in 2014
- No investor identity data
- No revenue/employee metrics
- Western/English-language bias
