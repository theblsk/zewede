begin;

create table if not exists public.site_settings (
    id uuid primary key default gen_random_uuid(),
    hero_image_key text,
    hero_image_backup_key text,
    call_phone_number text not null default '+961 81 484 472',
    whatsapp_phone_number text not null default '+961 81 484 472',
    opening_hours_en text not null default '7:30 AM - 2:30 PM, 6:00 PM - 10:00 PM',
    opening_hours_ar text not null default '٧:٣٠ ص - ٢:٣٠ م، ٦:٠٠ م - ١٠:٠٠ م',
    closed_days text[] not null default '{}'::text[],
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint site_settings_call_phone_not_blank check (char_length(btrim(call_phone_number)) > 0),
    constraint site_settings_whatsapp_phone_not_blank check (char_length(btrim(whatsapp_phone_number)) > 0),
    constraint site_settings_opening_hours_en_not_blank check (char_length(btrim(opening_hours_en)) > 0),
    constraint site_settings_opening_hours_ar_not_blank check (char_length(btrim(opening_hours_ar)) > 0),
    constraint site_settings_closed_days_valid check (
        closed_days <@ array[
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ]::text[]
    )
);

comment on table public.site_settings is 'Global landing page settings (hero image, phones, and opening hours).';

-- Enforce a single-row settings table.
create unique index if not exists site_settings_singleton_idx
    on public.site_settings ((true));

insert into public.site_settings (
    call_phone_number,
    whatsapp_phone_number,
    opening_hours_en,
    opening_hours_ar,
    closed_days
)
select
    '+961 81 484 472',
    '+961 81 484 472',
    '7:30 AM - 2:30 PM, 6:00 PM - 10:00 PM',
    '٧:٣٠ ص - ٢:٣٠ م، ٦:٠٠ م - ١٠:٠٠ م',
    '{}'::text[]
where not exists (
    select 1 from public.site_settings
);

create or replace function public.site_settings_before_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at := timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists site_settings_before_update on public.site_settings;
create trigger site_settings_before_update
    before update on public.site_settings
    for each row
    execute function public.site_settings_before_update();

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can view site settings" on public.site_settings;
create policy "Anyone can view site settings"
    on public.site_settings
    for select
    using (true);

drop policy if exists "Staff can insert site settings" on public.site_settings;
create policy "Staff can insert site settings"
    on public.site_settings
    for insert
    with check (public.is_staff());

drop policy if exists "Staff can update site settings" on public.site_settings;
create policy "Staff can update site settings"
    on public.site_settings
    for update
    using (public.is_staff())
    with check (public.is_staff());

drop policy if exists "Staff can delete site settings" on public.site_settings;
create policy "Staff can delete site settings"
    on public.site_settings
    for delete
    using (public.is_staff());

commit;
