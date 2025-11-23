begin;

-- Create enum type for order limit unit
do $$
begin
    if not exists (
        select 1 from pg_type t
        join pg_namespace n on n.oid = t.typnamespace
        where t.typname = 'order_limit_unit' and n.nspname = 'public'
    ) then
        create type public.order_limit_unit as enum ('box', 'gram');
    end if;
end;
$$;

-- Create the new table for max order limits
create table if not exists public.menu_item_max_order_limits (
    id uuid primary key default gen_random_uuid(),
    menu_item_id uuid not null references public.menu_items(id) on delete cascade,
    unit public.order_limit_unit not null,
    limit_value int not null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint menu_item_max_order_limits_limit_positive check (limit_value > 0),
    constraint menu_item_max_order_limits_unique_unit unique (menu_item_id, unit)
);

-- Migrate existing data from max_order_size JSONB field
-- Extract 'box' and 'gram' values from the JSONB object
insert into public.menu_item_max_order_limits (menu_item_id, unit, limit_value)
select 
    id as menu_item_id,
    'box'::public.order_limit_unit as unit,
    (max_order_size->>'box')::int as limit_value
from public.menu_items
where max_order_size is not null
  and jsonb_typeof(max_order_size) = 'object'
  and max_order_size ? 'box'
  and (max_order_size->>'box')::text ~ '^\d+$'
  and (max_order_size->>'box')::int > 0
on conflict (menu_item_id, unit) do nothing;

insert into public.menu_item_max_order_limits (menu_item_id, unit, limit_value)
select 
    id as menu_item_id,
    'gram'::public.order_limit_unit as unit,
    (max_order_size->>'gram')::int as limit_value
from public.menu_items
where max_order_size is not null
  and jsonb_typeof(max_order_size) = 'object'
  and max_order_size ? 'gram'
  and (max_order_size->>'gram')::text ~ '^\d+$'
  and (max_order_size->>'gram')::int > 0
on conflict (menu_item_id, unit) do nothing;

-- Drop the constraint and column from menu_items
alter table if exists public.menu_items
    drop constraint if exists menu_items_max_order_size_is_object;

alter table if exists public.menu_items
    drop column if exists max_order_size;

commit;

