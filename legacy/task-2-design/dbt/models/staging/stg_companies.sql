{{
    config(
        materialized='view',
        tags=['staging', 'companies']
    )
}}

/*
    Staging model for companies from Dealroom NDJSON source.

    This model:
    - Renames fields to snake_case convention
    - Casts data types appropriately
    - Adds basic data quality filters
    - Preserves all source fields for downstream flexibility

    Source: Dealroom daily export (companies.ndjson)
*/

with source as (

    select * from {{ source('dealroom_raw', 'companies_raw') }}

),

renamed as (

    select
        -- Primary identifiers
        company_id,
        trim(name) as company_name,
        trim(coalesce(legal_name, name)) as legal_name,

        -- Dates
        case
            when founding_date ~ '^\d{4}-\d{2}-\d{2}$'
            then founding_date::date
            else null
        end as founding_date,

        -- Metrics (with sanity checks)
        case
            when employee_count >= 0 and employee_count < 10000000
            then employee_count
            else null
        end as employee_count,

        case
            when total_funding_eur >= 0 and total_funding_eur < {{ var('max_funding_amount_eur') }}
            then total_funding_eur::decimal(18,2)
            else null
        end as total_funding_eur,

        -- Status normalization
        case lower(trim(status))
            when 'operating' then 'operating'
            when 'active' then 'operating'
            when 'acquired' then 'acquired'
            when 'closed' then 'closed'
            when 'shutdown' then 'closed'
            when 'ipo' then 'ipo'
            when 'public' then 'ipo'
            else 'unknown'
        end as current_status,

        -- Location (nested object flattening)
        trim(headquarters->>'city') as headquarters_city,
        trim(headquarters->>'country') as headquarters_country,
        trim(headquarters->>'region') as headquarters_region,

        -- Industries (array - will be flattened in bridge table)
        industries as industries_array,

        -- URLs
        trim(website_url) as website_url,
        trim(linkedin_url) as linkedin_url,

        -- Text fields
        trim(description) as description,
        trim(tagline) as tagline,

        -- Audit fields
        updated_at,
        '{{ var("source_system") }}' as source_system,
        _file_name as source_file,
        current_timestamp as _loaded_at

    from source

    -- Basic data quality filter
    where company_id is not null
      and trim(name) is not null
      and length(trim(name)) >= {{ var('min_company_name_length') }}

)

select * from renamed
