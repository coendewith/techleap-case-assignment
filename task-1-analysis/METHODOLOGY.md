# Methodology: Dutch Startup Ecosystem Analysis

## Data Source

**Dataset**: Startup Investments (Crunchbase) via Kaggle
- **Companies**: 54,294 total (48,163 after filtering to 2005-2014)
- **Countries**: 115 countries represented
- **Markets**: 753 market categories
- **Time Period**: 2005-2014 (first funding dates)
- **Dutch Companies**: 307 companies

## Data Cleaning & Processing

### Initial Cleaning
1. **Column Names**: Stripped whitespace from column names
2. **Funding Amounts**: Converted `funding_total_usd` from string to numeric
   - Removed commas and spaces
   - Handled missing values (coerced to NaN)
3. **Market Categories**: Stripped whitespace from market names
4. **Date Columns**: Converted to datetime format
   - `first_funding_at` → `first_funding_date`
   - `last_funding_at` → `last_funding_date`
   - `founded_at` → `founded_date`
5. **Status**: Filled missing status values with 'unknown'

### Filtering
- Filtered to companies with first funding between 2005-2014 (inclusive)
- This ensures meaningful time series analysis and removes edge cases

## Analysis Dimensions

### 1. Funding Funnel Analysis
**Purpose**: Identify the "Valley of Death" - where companies drop out

**Method**:
- Count companies that received each funding round type (seed, round_A, round_B, etc.)
- Calculate conversion rates between stages
- Identify largest drop-off points

**Key Finding**: Only 17% of seed-funded companies reach Series A

### 2. Outcomes by Funding Rounds
**Purpose**: Understand how funding progression affects company outcomes

**Method**:
- Group companies by number of funding rounds (1-7+)
- Calculate percentage distribution of outcomes (operating, acquired, closed)
- Compare acquisition rates across round counts

**Key Finding**: Companies with 4+ rounds have 3x higher acquisition rates than single-round companies

### 3. Peer Benchmarking
**Purpose**: Position Netherlands within global innovation ecosystem

**Method**:
- Select peer countries: USA, GBR, DEU, NLD, ISR, FRA
- Calculate metrics: average funding, operating rate, average rounds
- Compare Netherlands to peers and global averages

**Key Finding**: Netherlands shows competitive funding levels but fewer average rounds than Israel or USA

### 4. Time Series Analysis
**Purpose**: Understand ecosystem resilience and growth patterns

**Method**:
- Group by first funding year (2005-2014)
- Calculate yearly: company count, total funding, average funding
- Identify trends and anomalies (e.g., 2008 financial crisis)

**Key Finding**: Strong recovery from 2008 crisis, peak activity in 2012-2013

### 5. Sector Analysis
**Purpose**: Identify Dutch sector strengths and opportunities

**Method**:
- Group by market category
- Calculate: company count, total funding, average funding per company
- Compare Dutch vs Global by sector
- Identify top sectors by volume and funding

**Key Finding**: Biotech and Software are top Dutch sectors, with biotech attracting 3x more funding per company

### 6. Survival Curve Analysis (NEW)
**Purpose**: Visualize company drop-off through funding rounds (inspired by depreciation curves)

**Method**:
- Calculate survival rate (% companies reaching each round)
- Separate calculations for Dutch vs Global
- Calculate drop-off percentages between rounds
- Visualize as exponential decay curve

**Key Finding**: Netherlands shows 85.9% survival to Series A vs 84.2% globally

### 7. Cohort Analysis (NEW)
**Purpose**: Track performance of companies by founding year

**Method**:
- Group companies by `founded_year` (2005-2014)
- Calculate per cohort: company count, average funding, average rounds, operating rate, acquired rate
- Compare cohort performance over time

**Key Finding**: Earlier cohorts (2005-2007) show higher average funding and more rounds

## Statistical Methods

### Aggregations
- **Mean**: Average funding, average rounds
- **Median**: Median funding (less sensitive to outliers)
- **Percentage**: Operating rate, acquisition rate, conversion rates
- **Counts**: Company counts by various dimensions

### Comparisons
- **Dutch vs Global**: Compare Dutch metrics to global averages
- **Dutch vs Peers**: Compare to specific peer countries
- **Time Periods**: Compare across years/cohorts
- **Sectors**: Compare sector performance

### Limitations

1. **Data Recency**: Dataset ends in 2014, missing recent trends
2. **Missing Data**: 
   - No investor identity data
   - No time-between-rounds data (calculated from dates where available)
   - No revenue/employee growth metrics
   - No exit valuations
3. **Deeptech Classification**: Cannot clearly identify deeptech companies in current dataset
4. **Geographic Granularity**: No regional data within Netherlands
5. **Selection Bias**: Dataset may favor English-language, Western companies

## Integration with State of Dutch Tech

This analysis is informed by patterns from State of Dutch Tech 2024-2025 reports:

- **Deeptech Trends**: Higher scale-up ratios for deeptech ventures
- **Investment Patterns**: 25% drop in 2023 VC investment
- **Sector Strengths**: Health, biotech, semiconductors, enterprise software
- **Talent Gaps**: ICT specialist shortage despite high basic digital skills
- **Geographic Clusters**: North Holland, South Holland, North Brabant dominance

These patterns provide context for interpreting findings and informing policy recommendations.

## Policy Recommendations

Based on analysis findings:

1. **Bridge the Valley of Death**: Create bridge funding programs for post-seed, pre-Series A companies
2. **Encourage Follow-on Investment**: Incentivize existing investors to provide multiple rounds
3. **Sector Focus**: Continue support for Biotech and Software (Dutch strengths)
4. **Deeptech Support**: Prioritize deeptech given higher scale-up ratios
5. **Talent Development**: Address ICT specialist shortage to attract investment

## Next Steps

### Data Enhancements
1. Integrate Dealroom data for current, Dutch-focused coverage
2. Add KvK (Chamber of Commerce) data for company health metrics
3. Include patent/publication data for innovation metrics
4. Add investor identity and concentration data

### Analysis Enhancements
1. Time-between-rounds analysis (if date data allows)
2. Correlation analysis (funding, rounds, outcomes, sectors)
3. Geographic analysis (if region data becomes available)
4. Deeptech classification and analysis

### Qualitative Research
1. Interview key investors and founders
2. Survey companies about funding challenges
3. Case studies of successful Dutch scale-ups

## Tools & Technologies

- **Python**: Data processing and analysis (pandas, numpy)
- **Next.js/React**: Dashboard frontend
- **Recharts**: Data visualization
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## Reproducibility

All analysis code is available in:
- `analysis.ipynb`: Original Python analysis
- `scripts/generate_dashboard_data.py`: Data conversion script
- Dashboard source code in `src/app/`

Data files are generated from `investments_VC.csv` and can be regenerated by running the Python script.
