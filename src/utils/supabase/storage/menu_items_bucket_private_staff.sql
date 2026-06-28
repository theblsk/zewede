-- Manual SQL to create the `menu-items` storage bucket with private.is_staff policies.
-- Use this for new projects after running migration 010_fix_staff_role_rls_recursion.sql.
-- If buckets already exist with public.is_staff policies, run 012_fix_storage_rls_and_deprecate_public_helpers.sql instead.

begin;

insert into storage.buckets (id, name, public)
select 'menu-items', 'menu-items', true
where not exists (
  select 1 from storage.buckets where id = 'menu-items'
);

drop policy if exists "public read menu-items" on storage.objects;
drop policy if exists "staff insert menu-items" on storage.objects;
drop policy if exists "staff update menu-items" on storage.objects;
drop policy if exists "staff delete menu-items" on storage.objects;

create policy "public read menu-items"
  on storage.objects for select
  using (bucket_id = 'menu-items');

create policy "staff insert menu-items"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu-items' and (select private.is_staff()));

create policy "staff update menu-items"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'menu-items' and (select private.is_staff()))
  with check (bucket_id = 'menu-items' and (select private.is_staff()));

create policy "staff delete menu-items"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu-items' and (select private.is_staff()));

commit;
