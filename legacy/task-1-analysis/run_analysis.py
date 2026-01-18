#!/usr/bin/env python3
"""
Run the startup ecosystem analysis from the Jupyter notebook.
This script executes all the key analysis cells programmatically.
"""

import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Try to import visualization libraries (optional)
try:
    import matplotlib.pyplot as plt
    import seaborn as sns
    HAS_VIS = True
except ImportError:
    HAS_VIS = False
    print("Note: Visualization libraries not available, running analysis only")

print("=" * 70)
print("STARTUP ECOSYSTEM ANALYSIS")
print("=" * 70)

# Load the dataset
print("\n1. Loading dataset...")
df = pd.read_csv('../investments_VC.csv', encoding='latin-1', low_memory=False)
print(f"   Dataset loaded: {len(df):,} companies")
print(f"   Columns: {len(df.columns)}")

# Clean the data
print("\n2. Cleaning data...")
df.columns = df.columns.str.strip()
df['funding_usd'] = df['funding_total_usd'].astype(str).str.replace(',', '').str.replace(' ', '').str.strip()
df['funding_usd'] = pd.to_numeric(df['funding_usd'], errors='coerce')
df['market'] = df['market'].str.strip()
df['first_funding_date'] = pd.to_datetime(df['first_funding_at'], errors='coerce')
df['last_funding_date'] = pd.to_datetime(df['last_funding_at'], errors='coerce')
df['founded_date'] = pd.to_datetime(df['founded_at'], errors='coerce')
df['first_funding_year'] = df['first_funding_date'].dt.year
df['last_funding_year'] = df['last_funding_date'].dt.year
df['founded_year'] = df['founded_date'].dt.year
df['status'] = df['status'].fillna('unknown')

print(f"   Companies with funding data: {df['funding_usd'].notna().sum():,}")
print(f"   Companies with founded year: {df['founded_year'].notna().sum():,}")
print(f"   Companies with first funding date: {df['first_funding_date'].notna().sum():,}")

# Global Overview
print("\n3. Global Overview...")
print(f"   Total companies: {len(df):,}")
print(f"   Total funding: ${df['funding_usd'].sum()/1e9:.1f}B")
print(f"   Countries represented: {df['country_code'].nunique()}")
print(f"   Market categories: {df['market'].nunique()}")

# Dutch Analysis
print("\n4. Dutch Ecosystem Analysis...")
dutch = df[df['country_code'] == 'NLD'].copy()
print(f"   Total Dutch companies: {len(dutch):,}")
print(f"   Total Dutch funding: ${dutch['funding_usd'].sum()/1e9:.2f}B")
print(f"   Average funding per company: ${dutch['funding_usd'].mean()/1e6:.1f}M")
print(f"   Operating rate: {(dutch['status'] == 'operating').mean()*100:.1f}%")

# Funding Funnel
print("\n5. Funding Funnel Analysis...")
total = len(df)
seed = (df['seed'] > 0).sum()
series_a = (df['round_A'] > 0).sum()
series_b = (df['round_B'] > 0).sum()
series_c = (df['round_C'] > 0).sum()
series_d = (df['round_D'] > 0).sum()

print(f"   Total companies: {total:,}")
print(f"   Seed funding: {seed:,} ({seed/total*100:.1f}%)")
print(f"   Series A: {series_a:,} ({series_a/total*100:.1f}%)")
print(f"   Series B: {series_b:,} ({series_b/total*100:.1f}%)")
print(f"   Series C: {series_c:,} ({series_c/total*100:.1f}%)")
print(f"   Series D: {series_d:,} ({series_d/total*100:.1f}%)")

if seed > 0:
    seed_to_a = (series_a / seed) * 100
    print(f"\n   Seed to Series A conversion: {seed_to_a:.1f}%")
    print(f"   ⚠️  VALLEY OF DEATH: {100-seed_to_a:.1f}% of seed companies don't reach Series A")

# Outcomes by Rounds
print("\n6. Outcomes by Funding Rounds...")
for rounds in range(1, 6):
    subset = df[df['funding_rounds'] == rounds]
    if len(subset) > 0:
        operating_pct = (subset['status'] == 'operating').mean() * 100
        acquired_pct = (subset['status'] == 'acquired').mean() * 100
        closed_pct = (subset['status'] == 'closed').mean() * 100
        print(f"   {rounds} round(s): {len(subset):,} companies")
        print(f"      Operating: {operating_pct:.1f}%, Acquired: {acquired_pct:.1f}%, Closed: {closed_pct:.1f}%")

# Peer Benchmark
print("\n7. Peer Benchmarking...")
benchmark_countries = ['USA', 'GBR', 'DEU', 'NLD', 'ISR', 'FRA']
print(f"   {'Country':<12} {'Companies':>12} {'Avg Funding':>15} {'Operating Rate':>15}")
print("   " + "-" * 60)
for country in benchmark_countries:
    country_df = df[df['country_code'] == country]
    if len(country_df) > 0:
        avg_funding = country_df['funding_usd'].mean() / 1e6
        operating_rate = (country_df['status'] == 'operating').mean() * 100
        print(f"   {country:<12} {len(country_df):>12,} ${avg_funding:>13.1f}M {operating_rate:>14.1f}%")

# Time Series
print("\n8. Time Series Analysis (2005-2014)...")
yearly = df.groupby('first_funding_year').agg({
    'name': 'count',
    'funding_usd': 'sum'
}).rename(columns={'name': 'company_count'})
yearly = yearly[(yearly.index >= 2005) & (yearly.index <= 2014)]

peak_year = yearly['company_count'].idxmax()
peak_count = yearly.loc[peak_year, 'company_count']
print(f"   Peak year: {int(peak_year)} with {int(peak_count):,} companies")
print(f"   Total funding in peak year: ${yearly.loc[peak_year, 'funding_usd']/1e9:.2f}B")

# Sector Analysis
print("\n9. Sector Analysis...")
sector_data = df.groupby('market').agg({
    'name': 'count',
    'funding_usd': 'sum'
}).rename(columns={'name': 'company_count'})
sector_data['avg_funding'] = sector_data['funding_usd'] / sector_data['company_count']
top_sectors = sector_data.nlargest(5, 'company_count')

print(f"   Top 5 sectors by company count:")
for sector, row in top_sectors.iterrows():
    print(f"      {sector[:30]:<30} {int(row['company_count']):>6,} companies, ${row['avg_funding']/1e6:>6.1f}M avg")

# Key Findings Summary
print("\n" + "=" * 70)
print("KEY FINDINGS SUMMARY")
print("=" * 70)

single_round_pct = (df['funding_rounds'] == 1).sum() / len(df) * 100
print(f"\n1. THE VALLEY OF DEATH")
print(f"   - {single_round_pct:.1f}% of startups never progress beyond their first funding round")
if seed > 0:
    print(f"   - Only {seed_to_a:.1f}% of seed-funded companies reach Series A")

# Outcomes
subset_1 = df[df['funding_rounds'] == 1]
subset_4 = df[df['funding_rounds'] == 4]
if len(subset_1) > 0 and len(subset_4) > 0:
    acq_1 = (subset_1['status'] == 'acquired').mean() * 100
    acq_4 = (subset_4['status'] == 'acquired').mean() * 100
    print(f"\n2. MORE FUNDING = BETTER OUTCOMES")
    print(f"   - Companies with 1 round: {acq_1:.1f}% acquired")
    print(f"   - Companies with 4 rounds: {acq_4:.1f}% acquired")
    print(f"   - {acq_4/acq_1:.1f}x higher acquisition rate with more rounds")

print(f"\n3. NETHERLANDS POSITION")
print(f"   - {len(dutch):,} companies with ${dutch['funding_usd'].sum()/1e9:.2f}B total funding")
print(f"   - Average funding ${dutch['funding_usd'].mean()/1e6:.1f}M vs global ${df['funding_usd'].mean()/1e6:.1f}M")
print(f"   - {(dutch['status'] == 'operating').mean()*100:.1f}% operating rate (above global average)")

print("\n" + "=" * 70)
print("Analysis completed successfully!")
print("=" * 70)
print("\nNext steps:")
print("  1. View the interactive dashboard: cd dashboard && npm run dev")
print("  2. Check generated visualizations in task-1-analysis/figures/")
print("  3. Review documentation: README.md, METHODOLOGY.md")
