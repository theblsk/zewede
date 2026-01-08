begin;

-- 1. Reset Data: Truncate tables in reverse dependency order
-- (children tables first, then parent tables)
truncate table public.menu_item_max_order_limits cascade;
truncate table public.menu_item_price cascade;
truncate table public.menu_items_translations cascade;
truncate table public.menu_items cascade;
truncate table public.categories_translations cascade;
truncate table public.categories cascade;

-- 2. Drop Obsolete Structures
-- Drop tables first (they depend on types)
drop table if exists public.menu_item_max_order_limits cascade;
drop table if exists public.menu_item_price cascade;

-- Drop types
drop type if exists public.order_limit_unit;
drop type if exists public.sell_unit;

-- 3. Create New Schema: menu_item_sizes table
create table if not exists public.menu_item_sizes (
    id uuid primary key default gen_random_uuid(),
    menu_item_id uuid not null references public.menu_items(id) on delete cascade,
    price int not null,
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint menu_item_sizes_price_non_negative check (price >= 0)
);

comment on table public.menu_item_sizes is 'Stores different sizes and their prices for menu items.';

-- 4. Create menu_item_size_translations table
create table if not exists public.menu_item_size_translations (
    id uuid primary key default gen_random_uuid(),
    menu_item_size_id uuid not null references public.menu_item_sizes(id) on delete cascade,
    locale text not null,
    name text not null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists menu_item_size_translations_locale_key
    on public.menu_item_size_translations (menu_item_size_id, locale);

comment on table public.menu_item_size_translations is 'Stores translated names for menu item sizes (e.g., "Small", "Large", "صغير", "كبير").';

-- 5. Enable Row Level Security
alter table public.menu_item_sizes enable row level security;
alter table public.menu_item_size_translations enable row level security;

-- 6. Create RLS Policies for menu_item_sizes
drop policy if exists "Anyone can view menu item sizes" on public.menu_item_sizes;
create policy "Anyone can view menu item sizes"
    on public.menu_item_sizes
    for select
    using (true);

drop policy if exists "Staff can insert menu item sizes" on public.menu_item_sizes;
create policy "Staff can insert menu item sizes"
    on public.menu_item_sizes
    for insert
    with check (public.is_staff());

drop policy if exists "Staff can update menu item sizes" on public.menu_item_sizes;
create policy "Staff can update menu item sizes"
    on public.menu_item_sizes
    for update
    using (public.is_staff())
    with check (public.is_staff());

drop policy if exists "Staff can delete menu item sizes" on public.menu_item_sizes;
create policy "Staff can delete menu item sizes"
    on public.menu_item_sizes
    for delete
    using (public.is_staff());

-- 7. Create RLS Policies for menu_item_size_translations
drop policy if exists "Anyone can view menu item size translations" on public.menu_item_size_translations;
create policy "Anyone can view menu item size translations"
    on public.menu_item_size_translations
    for select
    using (true);

drop policy if exists "Staff can insert menu item size translations" on public.menu_item_size_translations;
create policy "Staff can insert menu item size translations"
    on public.menu_item_size_translations
    for insert
    with check (public.is_staff());

drop policy if exists "Staff can update menu item size translations" on public.menu_item_size_translations;
create policy "Staff can update menu item size translations"
    on public.menu_item_size_translations
    for update
    using (public.is_staff())
    with check (public.is_staff());

drop policy if exists "Staff can delete menu item size translations" on public.menu_item_size_translations;
create policy "Staff can delete menu item size translations"
    on public.menu_item_size_translations
    for delete
    using (public.is_staff());

commit;

