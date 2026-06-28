begin;

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select exists (
        select 1
        from public.users u
        where u.id = (select auth.uid())
          and u.role = 'ADMIN'
    );
$$;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select exists (
        select 1
        from public.users u
        where u.id = (select auth.uid())
          and u.role in ('ADMIN', 'MANAGER')
    );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on function private.is_staff() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_staff() to authenticated;

drop policy if exists "Admins can select all users" on public.users;
create policy "Admins can select all users"
    on public.users
    for select
    to authenticated
    using ((select private.is_admin()));

drop policy if exists "Admins can insert managed users" on public.users;
create policy "Admins can insert managed users"
    on public.users
    for insert
    to authenticated
    with check ((select private.is_admin()) and role in ('ADMIN', 'MANAGER'));

drop policy if exists "Admins can update all users" on public.users;
create policy "Admins can update all users"
    on public.users
    for update
    to authenticated
    using ((select private.is_admin()))
    with check ((select private.is_admin()));

drop policy if exists "Admins can delete all users" on public.users;
create policy "Admins can delete all users"
    on public.users
    for delete
    to authenticated
    using ((select private.is_admin()));

drop policy if exists "Staff can insert categories" on public.categories;
create policy "Staff can insert categories"
    on public.categories
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update categories" on public.categories;
create policy "Staff can update categories"
    on public.categories
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete categories" on public.categories;
create policy "Staff can delete categories"
    on public.categories
    for delete
    to authenticated
    using ((select private.is_staff()));

drop policy if exists "Staff can insert category translations" on public.categories_translations;
create policy "Staff can insert category translations"
    on public.categories_translations
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update category translations" on public.categories_translations;
create policy "Staff can update category translations"
    on public.categories_translations
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete category translations" on public.categories_translations;
create policy "Staff can delete category translations"
    on public.categories_translations
    for delete
    to authenticated
    using ((select private.is_staff()));

drop policy if exists "Staff can insert menu items" on public.menu_items;
create policy "Staff can insert menu items"
    on public.menu_items
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update menu items" on public.menu_items;
create policy "Staff can update menu items"
    on public.menu_items
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete menu items" on public.menu_items;
create policy "Staff can delete menu items"
    on public.menu_items
    for delete
    to authenticated
    using ((select private.is_staff()));

drop policy if exists "Staff can insert menu item translations" on public.menu_items_translations;
create policy "Staff can insert menu item translations"
    on public.menu_items_translations
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update menu item translations" on public.menu_items_translations;
create policy "Staff can update menu item translations"
    on public.menu_items_translations
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete menu item translations" on public.menu_items_translations;
create policy "Staff can delete menu item translations"
    on public.menu_items_translations
    for delete
    to authenticated
    using ((select private.is_staff()));

drop policy if exists "Staff can insert menu item sizes" on public.menu_item_sizes;
create policy "Staff can insert menu item sizes"
    on public.menu_item_sizes
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update menu item sizes" on public.menu_item_sizes;
create policy "Staff can update menu item sizes"
    on public.menu_item_sizes
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete menu item sizes" on public.menu_item_sizes;
create policy "Staff can delete menu item sizes"
    on public.menu_item_sizes
    for delete
    to authenticated
    using ((select private.is_staff()));

drop policy if exists "Staff can insert menu item size translations" on public.menu_item_size_translations;
create policy "Staff can insert menu item size translations"
    on public.menu_item_size_translations
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update menu item size translations" on public.menu_item_size_translations;
create policy "Staff can update menu item size translations"
    on public.menu_item_size_translations
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete menu item size translations" on public.menu_item_size_translations;
create policy "Staff can delete menu item size translations"
    on public.menu_item_size_translations
    for delete
    to authenticated
    using ((select private.is_staff()));

drop policy if exists "Staff can insert site settings" on public.site_settings;
create policy "Staff can insert site settings"
    on public.site_settings
    for insert
    to authenticated
    with check ((select private.is_staff()));

drop policy if exists "Staff can update site settings" on public.site_settings;
create policy "Staff can update site settings"
    on public.site_settings
    for update
    to authenticated
    using ((select private.is_staff()))
    with check ((select private.is_staff()));

drop policy if exists "Staff can delete site settings" on public.site_settings;
create policy "Staff can delete site settings"
    on public.site_settings
    for delete
    to authenticated
    using ((select private.is_staff()));

commit;
