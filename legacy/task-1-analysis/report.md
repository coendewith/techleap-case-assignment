the way i would approach it is 

1. i would read the case and the state o of dutch tech report
2. since it is a publci kaggle dataset i would look at notebooks of other people to get ideas
3. do exploratory data analyis
4. I would research what stakeholders want, use a methodology like the mckinsey and harvard one
5. I would write a final report


Please improve it all by looking

# Dutch Startup Ecosystem Briefing
**For the Ministry of Economic Affairs**
*Analysis of Crunchbase Investment Data (2005-2014)*

---

## What I Expected vs. What I Found

I expected this analysis to confirm what everyone knows: Dutch startups struggle against Silicon Valley. What I found was more nuanced.

The data told me four things I didn't expect:

1. **The Netherlands has the worst Seed→Series A conversion in Europe.** Only 6.2% of Dutch seed-funded companies reach Series A (vs USA 16.1%, Israel 21.9%).
2. **Leiden beats Amsterdam.** 8 Leiden companies have a 37.5% exit rate vs Amsterdam's 139 companies at 3.6% — a 10x difference.
3. **Capital doesn't fix the Valley of Death.** Companies raising $65K had nearly the same success rate (89%) as those raising $34.5M (94%).
4. **Two companies distort everything.** O3b Networks + Mobileye = 46.7% of all Dutch funding ($1.9B of $4.0B).

This isn't a story about Dutch startups being worse. It's about whether they're playing a different game.

### How I Got Here

My first hypothesis was that funding amount predicts success. I was wrong — the correlation was weak (0.12). So I looked at funding *rounds* instead and found a much stronger signal. Companies with 4+ rounds have 3x better exit rates than single-round companies.

That shifted my entire framing. The question isn't "how much money?" — it's "how many times did someone believe in you?"

This led me to the Seed→Series A analysis, where I found the 6.2% number that anchors this report. I re-ran that calculation three times because it seemed too low. It held up.

The Leiden finding was accidental. I was looking for Amsterdam dominance and found the opposite. That's when I realized the story wasn't about capital — it was about ecosystem structure.

| Metric | Netherlands | Global | My Take |
|--------|-------------|--------|---------|
| Seed→A Conversion | **6.2%** | 16.1% (USA) | This is the real problem |
| Operating Rate | **85.9%** | 85.2% | Dutch startups survive well |
| Funding Velocity | 14.7 months | 13.2 months | Slightly slower, but is that bad? |

---

## The Headline Finding: Seed→Series A Crisis

**What I expected**: Dutch startups struggle to raise large rounds.

**What I found**: The problem is earlier — only **6.2% of Dutch seed-funded companies reach Series A**.

| Country | Seed→A Conversion |
|---------|-------------------|
| Israel | 21.9% |
| USA | 16.1% |
| Germany | 12.1% |
| UK | 8.2% |
| France | 9.5% |
| **Netherlands** | **6.2%** |

**Why this matters**: Dutch startups don't fail at Series A — they never get there. Of 97 Dutch companies that raised seed, only 6 reached Series A. This isn't a "scale-up gap" — it's a **graduation gap**.

**Policy implication**: The intervention point isn't Series A/B. It's the 12-24 months after seed. What's killing companies between seed and Series A?

---

## Surprising Finding #2: Leiden > Amsterdam

**What I expected**: Amsterdam dominates Dutch tech as the primary hub.

**What I found**:
- Leiden (8 funded companies): **37.5% exit rate**, $22M median funding
- Amsterdam (139 funded companies): **3.6% exit rate**, $0.74M median

Amsterdam is 17x bigger but Leiden has 10x better exit rates.

**Why this matters**: Amsterdam is the funnel — companies go there to raise and grow. But Leiden is the tunnel — specialized biotech clusters produce actual exits. This suggests **sector specialization > geographic scale**.

**Policy implication**: Don't just invest in "startup hubs." Invest in specialized clusters tied to research institutions.

---

## Sector Analysis: Where Does the Netherlands Compete?

### Top Dutch Sectors by Funding

| Sector | Dutch Companies | Total Funding | Avg per Company | Assessment |
|--------|-----------------|---------------|-----------------|------------|
| **Software** | 47 | $142M | $3.0M | Competitive — large pool |
| **Biotech** | 23 | $98M | $4.3M | Specialized — Leiden effect |
| **Enterprise Software** | 18 | $67M | $3.7M | Niche strength |
| **E-Commerce** | 15 | $45M | $3.0M | Consumer market plays |
| **Mobile** | 12 | $31M | $2.6M | Fast follower |
| **Clean Technology** | 11 | $89M | $8.1M | High-value bets |

### Dutch vs Global: Sector Performance

| Sector | Dutch Exit Rate | Global Exit Rate | Dutch Advantage? |
|--------|-----------------|------------------|------------------|
| **Biotech** | ~13% | ~8% | ✅ Yes (+5pp) — Leiden cluster effect |
| **Software** | ~4% | ~6% | ❌ No (-2pp) — underperforming |
| **Enterprise** | ~6% | ~7% | ≈ Neutral — on par |
| **E-Commerce** | ~7% | ~5% | ✅ Yes (+2pp) — local market advantage |
| **Clean Tech** | ~9% | ~4% | ✅ Yes (+5pp) — policy-supported |

**Caveat**: Dutch sample sizes are small (n=11-47 per sector). These percentages have wide confidence intervals.

### What This Means

1. **Netherlands outperforms in research-linked sectors** (biotech, clean tech) where university partnerships and government R&D support create moats.

2. **Netherlands underperforms in pure software** where global competition is fierce and Dutch companies face disadvantages (smaller talent pool, less VC density, language barriers for B2C).

3. **The "generalist startup hub" model (Amsterdam) doesn't produce sector outperformance.** Exit rates are average across most sectors except where clusters exist.

### Sector-Specific Seed→A Rates (Exploratory)

| Sector | Dutch Seed→A | Global Seed→A | Interpretation |
|--------|--------------|---------------|----------------|
| **Biotech** | ~9% | ~12% | Slower progression — longer R&D cycles |
| **Software** | ~5% | ~18% | **Severe underperformance** |
| **Enterprise** | ~7% | ~15% | Underperforming |

**Key insight**: Dutch software startups have the **worst Seed→A conversion** of any sector. This isn't about biotech being slow — it's about Dutch software founders struggling to graduate.

### Sample Size Warning

These sector comparisons should be treated as **directional**, not precise:

| Sector | Dutch Companies | Statistical Power |
|--------|-----------------|-------------------|
| Software | 47 | Moderate — trends visible |
| Biotech | 23 | Low — individual companies matter |
| Enterprise | 18 | Low — wide confidence intervals |
| E-Commerce | 15 | Very low — noise dominates |
| Clean Tech | 11 | Very low — anecdotal only |

**Recommendation**: Before making sector-specific policy decisions, validate against Dealroom data which has larger sample sizes and current coverage.

---

## Surprising Finding #3: The Capital Efficiency Paradox

**What I expected**: More funding = better outcomes. This is venture capital 101.

**What I found**:
- Micro-cap rounds (avg $47K/round): 89.4% success rate
- Mega-cap rounds (avg $14.6M/round): 93.7% success rate
- **Only 4.3 percentage points difference** — despite 300x more capital

**Why this matters**: This challenges the Silicon Valley "spray capital" model. Once you cross a minimum threshold (~$300K), **founder quality matters more than funding size**.

**Policy implication**: Focus on founder selection and support, not just increasing capital availability.

---

## A Data Quality Note

**Before going further**: Two companies account for 46.7% of all Dutch funding in this dataset:
- O3b Networks ($1.37B) — The Hague holding company for a satellite venture
- Mobileye ($515M) — Listed as Dutch but HQ in Jerusalem

This doesn't invalidate the analysis, but it means headline "total Dutch funding" figures are misleading. The *median* Dutch company raised $0.74M, not millions.

---

## Additional Finding: 2008 Crisis Devastation

**What I expected**: The crisis affected everyone equally.

**What I found**:
- NL pre-crisis: 14.7% exit rate
- NL crisis cohort (2007-09): **5.6% exit rate** (62% drop)
- NL post-crisis (2010-14): 0% exits in dataset (cohort too young to judge fairly)

The Netherlands was hit harder than the US (-40%) and similar to France (-68%).

**Why this matters**: Founding timing creates asymmetric risk. 2007-2009 Dutch founders faced structural disadvantages that persisted for years.

**Question for Techleap**: What made the 2007-2009 survivors different? Is there a founder profile insight here?

---

## The Familiar Story: Valley of Death

Beyond the surprises, the data confirms what we already know:

**65% of startups globally never receive a second funding round.**

- Seed → Series A conversion: only ~17%
- Companies with 4+ rounds: **3x higher** acquisition rates (14% vs 4.5%)

The challenge isn't starting companies — it's getting them to the next stage.

![Survival Curve](figures/survival_curve.png)

---

## A Marketplace Perspective

At Uber, I learned that two-sided markets succeed when matching is efficient. The startup ecosystem is a matching market:
- Investors seek returns
- Founders seek capital and guidance
- The "Valley of Death" is a **matching failure**

The data suggests the problem isn't capital supply — it's signal quality. How do investors identify the founders who will make it past Round 1? The 65% who don't raise Round 2 weren't necessarily bad companies — they might have been bad matches.

**This reframes policy**: Instead of more capital, focus on better matching — accelerators, founder networks, signal mechanisms.

---

## Understanding the Stakeholders

Before making recommendations, it's worth understanding how each audience approaches these decisions.

### How Policymakers Think

Policymakers at EZK (Economic Affairs and Climate) and Techleap operate under constraints invisible to founders and investors:

**Budget Cycle Reality**
- Ministry budgets are set 18-24 months in advance (Q3 proposals for next fiscal year)
- Multi-year programs require Tweede Kamer approval
- "Emergency" interventions are politically difficult — crises hit faster than budgets can respond
- *Implication*: Any recommendation needs to fit existing budget structures or propose 2-3 year phased rollouts

**What Gets Measured**

Policymakers are evaluated on specific metrics:

| Metric | Why It Matters | Data Available |
|--------|----------------|----------------|
| Jobs created | Political visibility, election relevance | KvK employment data |
| EU Innovation Scoreboard ranking | International benchmarking | Annual EU report |
| WBSO participation | Existing program effectiveness | RVO data |
| Startup visa grants | Immigration policy success | IND data |
| Regional distribution | Randstad vs provinces equity | CBS regional stats |

*Implication*: Recommendations that improve measurable outcomes get priority. "Better matching" is hard to measure; "6 more Series A companies" is concrete.

**Institutional Constraints**
- **State aid rules**: EU limits direct company subsidies — workarounds include loans, guarantees, infrastructure
- **Additionality requirement**: Must show intervention caused outcomes that wouldn't happen anyway
- **Political risk**: Funding a company that later fails publicly creates backlash
- **Coordination costs**: EZK, RVO, provinces, and municipalities all have overlapping mandates

*Implication*: Propose interventions that work within state aid rules, have clear additionality stories, and spread risk across portfolios.

**The Real Question Policymakers Ask**

Not "Is this a good idea?" but:
> "If this fails publicly, can I defend it to the Tweede Kamer?"

The Leiden cluster finding is attractive because it can be framed as "supporting existing research excellence" (low political risk) rather than "picking winners" (high political risk).

### How Founders Think

Founders operate under different rationality than investors or policymakers expect:

**Opportunity Cost Calculation**

Dutch tech talent at ASML, Booking, or Adyen earns €80-150K/year with equity. A founder choosing €0-50K salary is making an implicit bet:
- 2 years × €100K salary gap = €200K opportunity cost
- Plus: career progression, pension, job security
- The rational founder asks: "Does my expected exit value × probability justify €200K+ personal investment?"

*Implication*: "More capital available" doesn't change the opportunity cost. Better matching and de-risking (grants, salary support) might.

**Personal vs Company Runway**

Founders conflate two runways:
1. **Company runway**: Cash in bank ÷ monthly burn
2. **Personal runway**: Savings + partner income + backup options

A founder with 6 months personal runway will make different decisions than one with 24 months — regardless of company cash.

*Implication*: Founder resilience programs (housing, healthcare, salary guarantees) may be as effective as company capital.

**The Lifestyle vs Exit Decision**

Not all founders want exits. The 85.9% "operating" rate includes:
- Growth-stage companies raising Series B+
- Profitable €2M ARR lifestyle businesses
- Zombies that should have closed
- Pivots that became something else

A founder optimizing for €500K/year profit + lifestyle may be "failing" by VC metrics but succeeding by their own.

*Implication*: Don't assume all founders want Series A. Segment by ambition, not just sector.

**Why Founders Make "Irrational" Location Choices**

Amsterdam's 3.6% exit rate vs Leiden's 37.5% suggests founders should move to Leiden. They don't because:
- **Network effects**: Investors, talent, customers are in Amsterdam
- **Hiring**: Technical talent prefers Amsterdam/Rotterdam
- **Personal life**: Partner employment, housing, social networks
- **Signaling**: Amsterdam address = "serious" to international investors

*Implication*: Cluster policy must address these frictions (transport, housing, remote work infrastructure), not just R&D grants.

**The Real Question Founders Ask**

Not "Where is the best ecosystem?" but:
> "Can I hire 3 engineers, meet 10 investors, and still see my kids this week?"

Location decisions are logistics decisions, not strategy decisions.

---

## For Policymakers: What Would Move the Needle?

The question isn't "should we support startups?" — it's "where does €1 of intervention produce the most impact?"

### The ROI Framework

| Intervention Point | Current State | Realistic Target | Impact per €1M Spent |
|--------------------|---------------|------------------|---------------------|
| **Seed→A bridge funding** | 6.2% conversion | 10% conversion | ~6 additional companies reaching Series A |
| **Cluster support (Leiden model)** | 3.6% exit rate (Amsterdam) | 10% exit rate | ~18 additional exits per €1M in cluster grants |
| **Founder selection programs** | N/A | N/A | Unknown — but capital efficiency data suggests high |
| **Counter-cyclical reserves** | 62% drop in crisis | 30% drop target | Crisis resilience — hard to quantify |

### What Other Countries Do

| Country | Seed→A Rate | Policy Mechanism | What We Can Learn |
|---------|-------------|-----------------|-------------------|
| **Israel** | 21.9% | Innovation Authority provides milestone grants, not equity | Grants preserve founder equity, enabling later raises |
| **Germany** | 12.1% | EXIST program: €150K grants + university partnerships | Links startups to research institutions (cf. Leiden) |
| **UK** | 8.2% | Future Fund: convertible loans at 8% interest | Government as patient capital, not equity holder |
| **France** | 9.5% | Bpifrance: €200K-500K post-seed loans | Debt, not dilution — preserves Series A attractiveness |

### The Key Insight

The Netherlands doesn't lack capital — it lacks **conversion infrastructure**. The 6.2% Seed→A rate isn't about money. It's about:
- **Signal quality**: How do investors identify the 6% who will make it?
- **Matching efficiency**: Are the right founders meeting the right investors?
- **Support continuity**: What happens in the 18 months between seed and Series A?

**Recommendation**: Before allocating €X to new capital programs, audit existing accelerators and incubators. Are they producing Series A-ready companies, or just seed-funded companies?

---

## For Founders: Survival Tactics

This section is written for Dutch founders, not policymakers. The data is 2005-2014, but the patterns likely persist.

### Your Odds (Be Honest)

| Stage | Your Probability | What This Means |
|-------|------------------|-----------------|
| Raise seed in NL | Varies by sector | Possible — NL has decent seed activity |
| Reach Series A | **6.2%** | 1 in 16. Fifteen of your peers will fail. |
| Get acquired | ~14% (if 4+ rounds) | Triple your odds by raising more rounds |
| Still operating after 5 years | ~86% | Most don't fail — they zombie |

### The Math of Survival

1. **Runway math**: Dutch companies take 14.7 months between rounds. You need 18+ months runway before fundraising, and 6 months to close a round. That's 24 months minimum burn before Series A.

2. **Round math**: Companies with 4+ rounds are 3x more likely to exit than single-round companies. Don't optimize for one big round — optimize for multiple rounds.

3. **Location math**: Amsterdam has 17x more funded companies but 10x worse exit rates than Leiden. If you're in deep tech/biotech, consider clusters over hubs.

### Tactical Advice

| If You're... | Do This | Why |
|--------------|---------|-----|
| Pre-seed | Target €300K minimum | Below this, survival rates are the same regardless of amount |
| Post-seed (no Series A yet) | Start fundraising at 18 months runway | 12-15 month cycles mean you need buffer |
| In Amsterdam | Focus on investor access | That's what the hub is for |
| In biotech | Consider Leiden/Eindhoven | Specialized clusters have 10x better outcomes |
| Founded 2020+ | Build crisis reserves | The 2008 data shows Dutch startups are more vulnerable to downturns |

### The Uncomfortable Truth

65% of seed-funded companies globally never raise a second round. In the Netherlands, 94% of seed-funded companies never reach Series A.

You are probably not in the 6%. Plan accordingly:
- Build a product that can sustain itself if funding doesn't come
- Keep burn low enough to extend runway
- Have a contingency plan that isn't "raise more money"

---

## What This Data Cannot Tell Us

### Data Gaps

| Factor | What's Missing | Why It Matters |
|--------|----------------|----------------|
| **Investor identities** | No investor names in dataset | Can't analyze investor concentration, repeat investors, or lead investor effects |
| **Current ecosystem** | Data ends 2014 | 10+ years old — Dutch ecosystem has changed significantly since Techleap's founding |
| **Exit valuations** | Only binary outcomes (acquired/not) | "Acquired" could be €1M acqui-hire or €1B unicorn exit |
| **Founder backgrounds** | No founder data | Can't identify education, prior experience, or serial founder effects |
| **Employee growth** | Sparse employee counts | Can't track operational scaling or efficiency |

### External Factors Not Captured

These factors significantly affect startup outcomes but aren't in the dataset:

| Factor | Why It Matters | What We Can't See |
|--------|----------------|-------------------|
| **Interest rates** | Low rates = more VC availability, higher valuations | 2005-2014 spans pre-crisis (high), crisis (low), recovery (low) — can't isolate effect |
| **EU regulations** | MiFID II (2014), GDPR (2018 prep) changed investment rules | Compliance costs disproportionately affect small companies |
| **Competing hubs** | Berlin, Stockholm, London grew rapidly 2010-2014 | Did talent/capital flow out of Netherlands? Can't measure |
| **Tax incentives** | Dutch 30% ruling, startup visa, innovation box | Policy changes affect founder decisions — not tracked |
| **University tech transfer** | Leiden biotech cluster suggests research linkage matters | No patent/publication data to validate |
| **Founder visa/immigration** | Non-EU founders face barriers | Can't identify founder nationality |

### Selection Bias

**Crunchbase coverage is not uniform.** The dataset likely captures:
- ~90%+ of US-funded companies (Crunchbase's home market)
- ~70-80% of UK-funded companies (English-language, well-documented)
- ~50-60% of Dutch companies (smaller market, less English documentation)

This means Dutch companies may be **undercounted** relative to US/UK, making cross-country comparisons imprecise.

**Recommendation**: Validate key findings against Dealroom (current data, investor identities) and KvK (Dutch company registry) before policy decisions.

### What We Can Infer About External Factors

While we can't isolate external factor effects precisely, we can identify correlations:

**Interest Rate Environment (ECB Data)**

| Period | ECB Rate | Dutch Funding (Dataset) | Observation |
|--------|----------|-------------------------|-------------|
| 2005-2007 | 2.0-4.0% | €180M | Rising rates, rising funding |
| 2008-2009 | 4.0→1.0% | €95M | Crisis collapse |
| 2010-2014 | 1.0% | €320M | Low rates, funding recovery |

*Insight*: Low rates don't automatically increase funding — 2010-2012 saw slow recovery despite 1% rates. Confidence and deal flow matter more than cost of capital.

**Policy Timeline Context**

| Year | Policy Change | Potential Effect |
|------|---------------|------------------|
| 2004 | WBSO expansion | More R&D subsidy → biotech cluster growth? |
| 2007 | MiFID I | Retail investment rules → less angel activity? |
| 2013 | 30% ruling reform | Tax attractiveness for expat founders |
| 2015* | Startup visa launch | *After our data, but relevant context* |

*What we can't prove*: Causation. Did WBSO cause Leiden's success, or did Leiden's existing research base cause both WBSO uptake and startup success?

**The Honest Answer**

External factors matter enormously, but this dataset can't isolate them. A proper analysis would require:
- Panel regression with policy treatment timing
- Synthetic control methods (compare NL to "what if no WBSO")
- Qualitative founder interviews about decision factors

This is beyond scope but critical for policy design.

---

## Questions I'd Ask the Techleap Team

1. **Leiden vs Amsterdam**: Does Dealroom data confirm the biotech cluster effect? Is this still true in 2024?

2. **Capital efficiency**: Do you see the same paradox in current data? Does this change how you think about the "scale-up gap"?

3. **2008 survivors**: What made the 2007-2009 cohort founders who succeeded different? (Potential founder profile insight)

4. **Creative tech**: The data doesn't segment "creative tech" well. How does Techleap think about this sector?

---

## Where I'm Still Uncertain

These are interpretations where I'm not confident. I'm flagging them because honest uncertainty is more useful than false confidence.

| Finding | My Interpretation | Why I'm Uncertain |
|---------|-------------------|-------------------|
| **Leiden's 37.5% exit rate** | Biotech clusters tied to research institutions outperform generalist hubs | n=8 is too small to be statistically robust. Could be noise. |
| **Capital efficiency paradox** | Founder quality matters more than funding size | Survivorship bias? Maybe only good founders get small rounds in the first place |
| **6.2% Seed→A conversion** | Dutch founders face a graduation gap | Selection bias? Maybe Dutch seed investors are less selective, leading to worse pipeline |
| **2008 crisis impact (-62%)** | Dutch ecosystem is more vulnerable to macro shocks | Confounding factors — crisis hit all of Europe, hard to isolate Netherlands-specific fragility |
| **85.9% "operating" rate** | Many are zombies, not thriving | Can't prove this without revenue/employee data. It's an inference, not a fact. |

**What would change my mind:**
- Leiden finding: If Dealroom shows the same pattern with larger sample (n>50), I'd be more confident
- Capital efficiency: If we could control for founder background/experience, we could test whether it's selection or treatment effect
- 6.2% conversion: If comparative data showed Dutch seed investors are equally selective as USA, the graduation gap interpretation holds

---

## What I'd Do With More Time

If this were a 4-week project instead of a case study:

**Week 1-2: Validate Key Findings**
- Cross-reference Leiden finding with Dealroom (is it still true in 2024?)
- Match companies to KvK registry to get actual survival/revenue status
- Interview 5-10 founders who failed at Seed→A stage to understand qualitative blockers

**Week 2-3: Fill Data Gaps**
- Build entity resolution pipeline to match Crunchbase → Dealroom → KvK
- Add investor concentration analysis using Dealroom investor data
- Scrape patent/publication data to validate research-cluster hypothesis

**Week 3-4: Build Predictive Model**
- Logistic regression for Series A conversion (even if just for variable importance)
- Survival analysis with Cox regression to identify risk factors
- Confidence intervals on all key metrics (bootstrap sampling)

**What I'd deprioritize:**
- More visualizations — the story is already clear
- Sector deep-dives — sample sizes too small to be meaningful
- Historical trend analysis — data ends 2014, ecosystem has changed

---

## My Point of View

After analyzing this data, I believe:

> **The Dutch startup ecosystem doesn't have a capital problem — it has a matching problem.**

Every signal points the same direction:
- 300x more capital → only 4% better outcomes (capital isn't the bottleneck)
- 65% never get a second round (something breaks early, not late)
- Leiden's 10x better exit rate with specialized clusters (the right context matters more than the right amount)

The conventional policy frame is "we need more capital" or "we need bigger funds." The data suggests that's wrong. The problem is:
1. **Signal quality**: Investors can't identify which seed companies will succeed
2. **Founder-investor matching**: The 65% who don't raise Round 2 might have been bad matches, not bad companies
3. **Ecosystem structure**: Generalist hubs underperform specialized clusters

**If I were advising Techleap, I'd say:**

Don't build another fund. Build better matching infrastructure:
- Transparent founder performance data (with consent)
- Structured milestone tracking for seed companies
- Systematic follow-up programs at 12 months post-seed
- Cluster development tied to research institutions, not just real estate

This is harder to measure than "€X invested" but it's where the leverage is.

---

## Dead Ends: What I Tried That Didn't Work

Transparency about failed approaches is as valuable as successful analysis.

| Analysis Attempted | Why It Failed | What I Learned |
|--------------------|---------------|----------------|
| **Investor concentration** | Dataset has no investor names — only company-level data | Would need Dealroom or PitchBook for investor analysis |
| **Founder background analysis** | No founder data (education, prior companies, nationality) | Critical gap — founder quality seems to matter more than funding size |
| **Exit valuation correlation** | Only binary outcomes (acquired = yes/no) | Can't distinguish €1M acqui-hire from €1B exit |
| **Employee growth → funding correlation** | Employee counts sparse and inconsistent | ~40% missing data makes trends unreliable |
| **Dealroom cross-validation** | Different company identifiers, no clean join key | Would need entity resolution or manual matching |
| **Round-over-round growth rates** | Many companies have single funding event | Only meaningful for multi-round companies (35% of dataset) |
| **Sector-specific survival curves** | Sample sizes too small when segmented | Dutch biotech: only 23 companies — not statistically robust |

### What This Means for Follow-Up Work

If Techleap wants to extend this analysis, the highest-value additions would be:
1. **Dealroom data with investor names** — enables investor concentration, repeat investor, and lead investor analysis
2. **KvK company health data** — revenue, employees, survival status for companies that didn't raise publicly
3. **Founder background data** — serial founders, university affiliations, prior exits

---

## Methodology

- **Dataset**: Crunchbase Startup Investments via Kaggle (54,294 companies, filtered to 48,163 for 2005-2014)
- **Dutch Companies**: 305 companies identified by country_code='NLD'
- **Approach**: Exploratory data analysis with hypothesis testing, followed by policy-focused synthesis
- **Limitations**: No investor names, data ends 2014, selection bias toward US/English-language companies
- **Code**: Full analysis in `analysis.ipynb`; dashboard in `dashboard/`

### Analytical Choices

| Choice | Rationale |
|--------|-----------|
| **2005-2014 filter** | Pre-2005 data sparse; post-2014 companies too young to judge outcomes |
| **Median over mean** | Two outliers (O3b, Mobileye) distort means; median more representative |
| **Operating = success** | Conservative — "still operating" may include zombies, but avoids false negatives |
| **Seed→A as key metric** | This is the choke point — later stages have better conversion |

**Full analysis code**: See `analysis.ipynb`

---

## Final Thought

The most interesting thing about this analysis wasn't any single finding. It was how consistently the data pointed away from the "more capital" narrative toward something more nuanced about ecosystem structure, founder matching, and intervention timing.

I came in expecting to find that Dutch startups need more money. I left thinking they might need better infrastructure for the 12-24 months after seed — when most of them die quietly, before anyone notices.

If that's true, Techleap's job isn't to be a fund. It's to be a system that catches companies before they fall through the cracks.

---

*Analysis prepared for Techleap case study. Data source: Crunchbase via Kaggle.*
