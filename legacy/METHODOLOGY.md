# Gold-Tier Data Analysis Methodology

A synthesis of Harvard EDA principles, McKinsey structured thinking, and Tukey's Four R's framework.

---

## The Framework: H.A.R.T.

**H**ypothesis → **A**nalysis → **R**esidue → **T**ranslation

This combines:
- **Harvard/Tukey**: Iterative EDA with revelation, resistance, residuals
- **McKinsey**: MECE structuring, hypothesis-driven, pyramid principle
- **Storytelling**: What → So What → Now What

---

## Phase 1: HYPOTHESIS (Before Touching Data)

### Step 1.1: Define the Problem MECE
Break down the question into mutually exclusive, collectively exhaustive parts.

**Example for Techleap:**
```
Main Question: What explains Dutch startup outcomes?
├── Supply Side (Capital)
│   ├── Amount available
│   ├── Round structure
│   └── Timing/velocity
├── Demand Side (Startups)
│   ├── Quality of founders
│   ├── Sector composition
│   └── Geographic distribution
├── Matching (Market)
│   ├── Investor-founder matching
│   ├── Information asymmetry
│   └── Network effects
└── External Factors
    ├── Macro (interest rates, crises)
    ├── Policy (WBSO, tax rules)
    └── Competition (other hubs)
```

### Step 1.2: State Hypotheses Explicitly
Before analysis, write down what you expect to find and WHY.

| # | Hypothesis | Logic | How to Test | Expected Result |
|---|------------|-------|-------------|-----------------|
| H1 | More capital → better outcomes | More runway = more time | Correlate $ with exits | Strong positive |
| H2 | Amsterdam dominates | Network effects, scale | Compare city exit rates | Amsterdam leads |
| H3 | Speed matters | Faster = more momentum | Compare round velocity | NL slower = worse |
| H4 | Crisis hits equally | Global shock | Compare 2008 impact | Similar drops |

### Step 1.3: Define Success Criteria
What would CONFIRM vs REJECT each hypothesis?

```
H1 Confirmed: r > 0.3 between funding and exit rate
H1 Rejected: r < 0.1 OR relationship is non-linear
```

---

## Phase 2: ANALYSIS (Tukey's Four R's)

### Step 2.1: REVELATION (Look Before You Calculate)

**Rule: Graph first, summarize second.**

For EVERY variable:
1. Plot distribution (histogram, boxplot)
2. Note shape: symmetric? skewed? bimodal?
3. Identify outliers visually
4. ONLY THEN calculate statistics

**Example sequence:**
```python
# WRONG: Jump to statistics
print(df['funding'].mean())  # Misleading if skewed

# RIGHT: Reveal first
plt.hist(np.log10(df['funding']), bins=50)  # See the shape
plt.axvline(np.log10(df['funding'].median()))  # Mark center
# NOW interpret: "Median $740K, but mean $15M due to outliers"
```

### Step 2.2: RESISTANCE (Use Robust Measures)

**Rule: Default to median, not mean. Report both.**

| Situation | Resistant Measure | Non-Resistant | Why |
|-----------|-------------------|---------------|-----|
| Center | Median | Mean | Outliers pull mean |
| Spread | IQR, MAD | Std Dev | Same reason |
| Correlation | Spearman | Pearson | Rank-based |
| Regression | Robust/Quantile | OLS | Outlier influence |

**Always report:**
- Sample size (n=X)
- Both median AND mean (if different, explain why)
- Outlier count and treatment

### Step 2.3: RE-EXPRESSION (Transform for Clarity)

**Rule: If distribution is skewed, transform before analysis.**

Common transforms:
- **Log**: For right-skewed data (funding, revenue)
- **Square root**: For count data
- **Logit**: For proportions

**Decision tree:**
```
Is distribution skewed?
├── No → Use raw scale
└── Yes → Is it right-skewed (long right tail)?
    ├── Yes → Try log transform
    │   └── Does it normalize? → Use log scale
    └── No (left-skewed) → Rare, investigate why
```

### Step 2.4: RESIDUAL (What's Left After the Pattern?)

**Rule: DATA = FIT + RESIDUAL. Always examine residuals.**

After finding a pattern:
1. Extract residuals (actual - predicted)
2. Plot residuals vs fitted values
3. Look for remaining structure
4. The residuals often contain the interesting insights

**Example:**
```python
# Found: More rounds → higher exit rate
# Now ask: Which companies DEFY this pattern?
# High rounds but no exit = What went wrong?
# Few rounds but exit = What went right?
```

---

## Phase 3: RESIDUE (What Remains?)

### Step 3.1: Hypothesis Scorecard
After each analysis, update your hypothesis status.

| Hypothesis | Status | Evidence | Confidence | Sample Size |
|------------|--------|----------|------------|-------------|
| H1: More capital → better | **REJECTED** | r=0.12 | HIGH | n=40,000+ |
| H2: Amsterdam dominates | **REJECTED** | 3.6% exit | MEDIUM | n=139 |
| H3: Speed matters | **REJECTED** | 14.4 vs 12.6mo | MEDIUM | n=88 |
| H4: Crisis hits equally | **REJECTED** | -62% vs -40% | MEDIUM | n=~50 |

### Step 3.2: Confidence Classification

| Confidence | Sample Size | Effect Size | Use For |
|------------|-------------|-------------|---------|
| HIGH | n > 1,000 | Clear, large | Policy recommendations |
| MEDIUM | n = 100-1,000 | Moderate | Hypotheses to validate |
| LOW | n < 100 | Any | Exploratory only |
| UNRELIABLE | n < 30 | Any | Do not report |

### Step 3.3: Acknowledge What You CAN'T Answer
Be explicit about:
- Missing data
- Confounding factors
- Selection bias
- Temporal limitations

---

## Phase 4: TRANSLATION (So What? Now What?)

### Step 4.1: Pyramid Principle Structure

**Lead with the answer, support with evidence.**

```
ANSWER (1 sentence)
├── SUPPORTING POINT 1
│   └── Evidence
├── SUPPORTING POINT 2
│   └── Evidence
└── SUPPORTING POINT 3
    └── Evidence
```

**Example:**
```
ANSWER: The Dutch startup ecosystem has a matching problem, not a capital problem.

SUPPORT 1: Capital doesn't predict success
└── Evidence: 300x more capital = 4pp better outcomes (n=40,000+)

SUPPORT 2: Completion rate is the bottleneck
└── Evidence: 65% never get Round 2; 4+ rounds = 5x exit rate

SUPPORT 3: Speed isn't the issue
└── Evidence: Dutch 14.4mo vs Global 12.6mo (competitive)
```

### Step 4.2: What → So What → Now What

For EVERY insight:

| Component | Question | Example |
|-----------|----------|---------|
| **WHAT** | What does the data show? | "65% of companies never get Round 2" |
| **SO WHAT** | Why does this matter? | "Most startups die before scale-up stage" |
| **NOW WHAT** | What action follows? | "Intervention point is Round 1→2, not Series A" |

### Step 4.3: Stakeholder-Specific Translation

Same insight, different framing:

| Audience | Frame | Language |
|----------|-------|----------|
| Policymaker | Risk/metrics | "Move conversion from 6.2% to 12%" |
| Founder | Survival tactics | "Plan 18-24mo runway, not 12" |
| Investor | Portfolio construction | "Focus on Round 2 bridge deals" |

---

## Quality Checklist

Before presenting any finding:

- [ ] Sample size stated (n=X)
- [ ] Confidence level assigned (HIGH/MEDIUM/LOW)
- [ ] Both mean AND median reported (if applicable)
- [ ] Outliers identified and treatment documented
- [ ] Hypothesis clearly stated and tested
- [ ] "So What" articulated
- [ ] "Now What" actionable
- [ ] Limitations acknowledged
- [ ] Alternative explanations considered

---

## Anti-Patterns to Avoid

### 1. Confirmation Bias
**Wrong**: "I found what I expected"
**Right**: "I tested X hypothesis; evidence {supports/rejects} it"

### 2. Headline Hunting
**Wrong**: "Leiden beats Amsterdam 10x!" (n=8)
**Right**: "Interesting pattern (n=8) but statistically unreliable"

### 3. Correlation → Causation
**Wrong**: "More rounds causes better outcomes"
**Right**: "More rounds correlates with better outcomes; possible explanations include..."

### 4. Missing Denominators
**Wrong**: "6 Dutch companies reached Series A"
**Right**: "6 of 97 (6.2%) Dutch seed companies reached Series A"

### 5. Survivorship Bias
**Wrong**: "Successful companies raised $X on average"
**Right**: "Including failed companies, median funding was $Y"

---

## Sources

- [Harvard CS109A: Effective EDA](https://harvard-iacs.github.io/2018-CS109A/lectures/lecture-3/)
- [Harvard Business School: Exploratory Data Analysis Technical Note](https://www.hbs.edu/faculty/Pages/item.aspx?num=62261)
- [Tukey's Four R's of EDA](https://bayesball.github.io/EDA/introduction.html)
- [McKinsey MECE Framework](https://www.mbacrystalball.com/blog/strategy/mece-framework/)
- [Pyramid Principle](https://strategyu.co/structure-your-ideas-pyramid-principle-part-1/)
- [Data Storytelling: What, So What, Now What](https://mantelgroup.com.au/data-storytelling-what-is-it-best-practice-and-a-framework/)
