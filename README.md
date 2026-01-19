# Techleap Senior Data Analyst Case Study

**Author**: Coen de With | **Date**: January 2025

---

## Repository Structure

```
techleap/
├── README.md                    # This file
├── tools.md                     # Tool choices + AI disclosure
├── investments_VC.csv           # Source data (see Data Source below)
│
├── task-1-analysis/             # DELIVERABLES
│   ├── Analysis_Deck.pdf        # Main deliverable - slide deck
│   ├── Analysis_2pager.pdf      # Optional: 2-page executive summary
│   ├── report.md                # Optional: markdown version
│   ├── analysis.ipynb           # Full analysis notebook
│   └── figures/                 # Visualizations
│
├── task-2-design/               # DELIVERABLES
│   ├── design-doc.md            # Data model design document
│   └── data-model.png           # Visual diagram
```

---

## Task 1: Data Analysis

| File | Description |
|------|-------------|
| [Analysis_Deck.pdf](task-1-analysis/Analysis_Deck.pdf) | **Main deliverable** - slide deck |
| [Analysis_2pager.pdf](task-1-analysis/Analysis_2pager.pdf) | Optional: 2-page executive summary |
| [report.md](task-1-analysis/report.md) | Optional: markdown version |
| [analysis.ipynb](task-1-analysis/analysis.ipynb) | Full analysis notebook |

### How to Run

```bash
pip install pandas matplotlib numpy jupyter
cd task-1-analysis
jupyter notebook analysis.ipynb
```

---

## Task 2: Data Engineering

| File | Description |
|------|-------------|
| [design-doc.md](task-2-design/design-doc.md) | Data model design |
| [data-model.png](task-2-design/data-model.png) | Visual diagram |

---

## Data Source

[Startup Investments (Crunchbase)](https://www.kaggle.com/datasets/arindam235/startup-investments-crunchbase) from Kaggle — 54,000+ companies, 2005-2014 cohort.

---

## Tools

See [tools.md](tools.md)
