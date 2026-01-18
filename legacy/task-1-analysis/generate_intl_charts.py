#!/usr/bin/env python
"""Generate all 3 international comparison chart options"""

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

# === OPTION 1: Slope Chart ===
fig, ax = plt.subplots(figsize=(10, 7))
tufte_style(ax)

countries = ['Israel', 'Netherlands']
before = [58, 50]
after = [3300, 200]
x_before, x_after = 0, 1

for i, (country, b, a) in enumerate(zip(countries, before, after)):
    color = COLORS['green'] if country == 'Israel' else COLORS['vermillion']
    lw = 3 if country == 'Israel' else 2
    ax.plot([x_before, x_after], [b, a], color=color, linewidth=lw, marker='o', markersize=10)
    ax.text(x_before - 0.08, b, f'${b}M', ha='right', va='center', fontsize=11, color=color, fontweight='bold')
    ax.text(x_after + 0.08, a, f'${a:,}M', ha='left', va='center', fontsize=11, color=color, fontweight='bold')
    if country == 'Israel':
        ax.text(0.5, (b + a) / 2 + 500, country, ha='center', va='bottom', fontsize=12, color=color, fontweight='bold')
        ax.text(0.5, (b + a) / 2 + 200, '60x growth', ha='center', va='top', fontsize=10, color=color, style='italic')
    else:
        ax.text(0.5, (b + a) / 2 - 100, country, ha='center', va='top', fontsize=12, color=color, fontweight='bold')
        ax.text(0.5, (b + a) / 2 - 350, '4x growth', ha='center', va='top', fontsize=10, color=color, style='italic')

ax.annotate('Yozma Program\n(1993)', xy=(0.15, 100), fontsize=10, color=COLORS['green'],
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#E8F5E9', edgecolor=COLORS['green']))
ax.set_xlim(-0.3, 1.3)
ax.set_ylim(-200, 4000)
ax.set_xticks([0, 1])
ax.set_xticklabels(['1993\n(Before Yozma)', '2000\n(After Yozma)'], fontsize=11)
ax.set_ylabel('Annual VC Investment ($ millions)', fontsize=11)
ax.set_title("Israel solved the scale-up gap—Netherlands hasn't (yet)", fontsize=14, fontweight='bold', loc='left', pad=20)
plt.tight_layout()
plt.savefig('figures/intl_option1_slope.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Option 1: Slope chart saved")

# === OPTION 2: Dumbbell Chart ===
fig, ax = plt.subplots(figsize=(11, 6))
tufte_style(ax)

metrics = ['Seed→Series A\nConversion', 'Scale-up\nRatio', 'Local Funding\nShare', 'ESOP\nRanking']
nl_values = [6.2, 21.5, 22, 25]
best_values = [21.4, 54, 78, 90]
y_pos = np.arange(len(metrics))

for i, (metric, nl, best) in enumerate(zip(metrics, nl_values, best_values)):
    ax.plot([nl, best], [i, i], color=COLORS['gray'], linewidth=2, zorder=1)
    ax.scatter(nl, i, s=150, color=COLORS['vermillion'], zorder=2, edgecolors='white', linewidths=1.5)
    ax.text(nl, i + 0.25, f'{nl}%', ha='center', va='bottom', fontsize=10, color=COLORS['vermillion'], fontweight='bold')
    ax.scatter(best, i, s=150, color=COLORS['green'], zorder=2, edgecolors='white', linewidths=1.5)
    ax.text(best, i + 0.25, f'{best}%', ha='center', va='bottom', fontsize=10, color=COLORS['green'], fontweight='bold')
    gap = best - nl
    ax.text((nl + best) / 2, i - 0.25, f'Gap: {gap:.0f}pp', ha='center', va='top', fontsize=9, color=COLORS['gray'], style='italic')

nl_patch = mpatches.Patch(color=COLORS['vermillion'], label='Netherlands')
best_patch = mpatches.Patch(color=COLORS['green'], label='Best Practice (Israel/USA)')
ax.legend(handles=[nl_patch, best_patch], loc='lower right', fontsize=10, frameon=False)
ax.set_yticks(y_pos)
ax.set_yticklabels(metrics, fontsize=11)
ax.set_xlim(0, 100)
ax.set_xlabel('Percentage', fontsize=11)
ax.set_title('The gaps Netherlands needs to close', fontsize=14, fontweight='bold', loc='left', pad=20)
ax.invert_yaxis()
plt.tight_layout()
plt.savefig('figures/intl_option2_dumbbell.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Option 2: Dumbbell chart saved")

# === OPTION 3: Timeline Chart ===
fig, ax = plt.subplots(figsize=(12, 5))
tufte_style(ax)

policies = [
    (1993, 'Israel', 'Yozma Program', '60x VC growth\nby 2000', COLORS['green']),
    (1994, 'UK', 'EIS Launched', '30% tax relief\nfor investors', COLORS['blue']),
    (2012, 'UK', 'SEIS Added', '50% tax relief\n90%+ angel deals', COLORS['skyblue']),
    (2017, 'Singapore', 'SEEDS Capital', '#4 global\nby 2025', COLORS['orange']),
    (2024, 'Netherlands', 'Current State', '6.2% Seed→A\n(Gap to close)', COLORS['vermillion']),
]

ax.axhline(y=0, color=COLORS['gray'], linewidth=1, zorder=1)

for i, (year, country, program, outcome, color) in enumerate(policies):
    y_offset = 0.5 if i % 2 == 0 else -0.5
    ax.plot([year, year], [0, y_offset * 0.8], color=color, linewidth=2)
    ax.scatter(year, 0, s=100, color=color, zorder=2, edgecolors='white', linewidths=1.5)
    ax.annotate(f'{country}\n{program}\n\n{outcome}',
                xy=(year, y_offset * 0.8),
                ha='center', va='center',
                fontsize=9, color=color, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor=color, alpha=0.9))
    ax.text(year, -0.15 if y_offset > 0 else 0.15, str(year), ha='center', va='top' if y_offset > 0 else 'bottom',
            fontsize=10, fontweight='bold', color=COLORS['black'])

ax.set_xlim(1990, 2027)
ax.set_ylim(-1.2, 1.2)
ax.set_title('Successful startup policies: A 30-year timeline', fontsize=14, fontweight='bold', loc='left', pad=20)
ax.axis('off')
plt.tight_layout()
plt.savefig('figures/intl_option3_timeline.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ Option 3: Timeline chart saved")

print("\nAll 3 charts generated in figures/")
