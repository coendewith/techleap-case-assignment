
import json

notebook_path = '/Users/coendewith/techleap/task-1-analysis/final_notebook.ipynb'

# --- REFINED CODE FOR FUNDING FUNNEL ---
funnel_source = [
    "# === FULL FUNDING FUNNEL: Stage-by-Stage Conversion ===\n",
    "print('CHART #4: Funding Funnel')\n",
    "\n",
    "def calc_conversion(country_codes, from_col, to_col):\n",
    "    \"\"\"Calculate conversion rate from one stage to next.\"\"\"\n",
    "    if isinstance(country_codes, str): country_codes = [country_codes]\n",
    "    subset = df_filtered[df_filtered['country_code'].isin(country_codes)]\n",
    "    with_from = subset[subset[from_col] > 0]\n",
    "    if len(with_from) == 0: return 0, 0\n",
    "    converted = (with_from[to_col] > 0).sum()\n",
    "    return converted / len(with_from) * 100, len(with_from)\n",
    "\n",
    "regions = ['Netherlands', 'EU Peers', 'USA', 'Israel']\n",
    "region_codes = [['NLD'], ['GBR', 'DEU', 'FRA'], ['USA'], ['ISR']]\n",
    "region_colors = [COLORS['techleap_org'], COLORS['gray'], COLORS['blue'], COLORS['green']]\n",
    "\n",
    "transitions = [\n",
    "    ('Seed → A', 'seed', 'round_A'),\n",
    "    ('A → B', 'round_A', 'round_B'),\n",
    "    ('B → C', 'round_B', 'round_C'),\n",
    "    ('C → D', 'round_C', 'round_D'),\n",
    "]\n",
    "\n",
    "fig, ax = plt.subplots(figsize=(12, 6))\n",
    "tufte_style(ax)\n",
    "\n",
    "x = np.arange(len(transitions))\n",
    "width = 0.18\n",
    "\n",
    "for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):\n",
    "    rates = [calc_conversion(codes, t[1], t[2])[0] for t in transitions]\n",
    "    \n",
    "    bars = ax.bar(x + (i - 1.5) * width, rates, width, label=region, color=color, alpha=0.9)\n",
    "    \n",
    "    # Add labels\n",
    "    for bar, rate in zip(bars, rates):\n",
    "        if rate > 0:\n",
    "            # White label inside if tall enough, otherwise color above\n",
    "            y_pos = bar.get_height() - 3 if bar.get_height() > 10 else bar.get_height() + 1\n",
    "            txt_color = 'white' if bar.get_height() > 10 else color\n",
    "            # Only label significant bars\n",
    "            if rate > 1.0 or region == 'Netherlands':\n",
    "                ax.text(bar.get_x() + bar.get_width()/2, y_pos,\n",
    "                        f'{rate:.0f}%', ha='center', va='bottom' if bar.get_height() <= 10 else 'top',\n",
    "                        fontsize=8, fontweight='bold', color=txt_color)\n",
    "\n",
    "ax.set_xticks(x)\n",
    "ax.set_xticklabels([t[0] for t in transitions], fontsize=11)\n",
    "ax.set_ylabel('Conversion Rate (%)', fontsize=10)\n",
    "ax.set_title('The Leaky Pipeline: NL Conversion Lags at Every Stage', fontweight='bold', loc='left', fontsize=13, pad=15)\n",
    "\n",
    "ax.legend(loc='upper right', frameon=False, fontsize=10)\n",
    "plt.tight_layout()\n",
    "plt.show()\n"
]

# --- REFINED CODE FOR PLAYING IT SMALL ---
small_source = [
    "# === CHART #2: Playing It Small — Final Version ===\n",
    "print('CHART #5: Playing It Small')\n",
    "\n",
    "def get_metrics_simple(country_codes):\n",
    "    if isinstance(country_codes, str): country_codes = [country_codes]\n",
    "    subset = df_filtered[df_filtered['country_code'].isin(country_codes)]\n",
    "    n = len(subset)\n",
    "    if n == 0: return 0, 0, 0\n",
    "    \n",
    "    # 1. Failure rate (closed)\n",
    "    failure = (subset['status'] == 'closed').sum() / n * 100\n",
    "    \n",
    "    # 2. Exit rate (acquired/ipo)\n",
    "    exit_rate = subset['exited'].sum() / n * 100\n",
    "    \n",
    "    # 3. Median Funding (millions)\n",
    "    funding = subset['funding_total_usd'].median()\n",
    "    funding_m = funding / 1e6 if pd.notna(funding) else 0\n",
    "    \n",
    "    return failure, funding_m, exit_rate\n",
    "\n",
    "metrics = ['Failure Rate', 'Median Funding ($M)', 'Exit Rate']\n",
    "regions = ['Netherlands', 'EU Peers', 'USA', 'Israel']\n",
    "region_codes = [['NLD'], ['GBR', 'DEU', 'FRA'], ['USA'], ['ISR']]\n",
    "region_colors = [COLORS['techleap_org'], COLORS['gray'], COLORS['blue'], COLORS['green']]\n",
    "\n",
    "data = {r: get_metrics_simple(c) for r, c in zip(regions, region_codes)}\n",
    "\n",
    "fig, axes = plt.subplots(1, 3, figsize=(15, 6))\n",
    "plt.subplots_adjust(wspace=0.4)\n",
    "\n",
    "for idx, ax in enumerate(axes):\n",
    "    tufte_style(ax)\n",
    "    metric_name = metrics[idx]\n",
    "    \n",
    "    # Get values for this metric\n",
    "    values = [data[r][idx] for r in regions]\n",
    "    \n",
    "    # Use bar chart\n",
    "    x = np.arange(len(regions))\n",
    "    bars = ax.bar(x, values, color=region_colors, alpha=0.9, width=0.6)\n",
    "    \n",
    "    # Title and labels\n",
    "    ax.set_title(metric_name, fontweight='bold', fontsize=12, pad=10)\n",
    "    ax.set_xticks(x)\n",
    "    ax.set_xticklabels(regions, rotation=45, ha='right', fontsize=10)\n",
    "    \n",
    "    # Add data labels\n",
    "    for bar, val in zip(bars, values):\n",
    "        if val > 0:\n",
    "            if idx == 1: # Money\n",
    "                label = f'${val:.1f}M'\n",
    "            else: # Percent\n",
    "                label = f'{val:.1f}%'\n",
    "                \n",
    "            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + (bar.get_height()*0.02),\n",
    "                    label, ha='center', va='bottom', fontsize=9, fontweight='bold', color='#333333')\n",
    "                    \n",
    "    # Highlight NL weakness\n",
    "    if idx == 1: # Funding\n",
    "        ax.annotate('Capital Gap', xy=(0, values[0]), xytext=(0.5, values[2]),\n",
    "                   arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=.2', color=COLORS['techleap_org']),\n",
    "                   color=COLORS['techleap_org'], fontsize=9, fontweight='bold')\n",
    "\n",
    "fig.suptitle(\"Playing It Small: NL Lags on Capital, Exits, and Risk-Taking\", fontsize=16, fontweight='bold', y=1.02)\n",
    "plt.tight_layout()\n",
    "plt.show()\n"
]

try:
    with open(notebook_path, 'r') as f:
        nb = json.load(f)

    # 1. Update Funding Funnel\n",
    found_funnel = False
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            source = "".join(cell['source'])
            if "FULL FUNDING FUNNEL" in source or "CHART #4: Funding Funnel" in source:
                print("Found Funding Funnel cell. Updating...")
                cell['source'] = funnel_source
                found_funnel = True
                break
    
    # 2. Update Playing It Small\n",
    found_small = False
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            source = "".join(cell['source'])
            if "CHART #2: Playing It Small" in source or "CHART #5: Playing It Small" in source:
                print("Found Playing It Small cell. Updating...")
                cell['source'] = small_source
                found_small = True
                break

    if found_funnel or found_small:
        with open(notebook_path, 'w') as f:
            json.dump(nb, f, indent=1)
        print("Notebook updated successfully.")
    else:
        print("Could not find one or more chart cells.")

except Exception as e:
    print(f"Error: {e}")
