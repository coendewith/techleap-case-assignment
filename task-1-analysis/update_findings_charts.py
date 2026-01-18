#!/usr/bin/env python
"""Update Finding 2 and 3 charts to show NL vs peers instead of just global data"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

# Okabe-Ito colorblind-friendly palette
COLORS = {
    'orange': '#E69F00',
    'skyblue': '#56B4E9',
    'green': '#009E73',
    'yellow': '#F0E442',
    'blue': '#0072B2',
    'vermillion': '#D55E00',
    'purple': '#CC79A7',
    'black': '#000000',
    'gray': '#999999'
}

def tufte_style(ax):
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#666666')
    ax.spines['bottom'].set_color('#666666')
    ax.spines['left'].set_linewidth(0.5)
    ax.spines['bottom'].set_linewidth(0.5)
    ax.tick_params(colors='#666666', width=0.5)
    ax.grid(False)
    return ax

os.makedirs('figures', exist_ok=True)

# Load and clean data
df = pd.read_csv('../investments_VC.csv', encoding='latin-1')
df.columns = df.columns.str.strip()
df['country_code'] = df['country_code'].str.strip()
df['first_funding_at'] = pd.to_datetime(df['first_funding_at'], errors='coerce')
df['founded_at'] = pd.to_datetime(df['founded_at'], errors='coerce')
df = df[df['first_funding_at'].notna()]
df = df[(df['first_funding_at'].dt.year >= 2005) & (df['first_funding_at'].dt.year <= 2014)]
df['acquired'] = df['status'] == 'acquired'

print(f"Total companies: {len(df):,}")
print(f"NL: {len(df[df.country_code=='NLD']):,}, USA: {len(df[df.country_code=='USA']):,}, Israel: {len(df[df.country_code=='ISR']):,}")

# === FINDING 2: Rounds by Country ===
def acq_rate_by_rounds(country_codes, round_range):
    """Calculate acquisition rate for companies with rounds in range"""
    if isinstance(country_codes, str):
        country_codes = [country_codes]
    subset = df[df['country_code'].isin(country_codes)]
    in_range = subset[(subset['funding_rounds'] >= round_range[0]) & (subset['funding_rounds'] <= round_range[1])]
    if len(in_range) == 0:
        return 0, 0
    return in_range['acquired'].sum() / len(in_range) * 100, len(in_range)

# Calculate rates for each region and round category
regions = ['Netherlands', 'European Peers\n(UK/DE/FR)', 'USA', 'Israel']
region_codes = [['NLD'], ['GBR', 'DEU', 'FRA'], ['USA'], ['ISR']]
region_colors = [COLORS['vermillion'], COLORS['gray'], COLORS['blue'], COLORS['green']]

# Round categories
round_cats = ['1-2 rounds', '3-4 rounds\n(sweet spot)', '5+ rounds']
round_ranges = [(1, 2), (3, 4), (5, 10)]

# Create grouped bar chart
fig, ax = plt.subplots(figsize=(12, 7))
tufte_style(ax)

x = np.arange(len(round_cats))
width = 0.2
multiplier = 0

for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):
    rates = []
    ns = []
    for rr in round_ranges:
        rate, n = acq_rate_by_rounds(codes, rr)
        rates.append(rate)
        ns.append(n)

    offset = width * multiplier
    bars = ax.bar(x + offset, rates, width, label=region, color=color, edgecolor='none')

    # Add labels
    for bar, rate, n in zip(bars, rates, ns):
        if n > 0:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                    f'{rate:.1f}%', ha='center', va='bottom', fontsize=9, fontweight='bold',
                    color=color)

    multiplier += 1

# Highlight sweet spot
ax.axvspan(0.7, 1.5, alpha=0.1, color=COLORS['green'])
ax.text(1, 17.5, 'SWEET SPOT', ha='center', fontsize=10, color=COLORS['green'], fontweight='bold')

ax.set_ylabel('Acquisition Rate (%)', fontsize=11)
ax.set_title('Dutch startups underperform at every funding stage—especially the sweet spot',
             fontsize=14, fontweight='bold', loc='left', pad=20)
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(round_cats, fontsize=11)
ax.legend(loc='upper right', fontsize=10, frameon=False)
ax.set_ylim(0, 20)

# Add key insight in a better position
ax.text(0.5, -0.12,
        'Key insight: NL reaches 12% at 3-4 rounds—competitive but few companies get there',
        transform=ax.transAxes, fontsize=10, color=COLORS['gray'], style='italic',
        ha='center', verticalalignment='top')

plt.tight_layout()
plt.savefig('figures/finding2_rounds_matter.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Finding 2: Updated with country comparison")

# === FINDING 3: Bootstrap Period by Country ===
def bootstrap_rate(country_codes, year_range):
    """Calculate acquisition rate for companies bootstrapping in year range"""
    if isinstance(country_codes, str):
        country_codes = [country_codes]
    valid = df[(df['founded_at'].notna()) & (df['first_funding_at'].notna())].copy()
    valid['years_to_funding'] = (valid['first_funding_at'] - valid['founded_at']).dt.days / 365.25
    valid = valid[(valid['years_to_funding'] >= 0) & (valid['years_to_funding'] <= 15)]

    subset = valid[valid['country_code'].isin(country_codes)]
    in_range = subset[(subset['years_to_funding'] >= year_range[0]) & (subset['years_to_funding'] < year_range[1])]

    if len(in_range) == 0:
        return 0, 0
    return in_range['acquired'].sum() / len(in_range) * 100, len(in_range)

# Bootstrap categories
boot_cats = ['<2 years\n(rushed)', '2-5 years', '5-7 years\n(sweet spot)', '7+ years']
boot_ranges = [(0, 2), (2, 5), (5, 7), (7, 15)]

# Create grouped bar chart
fig, ax = plt.subplots(figsize=(12, 7))
tufte_style(ax)

x = np.arange(len(boot_cats))
width = 0.2
multiplier = 0

for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):
    rates = []
    ns = []
    for br in boot_ranges:
        rate, n = bootstrap_rate(codes, br)
        rates.append(rate)
        ns.append(n)

    offset = width * multiplier
    bars = ax.bar(x + offset, rates, width, label=region, color=color, edgecolor='none')

    # Add labels
    for bar, rate, n in zip(bars, rates, ns):
        if n > 5:  # Only label if meaningful sample
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                    f'{rate:.1f}%', ha='center', va='bottom', fontsize=9, fontweight='bold',
                    color=color)

    multiplier += 1

# Highlight sweet spot
ax.axvspan(1.7, 2.5, alpha=0.1, color=COLORS['green'])
ax.text(2, 16.5, 'SWEET SPOT', ha='center', fontsize=10, color=COLORS['green'], fontweight='bold')

ax.set_ylabel('Acquisition Rate (%)', fontsize=11)
ax.set_title('Patient companies win everywhere—but NL companies may be too impatient',
             fontsize=14, fontweight='bold', loc='left', pad=20)
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(boot_cats, fontsize=11)
ax.legend(loc='upper right', fontsize=10, frameon=False)
ax.set_ylim(0, 18)

# Add key insight in a better position
ax.text(0.5, -0.12,
        'Key insight: Companies that raise too fast (<2 years) underperform everywhere',
        transform=ax.transAxes, fontsize=10, color=COLORS['gray'], style='italic',
        ha='center', verticalalignment='top')

plt.tight_layout()
plt.savefig('figures/finding3_tortoise_effect.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Finding 3: Updated with country comparison")

# === COPY TIMELINE TO FINAL REPORT ===
import shutil
shutil.copy('../legacy/task-1-analysis/figures/intl_option3_timeline.png',
            'figures/finding4_international_timeline.png')
print("✓ Added international timeline chart as Finding 4")

print("\nAll charts updated with country comparisons!")
