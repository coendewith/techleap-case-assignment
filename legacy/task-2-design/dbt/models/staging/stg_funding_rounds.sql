{{
    config(
        materialized='view',
        tags=['staging', 'funding']
    )
}}

/*
    Staging model for funding rounds.

    Flattens the nested funding_rounds array from company records
    into individual rows for each funding event.

    This model:
    - Unnests the funding_rounds JSON array
    - Calculates round sequence numbers
    - Normalizes round types
    - Handles currency conversions (if available)
*/

with company_funding as (

    select
        company_id,
        funding_round
    from {{ source('dealroom_raw', 'companies_raw') }},
    lateral jsonb_array_elements(
        case
            when funding_rounds is not null and jsonb_typeof(funding_rounds) = 'array'
            then funding_rounds
            else '[]'::jsonb
        end
    ) as funding_round

),

parsed_rounds as (

    select
        company_id,

        -- Round identifiers
        funding_round->>'round_id' as funding_round_source_id,

        -- Round type normalization
        case lower(trim(funding_round->>'type'))
            when 'pre-seed' then 'pre_seed'
            when 'preseed' then 'pre_seed'
            when 'seed' then 'seed'
            when 'series a' then 'series_a'
            when 'series-a' then 'series_a'
            when 'series_a' then 'series_a'
            when 'series b' then 'series_b'
            when 'series-b' then 'series_b'
            when 'series_b' then 'series_b'
            when 'series c' then 'series_c'
            when 'series-c' then 'series_c'
            when 'series_c' then 'series_c'
            when 'series d' then 'series_d'
            when 'series-d' then 'series_d'
            when 'series_d' then 'series_d'
            when 'series e' then 'series_e'
            when 'series f' then 'series_f'
            when 'series g' then 'series_g'
            when 'series h' then 'series_h'
            when 'growth' then 'growth'
            when 'late stage' then 'growth'
            when 'bridge' then 'bridge'
            when 'convertible' then 'convertible_note'
            when 'convertible note' then 'convertible_note'
            when 'debt' then 'debt'
            when 'grant' then 'grant'
            when 'ipo' then 'ipo'
            when 'secondary' then 'secondary'
            when 'private equity' then 'private_equity'
            when 'pe' then 'private_equity'
            else 'unknown'
        end as round_type,

        -- Date parsing
        case
            when (funding_round->>'date') ~ '^\d{4}-\d{2}-\d{2}$'
            then (funding_round->>'date')::date
            else null
        end as round_date,

        -- Amount (EUR preferred, USD as fallback)
        case
            when (funding_round->>'amount_eur')::decimal(18,2) > 0
            then (funding_round->>'amount_eur')::decimal(18,2)
            else null
        end as amount_eur,

        case
            when (funding_round->>'amount_usd')::decimal(18,2) > 0
            then (funding_round->>'amount_usd')::decimal(18,2)
            else null
        end as amount_usd,

        -- Valuation
        (funding_round->>'valuation_pre_eur')::decimal(18,2) as valuation_pre_eur,
        (funding_round->>'valuation_post_eur')::decimal(18,2) as valuation_post_eur,

        -- Status
        coalesce(funding_round->>'status', 'completed') as deal_status,

        current_timestamp as _loaded_at

    from company_funding

),

with_sequence as (

    select
        *,
        row_number() over (
            partition by company_id
            order by round_date asc nulls last
        ) as round_sequence

    from parsed_rounds

)

select * from with_sequence
where round_date is not null  -- Filter out rounds without dates
