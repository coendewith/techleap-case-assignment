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
├── task-1-analysis/
│   ├── report.md                # Executive briefing (1-2 pages, 3 visualizations)
│   ├── analysis.ipynb           # Python analysis notebook
│   └── figures/                 # Generated visualizations
│
├── task-2-design/
│   ├── design-doc.md            # Data model design document
│   └── data-model.png           # Visual diagram
│
└── legacy/                      # Additional explorations (bonus, not required)
```

---

## Task 1: Data Analysis (50%)

**Report**: [task-1-analysis/report.md](task-1-analysis/report.md)

**Notebook**: [task-1-analysis/analysis.ipynb](task-1-analysis/analysis.ipynb)

### Key Findings

1. **Graduation Gap**: Dutch Seed→A is 6.2% vs 16.1% USA
2. **Rounds Matter**: 4+ rounds = 2x acquisition rate (capital alone doesn't fix it)
3. **Tortoise Effect**: 3+ year bootstrap = 1.6x better outcomes

**Recommendation**: Help companies complete rounds, not just get more money.

### How to Run

```bash
pip install pandas matplotlib numpy jupyter
cd task-1-analysis
jupyter notebook analysis.ipynb
```

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
