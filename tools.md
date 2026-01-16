# Tool Choices and Rationale

## Overview

This document explains the tools selected for this case study and the reasoning behind each choice.

---

## Task 1: Data Analysis

### Python + Pandas

**Why**: Python is the industry standard for data analysis. Pandas provides powerful data manipulation capabilities that handle messy real-world data well.

**Alternatives Considered**:
- R: Equally capable, but Python has broader ecosystem integration
- SQL only: Less flexible for exploratory analysis
- Excel: Not reproducible, limited for 54K+ rows

**Trade-off**: Python requires setup (venv, dependencies) but enables reproducible, version-controlled analysis.

---

### Matplotlib + Seaborn

**Why**: Professional-quality static visualizations suitable for PDF reports and presentations. Seaborn provides attractive defaults with minimal configuration.

**Alternatives Considered**:
- Plotly: Interactive, but overkill for static PDF output
- Altair: Declarative, but less control over styling
- Tableau/Power BI: Excellent but adds tool dependency

**Trade-off**: Static charts can't be interactive, but they work reliably in PDFs and presentations.

---

### Jupyter Notebook

**Why**: Combines code, output, and narrative in a single document. Shows the analytical thought process and is fully reproducible.

**Alternatives Considered**:
- Python scripts: More production-ready but less narrative
- R Markdown: Similar capability but different ecosystem
- Observable: Web-based, harder to share as files

**Trade-off**: Notebooks can get messy; mitigated by clear section structure.

---

### Marp (Markdown Presentations)

**Why**: Create presentations using Markdown, enabling version control and easy content reuse from the analysis.

**Alternatives Considered**:
- PowerPoint: More polished but not version-controllable
- Google Slides: Collaborative but requires account
- reveal.js: More customizable but complex setup

**Trade-off**: Less visual flexibility than PowerPoint, but faster iteration and Git-friendly.

---

## Task 2: Data Engineering

### PostgreSQL

**Why**: Mature, reliable, SQL-standard compliant. Perfect for the current scale (~5GB/day) with clear upgrade path to cloud DWH.

**Alternatives Considered**:
- BigQuery/Snowflake: Better for >50GB but overkill now
- MySQL: Less feature-rich for analytics workloads
- DuckDB: Great for local analysis but not production-ready

**Trade-off**: Requires infrastructure management vs. serverless options, but avoids vendor lock-in.

---

### dbt (Data Build Tool)

**Why**: Industry-standard for SQL transformations. Provides version control, documentation, testing, and lineage tracking.

**Alternatives Considered**:
- Stored procedures: Less portable, harder to test
- Airflow SQL operators: Less specialized for transformations
- Apache Spark: Overkill for this scale

**Trade-off**: Learning curve and additional tooling, but massive benefits for maintainability.

---

### Star Schema Design

**Why**: Optimized for analytical queries that power dashboards and reports. Minimizes joins for common query patterns.

**Alternatives Considered**:
- Normalized (3NF): Better for OLTP, worse for analytics
- Data Vault: More complex, designed for enterprise scale
- Wide tables: Simpler but inflexible

**Trade-off**: Data redundancy vs. query performance. At this scale, redundancy cost is acceptable.

---

### Mermaid (Diagrams)

**Why**: Text-based diagrams that can be version-controlled. Renders in GitHub, documentation sites, and many editors.

**Alternatives Considered**:
- draw.io: More polished but binary files
- Lucidchart: Professional but requires account
- dbdiagram.io: Specialized for ERDs but less flexible

**Trade-off**: Less visual polish but better for version control and documentation-as-code.

---

## AI Tool Usage

### Claude Code (this tool)

**Used for**:
- Initial plan development and task breakdown
- Code generation for analysis notebook
- Documentation drafting
- Design pattern suggestions

**How it helped**:
- Accelerated boilerplate code creation
- Ensured comprehensive coverage of requirements
- Provided structured approach to complex tasks

**Human validation applied**:
- All generated code was reviewed for correctness
- Analysis insights were validated against data
- Design decisions were critically evaluated

**Why disclose**: Transparency about AI assistance is important. The analytical thinking, design decisions, and final validation remain human-driven.

---

## Summary Table

| Component | Tool | Key Rationale |
|-----------|------|---------------|
| Data Analysis | Python + Pandas | Industry standard, handles messy data |
| Visualization | Matplotlib + Seaborn | Professional static charts for PDF |
| Notebook | Jupyter | Reproducible analysis with narrative |
| Presentation | Marp | Version-controlled slides |
| Database | PostgreSQL | Reliable, right-sized for current scale |
| Transformations | dbt | Version control, testing, documentation |
| Data Model | Star Schema | Optimized for analytical queries |
| Diagrams | Mermaid | Text-based, version-controllable |
| AI Assistance | Claude Code | Accelerated development with oversight |
