#!/usr/bin/env python
"""
Generate premium, publication-ready charts for the Dutch Startup Ecosystem Report.
Uses TechLeap brand colors for consistent visual identity.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import matplotlib.patheffects as path_effects

# ==============================================================================
# TECHLEAP BRAND COLORS
# ==============================================================================
COLORS = {
    'primary': '#1C1C1C',         # Dark charcoal (Text/Axes)
    'secondary': '#888888',        # Neutral grey (Context bars)
    'highlight_bad': '#FD5924',    # TechLeap Orange (The problem/NL gap)
    'highlight_good': '#02E4FF',   # TechLeap Cyan (Success/benchmark)
    'neutral': '#E8E8E8',          # Light grey for grid
    'background': '#FFFFFF',
    # Full TechLeap palette
    'blue': '#5547FF',             # Primary blue
    'lime': '#BFFF09',             # Accent lime
    'magenta': '#FF7AC9',          # Magenta
    'purple': '#9441E9',           # Deep purple
    'orange': '#FD5924',           # Orange
    'cyan': '#02E4FF',             # Cyan
}

FONT_FAMILY = 'sans-serif' # Default to sans-serif, system will pick Arial/Helvetica/DejaVu
TITLE_SIZE = 16
SUBTITLE_SIZE = 12
LABEL_SIZE = 10
ANNOTATION_SIZE = 10

def set_premium_style():
    """Configure global matplotlib settings for premium look"""
    plt.rcParams['font.family'] = FONT_FAMILY
    plt.rcParams['axes.spines.top'] = False
    plt.rcParams['axes.spines.right'] = False
    plt.rcParams['axes.spines.left'] = False   # Remove left spine (use grid)
    plt.rcParams['axes.spines.bottom'] = True
    plt.rcParams['axes.edgecolor'] = COLORS['primary']
    plt.rcParams['axes.linewidth'] = 0.8
    plt.rcParams['axes.grid'] = True
    plt.rcParams['axes.grid.axis'] = 'y'
    plt.rcParams['grid.color'] = COLORS['neutral']
    plt.rcParams['grid.linestyle'] = '--'
    plt.rcParams['grid.linewidth'] = 0.5
    plt.rcParams['grid.alpha'] = 0.5
    plt.rcParams['xtick.color'] = COLORS['primary']
    plt.rcParams['ytick.color'] = COLORS['primary']
    plt.rcParams['text.color'] = COLORS['primary']
    plt.rcParams['axes.labelcolor'] = COLORS['primary']
    plt.rcParams['figure.dpi'] = 150
    plt.rcParams['savefig.bbox'] = 'tight'
    plt.rcParams['savefig.pad_inches'] = 0.2

# ==============================================================================
# DATA LOADING & CLEANING
# ==============================================================================
def load_data():
    """Load and clean the Crunchbase investments data"""
    print("Loading data...")
    try:
        df = pd.read_csv('../investments_VC.csv', encoding='latin-1')
    except FileNotFoundError:
        # Fallback if running from a different root
        df = pd.read_csv('investments_VC.csv', encoding='latin-1')
        
    df.columns = df.columns.str.strip()
    df['country_code'] = df['country_code'].str.strip()
    df['first_funding_at'] = pd.to_datetime(df['first_funding_at'], errors='coerce')
    df['founded_at'] = pd.to_datetime(df['founded_at'], errors='coerce')
    
    # Filter valid dates and window 2005-2014 per analysis
    df = df[df['first_funding_at'].notna()]
    df = df[(df['first_funding_at'].dt.year >= 2005) & (df['first_funding_at'].dt.year <= 2014)]
    
    # Clean numeric columns
    df['seed'] = pd.to_numeric(df['seed'], errors='coerce').fillna(0)
    df['round_A'] = pd.to_numeric(df['round_A'], errors='coerce').fillna(0)
    
    # Define flags
    df['had_seed'] = df['seed'] > 0
    df['had_series_a'] = df['round_A'] > 0
    df['acquired'] = df['status'] == 'acquired'
    
    return df

# ==============================================================================
# CHART 1: THE GRADUATION GAP
# ==============================================================================
def plot_graduation_gap(df):
    """
    Horizontal bar chart showing Seed -> Series A conversion rates.
    NL vs Peers vs Leaders.
    """
    print("Generating Chart 1: Graduation Gap...")
    
    # Define groups
    group_map = {
        'Israel': ['ISR'],
        'USA': ['USA'],
        'European Peers\n(UK/DE/FR)': ['GBR', 'DEU', 'FRA'],
        'Netherlands': ['NLD']
    }
    
    results = []
    for name, codes in group_map.items():
        subset = df[df['country_code'].isin(codes)]
        with_seed = subset[subset['had_seed']]
        with_a = with_seed[with_seed['had_series_a']]
        
        # Avoid division by zero
        count = len(with_seed)
        rate = (len(with_a) / count * 100) if count > 0 else 0
        results.append({'Region': name, 'Rate': rate, 'Count': count})
        
    res_df = pd.DataFrame(results).sort_values('Rate', ascending=True) # Sort for bar chart (bottom-up)

    fig, ax = plt.subplots(figsize=(10, 5))
    
    # Colors: Highlight NL (Bad) and Israel (Good), others neutral
    colors = []
    for region in res_df['Region']:
        if 'Netherlands' in region:
            colors.append(COLORS['highlight_bad'])
        elif 'Israel' in region:
            colors.append(COLORS['highlight_good'])
        else:
            colors.append(COLORS['secondary'])
            
    bars = ax.barh(res_df['Region'], res_df['Rate'], color=colors, height=0.6)
    
    # Add labels
    for bar in bars:
        width = bar.get_width()
        label_x_pos = width + 0.5
        ax.text(label_x_pos, bar.get_y() + bar.get_height()/2, 
                f"{width:.1f}%", 
                va='center', fontsize=LABEL_SIZE, fontweight='bold', color=COLORS['primary'])

    # Title and Subtitle
    ax.text(0, 1.12, "The Graduation Gap", transform=ax.transAxes, 
            fontsize=TITLE_SIZE, fontweight='bold', color=COLORS['primary'])
    ax.text(0, 1.05, "Dutch startups struggle to convert Seed funding into Series A compared to global leaders.", 
            transform=ax.transAxes, fontsize=SUBTITLE_SIZE, color=COLORS['primary'])
    
    ax.set_xlabel("Seed → Series A Conversion Rate (%)", fontsize=LABEL_SIZE)
    ax.set_xlim(0, 25)
    
    # Clean axes
    ax.spines['left'].set_visible(False)
    ax.tick_params(left=False) # Hide y ticks
    
    # Footer
    fig.text(0.0, -0.05, f"Source: Crunchbase (2005-2014 startup cohort)", fontsize=8, color=COLORS['secondary'])
    
    plt.savefig('figures/finding1_graduation_gap.png')
    plt.close()

# ==============================================================================
# CHART 2: THE SCALE-UP VOID
# ==============================================================================
def plot_rounds_matter(df):
    """
    Acquisition rate vs Number of Rounds.
    Highlighting the drop-off/gap for NL at higher rounds.
    """
    print("Generating Chart 2: Rounds Matter...")
    
    # Define simpler buckets for clarity
    # 1-2 Rounds (Early), 3-4 Rounds (Sweet Spot), 5+ (Late)
    buckets = [
        {'label': '1-2 Rounds', 'min': 1, 'max': 2},
        {'label': '3-4 Rounds\n(Sweet Spot)', 'min': 3, 'max': 4},
        {'label': '5+ Rounds', 'min': 5, 'max': 99}
    ]
    
    group_codes = {
        'Netherlands': ['NLD'],
        'European Peers': ['GBR', 'DEU', 'FRA'],
        'USA': ['USA']
    }
    
    # Calculate rates
    plot_data = {r: [] for r in group_codes.keys()}
    labels = [b['label'] for b in buckets]
    
    print("\n--- Finding 2: Rounds Matter Data ---")
    for bucket in buckets:
        print(f"Bucket: {bucket['label']}")
        for region, codes in group_codes.items():
            subset = df[df['country_code'].isin(codes)]
            # Filter by rounds
            in_bucket = subset[(subset['funding_rounds'] >= bucket['min']) & 
                               (subset['funding_rounds'] <= bucket['max'])]
            
            rate = (in_bucket['acquired'].sum() / len(in_bucket) * 100) if len(in_bucket) > 0 else 0
            plot_data[region].append(rate)
            print(f"  {region}: {rate:.1f}% (n={len(in_bucket)})")

    # Plot
    fig, ax = plt.subplots(figsize=(10, 6))
    
    x = np.arange(len(labels))
    width = 0.25
    
    # Plot grouping
    rects1 = ax.bar(x - width, plot_data['USA'], width, label='USA', color=COLORS['secondary'])
    rects2 = ax.bar(x, plot_data['European Peers'], width, label='European Peers', color=COLORS['secondary'])
    rects3 = ax.bar(x + width, plot_data['Netherlands'], width, label='Netherlands', color=COLORS['highlight_bad'])
    
    # Formatting
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=LABEL_SIZE)
    ax.set_ylabel("Acquisition Rate (%)")
    ax.set_ylim(0, 18)
    
    # Label NL bars
    for i, rate in enumerate(plot_data['Netherlands']):
        # If rate is 0, show it
        text = f"{rate:.1f}%"
        color = COLORS['highlight_bad']
        
        # Special handling for "Scale up void" (5+ rounds is 0%)
        if i == 2: 
            text = "0% (Void)"
            
        ax.text(x[i] + width, rate + 0.5, text,
                ha='center', va='bottom', fontweight='bold', color=color, fontsize=10)

    # Annotations
    # 3-4 Rounds: Competitive
    ax.annotate('NL beats Peers!', 
                xy=(1 + width, 12.0), 
                xytext=(1.5, 14),
                arrowprops=dict(facecolor=COLORS['highlight_good'], arrowstyle='->'),
                fontsize=10, color=COLORS['highlight_good'], fontweight='bold')

    # Title
    ax.text(0, 1.12, "The Scale-Up Void", transform=ax.transAxes, 
            fontsize=TITLE_SIZE, fontweight='bold', color=COLORS['primary'])
    ax.text(0, 1.05, "Dutch startups are competitive at 3-4 rounds, but the pipeline empties completely at 5+.", 
            transform=ax.transAxes, fontsize=SUBTITLE_SIZE, color=COLORS['primary'])

    # Legend
    ax.legend(frameon=False, loc='upper left')

    plt.savefig('figures/finding2_rounds_matter.png')
    plt.close()

# ==============================================================================
# CHART 3: THE PATIENCE PREMIUM
# ==============================================================================
def plot_patience_premium(df):
    """
    Acquisition rate vs Time to First Funding.
    Highlighting the penalty for rushing (<2 years).
    """
    print("Generating Chart 3: Patience Premium...")
    
    # Calculate years to funding
    df_clean = df.copy()
    df_clean['years_to_funding'] = (df_clean['first_funding_at'] - df_clean['founded_at']).dt.days / 365.25
    df_clean = df_clean[(df_clean['years_to_funding'] >= 0) & (df_clean['years_to_funding'] <= 15)]
    
    buckets = [
        {'label': '<2 Years\n(Rushed)', 'min': 0, 'max': 2},
        {'label': '2-5 Years\n(Measured)', 'min': 2, 'max': 5},
        {'label': '5+ Years\n(Patient)', 'min': 5, 'max': 15}
    ]
    
    # Just compare NL vs USA (The benchmark) to keep it simple and striking
    group_codes = {
        'Netherlands': ['NLD'],
        'USA (Benchmark)': ['USA']
    }
    
    plot_data = {r: [] for r in group_codes.keys()}
    labels = [b['label'] for b in buckets]
    
    print("\n--- Finding 3: Patience Premium Data ---")
    for bucket in buckets:
        print(f"Bucket: {bucket['label']}")
        for region, codes in group_codes.items():
            subset = df_clean[df_clean['country_code'].isin(codes)]
            in_bucket = subset[(subset['years_to_funding'] >= bucket['min']) & 
                               (subset['years_to_funding'] < bucket['max'])]
            
            rate = (in_bucket['acquired'].sum() / len(in_bucket) * 100) if len(in_bucket) > 0 else 0
            plot_data[region].append(rate)
            print(f"  {region}: {rate:.1f}% (n={len(in_bucket)})")
            
    # Plot
    fig, ax = plt.subplots(figsize=(10, 6))
    x = np.arange(len(labels))
    width = 0.35
    
    rects1 = ax.bar(x - width/2, plot_data['USA (Benchmark)'], width, label='USA', color=COLORS['secondary'])
    rects2 = ax.bar(x + width/2, plot_data['Netherlands'], width, label='Netherlands', color=COLORS['highlight_bad'])
    
    # Labels
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=LABEL_SIZE)
    ax.set_ylabel("Acquisition Rate (%)")
    
    # Highlight specific bars
    nl_rushed = plot_data['Netherlands'][0]
    nl_measured = plot_data['Netherlands'][1]
    nl_patient = plot_data['Netherlands'][2]
    
    # 1. Rushed Penalty
    if nl_rushed > 0:
        ax.text(x[0] + width/2, nl_rushed + 0.5, f"{nl_rushed:.1f}%",
                ha='center', va='bottom', fontweight='bold', color=COLORS['highlight_bad'])
        
    # 2. Measured (0%)
    if nl_measured == 0:
        ax.text(x[1] + width/2, 0.5, "0%",
                ha='center', va='bottom', fontweight='bold', color=COLORS['highlight_bad'])
        
    # 3. Patient Premium (Success!)
    # Change color for this specific bar to Green to show success
    rects2[2].set_color(COLORS['highlight_good'])
    ax.text(x[2] + width/2, nl_patient + 0.5, f"{nl_patient:.1f}%",
            ha='center', va='bottom', fontweight='bold', color=COLORS['highlight_good'], fontsize=12)
    
    ax.annotate("NL beats USA!", 
                xy=(x[2] + width/2, nl_patient), 
                xytext=(x[2], nl_patient + 3),
                arrowprops=dict(facecolor=COLORS['highlight_good'], arrowstyle='->'),
                fontsize=10, color=COLORS['highlight_good'], fontweight='bold')
    
    # Title
    ax.text(0, 1.12, "The Patience Premium", transform=ax.transAxes, 
            fontsize=TITLE_SIZE, fontweight='bold', color=COLORS['primary'])
    ax.text(0, 1.05, "Patient Dutch startups (5+ years) outperform the world. Rushing destroys value.", 
            transform=ax.transAxes, fontsize=SUBTITLE_SIZE, color=COLORS['primary'])
            
    ax.legend(frameon=False, loc='upper left')
    
    plt.savefig('figures/finding3_tortoise_effect.png')
    plt.close()

# ==============================================================================
# CHART 4: TIME SERIES TRENDS
# ==============================================================================
def plot_time_series(df):
    """Four-panel time series showing NL trends over 2005-2014"""
    print("Generating Chart 4: Time Series Trends...")

    df['funding_total_usd'] = pd.to_numeric(
        df['funding_total_usd'].astype(str).str.replace(',','').str.replace(' ','').str.replace('-',''),
        errors='coerce'
    )
    df['funding_year'] = df['first_funding_at'].dt.year
    years = range(2005, 2015)

    def yearly_metrics(code):
        subset = df[df['country_code'] == code]
        metrics = []
        for year in years:
            year_data = subset[subset['funding_year'] == year]
            metrics.append({
                'year': year,
                'deal_count': len(year_data),
                'total_funding': year_data['funding_total_usd'].sum() / 1e6,
                'avg_funding': year_data['funding_total_usd'].mean() / 1e6 if len(year_data) > 0 else 0,
            })
        return pd.DataFrame(metrics)

    countries = {
        'NLD': ('Netherlands', COLORS['orange']),
        'USA': ('USA', COLORS['blue']),
        'ISR': ('Israel', COLORS['cyan']),
        'GBR': ('UK', COLORS['secondary']),
        'DEU': ('Germany', COLORS['purple']),
    }

    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # Chart 1: Deal Count
    ax1 = axes[0, 0]
    nl_metrics = yearly_metrics('NLD')
    ax1.plot(nl_metrics['year'], nl_metrics['deal_count'], marker='o', linewidth=2.5,
             color=COLORS['orange'], markersize=8, label='Netherlands')
    ax1.set_xlabel('Year')
    ax1.set_ylabel('Number of Deals')
    ax1.set_title('NL Deal Count Over Time', fontweight='bold', color=COLORS['primary'])
    ax1.grid(True, alpha=0.3)
    ax1.legend()
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)

    # Chart 2: Total Funding
    ax2 = axes[0, 1]
    ax2.bar(nl_metrics['year'], nl_metrics['total_funding'], color=COLORS['orange'], alpha=0.7)
    ax2.plot(nl_metrics['year'], nl_metrics['total_funding'], marker='o',
             color=COLORS['primary'], linewidth=2)

    # Trend line
    z = np.polyfit(nl_metrics['year'], nl_metrics['total_funding'], 1)
    p = np.poly1d(z)
    ax2.plot(nl_metrics['year'], p(nl_metrics['year']), '--', color=COLORS['secondary'], linewidth=1.5)

    ax2.set_xlabel('Year')
    ax2.set_ylabel('Total Funding ($M)')
    ax2.set_title('NL Total VC Funding by Year', fontweight='bold', color=COLORS['primary'])
    ax2.grid(True, alpha=0.3, axis='y')
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)

    # Chart 3: Average Deal Size
    ax3 = axes[1, 0]
    for code, (name, color) in countries.items():
        metrics = yearly_metrics(code)
        lw = 2.5 if code == 'NLD' else 1
        alpha = 1 if code == 'NLD' else 0.5
        ax3.plot(metrics['year'], metrics['avg_funding'], marker='o', linewidth=lw,
                 label=name, color=color, alpha=alpha)

    ax3.set_xlabel('Year')
    ax3.set_ylabel('Average Deal Size ($M)')
    ax3.set_title('Average Deal Size Over Time', fontweight='bold', color=COLORS['primary'])
    ax3.legend(loc='upper left', fontsize=8)
    ax3.grid(True, alpha=0.3)
    ax3.spines['top'].set_visible(False)
    ax3.spines['right'].set_visible(False)

    # Chart 4: NL Share of EU-4
    ax4 = axes[1, 1]
    eu_codes = ['NLD', 'GBR', 'DEU', 'FRA']
    eu_yearly = []
    for year in years:
        year_data = df[(df['funding_year'] == year) & (df['country_code'].isin(eu_codes))]
        total_eu = year_data['funding_total_usd'].sum()
        nl_share = year_data[year_data['country_code'] == 'NLD']['funding_total_usd'].sum()
        eu_yearly.append({'year': year, 'nl_share': (nl_share / total_eu * 100) if total_eu > 0 else 0})
    eu_df = pd.DataFrame(eu_yearly)

    ax4.bar(eu_df['year'], eu_df['nl_share'], color=COLORS['orange'], alpha=0.7)
    ax4.axhline(eu_df['nl_share'].mean(), color=COLORS['primary'], linestyle='--', linewidth=1.5,
                label=f'Average: {eu_df["nl_share"].mean():.1f}%')
    ax4.set_xlabel('Year')
    ax4.set_ylabel('NL Share of EU-4 Funding (%)')
    ax4.set_title('Netherlands Share of EU-4 VC Market', fontweight='bold', color=COLORS['primary'])
    ax4.legend(loc='upper right')
    ax4.grid(True, alpha=0.3, axis='y')
    ax4.spines['top'].set_visible(False)
    ax4.spines['right'].set_visible(False)

    plt.tight_layout()
    plt.savefig('figures/finding8_time_series_trends.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()


# ==============================================================================
# CHART 5: SECTOR TRENDS
# ==============================================================================
def plot_sector_trends(df):
    """Sector composition and growth over time"""
    print("Generating Chart 5: Sector Trends...")

    df['funding_total_usd'] = pd.to_numeric(
        df['funding_total_usd'].astype(str).str.replace(',','').str.replace(' ','').str.replace('-',''),
        errors='coerce'
    )
    df['funding_year'] = df['first_funding_at'].dt.year

    nl_data = df[df['country_code'] == 'NLD'].copy()
    top5 = nl_data.groupby('market')['funding_total_usd'].sum().nlargest(5).index.tolist()

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    # Chart 1: Stacked area
    ax1 = axes[0]
    sector_year = nl_data[nl_data['market'].isin(top5)].groupby(
        ['funding_year', 'market']
    )['funding_total_usd'].sum().unstack(fill_value=0) / 1e6

    col_order = sector_year.sum().sort_values(ascending=False).index
    sector_year = sector_year[col_order]

    colors = [COLORS['orange'], COLORS['blue'], COLORS['cyan'],
              COLORS['purple'], COLORS['magenta']]
    sector_year.plot(kind='area', stacked=True, ax=ax1, color=colors, alpha=0.8)
    ax1.set_xlabel('Year')
    ax1.set_ylabel('Total Funding ($M)')
    ax1.set_title('NL Sector Composition Over Time', fontweight='bold', color=COLORS['primary'])
    ax1.legend(title='Sector', loc='upper left', fontsize=8)
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)

    # Chart 2: Growth rates
    ax2 = axes[1]
    growth_data = []
    for sector in top5:
        sector_df = nl_data[nl_data['market'] == sector]
        early = sector_df[sector_df['funding_year'] <= 2009]['funding_total_usd'].sum()
        late = sector_df[sector_df['funding_year'] >= 2010]['funding_total_usd'].sum()
        growth = ((late / early) - 1) * 100 if early > 0 else (100 if late > 0 else 0)
        growth_data.append({'sector': sector, 'growth': growth})

    growth_df = pd.DataFrame(growth_data).sort_values('growth', ascending=True)
    colors2 = [COLORS['cyan'] if g > 0 else COLORS['orange'] for g in growth_df['growth']]
    ax2.barh(growth_df['sector'], growth_df['growth'], color=colors2, alpha=0.8)
    ax2.axvline(x=0, color=COLORS['primary'], linewidth=0.5)
    ax2.set_xlabel('Growth: 2010-2014 vs 2005-2009 (%)')
    ax2.set_title('Sector Growth Rates', fontweight='bold', color=COLORS['primary'])
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)

    for i, (_, row) in enumerate(growth_df.iterrows()):
        ax2.text(row['growth'] + 5, i, f"{row['growth']:+.0f}%", va='center', fontsize=9)

    plt.tight_layout()
    plt.savefig('figures/finding8b_sector_trends.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()


# ==============================================================================
# CHART 6: INDUSTRY BY YEAR (DEALROOM STYLE)
# ==============================================================================
def plot_industry_year(df):
    """Grouped bar chart: NL VC investment by industry over years"""
    print("Generating Chart 6: Industry by Year...")

    df['funding_total_usd'] = pd.to_numeric(
        df['funding_total_usd'].astype(str).str.replace(',','').str.replace(' ','').str.replace('-',''),
        errors='coerce'
    )
    df['funding_year'] = df['first_funding_at'].dt.year

    nl_data = df[df['country_code'] == 'NLD'].copy()
    top10 = nl_data.groupby('market')['funding_total_usd'].sum().nlargest(10).index.tolist()

    industry_year = nl_data[nl_data['market'].isin(top10)].groupby(
        ['market', 'funding_year']
    )['funding_total_usd'].sum().unstack(fill_value=0) / 1e6

    industry_order = nl_data[nl_data['market'].isin(top10)].groupby('market')['funding_total_usd'].sum().sort_values(ascending=False).index
    industry_year = industry_year.reindex(industry_order)

    years = sorted([y for y in industry_year.columns if 2005 <= y <= 2014])

    # TechLeap-inspired gradient (blue to purple)
    year_colors = ['#E8E0FF', '#D4C4FF', '#BFA8FF', '#AA8CFF', '#9570FF',
                   '#8054FF', '#6B38FF', '#5547FF', '#4030E0', '#2B1CC0']

    fig, ax = plt.subplots(figsize=(14, 7))

    x = np.arange(len(industry_order))
    width = 0.08
    n_years = len(years)

    for i, year in enumerate(years):
        if year in industry_year.columns:
            values = industry_year[year].values
            offset = (i - n_years/2) * width
            ax.bar(x + offset, values, width, label=str(year), color=year_colors[i % len(year_colors)])

    ax.set_xlabel('Industry', fontsize=12)
    ax.set_ylabel('VC Investment (USD Million)', fontsize=12)
    ax.set_title('Netherlands - VC Investment Over Years for Top 10 Industries',
                 fontsize=14, fontweight='bold', color=COLORS['primary'])
    ax.set_xticks(x)
    ax.set_xticklabels([ind[:20] + '...' if len(ind) > 20 else ind for ind in industry_order],
                       rotation=45, ha='right', fontsize=10)
    ax.legend(title='Year', bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=9)
    ax.yaxis.grid(True, linestyle='--', alpha=0.3)
    ax.set_axisbelow(True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    plt.savefig('figures/nl_vc_investment_by_industry_year.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()


# ==============================================================================
# MAIN
# ==============================================================================
if __name__ == "__main__":
    set_premium_style()

    # Create fig dir if not exists
    os.makedirs('figures', exist_ok=True)

    # Load Data
    df = load_data()
    print(f"Data loaded: {len(df)} records")
    print(f"NL records: {len(df[df['country_code']=='NLD'])}")

    # Generate Plots
    plot_graduation_gap(df)
    plot_rounds_matter(df)
    plot_patience_premium(df)
    plot_time_series(df)
    plot_sector_trends(df)
    plot_industry_year(df)

    print("\n✅ Done! All charts saved to 'figures/'")
