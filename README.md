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
│   ├── report.md                # Executive briefing (1 page)
│   └── v2/
│       ├── analysis.ipynb       # SIMPLE: 4 findings, clean code
│       ├── analysis_full.ipynb  # ADVANCED: All explorations + McKinsey frameworks
│       └── data/                # JSON exports
│
└── task-2-design/
    ├── design-doc.md            # Data model design
    ├── data-model.mmd           # Mermaid diagram
    └── data-model.png           # Visual diagram
```

---

## Task 1: Data Analysis

### Report
**File**: [task-1-analysis/report.md](task-1-analysis/report.md) (1 page)

### Key Findings
1. **Graduation Gap**: Dutch Seed→A is 6.2% vs 16.1% USA
2. **Capital Doesn't Fix It**: 300x funding = 4pp better outcomes
3. **Rounds Matter**: 4+ rounds = 2x acquisition rate
4. **Tortoise Effect**: 3+ year bootstrap = 1.6x better

### Notebooks

| Notebook | Purpose |
|----------|---------|
| `analysis.ipynb` | **For review**: Simple, 4 findings, clear reasoning |
| `analysis_full.ipynb` | **Bonus exploration**: McKinsey/Harvard frameworks, survival analysis, statistical tests, Dutch sector deep-dive |

**Recommendation**: Help companies complete rounds, not just get more money.

---

## Task 2: Data Engineering

**File**: [task-2-design/design-doc.md](task-2-design/design-doc.md)

**Approach**: Star schema (4 tables) with SCD Type 2 on companies.

**Why simple**: Bridge tables add complexity without proportional value.

---

## How to Run

```bash
pip install pandas matplotlib numpy jupyter
jupyter notebook task-1-analysis/v2/analysis.ipynb
```

---

## Tool Choices

See [tools.md](tools.md) — includes honest AI usage disclosure.

---

*"A simple solution with clear reasoning beats a complex solution you can't explain."*
