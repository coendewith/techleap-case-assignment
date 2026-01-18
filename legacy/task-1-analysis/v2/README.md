# V2: Simplified Analysis

**Philosophy**: One core insight, clearly explained, beats ten insights poorly presented.

## Structure

```
v2/
├── README.md          # This file
├── report.md          # ~120 lines (was 598)
├── analysis.ipynb     # 22 cells (was 83)
├── page.tsx           # ~280 lines (was 940)
├── data/
│   ├── overview.json      # Key metrics
│   ├── findings.json      # 3 core findings
│   └── limitations.json   # Honest limitations
└── figures/               # Generated charts
```

## 3 Core Findings

| # | Finding | Evidence | Confidence |
|---|---------|----------|------------|
| 1 | **Seed→A conversion is broken** | 6.2% NL vs 16% USA | MEDIUM (n=97) |
| 2 | **Capital doesn't fix it** | 300x more money = 4% better | HIGH (n=40K+) |
| 3 | **Rounds matter, not amount** | 2x better with 4+ rounds | HIGH (n=48K) |

## Core Recommendation

> Focus on helping companies COMPLETE rounds (matching), not raising MORE capital.

## Usage

### Run the notebook
```bash
cd task-1-analysis/v2
jupyter notebook analysis.ipynb
```

### Use the dashboard component
Copy `page.tsx` to `dashboard/src/app/page.tsx` to replace the current dashboard.

## What's Different from V1

| Aspect | V1 | V2 |
|--------|----|----|
| Findings | 10+ insights | 3 core findings |
| Report | 598 lines | ~120 lines |
| Notebook | 83 cells | 22 cells |
| Dashboard | 940 lines | ~280 lines |
| Data files | 16 files | 3 files |
| Focus | Comprehensive | Decision-relevant |

## Success Criteria

- [ ] Understand the 3 findings in under 2 minutes
- [ ] Explain "so what" in one sentence
- [ ] Know what data CAN'T tell you
