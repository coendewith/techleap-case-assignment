
import json

notebook_path = '/Users/coendewith/techleap/task-1-analysis/all_charts_gallery.ipynb'

# Refined code for Chart 1
refined_source = [
    "# === CHART #1: finding1_graduation_gap.png (Score: 24) ===\n",
    "print('CHART #1: The Graduation Gap')\n",
    "\n",
    "# Add funding year for period analysis\n",
    "df['funding_year'] = df['first_funding_at'].dt.year\n",
    "\n",
    "def seed_to_a_rate_period(codes, year_start, year_end):\n",
    "    \"\"\"Calculate Seed→A conversion for a specific time period\"\"\"\n",
    "    if isinstance(codes, str): codes = [codes]\n",
    "    subset = df[(df['country_code'].isin(codes)) & \n",
    "                (df['funding_year'] >= year_start) & \n",
    "                (df['funding_year'] <= year_end)]\n",
    "    with_seed = subset[subset['had_seed']]\n",
    "    with_a = with_seed[with_seed['had_series_a']]\n",
    "    if len(with_seed) < 5:  # Minimum sample size\n",
    "        return np.nan, len(with_seed)\n",
    "    return len(with_a) / len(with_seed) * 100, len(with_seed)\n",
    "\n",
    "# Define regions and time periods\n",
    "regions = ['Netherlands', 'EU Peers', 'USA', 'Israel']\n",
    "region_codes = [['NLD'], ['GBR', 'DEU', 'FRA'], ['USA'], ['ISR']]\n",
    "region_colors = [COLORS['vermillion'], COLORS['gray'], COLORS['blue'], COLORS['green']]\n",
    "\n",
    "periods = [('2005-2007', 2005, 2007), ('2008-2010', 2008, 2010), ('2011-2014', 2011, 2014)]\n",
    "period_labels = [p[0] for p in periods]\n",
    "\n",
    "# Calculate rates for each region and period\n",
    "fig, ax = plt.subplots(figsize=(12, 6))\n",
    "tufte_style(ax)\n",
    "\n",
    "x = np.arange(len(period_labels))\n",
    "width = 0.18\n",
    "multiplier = 0\n",
    "\n",
    "# First pass: collect all rates to determine y-axis max\n",
    "all_rates = []\n",
    "for region, codes, color in zip(regions, region_codes, region_colors):\n",
    "    for label, start, end in periods:\n",
    "        rate, n = seed_to_a_rate_period(codes, start, end)\n",
    "        if pd.notna(rate):\n",
    "            all_rates.append(rate)\n",
    "\n",
    "y_max = max(all_rates) + 10 if all_rates else 70  # Add padding\n",
    "\n",
    "# Second pass: draw bars\n",
    "for region, codes, color in zip(regions, region_codes, region_colors):\n",
    "    rates = []\n",
    "    for label, start, end in periods:\n",
    "        rate, n = seed_to_a_rate_period(codes, start, end)\n",
    "        rates.append(rate)\n",
    "    \n",
    "    offset = width * multiplier\n",
    "    bars = ax.bar(x + offset, rates, width, label=region, color=color, alpha=0.9)\n",
    "    \n",
    "    # Add value labels INSIDE bars (at top) to avoid overlap\n",
    "    for bar, rate in zip(bars, rates):\n",
    "        if pd.notna(rate):\n",
    "            # Position label inside bar if bar is tall enough, otherwise above\n",
    "            label_y = bar.get_height() - 2 if bar.get_height() > 5 else bar.get_height() + 0.5\n",
    "            label_color = 'white' if bar.get_height() > 5 else color\n",
    "            ax.text(bar.get_x() + bar.get_width()/2, label_y,\n",
    "                    f'{rate:.0f}%', ha='center', va='bottom' if bar.get_height() <= 5 else 'top', \n",
    "                    fontsize=8, color=label_color, fontweight='bold')\n",
    "    \n",
    "    multiplier += 1\n",
    "\n",
    "ax.set_xticks(x + width * 1.5)\n",
    "ax.set_xticklabels(period_labels, fontsize=11)\n",
    "ax.set_ylabel('Seed → Series A\\nConversion Rate (%)', fontsize=10)\n",
    "ax.set_title('The Graduation Gap Persists: NL Lags Behind Across All Periods', \n",
    "             fontweight='bold', fontsize=13, loc='left', pad=15)\n",
    "\n",
    "# Move legend to upper right, outside the bar area\n",
    "ax.legend(loc='upper right', frameon=False, fontsize=10, ncol=2)\n",
    "\n",
    "# Set proper y-axis limit\n",
    "ax.set_ylim(0, y_max)\n",
    "\n",
    "# Add reference line\n",
    "ax.axhline(y=15, color=COLORS['gray'], linestyle='--', alpha=0.4, linewidth=1)\n",
    "ax.text(2.65, 16, 'Target 15%', fontsize=9, color=COLORS['gray'], style='italic', ha='right')\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()\n",
    "\n",
    "# Print summary table\n",
    "print('\\n📊 Seed→Series A Conversion by Period:')\n",
    "print('-' * 50)\n",
    "for label, start, end in periods:\n",
    "    print(f'\\n{label}:')\n",
    "    for region, codes in zip(regions, region_codes):\n",
    "        rate, n = seed_to_a_rate_period(codes, start, end)\n",
    "        if pd.notna(rate):\n",
    "            print(f'  {region}: {rate:.1f}% (n={n})')\n"
]

try:
    with open(notebook_path, 'r') as f:
        nb = json.load(f)

    found = False
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            source = "".join(cell['source'])
            if "CHART #1: finding1_graduation_gap.png" in source:
                print("Found Chart 1 cell. Updating...")
                cell['source'] = refined_source
                found = True
                break
    
    if found:
        with open(notebook_path, 'w') as f:
            json.dump(nb, f, indent=1)
        print("Chart 1 updated successfully.")
    else:
        print("Chart 1 cell not found.")

except Exception as e:
    print(f"Error: {e}")
