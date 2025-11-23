begin;

alter table public.menu_item_max_order_limits enable row level security;

drop policy if exists "Anyone can view menu item max order limits" on public.menu_item_max_order_limits;
create policy "Anyone can view menu item max order limits"
    on public.menu_item_max_order_limits
    for select
    using (true);

drop policy if exists "Staff can insert menu item max order limits" on public.menu_item_max_order_limits;
create policy "Staff can insert menu item max order limits"
    on public.menu_item_max_order_limits
    for insert
    with check (public.is_staff());

drop policy if exists "Staff can update menu item max order limits" on public.menu_item_max_order_limits;
create policy "Staff can update menu item max order limits"
    on public.menu_item_max_order_limits
    for update
    using (public.is_staff())
    with check (public.is_staff());

drop policy if exists "Staff can delete menu item max order limits" on public.menu_item_max_order_limits;
create policy "Staff can delete menu item max order limits"
    on public.menu_item_max_order_limits
    for delete
    using (public.is_staff());

commit;

