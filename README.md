# Techleap Senior Data Analyst Case Study

## Overview

This repository contains my submission for the Techleap Senior Data Analyst case study. The assignment analyzes startup ecosystem data to derive policy insights and designs a scalable data infrastructure for ecosystem monitoring.

## Repository Structure

```
techleap-case/
├── README.md                          # This file
├── tools.md                           # Tool choices and rationale
├── investments_VC.csv                 # Source data (Crunchbase via Kaggle)
│
├── task-1-analysis/                   # Data Analysis Report
│   ├── report.md                      # Executive briefing (source)
│   ├── presentation.md                # Ministry slides (Marp format)
│   ├── analysis.ipynb                 # Full analysis notebook
│   └── figures/                       # Generated visualizations
│       ├── 01_funding_funnel.png
│       ├── 02_outcomes_by_rounds.png
│       ├── 03_peer_benchmark.png
│       ├── 04_funding_timeline.png
│       └── 05_sector_analysis.png
│
└── task-2-design/                     # Data Engineering Design
    ├── design-doc.md                  # Comprehensive design document
    ├── schema.sql                     # Production-ready PostgreSQL DDL
    ├── data-model.mmd                 # ER diagram (Mermaid format)
    └── dbt/                           # Sample dbt project
        ├── dbt_project.yml
        └── models/
            ├── staging/               # Staging layer models
            │   ├── stg_companies.sql
            │   ├── stg_funding_rounds.sql
            │   └── schema.yml
            └── marts/                 # Analytics marts
                ├── mart_funding_analysis.sql
                ├── mart_ecosystem_metrics.sql
                └── schema.yml
```

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/techleap-case.git
cd techleap-case

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install pandas matplotlib seaborn numpy jupyter
```

### Running the Analysis

```bash
# Start Jupyter notebook
jupyter notebook task-1-analysis/analysis.ipynb

# Or run the analysis script directly
cd task-1-analysis
python -c "exec(open('analysis.ipynb').read())"
```

### Viewing the Report

The executive report is available in `task-1-analysis/report.md`. To convert to PDF:

```bash
# Using pandoc (if installed)
pandoc task-1-analysis/report.md -o task-1-analysis/report.pdf --pdf-engine=xelatex

# Or use any Markdown viewer/editor
```

### Viewing the Presentation

The presentation is in Marp format (`task-1-analysis/presentation.md`). To view:

```bash
# Using Marp CLI (if installed)
npx @marp-team/marp-cli task-1-analysis/presentation.md --pdf

# Or use VS Code with Marp extension
```

---

## Task 1: Data Analysis Report

### Key Findings

1. **The Valley of Death**: 59% of startups never progress beyond their first funding round. Only 17% of seed-funded companies reach Series A.

2. **More Funding Rounds = Better Outcomes**: Companies with 4+ funding rounds show 12-15% acquisition rates vs. 4% for single-round companies.

3. **Netherlands Positioning**: Dutch startups attract $13.2M average funding with 86% operating rate (above global average).

### Deliverables

- **Executive Report** (`report.md`): 2-page briefing for Ministry of Economic Affairs
- **Presentation** (`presentation.md`): 12-slide deck for Ministry meeting
- **Analysis Notebook** (`analysis.ipynb`): Full reproducible analysis
- **Visualizations** (`figures/`): 5 publication-ready charts

---

## Task 2: Data Engineering Design

### Architecture Summary

Star schema data warehouse optimized for analytical queries:

- **Fact Table**: `fact_funding_rounds` - Core funding event data
- **Dimensions**: Company (SCD Type 2), Investor, Geography, Date
- **Bridge Tables**: Company-Industry many-to-many relationship

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Star Schema | Query performance over storage efficiency at this scale |
| SCD Type 2 | Historical tracking critical for ecosystem monitoring |
| PostgreSQL | Cost-effective for 5GB daily; scalable to BigQuery |
| dbt | Version-controlled SQL transformations with lineage |

### Deliverables

- **Design Document** (`design-doc.md`): Comprehensive architecture specification
- **SQL Schema** (`schema.sql`): Production-ready PostgreSQL DDL
- **ER Diagram** (`data-model.mmd`): Mermaid entity relationship diagram
- **dbt Project** (`dbt/`): Sample staging and mart models

---

## Author

Coen de With

---

## License

This project is submitted as part of the Techleap hiring process and is not licensed for redistribution.
