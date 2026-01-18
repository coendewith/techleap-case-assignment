# Techleap Senior Data Analyst Case Study

**Author**: Coen de With | **Date**: January 2026

---

## Repository Structure

```
techleap/
├── README.md                    # This file
├── tools.md                     # Tool choices + AI disclosure
├── investments_VC.csv           # Source data
│
├── task-1-analysis/             # ⭐ FINAL DELIVERABLES
│   ├── report.md                # Executive briefing (1-2 pages)
│   ├── analysis.ipynb           # Final analysis notebook (Tufte-style viz)
│   └── figures/                 # 3 polished visualizations
│
├── task-2-design/               # ⭐ FINAL DELIVERABLES
│   ├── design-doc.md            # Data model design document
│   └── data-model.png           # Visual diagram
│
└── legacy/                      # 📊 EXPLORATORY (bonus, not required)
    └── task-1-analysis/
        ├── analysis.ipynb       # Extended analysis (all countries, full funnel)
        └── figures/             # 20+ exploratory visualizations
```

---

## Task 1: Data Analysis (50%)

### Final Deliverables

| File | Description |
|------|-------------|
| [report.md](task-1-analysis/report.md) | Executive briefing for Ministry of Economic Affairs |
| [analysis.ipynb](task-1-analysis/analysis.ipynb) | Final notebook with Tufte-style visualizations |
| [figures/](task-1-analysis/figures/) | 3 professional charts (colorblind-friendly) |

### Key Findings

1. **Graduation Gap**: Dutch Seed→A is 6.2% vs 9.0% European peers (USA: 15.8%)
2. **Rounds Matter**: 4+ rounds = 2x acquisition rate (capital alone doesn't fix it)
3. **Tortoise Effect**: 3+ year bootstrap = 1.6x better outcomes

**Recommendation**: Help companies complete rounds, not just get more money.

### Visualization Style

Charts use **Tufte principles** + **Okabe-Ito colorblind-friendly palette**:
- High data-ink ratio (no chartjunk)
- Direct labeling on data
- Insight-driven titles

### How to Run

```bash
pip install pandas matplotlib numpy jupyter
cd task-1-analysis
jupyter notebook analysis.ipynb
```

### Exploratory Analysis (Bonus)

See [legacy/task-1-analysis/](legacy/task-1-analysis/) for:
- Full funding funnel for **all 38 countries** (Seed→A→B→C→D)
- Country ranking heatmaps
- Survival curve analysis
- McKinsey frameworks

---

## Task 2: Data Engineering (30%)

**Design Doc**: [task-2-design/design-doc.md](task-2-design/design-doc.md)

**Diagram**: [task-2-design/data-model.png](task-2-design/data-model.png)

**Approach**: Star schema (4 tables) with SCD Type 2 on companies.

**Why simple**: Bridge tables add complexity without proportional value for this use case.

---

## Tool Choices (20%)

See [tools.md](tools.md) — includes honest AI usage disclosure.

---

*"A simple solution with clear reasoning beats a complex solution you can't explain."*
