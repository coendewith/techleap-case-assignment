# Startup Ecosystem Dashboard

Interactive Next.js dashboard for analyzing the Dutch startup ecosystem, built with React, Recharts, and Tailwind CSS.

## Features

- **Interactive Visualizations**: Modern charts using Recharts library
- **Comprehensive Analysis**: Funding funnel, outcomes, peer benchmarking, survival curves, cohort analysis
- **State of Dutch Tech Integration**: Context from recent ecosystem reports
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Professional dark theme with Dutch orange accents

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Python 3.8+ (for data generation script)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Generate data files:
```bash
python3 scripts/generate_dashboard_data.py
```

This will create JSON data files in `public/data/` from the CSV dataset.

3. Run development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── components/       # Reusable React components
│   │   │   ├── StatCard.tsx
│   │   │   ├── CohortAnalysis.tsx
│   │   │   └── ...
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── layout.tsx        # Root layout with navigation
│   │   └── globals.css       # Global styles and theme
│   └── lib/                  # Utility functions
├── public/
│   └── data/                 # JSON data files (generated)
│       ├── overview.json
│       ├── funnel.json
│       ├── outcomes.json
│       ├── peers.json
│       ├── timeline.json
│       ├── sectors.json
│       ├── survival.json
│       └── cohorts.json
├── scripts/
│   └── generate_dashboard_data.py  # Data conversion script
└── package.json
```

## Data Processing

The `scripts/generate_dashboard_data.py` script:

1. Loads the CSV dataset (`../investments_VC.csv`)
2. Cleans and processes the data
3. Generates aggregated statistics
4. Exports JSON files for the dashboard

To regenerate data after CSV updates:
```bash
python3 scripts/generate_dashboard_data.py
```

## Technologies

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Recharts 3.6**: Charting library
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript 5**: Type-safe JavaScript

## Key Visualizations

1. **Funding Funnel**: Shows progression through funding stages (Seed → Series A → B → C → D)
2. **Outcomes by Rounds**: 100% stacked bar chart showing operating/acquired/closed rates
3. **Peer Benchmark**: Multi-dimensional comparison of Netherlands vs peer countries
4. **Timeline**: Area + line chart showing funding activity over time (2005-2014)
5. **Survival Curve**: Exponential decay curve showing company drop-off by round
6. **Cohort Analysis**: Companies grouped by founding year with performance metrics
7. **Sector Analysis**: Top sectors by company count and funding

## Customization

### Colors

Edit `src/app/globals.css` to customize the color palette:

```css
:root {
  --techleap-primary: #1a365d;
  --techleap-secondary: #3182ce;
  --techleap-dutch: #FF5500;
  /* ... */
}
```

### Adding New Visualizations

1. Add data processing in `scripts/generate_dashboard_data.py`
2. Create component in `src/app/components/`
3. Import and use in `src/app/page.tsx`

## Build for Production

```bash
npm run build
npm start
```

## License

Internal use for Techleap analysis.
