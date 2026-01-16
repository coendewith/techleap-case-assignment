{{
    config(
        materialized='table',
        tags=['marts', 'analytics', 'ecosystem']
    )
}}

/*
    Ecosystem Metrics Mart

    Aggregated metrics for ecosystem-level analysis.
    Provides country-level and time-series metrics for:
    - Ministry briefings
    - State of Dutch Tech Report
    - Benchmark comparisons

    Dimensions: Country, Year, Quarter, Sector
*/

with funding_analysis as (

    select * from {{ ref('mart_funding_analysis') }}

),

-- Country-level aggregations
country_metrics as (

    select
        headquarters_country as country,
        extract(year from first_funding_date)::int as funding_year,

        -- Company counts
        count(*) as total_companies,
        count(case when current_status = 'operating' then 1 end) as operating_companies,
        count(case when current_status = 'acquired' then 1 end) as acquired_companies,
        count(case when current_status = 'closed' then 1 end) as closed_companies,

        -- Funding metrics
        sum(total_funding_eur) as total_funding_eur,
        avg(total_funding_eur) as avg_funding_per_company_eur,
        percentile_cont(0.5) within group (order by total_funding_eur) as median_funding_eur,

        -- Round progression
        avg(total_funding_rounds) as avg_rounds_per_company,
        count(case when series_a_rounds > 0 then 1 end)::decimal / nullif(count(case when seed_rounds > 0 then 1 end), 0) as seed_to_series_a_rate,

        -- Survival metrics
        count(case when current_status = 'operating' then 1 end)::decimal / nullif(count(*), 0) as operating_rate,
        count(case when current_status = 'acquired' then 1 end)::decimal / nullif(count(*), 0) as acquisition_rate,
        count(case when current_status = 'closed' then 1 end)::decimal / nullif(count(*), 0) as closure_rate,

        -- Time metrics
        avg(days_to_first_funding) as avg_days_to_first_funding,
        avg(avg_days_between_rounds) as avg_days_between_rounds

    from funding_analysis
    where headquarters_country is not null
      and first_funding_date is not null
    group by headquarters_country, extract(year from first_funding_date)::int

),

-- Add year-over-year growth
with_growth as (

    select
        *,

        -- YoY growth calculations
        lag(total_companies) over (partition by country order by funding_year) as prev_year_companies,
        lag(total_funding_eur) over (partition by country order by funding_year) as prev_year_funding,

        case
            when lag(total_companies) over (partition by country order by funding_year) > 0
            then (total_companies - lag(total_companies) over (partition by country order by funding_year))::decimal /
                 lag(total_companies) over (partition by country order by funding_year)
            else null
        end as yoy_company_growth,

        case
            when lag(total_funding_eur) over (partition by country order by funding_year) > 0
            then (total_funding_eur - lag(total_funding_eur) over (partition by country order by funding_year)) /
                 lag(total_funding_eur) over (partition by country order by funding_year)
            else null
        end as yoy_funding_growth

    from country_metrics

)

select
    country,
    funding_year,

    -- Company counts
    total_companies,
    operating_companies,
    acquired_companies,
    closed_companies,

    -- Funding
    total_funding_eur,
    avg_funding_per_company_eur,
    median_funding_eur,

    -- Progression
    avg_rounds_per_company,
    seed_to_series_a_rate,

    -- Survival
    operating_rate,
    acquisition_rate,
    closure_rate,

    -- Time
    avg_days_to_first_funding,
    avg_days_between_rounds,

    -- Growth
    yoy_company_growth,
    yoy_funding_growth,

    -- Metadata
    current_timestamp as mart_updated_at

from with_growth
order by country, funding_year
