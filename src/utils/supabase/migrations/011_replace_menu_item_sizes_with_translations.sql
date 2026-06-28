begin;

set local check_function_bodies = off;

create or replace function public.replace_menu_item_sizes_with_translations(
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

    delete from public.menu_item_sizes
    where menu_item_sizes.menu_item_id = replace_menu_item_sizes_with_translations.menu_item_id;

    if jsonb_array_length(sizes) = 0 then
        return;
    end if;

    if exists (
        select 1
        from jsonb_array_elements(sizes) as t(elem)
        where nullif(btrim(elem->>'name'), '') is null
    ) then
        raise exception 'Size name is required for all sizes' using errcode = '22023';
    end if;

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
        raise exception 'Failed to replace size(s): %', sqlerrm;
    end;

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
        raise exception 'Failed to replace size translation(s): %', sqlerrm;
    end;

    return query
    select (elem->>'id')::uuid
    from jsonb_array_elements(sizes) as t(elem);
end;
$$;

set local check_function_bodies = on;

grant execute on function public.replace_menu_item_sizes_with_translations(uuid, jsonb) to authenticated;

commit;
