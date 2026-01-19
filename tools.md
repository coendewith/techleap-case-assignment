# Tool Justifications

## What I Used

| Component | Tool | Why |
|-----------|------|-----|
| **Initial Exploration** | Google Sheets | Data was <50K rows, so I could quickly identify data cleaning issues and get an overall picture of the data structure and types |
| **Analysis** | Python + Pandas | High versatility and customization, quick for code generation, and the language I'm most comfortable with |
| **Notebook** | Jupyter | Reproducibility (run cells top-to-bottom, same results), narrative flow (interleave code, output, and explanation), and easy to review—unlike scripts where you'd need to run code and read comments separately |
| **Visualization** | Matplotlib | Publication-quality static charts, fine-grained control over styling and high customizability |
| **IDE** | VS Code + Claude Code (Claude Opus 4.5) | Claude Opus is currently the most productive model based on own experiecne and for agentic coding as seen livebench.ai |
| **Design Tasks** | Gemini 2.5 Pro | For design-related tasks, high-thinking models outperform on visual/layout decisions |
| **Data Model Diagrams** | Mermaid + dbdiagram.io | Text-based, version-controllable |

## Why Not Other Tools?

- **Excel**: Not reproducible, low flexibillty in making graphs
- **Gsheets for graohs and descriptive statistic**: more manual work, not flexible
- **R**: Equally capable, but Python has broader ecosystem and I'm faster in it
- **Plotly**: Considered for interactivity, but static charts were cleaner for the PDF report

## AI Usage

**Yes, I used AI assistants.** Here's what for:

| Used AI For | Why |
|-------------|-----|
| Initial data cleaning steps | Faster pipeline development |
| Quickly generating charts based on proposed ideas | Rapid iteration on visualizations |
| Code cleanup + brainstorimign text | Focus time on analysis, not formatting |
| Policy research | Finding international benchmark examples (Yozma, SEIS) |\
| Git commits | Keeping track of changes quick git commits |

| Did NOT Use AI For | Why |
|---------------------|-----|
| Ideation regarding story and graph design | Human judgment required |
| Defining research questions and story arc | Human judgment required |
| Interpreting findings and drawing conclusions | Context and domain knowledge needed |
| Final editorial decisions on charts and content | My choices, my voice |

**My view**: AI help is narrow execution, task, such as code generation, but it is crucial to do design, architecture, and data analysis choices with human judgment.

