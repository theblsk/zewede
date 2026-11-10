-- Local development seed: a staff login and a random menu. Never run this against production.
--
--   supabase start      first run applies the schema + this seed
--   supabase db reset   wipe and re-seed
--   bun run dev:local   run the app against the local stack
--
-- Login: admin@zewede.test / zewede-local (ADMIN)

begin;

-- Fixed seed so every reset gives the same menu; delete this line for a different one each time.
select setseed(0.42);

-- 1. Staff account ---------------------------------------------------------
insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
) values (
    '00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000001',
    'authenticated', 'authenticated', 'admin@zewede.test',
    extensions.crypt('zewede-local', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(),
    '', '', '', ''
);

insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
    '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'email',
    '{"sub":"00000000-0000-4000-8000-000000000001","email":"admin@zewede.test","email_verified":true}',
    now(), now(), now()
);

-- The insert trigger forces every self-created profile to CUSTOMER, so bypass it for the first admin.
alter table public.users disable trigger users_before_insert;
insert into public.users (id, email, first_name, last_name, phone_number, role)
values ('00000000-0000-4000-8000-000000000001', 'admin@zewede.test', 'Local', 'Admin', '+961 70 000 000', 'ADMIN');
alter table public.users enable trigger users_before_insert;

-- 2. Categories (roughly a quarter disabled) --------------------------------
create temp table seed_categories on commit drop as
select gen_random_uuid() as id, c.en, c.ar, random() > 0.25 as is_active
from (values
    ('Manoushe', 'مناقيش'), ('Pizza', 'بيتزا'), ('Kaake', 'كعك'), ('Pastries', 'معجنات'),
    ('Sandwiches', 'سندويشات'), ('Sweets', 'حلويات'), ('Drinks', 'مشروبات'), ('Bread & Dough', 'خبز وعجين')
) as c(en, ar);

insert into public.categories (id, slug, name, description, is_active)
select id, lower(replace(replace(en, ' & ', '-'), ' ', '-')), en, 'Seeded ' || lower(en) || ' category.', is_active
from seed_categories;

insert into public.categories_translations (category_id, locale, name)
select id, 'ar', ar from seed_categories;

-- 3. Menu items: 60 random flavour x product names, random category and flags --
create temp table seed_items on commit drop as
select
    gen_random_uuid() as id,
    picked.name,
    picked.name_ar,
    cats.ids[1 + floor(random() * array_length(cats.ids, 1))::int] as category_id,
    random() > 0.2 as availability,
    random() > 0.25 as is_active
from (
    select flavour.en || ' ' || product.en as name, product.ar || ' ' || flavour.ar as name_ar
    from (values
        ('Classic', 'كلاسيك'), ('Spicy', 'حار'), ('Smoked', 'مدخن'), ('Garlic', 'بالثوم'), ('Honey', 'بالعسل'),
        ('Crispy', 'مقرمش'), ('Stuffed', 'محشي'), ('Mini', 'صغير'), ('Royal', 'ملكي'), ('Village', 'بلدي')
    ) as flavour(en, ar)
    cross join (values
        ('Zaatar', 'زعتر'), ('Cheese', 'جبنة'), ('Lahm Bi Ajin', 'لحم بعجين'), ('Labneh', 'لبنة'), ('Spinach', 'سبانخ'),
        ('Kishk', 'كشك'), ('Halloumi', 'حلوم'), ('Sujuk', 'سجق'), ('Chicken', 'دجاج'), ('Knafeh', 'كنافة')
    ) as product(en, ar)
    order by random()
    limit 60
) as picked
cross join (select array_agg(id) as ids from seed_categories) as cats;

insert into public.menu_items (id, category_id, slug, name, description, availability, is_active)
select id, category_id, 'seed-' || row_number() over (), name, 'Freshly baked ' || lower(name) || '.', availability, is_active
from seed_items;

insert into public.menu_items_translations (menu_item_id, locale, name, description)
select id, 'ar', name_ar, name_ar || ' طازج من الفرن.' from seed_items;

-- 4. Sizes: 1-3 per item, each larger size costing more -----------------------
insert into public.menu_item_sizes (menu_item_id, price, is_active)
select item.id, (10 + abs(hashtext(item.id::text)) % 60) * 5000 * size_number, true
from seed_items as item
cross join lateral generate_series(1, 1 + abs(hashtext(item.name)) % 3) as size_number;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name)
select size.id, label.locale, label.names[size.position]
from (
    select id, row_number() over (partition by menu_item_id order by price) as position
    from public.menu_item_sizes
) as size
cross join (values ('en', array['Small', 'Medium', 'Large']), ('ar', array['صغير', 'وسط', 'كبير'])) as label(locale, names);

commit;
