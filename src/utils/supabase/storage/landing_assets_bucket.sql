-- Manual SQL to create the `landing-assets` storage bucket and related policies.
-- Run this once inside your Supabase project (SQL Editor or psql).

begin;

insert into storage.buckets (id, name, public)
select 'landing-assets', 'landing-assets', true
where not exists (
  select 1 from storage.buckets where id = 'landing-assets'
);

drop policy if exists "public read landing-assets" on storage.objects;
drop policy if exists "staff insert landing-assets" on storage.objects;
drop policy if exists "staff update landing-assets" on storage.objects;
drop policy if exists "staff delete landing-assets" on storage.objects;

create policy "public read landing-assets"
  on storage.objects for select
  using (bucket_id = 'landing-assets');

create policy "staff insert landing-assets"
  on storage.objects for insert
  with check (bucket_id = 'landing-assets' and public.is_staff());

create policy "staff update landing-assets"
  on storage.objects for update
  using (bucket_id = 'landing-assets' and public.is_staff())
  with check (bucket_id = 'landing-assets' and public.is_staff());

create policy "staff delete landing-assets"
  on storage.objects for delete
  using (bucket_id = 'landing-assets' and public.is_staff());

commit;
