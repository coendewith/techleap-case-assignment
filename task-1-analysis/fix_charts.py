#!/usr/bin/env python
"""Fix Finding 2 and 3 charts - NO ARROWS, just clean text boxes"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os

# Okabe-Ito colorblind-friendly palette
COLORS = {
    'orange': '#E69F00',
    'skyblue': '#56B4E9',
    'green': '#009E73',
    'blue': '#0072B2',
    'vermillion': '#D55E00',
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

print(f"Loaded {len(df):,} companies")

regions = ['Netherlands', 'European Peers', 'USA', 'Israel']
region_codes = [['NLD'], ['GBR', 'DEU', 'FRA'], ['USA'], ['ISR']]
region_colors = [COLORS['vermillion'], COLORS['gray'], COLORS['blue'], COLORS['green']]

# ============================================================================
# FINDING 2: More Rounds = Better Outcomes
# ============================================================================

def acq_rate_by_rounds(country_codes, min_rounds):
    if isinstance(country_codes, str):
        country_codes = [country_codes]
    subset = df[df['country_code'].isin(country_codes)]
    has_rounds = subset[subset['funding_rounds'] >= min_rounds]
    if len(has_rounds) == 0:
        return 0, 0
    return has_rounds['acquired'].sum() / len(has_rounds) * 100, len(has_rounds)

fig, ax = plt.subplots(figsize=(11, 6))
tufte_style(ax)

thresholds = [1, 2, 3, 4]
threshold_labels = ['1+ round', '2+ rounds', '3+ rounds', '4+ rounds']

x = np.arange(len(thresholds))
width = 0.2

for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):
    rates = [acq_rate_by_rounds(codes, t)[0] for t in thresholds]
    offset = width * i
    bars = ax.bar(x + offset, rates, width, label=region, color=color, edgecolor='none')
    for bar, rate in zip(bars, rates):
        if rate > 0:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                    f'{rate:.0f}%', ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)

ax.set_ylabel('Acquisition Rate (%)', fontsize=11)
ax.set_title('More funding rounds = better outcomes (but few NL companies get there)',
             fontsize=14, fontweight='bold', loc='left', pad=20)
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(threshold_labels, fontsize=11)
ax.legend(loc='upper left', fontsize=10, frameon=False)
ax.set_ylim(0, 15)

plt.tight_layout()
plt.savefig('figures/finding2_rounds_matter.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Finding 2: Clean, no arrows")


# ============================================================================
# FINDING 3: Rushing Hurts NL Most
# ============================================================================

def bootstrap_rate(country_codes, year_range):
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

fig, ax = plt.subplots(figsize=(10, 6))
tufte_style(ax)

boot_cats = ['Rushed\n(<2 years)', 'Measured\n(2-5 years)', 'Patient\n(5+ years)']
boot_ranges = [(0, 2), (2, 5), (5, 20)]

x = np.arange(len(boot_cats))
width = 0.18

for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):
    rates = [bootstrap_rate(codes, br)[0] for br in boot_ranges]
    offset = width * i
    bars = ax.bar(x + offset, rates, width, label=region, color=color, edgecolor='none')
    for bar, rate in zip(bars, rates):
        if rate > 0:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                    f'{rate:.0f}%', ha='center', va='bottom', fontsize=10, fontweight='bold', color=color)

ax.set_ylabel('Acquisition Rate (%)', fontsize=11)
ax.set_title('Rushing to raise funding hurts outcomes—especially in NL (only 2%)',
             fontsize=14, fontweight='bold', loc='left', pad=20)
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(boot_cats, fontsize=11)
ax.legend(loc='upper left', fontsize=10, frameon=False)
ax.set_ylim(0, 15)

plt.tight_layout()
plt.savefig('figures/finding3_tortoise_effect.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Finding 3: Clean, no arrows")

print("\nDone - minimal clean charts")
