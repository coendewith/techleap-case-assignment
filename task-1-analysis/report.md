# Dutch Startup Ecosystem Analysis
### Policy Briefing for the Ministry of Economic Affairs

---

**Research Question**
What can policymakers do to support the startup ecosystem?

**Approach**
Benchmark the Netherlands against EU peers (France, UK, Germany) and global tech hubs (USA, Israel) using Crunchbase data on 48,000+ VC-backed companies (2005-2014 cohort).

---

## Finding 1: Dutch startups drop off before they can scale

**Dutch startups fail to convert Seed → Series A at half the rate of peers**

| Region | Seed → A | A → B | B → C |
|--------|----------|-------|-------|
| Netherlands | 6.2% | 34.3% | 25.0% |
| EU Peers | 9.2% | 38.1% | 33.3% |
| USA | 16.1% | 42.9% | 41.0% |
| Israel | 21.9% | 40.0% | 41.7% |

The critical bottleneck is post-seed, not seed availability. NL's gap vs peers is largest at Seed→A (-9.6pp) and B→C (-16.6pp).

![Chart 1: Full Funding Funnel](figures/finding1_funding_funnel.png)

---

## Finding 2: Playing It Small

**Dutch startups raise less, risk less, and achieve less**

| Metric | Netherlands | EU Peers | USA | Israel |
|--------|-------------|----------|-----|--------|
| Failure Rate | 4.3% | 5.5% | 5.1% | 7.0% |
| Median Funding | $1.0M | $1.7M | $2.7M | $3.9M |
| Exit Rate | 4.3% | 5.4% | 8.9% | 8.5% |

Dutch startups have the lowest failure rate—which sounds positive. But combined with the lowest funding and the lowest exit rate, it suggests the ecosystem **plays it small**: fewer bold bets, fewer big outcomes.

![Chart 2: Playing It Small](figures/finding2_playing_small.png)

---

## Finding 3: The Opportunity Cost

**We're missing ~9 scale-ups per year**

From NL's 97 Seed-funded companies:
- **Current rate (6.2%):** 6 companies reach Series A
- **If EU rate (9.2%):** 9 companies (+3)
- **If USA rate (16.1%):** 15 companies (+9)
- **If Israel rate (21.9%):** 21 companies (+15)

Every year, 9 potential scale-ups fall into the Valley of Death.

![Chart 3: The Opportunity Cost](figures/finding3_opportunity_cost.png)

---

## Recommendations

### 1. Co-invest with international VCs to bridge the funding gap
**What works:** Israel's Yozma program ($100M, required foreign VC partners) grew their VC market 60x in 7 years.

**Action:** Co-invest with private VCs in post-seed companies
**Target:** Improve Seed→A conversion from 6% to 15%

### 2. Make Angel Investing Rational
**What works:** UK's SEIS tax relief (50% on seed investments) is now used in 90%+ of angel deals.

**Action:** Introduce Dutch SEIS equivalent (30-50% tax relief)
**Why:** Currently high-risk = irrational. Tax relief = risk mitigation.

### 3. Fix the Incentives
The bottleneck isn't Dutch founders—they perform equally well at Series B. It's the lack of incentives to take early-stage risk. Tax relief for angels and smarter ESOP taxation would shift the risk/reward calculus toward high-growth bets.

---

## Limitations

- Data ends in 2014; the ecosystem has evolved significantly
- Small Dutch sample (305 companies); results are directional, not definitive
- Exit data only captures acquisitions, not IPOs (0 IPOs in dataset)
- No founder-level data; team quality may drive outcomes
- No exit valuations (an acquisition ≠ a good outcome)
- Companies may relocate HQ between funding rounds

---

**Data:** Crunchbase, 48,163 companies, 2005-2014 first funding
**Analysis:** See `analysis.ipynb` for full methodology and code
