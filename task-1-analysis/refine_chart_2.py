
import json

notebook_path = '/Users/coendewith/techleap/task-1-analysis/all_charts_gallery.ipynb'

# Refined code for Chart 2
refined_source = [
    "# === CHART #2: finding2_rounds_matter.png (Score: 24) ===\n",
    "print('CHART #2: More Rounds = Better Outcomes')\n",
    "\n",
    "def acq_rate_by_rounds(country_codes, min_rounds):\n",
    "    if isinstance(country_codes, str): country_codes = [country_codes]\n",
    "    subset = df[df['country_code'].isin(country_codes)]\n",
    "    has_rounds = subset[subset['funding_rounds'] >= min_rounds]\n",
    "    if len(has_rounds) == 0: return 0, 0\n",
    "    return has_rounds['acquired'].sum() / len(has_rounds) * 100, len(has_rounds)\n",
    "\n",
    "regions = ['Netherlands', 'EU Peers', 'USA', 'Israel']\n",
    "region_codes = [['NLD'], ['GBR', 'DEU', 'FRA'], ['USA'], ['ISR']]\n",
    "region_colors = [COLORS['vermillion'], COLORS['gray'], COLORS['blue'], COLORS['green']]\n",
    "thresholds = [1, 2, 3, 4]\n",
    "threshold_labels = ['1+ round', '2+ rounds', '3+ rounds', '4+ rounds']\n",
    "\n",
    "fig, ax = plt.subplots(figsize=(12, 6))\n",
    "tufte_style(ax)\n",
    "x = np.arange(len(threshold_labels))\n",
    "width = 0.18\n",
    "\n",
    "for i, (region, codes, color) in enumerate(zip(regions, region_codes, region_colors)):\n",
    "    # Calculate rates\n",
    "    rates = [acq_rate_by_rounds(codes, t)[0] for t in thresholds]\n",
    "    \n",
    "    # Draw bars\n",
    "    bars = ax.bar(x + (i - 1.5) * width, rates, width, label=region, color=color, alpha=0.9)\n",
    "    \n",
    "    # Add value labels\n",
    "    for bar, rate in zip(bars, rates):\n",
    "        if rate > 2:\n",
    "            # White label inside if tall enough, otherwise color above\n",
    "            y_pos = bar.get_height() - 2 if bar.get_height() > 5 else bar.get_height() + 0.5\n",
    "            txt_color = 'white' if bar.get_height() > 5 else color\n",
    "            ax.text(bar.get_x() + bar.get_width()/2, y_pos,\n",
    "                    f'{rate:.0f}%', ha='center', va='bottom' if bar.get_height() <= 5 else 'top',\n",
    "                    fontsize=8, fontweight='bold', color=txt_color)\n",
    "\n",
    "ax.set_xticks(x)\n",
    "ax.set_xticklabels(threshold_labels, fontsize=11)\n",
    "ax.set_ylabel('Acquisition Rate (%)', fontsize=10)\n",
    "ax.set_title('The Scale-Up Void: NL Falls Behind at 3+ Rounds', fontweight='bold', loc='left', fontsize=14, pad=15)\n",
    "\n",
    "# Add highlighting annotation for the gap\n",
    "ax.annotate('The Gap Widens Here', xy=(2.1, 8), xytext=(2.5, 12),\n",
    "            arrowprops=dict(facecolor=COLORS['vermillion'], shrink=0.05, alpha=0.5),\n",
    "            fontsize=10, color=COLORS['vermillion'], fontweight='bold')\n",
    "\n",
    "ax.legend(loc='upper left', frameon=False, fontsize=10, ncol=2)\n",
    "plt.tight_layout()\n",
    "plt.show()\n",
    "\n",
    "# Print insights\n",
    "print('\\n📊 Acquisition Rate by Number of Funding Rounds:')\n",
    "for t_idx, t_label in enumerate(threshold_labels):\n",
    "    print(f'\\n{t_label}:')\n",
    "    for region, codes in zip(regions, region_codes):\n",
    "        r = acq_rate_by_rounds(codes, thresholds[t_idx])[0]\n",
    "        print(f'  {region}: {r:.1f}%')\n"
]

try:
    with open(notebook_path, 'r') as f:
        nb = json.load(f)

    found = False
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            source = "".join(cell['source'])
            if "CHART #2: finding2_rounds_matter.png" in source:
                print("Found Chart 2 cell. Updating...")
                cell['source'] = refined_source
                found = True
                break
    
    if found:
        with open(notebook_path, 'w') as f:
            json.dump(nb, f, indent=1)
        print("Chart 2 updated successfully.")
    else:
        print("Chart 2 cell not found.")

except Exception as e:
    print(f"Error: {e}")
