-- Populate ZEWEDE Menu Items
-- This script adds all menu items from the ZEWEDE menu
-- Run this script after running all migrations

begin;

-- Insert Categories
insert into public.categories (id, slug, name, description, is_active) values
    ('11111111-1111-1111-1111-111111111111', 'dozen', 'Dozen', 'Items sold by the dozen', true),
    ('22222222-2222-2222-2222-222222222222', 'pizza', 'Pizza', 'Delicious pizzas in various sizes', true),
    ('33333333-3333-3333-3333-333333333333', 'manoushe-mashrouha', 'Manoushe & Mashrouha', 'Traditional Lebanese flatbreads', true),
    ('44444444-4444-4444-4444-444444444444', 'kaake', 'Kaake', 'Traditional Lebanese sesame bread rings', true),
    ('55555555-5555-5555-5555-555555555555', 'drinks', 'Drinks', 'Beverages', true),
    ('66666666-6666-6666-6666-666666666666', 'bread-dough', 'Bread & Dough', 'Fresh bread and dough', true)
on conflict (id) do nothing;

-- Insert Category Translations
insert into public.categories_translations (category_id, locale, name, description) values
    -- Dozen
    ('11111111-1111-1111-1111-111111111111', 'en', 'Dozen', 'Items sold by the dozen'),
    ('11111111-1111-1111-1111-111111111111', 'ar', 'الدزينة', 'منتجات تباع بالدستة'),
    -- Pizza
    ('22222222-2222-2222-2222-222222222222', 'en', 'Pizza', 'Delicious pizzas in various sizes'),
    ('22222222-2222-2222-2222-222222222222', 'ar', 'البيتزا', 'بيتزا لذيذة بأحجام مختلفة'),
    -- Manoushe & Mashrouha
    ('33333333-3333-3333-3333-333333333333', 'en', 'Manoushe & Mashrouha', 'Traditional Lebanese flatbreads'),
    ('33333333-3333-3333-3333-333333333333', 'ar', 'المناقيش والمشروحة', 'مناقيش ومشروحة لبنانية تقليدية'),
    -- Kaake
    ('44444444-4444-4444-4444-444444444444', 'en', 'Kaake', 'Traditional Lebanese sesame bread rings'),
    ('44444444-4444-4444-4444-444444444444', 'ar', 'الكعكة', 'كعك لبناني تقليدي'),
    -- Drinks
    ('55555555-5555-5555-5555-555555555555', 'en', 'Drinks', 'Beverages'),
    ('55555555-5555-5555-5555-555555555555', 'ar', 'مشروبات', 'مشروبات ومرطبات'),
    -- Bread & Dough
    ('66666666-6666-6666-6666-666666666666', 'en', 'Bread & Dough', 'Fresh bread and dough'),
    ('66666666-6666-6666-6666-666666666666', 'ar', 'خبز ومعجين', 'خبز وعجين طازج')
on conflict (category_id, locale) do nothing;

-- ===========================================
-- DOZEN ITEMS (الدزينة)
-- ===========================================

-- Thyme Dozen (دزينة زعتر)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'dozen-thyme', 'Thyme Dozen', 'Dozen manoushe with thyme', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000001-0000-0000-0000-000000000001', 'en', 'Thyme Dozen', 'Dozen manoushe with thyme'),
    ('d0000001-0000-0000-0000-000000000001', 'ar', 'دزينة زعتر', 'دستة مناقيش زعتر')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 15000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000001-0000-0000-0000-000000000001', 'en', 'Dozen'),
    ('ds000001-0000-0000-0000-000000000001', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Cheese Dozen (دزينة جبنة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'dozen-cheese', 'Cheese Dozen', 'Dozen manoushe with cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000002-0000-0000-0000-000000000002', 'en', 'Cheese Dozen', 'Dozen manoushe with cheese'),
    ('d0000002-0000-0000-0000-000000000002', 'ar', 'دزينة جبنة', 'دستة مناقيش جبنة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000002-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000002', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000002-0000-0000-0000-000000000002', 'en', 'Dozen'),
    ('ds000002-0000-0000-0000-000000000002', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Cheese & Hot Pepper Dozen (دزينة جبنة حرة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'dozen-cheese-hot-pepper', 'Cheese & Hot Pepper Dozen', 'Dozen manoushe with cheese and hot pepper', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000003-0000-0000-0000-000000000003', 'en', 'Cheese & Hot Pepper Dozen', 'Dozen manoushe with cheese and hot pepper'),
    ('d0000003-0000-0000-0000-000000000003', 'ar', 'دزينة جبنة حرة', 'دستة مناقيش جبنة حرة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000003-0000-0000-0000-000000000003', 'd0000003-0000-0000-0000-000000000003', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000003-0000-0000-0000-000000000003', 'en', 'Dozen'),
    ('ds000003-0000-0000-0000-000000000003', 'ar', 'دستة')
on conflict (menu_item_id, locale) do nothing;

-- Cheese & Makdous Dozen (دزينة جبنة ومكدوس)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'dozen-cheese-makdous', 'Cheese & Makdous Dozen', 'Dozen manoushe with cheese and makdous', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000004-0000-0000-0000-000000000004', 'en', 'Cheese & Makdous Dozen', 'Dozen manoushe with cheese and makdous'),
    ('d0000004-0000-0000-0000-000000000004', 'ar', 'دزينة جبنة ومكدوس', 'دستة مناقيش جبنة ومكدوس')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000004-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000004', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000004-0000-0000-0000-000000000004', 'en', 'Dozen'),
    ('ds000004-0000-0000-0000-000000000004', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Walnut & Kashkaval Dozen (دزينة ول قشقوان)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'dozen-walnut-kashkaval', 'Walnut & Kashkaval Dozen', 'Dozen manoushe with walnut and kashkaval cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000005-0000-0000-0000-000000000005', 'en', 'Walnut & Kashkaval Dozen', 'Dozen manoushe with walnut and kashkaval cheese'),
    ('d0000005-0000-0000-0000-000000000005', 'ar', 'دزينة ول قشقوان', 'دستة مناقيش ول قشقوان')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000005-0000-0000-0000-000000000005', 'd0000005-0000-0000-0000-000000000005', 35000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000005-0000-0000-0000-000000000005', 'en', 'Dozen'),
    ('ds000005-0000-0000-0000-000000000005', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Chicken Dozen (دزينة دجاج)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'dozen-chicken', 'Chicken Dozen', 'Dozen manoushe with chicken', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000006-0000-0000-0000-000000000006', 'en', 'Chicken Dozen', 'Dozen manoushe with chicken'),
    ('d0000006-0000-0000-0000-000000000006', 'ar', 'دزينة دجاج', 'دستة مناقيش دجاج')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000006-0000-0000-0000-000000000006', 'd0000006-0000-0000-0000-000000000006', 28000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000006-0000-0000-0000-000000000006', 'en', 'Dozen'),
    ('ds000006-0000-0000-0000-000000000006', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Halloumi Dozen (دزينة هلومي)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'dozen-halloumi', 'Halloumi Dozen', 'Dozen manoushe with halloumi cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000007-0000-0000-0000-000000000007', 'en', 'Halloumi Dozen', 'Dozen manoushe with halloumi cheese'),
    ('d0000007-0000-0000-0000-000000000007', 'ar', 'دزينة هلومي', 'دستة مناقيش هلومي')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000007-0000-0000-0000-000000000007', 'd0000007-0000-0000-0000-000000000007', 28000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000007-0000-0000-0000-000000000007', 'en', 'Dozen'),
    ('ds000007-0000-0000-0000-000000000007', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Hot Dog Dozen (دزينة هوت دوغ)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'dozen-hot-dog', 'Hot Dog Dozen', 'Dozen manoushe with hot dog', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000008-0000-0000-0000-000000000008', 'en', 'Hot Dog Dozen', 'Dozen manoushe with hot dog'),
    ('d0000008-0000-0000-0000-000000000008', 'ar', 'دزينة هوت دوغ', 'دستة مناقيش هوت دوغ')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000008-0000-0000-0000-000000000008', 'd0000008-0000-0000-0000-000000000008', 38000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000008-0000-0000-0000-000000000008', 'en', 'Dozen'),
    ('ds000008-0000-0000-0000-000000000008', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Falafel Dozen (دزينة فلافل)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'dozen-falafel', 'Falafel Dozen', 'Dozen manoushe with falafel', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000009-0000-0000-0000-000000000009', 'en', 'Falafel Dozen', 'Dozen manoushe with falafel'),
    ('d0000009-0000-0000-0000-000000000009', 'ar', 'دزينة فلافل', 'دستة مناقيش فلافل')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000009-0000-0000-0000-000000000009', 'd0000009-0000-0000-0000-000000000009', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000009-0000-0000-0000-000000000009', 'en', 'Dozen'),
    ('ds000009-0000-0000-0000-000000000009', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Pizza Dozen (دزينة بيتزا)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'dozen-pizza', 'Pizza Dozen', 'Dozen mini pizzas', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000010-0000-0000-0000-000000000010', 'en', 'Pizza Dozen', 'Dozen mini pizzas'),
    ('d0000010-0000-0000-0000-000000000010', 'ar', 'دزينة بيتزا', 'دستة بيتزا صغيرة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000010-0000-0000-0000-000000000010', 'd0000010-0000-0000-0000-000000000010', 35000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000010-0000-0000-0000-000000000010', 'en', 'Dozen'),
    ('ds000010-0000-0000-0000-000000000010', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- Soujouk Dozen (دزينة سجق)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('d0000011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'dozen-soujouk', 'Soujouk Dozen', 'Dozen manoushe with soujouk', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000011-0000-0000-0000-000000000011', 'en', 'Soujouk Dozen', 'Dozen manoushe with soujouk'),
    ('d0000011-0000-0000-0000-000000000011', 'ar', 'دزينة سجق', 'دستة مناقيش سجق')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000011-0000-0000-0000-000000000011', 'd0000011-0000-0000-0000-000000000011', 30000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000011-0000-0000-0000-000000000011', 'en', 'Dozen'),
    ('ds000011-0000-0000-0000-000000000011', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- ===========================================
-- PIZZA ITEMS (البيتزا)
-- ===========================================

-- Vegetable Pizza (خضار)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'pizza-vegetable', 'Vegetable Pizza', 'Pizza with fresh vegetables', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000001-0000-0000-0000-000000000001', 'en', 'Vegetable Pizza', 'Pizza with fresh vegetables'),
    ('p0000001-0000-0000-0000-000000000001', 'ar', 'خضار', 'بيتزا بالخضار الطازجة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 72000000, true),
    ('ps000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000001', 50000000, true),
    ('ps000001-0000-0000-0000-000000000003', 'p0000001-0000-0000-0000-000000000001', 27000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000001-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000001-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000001-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000001-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000001-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000001-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- Margarita Pizza (مارغريتا)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'pizza-margarita', 'Margarita Pizza', 'Classic margarita pizza', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000002-0000-0000-0000-000000000002', 'en', 'Margarita Pizza', 'Classic margarita pizza'),
    ('p0000002-0000-0000-0000-000000000002', 'ar', 'مارغريتا', 'بيتزا مارغريتا كلاسيكية')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000002-0000-0000-0000-000000000001', 'p0000002-0000-0000-0000-000000000002', 72000000, true),
    ('ps000002-0000-0000-0000-000000000002', 'p0000002-0000-0000-0000-000000000002', 50000000, true),
    ('ps000002-0000-0000-0000-000000000003', 'p0000002-0000-0000-0000-000000000002', 27000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000002-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000002-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000002-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000002-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000002-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000002-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- Mortadella Pizza (مرتديلا)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'pizza-mortadella', 'Mortadella Pizza', 'Pizza with mortadella', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000003-0000-0000-0000-000000000003', 'en', 'Mortadella Pizza', 'Pizza with mortadella'),
    ('p0000003-0000-0000-0000-000000000003', 'ar', 'مرتديلا', 'بيتزا بالمرتديلا')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000003-0000-0000-0000-000000000001', 'p0000003-0000-0000-0000-000000000003', 82000000, true),
    ('ps000003-0000-0000-0000-000000000002', 'p0000003-0000-0000-0000-000000000003', 58000000, true),
    ('ps000003-0000-0000-0000-000000000003', 'p0000003-0000-0000-0000-000000000003', 38000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000003-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000003-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000003-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000003-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000003-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000003-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- Chicken Pizza (دجاج)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'pizza-chicken', 'Chicken Pizza', 'Pizza with chicken', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000004-0000-0000-0000-000000000004', 'en', 'Chicken Pizza', 'Pizza with chicken'),
    ('p0000004-0000-0000-0000-000000000004', 'ar', 'دجاج', 'بيتزا بالدجاج')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000004-0000-0000-0000-000000000001', 'p0000004-0000-0000-0000-000000000004', 85000000, true),
    ('ps000004-0000-0000-0000-000000000002', 'p0000004-0000-0000-0000-000000000004', 58000000, true),
    ('ps000004-0000-0000-0000-000000000003', 'p0000004-0000-0000-0000-000000000004', 38000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000004-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000004-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000004-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000004-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000004-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000004-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- Soujouk Pizza (سجق)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'pizza-soujouk', 'Soujouk Pizza', 'Pizza with soujouk', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000005-0000-0000-0000-000000000005', 'en', 'Soujouk Pizza', 'Pizza with soujouk'),
    ('p0000005-0000-0000-0000-000000000005', 'ar', 'سجق', 'بيتزا بالسجق')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000005-0000-0000-0000-000000000001', 'p0000005-0000-0000-0000-000000000005', 85000000, true),
    ('ps000005-0000-0000-0000-000000000002', 'p0000005-0000-0000-0000-000000000005', 58000000, true),
    ('ps000005-0000-0000-0000-000000000003', 'p0000005-0000-0000-0000-000000000005', 38000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000005-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000005-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000005-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000005-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000005-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000005-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- Cheese Pizza (جبنة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000006-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'pizza-cheese', 'Cheese Pizza', 'Pizza with cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000006-0000-0000-0000-000000000006', 'en', 'Cheese Pizza', 'Pizza with cheese'),
    ('p0000006-0000-0000-0000-000000000006', 'ar', 'جبنة', 'بيتزا بالجبنة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000006-0000-0000-0000-000000000001', 'p0000006-0000-0000-0000-000000000006', 85000000, true),
    ('ps000006-0000-0000-0000-000000000002', 'p0000006-0000-0000-0000-000000000006', 58000000, true),
    ('ps000006-0000-0000-0000-000000000003', 'p0000006-0000-0000-0000-000000000006', 38000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000006-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000006-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000006-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000006-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000006-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000006-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- Pepperoni Pizza (بيبروني)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('p0000007-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'pizza-pepperoni', 'Pepperoni Pizza', 'Pizza with pepperoni', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('p0000007-0000-0000-0000-000000000007', 'en', 'Pepperoni Pizza', 'Pizza with pepperoni'),
    ('p0000007-0000-0000-0000-000000000007', 'ar', 'بيبروني', 'بيتزا بيبروني')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ps000007-0000-0000-0000-000000000001', 'p0000007-0000-0000-0000-000000000007', 85000000, true),
    ('ps000007-0000-0000-0000-000000000002', 'p0000007-0000-0000-0000-000000000007', 58000000, true),
    ('ps000007-0000-0000-0000-000000000003', 'p0000007-0000-0000-0000-000000000007', 38000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ps000007-0000-0000-0000-000000000001', 'en', 'Large'),
    ('ps000007-0000-0000-0000-000000000001', 'ar', 'كبير'),
    ('ps000007-0000-0000-0000-000000000002', 'en', 'Medium'),
    ('ps000007-0000-0000-0000-000000000002', 'ar', 'وسط'),
    ('ps000007-0000-0000-0000-000000000003', 'en', 'Small'),
    ('ps000007-0000-0000-0000-000000000003', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- ===========================================
-- MANOUSHE & MASHROUHA (المناقيش والمشروحة)
-- ===========================================

-- Thyme (زعتر)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'manoushe-thyme', 'Thyme', 'Manoushe with thyme', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000001-0000-0000-0000-000000000001', 'en', 'Thyme', 'Manoushe with thyme'),
    ('m0000001-0000-0000-0000-000000000001', 'ar', 'زعتر', 'منقوشة زعتر')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000001-0000-0000-0000-000000000001', 'm0000001-0000-0000-0000-000000000001', 10000000, true),
    ('ms000001-0000-0000-0000-000000000002', 'm0000001-0000-0000-0000-000000000001', 6000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000001-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000001-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000001-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000001-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Cheese (جبنة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000002-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'manoushe-cheese', 'Cheese', 'Manoushe with cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000002-0000-0000-0000-000000000002', 'en', 'Cheese', 'Manoushe with cheese'),
    ('m0000002-0000-0000-0000-000000000002', 'ar', 'جبنة', 'منقوشة جبنة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000002-0000-0000-0000-000000000001', 'm0000002-0000-0000-0000-000000000002', 28000000, true),
    ('ms000002-0000-0000-0000-000000000002', 'm0000002-0000-0000-0000-000000000002', 16000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000002-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000002-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000002-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000002-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Muhammara (محمرة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'manoushe-muhammara', 'Muhammara', 'Manoushe with muhammara', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000003-0000-0000-0000-000000000003', 'en', 'Muhammara', 'Manoushe with muhammara'),
    ('m0000003-0000-0000-0000-000000000003', 'ar', 'محمرة', 'منقوشة محمرة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000003-0000-0000-0000-000000000001', 'm0000003-0000-0000-0000-000000000003', 29000000, true),
    ('ms000003-0000-0000-0000-000000000002', 'm0000003-0000-0000-0000-000000000003', 17000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000003-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000003-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000003-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000003-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Labneh (لبنة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000004-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'manoushe-labneh', 'Labneh', 'Manoushe with labneh', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000004-0000-0000-0000-000000000004', 'en', 'Labneh', 'Manoushe with labneh'),
    ('m0000004-0000-0000-0000-000000000004', 'ar', 'لبنة', 'منقوشة لبنة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000004-0000-0000-0000-000000000001', 'm0000004-0000-0000-0000-000000000004', 29000000, true),
    ('ms000004-0000-0000-0000-000000000002', 'm0000004-0000-0000-0000-000000000004', 17000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000004-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000004-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000004-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000004-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Cocktail (كوكتيل)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'manoushe-cocktail', 'Cocktail', 'Manoushe with cocktail mix', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000005-0000-0000-0000-000000000005', 'en', 'Cocktail', 'Manoushe with cocktail mix'),
    ('m0000005-0000-0000-0000-000000000005', 'ar', 'كوكتيل', 'منقوشة كوكتيل')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000005-0000-0000-0000-000000000001', 'm0000005-0000-0000-0000-000000000005', 22000000, true),
    ('ms000005-0000-0000-0000-000000000002', 'm0000005-0000-0000-0000-000000000005', 10000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000005-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000005-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000005-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000005-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Kashkaval (قشقوان)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000006-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'manoushe-kashkaval', 'Kashkaval', 'Manoushe with kashkaval cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000006-0000-0000-0000-000000000006', 'en', 'Kashkaval', 'Manoushe with kashkaval cheese'),
    ('m0000006-0000-0000-0000-000000000006', 'ar', 'قشقوان', 'منقوشة قشقوان')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000006-0000-0000-0000-000000000001', 'm0000006-0000-0000-0000-000000000006', 29000000, true),
    ('ms000006-0000-0000-0000-000000000002', 'm0000006-0000-0000-0000-000000000006', 23000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000006-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000006-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000006-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000006-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Spinach (سبانخ)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000007-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 'manoushe-spinach', 'Spinach', 'Manoushe with spinach', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000007-0000-0000-0000-000000000007', 'en', 'Spinach', 'Manoushe with spinach'),
    ('m0000007-0000-0000-0000-000000000007', 'ar', 'سبانخ', 'فطيرة سبانخ')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000007-0000-0000-0000-000000000001', 'm0000007-0000-0000-0000-000000000007', 41000000, true),
    ('ms000007-0000-0000-0000-000000000002', 'm0000007-0000-0000-0000-000000000007', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000007-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000007-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000007-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000007-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Balawa + Kashkaval (بلاوة + قشقوان)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000008-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333333', 'manoushe-balawa-kashkaval', 'Balawa + Kashkaval', 'Manoushe with balawa and kashkaval', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000008-0000-0000-0000-000000000008', 'en', 'Balawa + Kashkaval', 'Manoushe with balawa and kashkaval'),
    ('m0000008-0000-0000-0000-000000000008', 'ar', 'بلاوة + قشقوان', 'منقوشة بلاوة وقشقوان')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000008-0000-0000-0000-000000000001', 'm0000008-0000-0000-0000-000000000008', 41000000, true),
    ('ms000008-0000-0000-0000-000000000002', 'm0000008-0000-0000-0000-000000000008', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000008-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000008-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000008-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000008-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Soujouk + Kashkaval (سجق + قشقوان)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000009-0000-0000-0000-000000000009', '33333333-3333-3333-3333-333333333333', 'manoushe-soujouk-kashkaval', 'Soujouk + Kashkaval', 'Manoushe with soujouk and kashkaval', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000009-0000-0000-0000-000000000009', 'en', 'Soujouk + Kashkaval', 'Manoushe with soujouk and kashkaval'),
    ('m0000009-0000-0000-0000-000000000009', 'ar', 'سجق + قشقوان', 'منقوشة سجق وقشقوان')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000009-0000-0000-0000-000000000001', 'm0000009-0000-0000-0000-000000000009', 41000000, true),
    ('ms000009-0000-0000-0000-000000000002', 'm0000009-0000-0000-0000-000000000009', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000009-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000009-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000009-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000009-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Cheese & Hot Pepper (جبنة حرة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000010-0000-0000-0000-000000000010', '33333333-3333-3333-3333-333333333333', 'manoushe-cheese-hot-pepper', 'Cheese & Hot Pepper', 'Manoushe with cheese and hot pepper', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000010-0000-0000-0000-000000000010', 'en', 'Cheese & Hot Pepper', 'Manoushe with cheese and hot pepper'),
    ('m0000010-0000-0000-0000-000000000010', 'ar', 'جبنة حرة', 'منقوشة جبنة حرة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000010-0000-0000-0000-000000000001', 'm0000010-0000-0000-0000-000000000010', 31000000, true),
    ('ms000010-0000-0000-0000-000000000002', 'm0000010-0000-0000-0000-000000000010', 19000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000010-0000-0000-0000-000000000001', 'en', 'Mashrouha'),
    ('ms000010-0000-0000-0000-000000000001', 'ar', 'مشروحة'),
    ('ms000010-0000-0000-0000-000000000002', 'en', 'Manoushe'),
    ('ms000010-0000-0000-0000-000000000002', 'ar', 'منقوشة')
on conflict (menu_item_size_id, locale) do nothing;

-- Extra Vegetables (إضافات خضار)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('m0000011-0000-0000-0000-000000000011', '33333333-3333-3333-3333-333333333333', 'manoushe-extra-vegetables', 'Extra Vegetables', 'Additional vegetable toppings', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('m0000011-0000-0000-0000-000000000011', 'en', 'Extra Vegetables', 'Additional vegetable toppings'),
    ('m0000011-0000-0000-0000-000000000011', 'ar', 'إضافات خضار', 'إضافات خضار')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ms000011-0000-0000-0000-000000000001', 'm0000011-0000-0000-0000-000000000011', 2000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ms000011-0000-0000-0000-000000000001', 'en', 'Extra'),
    ('ms000011-0000-0000-0000-000000000001', 'ar', 'إضافة')
on conflict (menu_item_size_id, locale) do nothing;

-- ===========================================
-- KAAKE ITEMS (الكعكة)
-- ===========================================

-- Plain Kaake (كعكة سادة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('k0000001-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'kaake-plain', 'Plain Kaake', 'Traditional Lebanese sesame bread ring', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('k0000001-0000-0000-0000-000000000001', 'en', 'Plain Kaake', 'Traditional Lebanese sesame bread ring'),
    ('k0000001-0000-0000-0000-000000000001', 'ar', 'كعكة سادة', 'كعك لبناني تقليدي')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ks000001-0000-0000-0000-000000000001', 'k0000001-0000-0000-0000-000000000001', 8000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ks000001-0000-0000-0000-000000000001', 'en', 'Each'),
    ('ks000001-0000-0000-0000-000000000001', 'ar', 'حبة')
on conflict (menu_item_size_id, locale) do nothing;

-- Thyme Kaake (كعكة زعتر)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('k0000002-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'kaake-thyme', 'Thyme Kaake', 'Kaake with thyme', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('k0000002-0000-0000-0000-000000000002', 'en', 'Thyme Kaake', 'Kaake with thyme'),
    ('k0000002-0000-0000-0000-000000000002', 'ar', 'كعكة زعتر', 'كعك بالزعتر')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ks000002-0000-0000-0000-000000000002', 'k0000002-0000-0000-0000-000000000002', 13000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ks000002-0000-0000-0000-000000000002', 'en', 'Each'),
    ('ks000002-0000-0000-0000-000000000002', 'ar', 'حبة')
on conflict (menu_item_size_id, locale) do nothing;

-- Akkawi Kaake (كعكة عكاوي)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('k0000003-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'kaake-akkawi', 'Akkawi Kaake', 'Kaake with akkawi cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('k0000003-0000-0000-0000-000000000003', 'en', 'Akkawi Kaake', 'Kaake with akkawi cheese'),
    ('k0000003-0000-0000-0000-000000000003', 'ar', 'كعكة عكاوي', 'كعك بالجبنة العكاوي')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ks000003-0000-0000-0000-000000000003', 'k0000003-0000-0000-0000-000000000003', 23000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ks000003-0000-0000-0000-000000000003', 'en', 'Each'),
    ('ks000003-0000-0000-0000-000000000003', 'ar', 'حبة')
on conflict (menu_item_size_id, locale) do nothing;

-- Akkawi + Kashkaval Kaake (كعكة عكاوي + قشقوان)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('k0000004-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'kaake-akkawi-kashkaval', 'Akkawi + Kashkaval Kaake', 'Kaake with akkawi and kashkaval cheese', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('k0000004-0000-0000-0000-000000000004', 'en', 'Akkawi + Kashkaval Kaake', 'Kaake with akkawi and kashkaval cheese'),
    ('k0000004-0000-0000-0000-000000000004', 'ar', 'كعكة عكاوي + قشقوان', 'كعك بالعكاوي والقشقوان')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ks000004-0000-0000-0000-000000000004', 'k0000004-0000-0000-0000-000000000004', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ks000004-0000-0000-0000-000000000004', 'en', 'Each'),
    ('ks000004-0000-0000-0000-000000000004', 'ar', 'حبة')
on conflict (menu_item_size_id, locale) do nothing;

-- Soujouk + Mozzarella Kaake (كعكة سجق + موزاريلا)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('k0000005-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444', 'kaake-soujouk-mozzarella', 'Soujouk + Mozzarella Kaake', 'Kaake with soujouk and mozzarella', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('k0000005-0000-0000-0000-000000000005', 'en', 'Soujouk + Mozzarella Kaake', 'Kaake with soujouk and mozzarella'),
    ('k0000005-0000-0000-0000-000000000005', 'ar', 'كعكة سجق + موزاريلا', 'كعك بالسجق والموزاريلا')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ks000005-0000-0000-0000-000000000005', 'k0000005-0000-0000-0000-000000000005', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ks000005-0000-0000-0000-000000000005', 'en', 'Each'),
    ('ks000005-0000-0000-0000-000000000005', 'ar', 'حبة')
on conflict (menu_item_size_id, locale) do nothing;

-- Cheese + Kashkaval Kaake (كعكة جبن + قشقوان)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('k0000006-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 'kaake-cheese-kashkaval', 'Cheese + Kashkaval Kaake', 'Kaake with cheese and kashkaval', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('k0000006-0000-0000-0000-000000000006', 'en', 'Cheese + Kashkaval Kaake', 'Kaake with cheese and kashkaval'),
    ('k0000006-0000-0000-0000-000000000006', 'ar', 'كعكة جبن + قشقوان', 'كعك بالجبن والقشقوان')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ks000006-0000-0000-0000-000000000006', 'k0000006-0000-0000-0000-000000000006', 25000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ks000006-0000-0000-0000-000000000006', 'en', 'Each'),
    ('ks000006-0000-0000-0000-000000000006', 'ar', 'حبة')
on conflict (menu_item_size_id, locale) do nothing;

-- ===========================================
-- DRINKS (مشروبات)
-- ===========================================

-- Cold Drink (مشروب غازي)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('dr000001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'drink-cold', 'Cold Drink', 'Carbonated soft drinks', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('dr000001-0000-0000-0000-000000000001', 'en', 'Cold Drink', 'Carbonated soft drinks'),
    ('dr000001-0000-0000-0000-000000000001', 'ar', 'مشروب غازي', 'مشروبات غازية')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('drs00001-0000-0000-0000-000000000001', 'dr000001-0000-0000-0000-000000000001', 5000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('drs00001-0000-0000-0000-000000000001', 'en', 'Bottle'),
    ('drs00001-0000-0000-0000-000000000001', 'ar', 'قنينة')
on conflict (menu_item_size_id, locale) do nothing;

-- Small Bottled Water (مياه صغيرة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('dr000002-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'drink-water-small', 'Small Bottled Water', 'Small bottle of water', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('dr000002-0000-0000-0000-000000000002', 'en', 'Small Bottled Water', 'Small bottle of water'),
    ('dr000002-0000-0000-0000-000000000002', 'ar', 'مياه صغيرة', 'زجاجة مياه صغيرة')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('drs00002-0000-0000-0000-000000000002', 'dr000002-0000-0000-0000-000000000002', 2000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('drs00002-0000-0000-0000-000000000002', 'en', 'Bottle'),
    ('drs00002-0000-0000-0000-000000000002', 'ar', 'قنينة')
on conflict (menu_item_size_id, locale) do nothing;

-- ===========================================
-- BREAD & DOUGH (خبز ومعجين)
-- ===========================================

-- Dough (عجينة)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('bd000001-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666666', 'bread-dough', 'Dough', 'Fresh dough', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('bd000001-0000-0000-0000-000000000001', 'en', 'Dough', 'Fresh dough'),
    ('bd000001-0000-0000-0000-000000000001', 'ar', 'عجينة', 'عجين طازج')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('bds00001-0000-0000-0000-000000000001', 'bd000001-0000-0000-0000-000000000001', 3000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('bds00001-0000-0000-0000-000000000001', 'en', 'Piece'),
    ('bds00001-0000-0000-0000-000000000001', 'ar', 'قطعة')
on conflict (menu_item_size_id, locale) do nothing;

-- Bread Plate (ربطة خبز)
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    ('bd000002-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666', 'bread-plate', 'Bread Plate', 'Plate of fresh bread', true, true)
on conflict (id) do nothing;

insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('bd000002-0000-0000-0000-000000000002', 'en', 'Bread Plate', 'Plate of fresh bread'),
    ('bd000002-0000-0000-0000-000000000002', 'ar', 'ربطة خبز', 'ربطة خبز طازج')
on conflict (menu_item_id, locale) do nothing;

insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('bds00002-0000-0000-0000-000000000002', 'bd000002-0000-0000-0000-000000000002', 10000000, true)
on conflict (id) do nothing;

insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('bds00002-0000-0000-0000-000000000002', 'en', 'Plate'),
    ('bds00002-0000-0000-0000-000000000002', 'ar', 'ربطة')
on conflict (menu_item_size_id, locale) do nothing;

commit;
