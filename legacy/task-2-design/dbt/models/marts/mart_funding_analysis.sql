{{
    config(
        materialized='table',
        tags=['marts', 'analytics', 'funding']
    )
}}

/*
    Funding Analysis Mart

    Business-ready aggregated view of funding activity by company.
    This mart powers dashboards and ad-hoc analysis for:
    - Ecosystem health metrics
    - Funding trends over time
    - Company funding journey analysis

    Refresh: Daily
    Primary users: Analysts, Report generation
*/

with companies as (

    select * from {{ ref('stg_companies') }}

),

funding_rounds as (

    select * from {{ ref('stg_funding_rounds') }}

),

-- Aggregate funding at company level
company_funding_summary as (

    select
        company_id,

        -- Round counts
        count(*) as total_funding_rounds,
        count(case when round_type = 'seed' then 1 end) as seed_rounds,
        count(case when round_type = 'series_a' then 1 end) as series_a_rounds,
        count(case when round_type = 'series_b' then 1 end) as series_b_rounds,
        count(case when round_type = 'series_c' then 1 end) as series_c_rounds,
        count(case when round_type in ('series_d', 'series_e', 'series_f', 'series_g', 'series_h') then 1 end) as late_stage_rounds,

        -- Funding amounts
        sum(amount_eur) as total_funding_from_rounds_eur,
        avg(amount_eur) as avg_round_size_eur,
        min(amount_eur) as min_round_size_eur,
        max(amount_eur) as max_round_size_eur,

        -- Dates
        min(round_date) as first_funding_date,
        max(round_date) as last_funding_date,

        -- Latest round info
        max(case when round_sequence = (select max(round_sequence) from funding_rounds f2 where f2.company_id = funding_rounds.company_id) then round_type end) as latest_round_type,

        -- Time between rounds (days)
        case
            when count(*) > 1
            then (max(round_date) - min(round_date))::int / (count(*) - 1)
            else null
        end as avg_days_between_rounds

    from funding_rounds
    group by company_id

),

-- Join company info with funding summary
final as (

    select
        -- Company identifiers
        c.company_id,
        c.company_name,
        c.legal_name,

        -- Company attributes
        c.founding_date,
        c.employee_count,
        c.current_status,

        -- Location
        c.headquarters_city,
        c.headquarters_country,
        c.headquarters_region,

        -- Funding metrics
        coalesce(f.total_funding_rounds, 0) as total_funding_rounds,
        f.seed_rounds,
        f.series_a_rounds,
        f.series_b_rounds,
        f.series_c_rounds,
        f.late_stage_rounds,

        coalesce(c.total_funding_eur, f.total_funding_from_rounds_eur) as total_funding_eur,
        f.avg_round_size_eur,
        f.min_round_size_eur,
        f.max_round_size_eur,

        -- Funding journey
        f.first_funding_date,
        f.last_funding_date,
        f.latest_round_type,
        f.avg_days_between_rounds,

        -- Derived metrics
        case
            when c.founding_date is not null and f.first_funding_date is not null
            then (f.first_funding_date - c.founding_date)::int
            else null
        end as days_to_first_funding,

        case
            when c.founding_date is not null
            then extract(year from age(current_date, c.founding_date))
            else null
        end as company_age_years,

        -- Funding stage classification
        case
            when f.late_stage_rounds > 0 or f.series_c_rounds > 0 then 'Late Stage'
            when f.series_b_rounds > 0 then 'Growth Stage'
            when f.series_a_rounds > 0 then 'Early Stage'
            when f.seed_rounds > 0 then 'Seed Stage'
            when f.total_funding_rounds > 0 then 'Other Funding'
            else 'Pre-Funding'
        end as funding_stage,

        -- Metadata
        c.source_system,
        current_timestamp as mart_updated_at

    from companies c
    left join company_funding_summary f on c.company_id = f.company_id

)

select * from final
