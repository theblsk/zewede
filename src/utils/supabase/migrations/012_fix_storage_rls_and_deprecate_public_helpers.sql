begin;

-- Depends on 010_fix_staff_role_rls_recursion.sql (private.is_admin / private.is_staff).

drop policy if exists "staff insert menu-items" on storage.objects;
create policy "staff insert menu-items"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'menu-items' and (select private.is_staff()));

drop policy if exists "staff update menu-items" on storage.objects;
create policy "staff update menu-items"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'menu-items' and (select private.is_staff()))
    with check (bucket_id = 'menu-items' and (select private.is_staff()));

drop policy if exists "staff delete menu-items" on storage.objects;
create policy "staff delete menu-items"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'menu-items' and (select private.is_staff()));

drop policy if exists "staff insert landing-assets" on storage.objects;
create policy "staff insert landing-assets"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'landing-assets' and (select private.is_staff()));

drop policy if exists "staff update landing-assets" on storage.objects;
create policy "staff update landing-assets"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'landing-assets' and (select private.is_staff()))
    with check (bucket_id = 'landing-assets' and (select private.is_staff()));

drop policy if exists "staff delete landing-assets" on storage.objects;
create policy "staff delete landing-assets"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'landing-assets' and (select private.is_staff()));

revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.is_staff() from public, anon, authenticated;

commit;
