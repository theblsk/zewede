begin;

-- Uploads are compressed client-side to ~300KB; reject anything that slips past it
-- so oversized originals can't inflate storage egress.
update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/*']
where id in ('menu-items', 'landing-assets');

commit;
