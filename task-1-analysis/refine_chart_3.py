
import json

notebook_path = '/Users/coendewith/techleap/task-1-analysis/all_charts_gallery.ipynb'

# Refined code for Chart 3
refined_source = [
    "# === CHART #3: finding3_tortoise_effect.png (Score: 24) ===\n",
    "print('CHART #3: The Patience Premium')\n",
    "\n",
    "def bootstrap_rate(country_codes, year_range):\n",
    "    if isinstance(country_codes, str): country_codes = [country_codes]\n",
    "    subset = df_timing[df_timing['country_code'].isin(country_codes)]\n",
    "    in_range = subset[(subset['years_to_funding'] >= year_range[0]) & (subset['years_to_funding'] < year_range[1])]\n",
    "    if len(in_range) == 0: return 0, 0\n",
    "    return in_range['acquired'].sum() / len(in_range) * 100, len(in_range)\n",
    "\n",
    "boot_cats = ['Rushed (<2 years)', 'Measured (2-5 years)', 'Patient (5+ years)']\n",
    "boot_ranges = [(0, 2), (2, 5), (5, 20)]\n",
    "\n",
    "fig, ax = plt.subplots(figsize=(12, 6))\n",
    "tufte_style(ax)\n",
    "x = np.arange(len(boot_cats))\n",
    "width = 0.18\n",
    "\n",
    "for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):\n",
    "    # Calculate rates\n",
    "    rates = [bootstrap_rate(codes, br)[0] for br in boot_ranges]\n",
    "    \n",
    "    # Draw bars\n",
    "    bars = ax.bar(x + (i - 1.5) * width, rates, width, label=region, color=color, alpha=0.9)\n",
    "    \n",
    "    # Add value labels\n",
    "    for bar, rate in zip(bars, rates):\n",
    "        if rate > 0:\n",
    "            # White label inside if tall enough, otherwise color above\n",
    "            y_pos = bar.get_height() - 1.5 if bar.get_height() > 3 else bar.get_height() + 0.2\n",
    "            txt_color = 'white' if bar.get_height() > 3 else color\n",
    "            # Only label significant bars to avoid clutter, or all bars if requested\n",
    "            if rate > 1.0: \n",
    "                ax.text(bar.get_x() + bar.get_width()/2, y_pos,\n",
    "                        f'{rate:.1f}%', ha='center', va='bottom' if bar.get_height() <= 3 else 'top',\n",
    "                        fontsize=8, fontweight='bold', color=txt_color)\n",
    "\n",
    "ax.set_xticks(x)\n",
    "ax.set_xticklabels(boot_cats, fontsize=11)\n",
    "ax.set_ylabel('Acquisition Rate (%)', fontsize=10)\n",
    "ax.set_title('The Patience Premium: Rushing (<2 Years) Hurts NL Startups Most', fontweight='bold', loc='left', fontsize=13, pad=15)\n",
    "\n",
    "# Highlight the negative impact on NL\n",
    "ax.annotate('NL Performance Gap', xy=(0 - 1.5*width, 2.5), xytext=(0, 8),\n",
    "            arrowprops=dict(facecolor=COLORS['vermillion'], shrink=0.05, alpha=0.5),\n",
    "            fontsize=9, color=COLORS['vermillion'], fontweight='bold')\n",
    "\n",
    "ax.legend(loc='upper left', frameon=False, fontsize=10, ncol=2)\n",
    "plt.tight_layout()\n",
    "plt.show()\n",
    "\n",
    "# Print insights\n",
    "print('\\n📊 Acquisition Rate by Time to First Funding:')\n",
    "for t_idx, t_label in enumerate(boot_cats):\n",
    "    print(f'\\n{t_label}:')\n",
    "    for region, codes in zip(regions, region_codes):\n",
    "        r = bootstrap_rate(codes, boot_ranges[t_idx])[0]\n",
    "        print(f'  {region}: {r:.1f}%')\n"
]

try:
    with open(notebook_path, 'r') as f:
        nb = json.load(f)

    found = False
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            source = "".join(cell['source'])
            if "CHART #3: finding3_tortoise_effect.png" in source:
                print("Found Chart 3 cell. Updating...")
                cell['source'] = refined_source
                found = True
                break
    
    if found:
        with open(notebook_path, 'w') as f:
            json.dump(nb, f, indent=1)
        print("Chart 3 updated successfully.")
    else:
        print("Chart 3 cell not found.")

except Exception as e:
    print(f"Error: {e}")
