# Tool Choices

## What I Used

| Component | Tool | Why |
|-----------|------|-----|
| **Analysis** | Python + Pandas | Industry standard, reproducible |
| **Notebook** | Jupyter | Shows work step-by-step |
| **Static Charts** | Matplotlib/Seaborn | Clean, PDF-ready |
| **Interactive Charts** | Plotly | Hover/explore capability |
| **Data Model Diagrams** | Mermaid + dbdiagram.io | Text-based, version-controllable |
| **Data Warehouse** | Star Schema | BI-friendly, handles temporal tracking |
| **Transformations** | dbt (recommended) | SCD Type 2 snapshots built-in |

## Why Not Other Tools?

- **Excel**: Not reproducible, struggles with 50K+ rows
- **R**: Equally capable, but Python has broader ecosystem
- **Data Vault**: Overkill for single-source data, requires specialized expertise
- **One Big Table**: Can't track how companies change over time

## AI Usage (Honest Disclosure)

**Yes, I used Claude Code (AI assistant).** Here's what for:

| Used AI For | Why |
|-------------|-----|
| Boilerplate code generation | Faster setup, focus time on analysis |
| SQL syntax across warehouses | Avoid manual lookup |
| Documentation structure | Consistent formatting |
| Trade-off brainstorming | Surface alternatives I might miss |

| Did NOT Use AI For | Why |
|---------------------|-----|
| Final analytical conclusions | Human judgment required |
| Design decisions | Evaluated alternatives myself |
| Data interpretation | Context and domain knowledge needed |

**My view**: AI accelerated development but the thinking is mine. I validated all outputs, questioned AI suggestions, and made independent decisions. The quality of reasoning matters more than whether AI helped draft it.

---

*The assignment asks for reasoning, not perfection. I chose tools I could explain and justify.*
