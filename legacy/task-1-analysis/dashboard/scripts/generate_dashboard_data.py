#!/usr/bin/env python3
"""
Generate JSON data files for the startup ecosystem dashboard.
Converts Python analysis results to JSON format for the Next.js dashboard.
"""

import pandas as pd
import numpy as np
import json
import os
from pathlib import Path

# Set up paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
DATA_DIR = PROJECT_ROOT / "dashboard" / "public" / "data"
CSV_PATH = PROJECT_ROOT.parent / "investments_VC.csv"

# Create data directory if it doesn't exist
DATA_DIR.mkdir(parents=True, exist_ok=True)

print("Loading dataset...")
df = pd.read_csv(CSV_PATH, encoding='latin-1', low_memory=False)

# Clean the data (same as in analysis.ipynb)
df.columns = df.columns.str.strip()
df['funding_usd'] = df['funding_total_usd'].astype(str).str.replace(',', '').str.replace(' ', '').str.strip()
df['funding_usd'] = pd.to_numeric(df['funding_usd'], errors='coerce')
df['market'] = df['market'].str.strip()
df['first_funding_date'] = pd.to_datetime(df['first_funding_at'], errors='coerce')
df['last_funding_date'] = pd.to_datetime(df['last_funding_at'], errors='coerce')
df['founded_date'] = pd.to_datetime(df['founded_at'], errors='coerce')
df['first_funding_year'] = df['first_funding_date'].dt.year
df['last_funding_year'] = df['last_funding_date'].dt.year
df['founded_year'] = df['founded_date'].dt.year
df['status'] = df['status'].fillna('unknown')

# Filter to meaningful years
df = df[df['first_funding_year'].between(2005, 2014, inclusive='both')]

print(f"Loaded {len(df):,} companies")

# 1. Overview Stats
print("Generating overview stats...")
dutch = df[df['country_code'] == 'NLD'].copy()

overview = {
    "total_companies": int(len(df)),
    "total_funding": float(df['funding_usd'].sum()),
    "avg_funding": float(df['funding_usd'].mean()),
    "median_funding": float(df['funding_usd'].median()),
    "operating_rate": float((df['status'] == 'operating').mean() * 100),
    "avg_rounds": float(df['funding_rounds'].mean()),
    "dutch_companies": int(len(dutch)),
    "dutch_total_funding": float(dutch['funding_usd'].sum()),
    "dutch_avg_funding": float(dutch['funding_usd'].mean()),
    "dutch_operating_rate": float((dutch['status'] == 'operating').mean() * 100),
    "dutch_avg_rounds": float(dutch['funding_rounds'].mean()),
    # Calculate Dutch Scaleup Ratio (Seed -> Series A conversion proxy)
    "dutch_scaleup_ratio": float(((dutch['round_A'] > 0).sum() / (dutch['seed'] > 0).sum() * 100) if (dutch['seed'] > 0).sum() > 0 else 0)
}

# 2. Funding Funnel Data with Country Comparison
print("Generating funding funnel data with country comparisons...")

def calculate_funnel(data, name):
    """Calculate funnel data for a given dataset"""
    round_columns = ['seed', 'round_A', 'round_B', 'round_C', 'round_D']
    round_names = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D']
    
    results = []
    total = len(data)
    prev_count = total
    
    for col, stage in zip(round_columns, round_names):
        count = int((data[col] > 0).sum())
        pct = (count / total * 100) if total > 0 else 0
        conversion = (count / prev_count * 100) if prev_count > 0 else 0
        results.append({
            "stage": stage,
            "count": count,
            "percentage": round(pct, 1),
            "conversion_rate": round(conversion, 1)
        })
        prev_count = count if count > 0 else prev_count
    
    return results

# Calculate for different regions
usa_df = df[df['country_code'] == 'USA']
gbr_df = df[df['country_code'] == 'GBR'] # UK
deu_df = df[df['country_code'] == 'DEU'] # Germany
fra_df = df[df['country_code'] == 'FRA'] # France
swe_df = df[df['country_code'] == 'SWE'] # Sweden

funnel_comparison = {
    "global": calculate_funnel(df, "Global"),
    "netherlands": calculate_funnel(dutch, "Netherlands"),
    "usa": calculate_funnel(usa_df, "USA"),
    "uk": calculate_funnel(gbr_df, "UK"),
    "germany": calculate_funnel(deu_df, "Germany"),
    "france": calculate_funnel(fra_df, "France"),
    "sweden": calculate_funnel(swe_df, "Sweden"),
    "summary": {
        "total_global": len(df),
        "total_nl": len(dutch),
        "total_usa": len(usa_df)
    }
}

# Also create simple funnel for backward compatibility
funnel_stages = ['Total', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D']
funnel_counts = [
    len(df),
    int((df['seed'] > 0).sum()),
    int((df['round_A'] > 0).sum()),
    int((df['round_B'] > 0).sum()),
    int((df['round_C'] > 0).sum()),
    int((df['round_D'] > 0).sum()),
]

funnel_data = []
for i, (stage, count) in enumerate(zip(funnel_stages, funnel_counts)):
    pct = (count / funnel_counts[0] * 100) if funnel_counts[0] > 0 else 0
    conversion = (count / funnel_counts[i-1] * 100) if i > 0 and funnel_counts[i-1] > 0 else 100
    funnel_data.append({
        "stage": stage,
        "count": count,
        "percentage": round(pct, 1),
        "conversion_rate": round(conversion, 1) if i > 0 else 100
    })

# 3. Outcomes by Rounds
print("Generating outcomes by rounds data...")
outcomes_by_rounds = []
for rounds in range(1, 8):
    subset = df[df['funding_rounds'] == rounds]
    if len(subset) > 0:
        operating_pct = (subset['status'] == 'operating').mean() * 100
        acquired_pct = (subset['status'] == 'acquired').mean() * 100
        closed_pct = (subset['status'] == 'closed').mean() * 100
        outcomes_by_rounds.append({
            "rounds": int(rounds),
            "count": int(len(subset)),
            "operating": round(operating_pct, 1),
            "acquired": round(acquired_pct, 1),
            "closed": round(closed_pct, 1)
        })

# 4. Peer Benchmark
print("Generating peer benchmark data...")
benchmark_countries = ['USA', 'GBR', 'DEU', 'NLD', 'ISR', 'FRA']
peer_data = []
for country in benchmark_countries:
    country_df = df[df['country_code'] == country]
    if len(country_df) > 0:
        peer_data.append({
            "country": country,
            "country_name": {
                'USA': 'United States',
                'GBR': 'United Kingdom',
                'DEU': 'Germany',
                'NLD': 'Netherlands',
                'ISR': 'Israel',
                'FRA': 'France'
            }.get(country, country),
            "company_count": int(len(country_df)),
            "total_funding": float(country_df['funding_usd'].sum()),
            "avg_funding": float(country_df['funding_usd'].mean()),
            "avg_rounds": float(country_df['funding_rounds'].mean()),
            "operating_rate": float((country_df['status'] == 'operating').mean() * 100)
        })

# 4b. Regional Comparison Data (NLD vs USA, Rest of Europe, Germany, Asia, China)
print("Generating regional comparison data...")

# Define regional groupings
europe_excl_nld_deu_gbr = ['FRA', 'ESP', 'ITA', 'SWE', 'CHE', 'BEL', 'AUT', 'DNK', 'NOR', 'FIN', 'IRL', 'PRT', 'POL', 'CZE']
asia_excl_china = ['JPN', 'KOR', 'SGP', 'IND', 'HKG', 'TWN', 'IDN', 'THA', 'VNM', 'MYS', 'PHL']
china_codes = ['CHN']

def get_region_stats(df, country_codes, region_name):
    region_df = df[df['country_code'].isin(country_codes)]
    if len(region_df) > 0:
        return {
            "region": region_name,
            "company_count": int(len(region_df)),
            "total_funding": float(region_df['funding_usd'].sum()),
            "avg_funding": float(region_df['funding_usd'].mean()),
            "avg_rounds": float(region_df['funding_rounds'].mean()),
            "operating_rate": float((region_df['status'] == 'operating').mean() * 100)
        }
    return None

regional_data = []

# Individual countries
for country, name in [('NLD', 'Netherlands'), ('USA', 'United States'), ('DEU', 'Germany')]:
    stats = get_region_stats(df, [country], name)
    if stats:
        regional_data.append(stats)

# Rest of Europe (excl NLD, DEU, GBR)
stats = get_region_stats(df, europe_excl_nld_deu_gbr, 'Rest of Europe')
if stats:
    regional_data.append(stats)

# Asia (excl China)
stats = get_region_stats(df, asia_excl_china, 'Asia')
if stats:
    regional_data.append(stats)

# China
stats = get_region_stats(df, china_codes, 'China')
if stats:
    regional_data.append(stats)

# 5. Time Series
print("Generating time series data...")
yearly = df.groupby('first_funding_year').agg({
    'name': 'count',
    'funding_usd': 'sum'
}).rename(columns={'name': 'company_count'})
yearly['avg_funding'] = yearly['funding_usd'] / yearly['company_count']

time_series = []
for year, row in yearly.iterrows():
    time_series.append({
        "year": int(year),
        "company_count": int(row['company_count']),
        "total_funding": float(row['funding_usd']),
        "avg_funding": float(row['avg_funding'])
    })

# 6. Sector Analysis
print("Generating sector analysis data...")
sector_data = df.groupby('market').agg({
    'name': 'count',
    'funding_usd': 'sum'
}).rename(columns={'name': 'company_count'})
sector_data['avg_funding'] = sector_data['funding_usd'] / sector_data['company_count']
top_sectors = sector_data.nlargest(15, 'company_count')

sectors = []
for sector, row in top_sectors.iterrows():
    dutch_sector = dutch[dutch['market'] == sector]
    sectors.append({
        "sector": sector,
        "company_count": int(row['company_count']),
        "total_funding": float(row['funding_usd']),
        "avg_funding": float(row['avg_funding']),
        "dutch_company_count": int(len(dutch_sector)),
        "dutch_total_funding": float(dutch_sector['funding_usd'].sum()) if len(dutch_sector) > 0 else 0,
        "dutch_avg_funding": float(dutch_sector['funding_usd'].mean()) if len(dutch_sector) > 0 else 0
    })

# 6b. Strategic & Hub Analysis (Phase 8)
print("Generating strategic sector & hub analysis...")

# Define Strategic Mapping
deep_tech_sectors = [
    'Biotechnology', 'Clean Technology', 'Health Care', 'Hardware + Software',
    'Semiconductors', 'Nanotechnology', 'Medical', 'Science and Engineering',
    'Manufacturing', 'Robotics'
]
digital_sectors = [
    'Software', 'Mobile', 'E-Commerce', 'Curated Web', 'Social Media',
    'Enterprise Software', 'Web', 'Games', 'Advertising', 'Analytics'
]

# function to categorize
def get_strategic_category(market):
    if market in deep_tech_sectors:
        return 'Deep Tech'
    elif market in digital_sectors:
        return 'Digital'
    return 'Other'

df['strategic_category'] = df['market'].apply(get_strategic_category)
dutch['strategic_category'] = dutch['market'].apply(get_strategic_category)

# Calculate split
funding_by_category = dutch.groupby('strategic_category')['funding_usd'].sum()
count_by_category = dutch.groupby('strategic_category')['name'].count()

strategic_split = {
    "funding": {
        "Deep Tech": float(funding_by_category.get('Deep Tech', 0)),
        "Digital": float(funding_by_category.get('Digital', 0)),
        "Other": float(funding_by_category.get('Other', 0))
    },
    "companies": {
        "Deep Tech": int(count_by_category.get('Deep Tech', 0)),
        "Digital": int(count_by_category.get('Digital', 0)),
        "Other": int(count_by_category.get('Other', 0))
    }
}

# Hub Analysis
target_cities = ['Amsterdam', 'Eindhoven', 'Rotterdam', 'Delft', 'Utrecht']

# Province Mapping (Manual override since CSV lacks it for NL)
# Province Mapping (Comprehensive)
CITY_PROVINCE_MAPPING = {
    # North Holland
    'Amsterdam': 'North Holland', 'Haarlem': 'North Holland', 'Hilversum': 'North Holland', 
    'Amstelveen': 'North Holland', 'Alkmaar': 'North Holland', 'Hoofddorp': 'North Holland',
    'Schiphol': 'North Holland', 'Naarden': 'North Holland', 'Bussum': 'North Holland',
    'Zaandam': 'North Holland', 'Zaanstad': 'North Holland', 'Huizen': 'North Holland',
    'Purmerend': 'North Holland', 'Laren': 'North Holland', 'Heerhogowaard': 'North Holland',
    'Weesp': 'North Holland', 'Zaandijk': 'North Holland', 'Castricum': 'North Holland',
    'Schagen': 'North Holland', 'Halfweg': 'North Holland', 'De Goorn': 'North Holland', 'Hoorn': 'North Holland',

    # South Holland
    'Rotterdam': 'South Holland', 'The Hague': 'South Holland', 'Den Haag': 'South Holland',
    'Delft': 'South Holland', 'Leiden': 'South Holland', 'Dordrecht': 'South Holland',
    'Zoetermeer': 'South Holland', 'Schiedam': 'South Holland', 'Rijswijk': 'South Holland',
    'Noordwijk': 'South Holland', 'Oegstgeest': 'South Holland', 'Gouda': 'South Holland',
    'Westland': 'South Holland', 'Alphen aan den Rijn': 'South Holland', 'Capelle aan den IJssel': 'South Holland',
    'Voorburg': 'South Holland', 'Katwijk': 'South Holland', 'Naaldwijk': 'South Holland', 
    'Wassenaar': 'South Holland', 'Bodegraven': 'South Holland', 'Gorinchem': 'South Holland',
    'Boskoop': 'South Holland',

    # Utrecht
    'Utrecht': 'Utrecht', 'Amersfoort': 'Utrecht', 'Zeist': 'Utrecht', 'Nieuwegein': 'Utrecht',
    'Veenendaal': 'Utrecht', 'Woerden': 'Utrecht', 'Soest': 'Utrecht', 'Houten': 'Utrecht',
    'Maarssen': 'Utrecht', 'Breukelen': 'Utrecht', 'Vleuten': 'Utrecht', 'Bunnik': 'Utrecht',
    'Bilthoven': 'Utrecht', 'De Bilt': 'Utrecht', 'Baarn': 'Utrecht', 'Rhenen': 'Utrecht',
    
    # North Brabant
    'Eindhoven': 'North Brabant', 'Tilburg': 'North Brabant', 'Breda': 'North Brabant',
    'Den Bosch': 'North Brabant', "'s-Hertogenbosch": 'North Brabant', "('s-Hertogenbosch)": 'North Brabant',
    'Helmond': 'North Brabant', 'Roosendaal': 'North Brabant', 'Oss': 'North Brabant',
    'Bergen op Zoom': 'North Brabant', 'Oosterhout': 'North Brabant', 'Waalwijk': 'North Brabant',
    'Veldhoven': 'North Brabant', 'Best': 'North Brabant', 'Boxmeer': 'North Brabant', 'Veghel': 'North Brabant',
    
    # Gelderland
    'Nijmegen': 'Gelderland', 'Arnhem': 'Gelderland', 'Apeldoorn': 'Gelderland', 'Ede': 'Gelderland',
    'Wageningen': 'Gelderland', 'Doetinchem': 'Gelderland', 'Zutphen': 'Gelderland', 'Tiel': 'Gelderland',
    'Harderwijk': 'Gelderland', 'Wijchen': 'Gelderland', 'Barneveld': 'Gelderland', 'Culemborg': 'Gelderland',
    'Nijkerk': 'Gelderland', 'Hoevelaken': 'Gelderland', 'Geldermalsen': 'Gelderland',
    
    # Overijssel
    'Enschede': 'Overijssel', 'Zwolle': 'Overijssel', 'Deventer': 'Overijssel', 'Hengelo': 'Overijssel',
    'Almelo': 'Overijssel', 'Kampen': 'Overijssel', 'Oldenzaal': 'Overijssel',
    
    # Limburg
    'Maastricht': 'Limburg', 'Venlo': 'Limburg', 'Heerlen': 'Limburg', 'Sittard': 'Limburg',
    'Geleen': 'Limburg', 'Roermond': 'Limburg', 'Weert': 'Limburg',
    
    # Groningen
    'Groningen': 'Groningen', 'Haren': 'Groningen', 'Veendam': 'Groningen',
    
    # Friesland
    'Leeuwarden': 'Friesland', 'Drachten': 'Friesland', 'Sneek': 'Friesland', 'Heerenveen': 'Friesland',
    'Joure': 'Friesland', 'Huins': 'Friesland',
    
    # Flevoland
    'Almere': 'Flevoland', 'Lelystad': 'Flevoland', 'Dronten': 'Flevoland', 'Zeewolde': 'Flevoland',
    
    # Drenthe
    'Assen': 'Drenthe', 'Emmen': 'Drenthe', 'Hoogeveen': 'Drenthe', 'Meppel': 'Drenthe',
    
    # Zeeland
    'Middelburg': 'Zeeland', 'Vlissingen': 'Zeeland', 'Goes': 'Zeeland', 'Terneuzen': 'Zeeland',
}

# Process ALL cities
city_stats = {}
province_stats = {}

# Initialize all 12 provinces to ensure full map coverage
ALL_PROVINCES = [
    'North Holland', 'South Holland', 'Utrecht', 'North Brabant', 'Gelderland', 
    'Overijssel', 'Limburg', 'Groningen', 'Friesland', 'Flevoland', 'Drenthe', 'Zeeland'
]

for prov in ALL_PROVINCES:
    province_stats[prov] = {
        "province": prov,
        "company_count": 0,
        "total_funding": 0.0,
        "deep_tech_count": 0,
        "deep_tech_funding": 0.0
    }

# Clean city names and map to province
def get_province(city_name):
    if not isinstance(city_name, str): return 'Unknown'
    clean = city_name.strip()
    return CITY_PROVINCE_MAPPING.get(clean, 'Other')

# Iterate through all Dutch companies for granular geo analysis
all_cities_data = []

# Group by City
cities_grouped = dutch.groupby('city')

for city, group in cities_grouped:
    if not isinstance(city, str) or len(city) < 2: continue
    
    # Filter noise: only include cities with >0 funding or >1 company (unless it's a known hub)
    if group['funding_usd'].sum() == 0 and len(group) < 2:
        continue

    # Categorize deep tech for this city
    deep_tech_group = group[group['strategic_category'] == 'Deep Tech']
    
    prov = get_province(city)
    
    city_stat = {
        "city": city,
        "province": prov,
        "company_count": int(len(group)),
        "total_funding": float(group['funding_usd'].sum()),
        "deep_tech_count": int(len(deep_tech_group)),
        "deep_tech_funding": float(deep_tech_group['funding_usd'].sum()),
        "deep_tech_intensity": float(len(deep_tech_group) / len(group) * 100)
    }
    all_cities_data.append(city_stat)

    # Aggregate to Province
    if prov != 'Other':
        province_stats[prov]["company_count"] += city_stat["company_count"]
        province_stats[prov]["total_funding"] += city_stat["total_funding"]
        province_stats[prov]["deep_tech_count"] += city_stat["deep_tech_count"]
        province_stats[prov]["deep_tech_funding"] += city_stat["deep_tech_funding"]

# Convert province stats to list and add insights
all_provinces_data = []

# Calculate averages for benchmarks
total_companies = sum(p['company_count'] for p in province_stats.values())
total_deep_tech = sum(p['deep_tech_count'] for p in province_stats.values())
avg_deep_tech_intensity = (total_deep_tech / total_companies * 100) if total_companies > 0 else 0

for prov, stats in province_stats.items():
    stats["deep_tech_intensity"] = float(stats["deep_tech_count"] / stats["company_count"] * 100) if stats["company_count"] > 0 else 0
    
    # Generate Insight
    if stats["company_count"] == 0:
        stats["highlight"] = "No Data Available"
    elif stats["total_funding"] > 500_000_000:
        stats["highlight"] = "Major Capital Hub"
    elif stats["deep_tech_intensity"] > 25:
        stats["highlight"] = "Deep Tech Hotspot"
    elif stats["deep_tech_intensity"] > avg_deep_tech_intensity + 5:
        stats["highlight"] = "Innovation Cluster"
    elif stats["company_count"] > 20 and stats["total_funding"] < 10_000_000:
        stats["highlight"] = "Capital Efficient"
    else:
        stats["highlight"] = "Emerging Ecosystem"
        
    all_provinces_data.append(stats)

# Legacy Hub Data (Top 5 for original chart)
hub_data = []
for city in target_cities:
    city_df = dutch[dutch['city'].str.contains(city, case=False, na=False)]
    
    if len(city_df) > 0:
        deep_tech_df = city_df[city_df['strategic_category'] == 'Deep Tech']
        
        hub_data.append({
            "city": city,
            "company_count": int(len(city_df)),
            "total_funding": float(city_df['funding_usd'].sum()),
            "avg_funding": float(city_df['funding_usd'].mean()),
            "deep_tech_count": int(len(deep_tech_df)),
            "deep_tech_funding": float(deep_tech_df['funding_usd'].sum()),
            "deep_tech_intensity_count": float(len(deep_tech_df) / len(city_df) * 100),
            "deep_tech_intensity_funding": float(deep_tech_df['funding_usd'].sum() / city_df['funding_usd'].sum() * 100) if city_df['funding_usd'].sum() > 0 else 0
        })

strategic_analysis = {
    "split": strategic_split,
    "hubs": hub_data,
    "all_cities": sorted(all_cities_data, key=lambda x: x['total_funding'], reverse=True),
    "provinces": sorted(all_provinces_data, key=lambda x: x['total_funding'], reverse=True)
}


# 7. Survival/Decay Data (inspired by car depreciation)
print("Generating survival/decay data...")
round_columns = ['seed', 'round_A', 'round_B', 'round_C', 'round_D', 'round_E']
round_names = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Series E']

survival_data = []
# Define peers for survival analysis
peers = {
    'USA': 'usa',
    'GBR': 'uk',
    'DEU': 'germany',
    'FRA': 'france',
    'SWE': 'sweden'
}

for i, (col, name) in enumerate(zip(round_columns, round_names)):
    global_count = (df[col] > 0).sum()
    dutch_count = (dutch[col] > 0).sum() if len(dutch) > 0 else 0
    
    global_survival = (global_count / len(df) * 100) if len(df) > 0 else 0
    dutch_survival = (dutch_count / len(dutch) * 100) if len(dutch) > 0 else 0
    
    row = {
        "round": i,
        "round_name": name,
        "global_survival_rate": round(global_survival, 1),
        "dutch_survival_rate": round(dutch_survival, 1),
        "global_count": int(global_count),
        "dutch_count": int(dutch_count)
    }

    # Calculate Peers
    for code, key in peers.items():
        peer_df = df[df['country_code'] == code]
        peer_count = (peer_df[col] > 0).sum()
        peer_survival = (peer_count / len(peer_df) * 100) if len(peer_df) > 0 else 0
        row[f"{key}_survival_rate"] = round(peer_survival, 1)

    # Calculate drop-off from previous round
    if i > 0:
        prev_col = round_columns[i-1]
        prev_global = (df[prev_col] > 0).sum()
        prev_dutch = (dutch[prev_col] > 0).sum() if len(dutch) > 0 else 0
        global_dropoff = ((prev_global - global_count) / prev_global * 100) if prev_global > 0 else 0
        dutch_dropoff = ((prev_dutch - dutch_count) / prev_dutch * 100) if prev_dutch > 0 else 0
    else:
        global_dropoff = 0
        dutch_dropoff = 0
    
    row["global_dropoff"] = round(global_dropoff, 1)
    row["dutch_dropoff"] = round(dutch_dropoff, 1)
    
    survival_data.append(row)

# 8. Cohort Analysis
print("Generating cohort analysis data...")
cohorts = []
for year in range(2005, 2015):
    cohort_df = df[df['founded_year'] == year]
    if len(cohort_df) > 0:
        cohorts.append({
            "founded_year": int(year),
            "company_count": int(len(cohort_df)),
            "avg_funding": float(cohort_df['funding_usd'].mean()),
            "avg_rounds": float(cohort_df['funding_rounds'].mean()),
            "operating_rate": float((cohort_df['status'] == 'operating').mean() * 100),
            "acquired_rate": float((cohort_df['status'] == 'acquired').mean() * 100)
        })

# 9. Deep Tech Analysis (New!)
print("Generating Deep Tech analysis...")

# Sector classification
deep_tech_keywords = ['biotech', 'clean technology', 'hardware', 'manufacturing', 'semiconductor', 'nanotechnology', 'medical', 'health care']
digital_keywords = ['software', 'saas', 'e-commerce', 'mobile', 'social media', 'advertising', 'games', 'curated web', 'analytics', 'enterprise software']

def classify_sector(market):
    if pd.isna(market):
        return 'Other'
    m = str(market).lower().strip()
    if any(kw in m for kw in deep_tech_keywords):
        return 'Deep Tech'
    elif any(kw in m for kw in digital_keywords):
        return 'Digital'
    return 'Other'

df['sector_type'] = df['market'].apply(classify_sector)
dutch['sector_type'] = dutch['market'].apply(classify_sector)

# Calculate metrics for each sector type
def calc_sector_metrics(data, sector_type):
    subset = data[data['sector_type'] == sector_type]
    if len(subset) == 0:
        return None
    return {
        "count": int(len(subset)),
        "acquired_rate": round((subset['status'] == 'acquired').mean() * 100, 1),
        "operating_rate": round((subset['status'] == 'operating').mean() * 100, 1),
        "closed_rate": round((subset['status'] == 'closed').mean() * 100, 1),
        "avg_funding": round(float(subset['funding_usd'].mean()), 0),
        "total_funding": round(float(subset['funding_usd'].sum()), 0),
    }

# Time to scale (for multi-round companies)
dutch['days_between_fundings'] = (dutch['last_funding_date'] - dutch['first_funding_date']).dt.days
multi_round_dutch = dutch[dutch['funding_rounds'] > 1]

time_to_scale = {
    "multi_round_count": int(len(multi_round_dutch)),
    "single_round_count": int(len(dutch) - len(multi_round_dutch)),
    "single_round_pct": round((len(dutch) - len(multi_round_dutch)) / len(dutch) * 100, 1) if len(dutch) > 0 else 0,
    "avg_days": round(float(multi_round_dutch['days_between_fundings'].mean()), 0) if len(multi_round_dutch) > 0 else 0,
    "avg_years": round(float(multi_round_dutch['days_between_fundings'].mean() / 365), 1) if len(multi_round_dutch) > 0 else 0,
    "median_days": round(float(multi_round_dutch['days_between_fundings'].median()), 0) if len(multi_round_dutch) > 0 else 0,
}

deep_tech_analysis = {
    "dutch": {
        "deep_tech": calc_sector_metrics(dutch, "Deep Tech"),
        "digital": calc_sector_metrics(dutch, "Digital"),
        "other": calc_sector_metrics(dutch, "Other"),
    },
    "global": {
        "deep_tech": calc_sector_metrics(df, "Deep Tech"),
        "digital": calc_sector_metrics(df, "Digital"),
        "other": calc_sector_metrics(df, "Other"),
    },
    "time_to_scale": time_to_scale,
    "headline_insights": {
        "deep_tech_acquisition_advantage": round(
            (calc_sector_metrics(dutch, "Deep Tech")["acquired_rate"] if calc_sector_metrics(dutch, "Deep Tech") else 0) / 
            (calc_sector_metrics(dutch, "Digital")["acquired_rate"] if calc_sector_metrics(dutch, "Digital") and calc_sector_metrics(dutch, "Digital")["acquired_rate"] > 0 else 1),
            1
        ),
        "dutch_vs_global_deep_tech_delta": round(
            (calc_sector_metrics(dutch, "Deep Tech")["acquired_rate"] if calc_sector_metrics(dutch, "Deep Tech") else 0) - 
            (calc_sector_metrics(df, "Deep Tech")["acquired_rate"] if calc_sector_metrics(df, "Deep Tech") else 0),
            1
        ),
        "amsterdam_concentration": round(
            (dutch['city'] == 'Amsterdam').sum() / len(dutch) * 100, 1
        ) if len(dutch) > 0 else 0,
    }
}

# Write all JSON files
print("Writing JSON files...")

with open(DATA_DIR / "overview.json", 'w') as f:
    json.dump(overview, f, indent=2)

with open(DATA_DIR / "funnel.json", 'w') as f:
    json.dump(funnel_data, f, indent=2)

with open(DATA_DIR / "funnel_comparison.json", 'w') as f:
    json.dump(funnel_comparison, f, indent=2)

with open(DATA_DIR / "outcomes.json", 'w') as f:
    json.dump(outcomes_by_rounds, f, indent=2)

with open(DATA_DIR / "peers.json", 'w') as f:
    json.dump(peer_data, f, indent=2)

with open(DATA_DIR / "regional.json", 'w') as f:
    json.dump(regional_data, f, indent=2)

with open(DATA_DIR / "timeline.json", 'w') as f:
    json.dump(time_series, f, indent=2)

with open(DATA_DIR / "sectors.json", 'w') as f:
    json.dump(sectors, f, indent=2)

with open(DATA_DIR / "survival.json", 'w') as f:
    json.dump(survival_data, f, indent=2)

with open(DATA_DIR / "strategic_analysis.json", 'w') as f:
    json.dump(strategic_analysis, f, indent=2)


with open(DATA_DIR / "cohorts.json", 'w') as f:
    json.dump(cohorts, f, indent=2)

with open(DATA_DIR / "deep_tech_analysis.json", 'w') as f:
    json.dump(deep_tech_analysis, f, indent=2)

print(f"✅ Generated {len(list(DATA_DIR.glob('*.json')))} JSON files in {DATA_DIR}")
