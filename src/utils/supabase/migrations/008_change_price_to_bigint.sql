begin;

-- Change price column to bigint to support larger values (LBP)
alter table public.menu_item_sizes
    alter column price type bigint;

-- Update the function to handle bigint prices
create or replace function public.create_menu_item_sizes_with_translations(
    menu_item_id uuid,
    sizes jsonb
)
returns table (id uuid)
language plpgsql
security invoker
set search_path = public
as $$
begin
    if menu_item_id is null then
        raise exception 'menu_item_id is required' using errcode = '22023';
    end if;

    if sizes is null or jsonb_typeof(sizes) <> 'array' then
        raise exception 'sizes must be a JSON array' using errcode = '22023';
    end if;

    if jsonb_array_length(sizes) = 0 then
        return;
    end if;

    -- Enforce required English size name (matches app validation expectations)
    if exists (
        select 1
        from jsonb_array_elements(sizes) as t(elem)
        where nullif(btrim(elem->>'name'), '') is null
    ) then
        raise exception 'Size name is required for all sizes' using errcode = '22023';
    end if;

    -- Insert sizes (bulk) - any error rolls back the entire function call
    begin
        with input as (
            select
                (elem->>'id')::uuid as id,
                (elem->>'price')::bigint as price,
                coalesce((elem->>'is_active')::boolean, true) as is_active
            from jsonb_array_elements(sizes) as t(elem)
        )
        insert into public.menu_item_sizes (id, menu_item_id, price, is_active)
        select input.id, menu_item_id, input.price, input.is_active
        from input;
    exception when others then
        raise exception 'Failed to create size(s): %', sqlerrm;
    end;

    -- Insert translations (bulk) - any error rolls back the entire function call
    begin
        with input as (
            select
                (elem->>'id')::uuid as id,
                nullif(btrim(elem->>'name'), '') as name_en,
                nullif(btrim(elem->>'name_ar'), '') as name_ar
            from jsonb_array_elements(sizes) as t(elem)
        ),
        translations as (
            select input.id as menu_item_size_id, 'en'::text as locale, input.name_en as name
            from input
            where input.name_en is not null
            union all
            select input.id, 'ar'::text, input.name_ar
            from input
            where input.name_ar is not null
        )
        insert into public.menu_item_size_translations (menu_item_size_id, locale, name)
        select menu_item_size_id, locale, name
        from translations;
    exception when others then
        raise exception 'Failed to create size translation(s): %', sqlerrm;
    end;

    -- Return ids (in input order) for callers that need them
    return query
    select (elem->>'id')::uuid
    from jsonb_array_elements(sizes) as t(elem);
end;
$$;

commit;
