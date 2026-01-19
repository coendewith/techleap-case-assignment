# Techleap Senior Data Analyst Case Study

**Author**: Coen de With | **Date**: January 2026

---

## Repository Structure

```
techleap/
├── README.md                    # This file
├── tools.md                     # Tool choices + AI disclosure
├── investments_VC.csv           # Source data (48K companies)
│
├── task-1-analysis/             # DELIVERABLES
│   ├── report.pdf               # Executive briefing (1-2 pages)
│   ├── analysis.ipynb           # Full analysis notebook
│   └── figures/                 # Visualizations
│
├── task-2-design/               # DELIVERABLES
│   ├── design-doc.md            # Data model design document
│   └── data-model.png           # Visual diagram
│
└── legacy/                      # Working files (not required)
    └── task-1-analysis/
```

---

## Task 1: Data Analysis

### Final Deliverables

| File | Description |
|------|-------------|
| [report.pdf](task-1-analysis/report.pdf) | Executive briefing for Ministry of Economic Affairs |
| [analysis.ipynb](task-1-analysis/analysis.ipynb) | Full analysis notebook with visualizations |

### Key Findings

1. **The Valley of Death**: Dutch Seed→A conversion is 6.2% vs EU peers 9.2%, USA 16.1%, Israel 21.9%
2. **Playing It Small**: NL ranks last on failure rate (4.3%), median funding ($1.0M), and exit rate (4.3%)
3. **The Opportunity Cost**: ~9 potential scale-ups lost per year due to lower conversion rates

### Policy Recommendations

1. **Yozma-style program**: €100M fund-of-funds requiring international VC partners
2. **Dutch SEIS**: 30-50% tax relief on seed investments (mirrors UK model)
3. **SBIC-style leverage**: Government-guaranteed loans to multiply private capital

### How to Run

```bash
pip install pandas matplotlib numpy jupyter
cd task-1-analysis
jupyter notebook analysis.ipynb
```

---

## Task 2: Data Engineering

### Deliverables

| File | Description |
|------|-------------|
| [design-doc.md](task-2-design/design-doc.md) | Data model design with trade-offs |
| [data-model.png](task-2-design/data-model.png) | Visual diagram |

### Approach

- **Star schema** with SCD Type 2 on `dim_company`
- **Separate funding tables**: `fact_funding_round` + `fact_funding_participation` (preserves round as single event)
- **Stack**: BigQuery/Snowflake + dbt + dbt Cloud

---

## Tool Choices

See [tools.md](tools.md) — includes honest AI usage disclosure.

---

*"A simple solution that works beats a complex solution that doesn't get built."*
