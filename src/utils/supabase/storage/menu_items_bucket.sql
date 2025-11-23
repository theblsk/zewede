-- Manual SQL to create the `menu-items` storage bucket and related policies.
-- Run this once inside your Supabase project (SQL Editor or psql).

begin;

-- Ensure the helper function exists (defined in 002_menu_rls.sql). If your
-- Supabase project has already run that migration, public.is_staff() is ready.

-- Create the public bucket (no-op if it already exists)
insert into storage.buckets (id, name, public)
select 'menu-items', 'menu-items', true
where not exists (
  select 1 from storage.buckets where id = 'menu-items'
);

-- Remove existing policies to avoid duplicates
drop policy if exists "public read menu-items" on storage.objects;
drop policy if exists "staff insert menu-items" on storage.objects;
drop policy if exists "staff update menu-items" on storage.objects;
drop policy if exists "staff delete menu-items" on storage.objects;

-- Allow anyone to read files from the bucket
create policy "public read menu-items"
  on storage.objects for select
  using (bucket_id = 'menu-items');

-- Allow staff (ADMIN/MANAGER via public.is_staff()) to upload new files
create policy "staff insert menu-items"
  on storage.objects for insert
  with check (bucket_id = 'menu-items' and public.is_staff());

-- Allow staff to replace/update existing files
create policy "staff update menu-items"
  on storage.objects for update
  using (bucket_id = 'menu-items' and public.is_staff())
  with check (bucket_id = 'menu-items' and public.is_staff());

-- Allow staff to delete files
create policy "staff delete menu-items"
  on storage.objects for delete
  using (bucket_id = 'menu-items' and public.is_staff());

commit;

