-- ============================================================================
-- TEMPLATE: Add New Menu Items
-- ============================================================================
-- Use this template to add new categories and menu items to your database
-- Copy the relevant sections and replace the placeholder values
-- ============================================================================

begin;

-- ============================================================================
-- STEP 1: ADD A NEW CATEGORY (Skip if using existing category)
-- ============================================================================

-- Generate a new UUID for your category at: https://www.uuidgenerator.net/
-- Or use: SELECT gen_random_uuid();

-- Insert the category
insert into public.categories (id, slug, name, description, is_active) values
    ('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'category-slug', 'Category Name', 'Category description', true)
on conflict (id) do nothing;

-- Insert category translations (English and Arabic)
insert into public.categories_translations (category_id, locale, name, description) values
    ('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'en', 'Category Name in English', 'Description in English'),
    ('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'ar', 'اسم الفئة بالعربية', 'الوصف بالعربية')
on conflict (category_id, locale) do nothing;

-- ============================================================================
-- STEP 2: ADD A NEW MENU ITEM
-- ============================================================================

-- Example 1: Menu Item with Multiple Sizes (like Pizza or Manoushe)
-- ----------------------------------------------------------------------------

-- Insert the menu item
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    (
        'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',           -- New UUID for menu item
        '33333333-3333-3333-3333-333333333333',           -- Use existing category ID (e.g., Manoushe category)
        'menu-item-slug',                                  -- URL-friendly slug
        'Menu Item Name',                                  -- Default name (English)
        'Menu item description',                           -- Default description
        true,                                              -- availability: true = available today
        true                                               -- is_active: true = visible on menu
    )
on conflict (id) do nothing;

-- Insert menu item translations (English and Arabic)
insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY', 'en', 'Menu Item Name in English', 'Description in English'),
    ('YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY', 'ar', 'اسم المنتج بالعربية', 'الوصف بالعربية')
on conflict (menu_item_id, locale) do nothing;

-- Insert menu item sizes and prices
-- IMPORTANT: Prices must be in cents/fils (multiply LBP by 100)
-- Example: 250,000 LBP = 25000000
insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZ01', 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY', 25000000, true),  -- Size 1
    ('ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZ02', 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY', 15000000, true)   -- Size 2
on conflict (id) do nothing;

-- Insert size translations (English and Arabic)
insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    -- Size 1 translations
    ('ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZ01', 'en', 'Large'),
    ('ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZ01', 'ar', 'كبير'),
    -- Size 2 translations
    ('ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZ02', 'en', 'Small'),
    ('ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZ02', 'ar', 'صغير')
on conflict (menu_item_size_id, locale) do nothing;

-- ============================================================================
-- Example 2: Menu Item with Single Size (like Dozen items)
-- ----------------------------------------------------------------------------

-- Insert the menu item
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    (
        'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA',           -- New UUID for menu item
        '11111111-1111-1111-1111-111111111111',           -- Use Dozen category ID
        'dozen-new-item',                                  -- URL-friendly slug
        'New Dozen Item',                                  -- Default name
        'Description of dozen item',                       -- Default description
        true,                                              -- availability
        true                                               -- is_active
    )
on conflict (id) do nothing;

-- Insert menu item translations
insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA', 'en', 'New Dozen Item', 'Description of dozen item'),
    ('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA', 'ar', 'دزينة جديدة', 'وصف الدستة')
on conflict (menu_item_id, locale) do nothing;

-- Insert single size with price
-- Price: 300,000 LBP = 30000000
insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB', 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA', 30000000, true)
on conflict (id) do nothing;

-- Insert size translations
insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB', 'en', 'Dozen'),
    ('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

-- ============================================================================
-- REAL WORKING EXAMPLE: Nutella Dozen
-- ============================================================================
-- This is a complete, ready-to-use example you can uncomment and modify

-- Insert the menu item
insert into public.menu_items (id, category_id, slug, name, description, availability, is_active) values
    (
        'd0000012-0000-0000-0000-000000000012',           -- UUID for Nutella Dozen
        '11111111-1111-1111-1111-111111111111',           -- Dozen category ID
        'dozen-nutella',                                   -- Slug
        'Nutella Dozen',                                   -- Default name
        'Dozen manoushe with Nutella',                    -- Description
        true,                                              -- Available today
        true                                               -- Active/visible
    )
on conflict (id) do nothing;

-- Insert translations
insert into public.menu_items_translations (menu_item_id, locale, name, description) values
    ('d0000012-0000-0000-0000-000000000012', 'en', 'Nutella Dozen', 'Dozen manoushe with Nutella'),
    ('d0000012-0000-0000-0000-000000000012', 'ar', 'دزينة نوتيلا', 'دستة مناقيش نوتيلا')
on conflict (menu_item_id, locale) do nothing;

-- Insert size and price (280,000 LBP = 28000000)
insert into public.menu_item_sizes (id, menu_item_id, price, is_active) values
    ('ds000012-0000-0000-0000-000000000012', 'd0000012-0000-0000-0000-000000000012', 28000000, true)
on conflict (id) do nothing;

-- Insert size translations
insert into public.menu_item_size_translations (menu_item_size_id, locale, name) values
    ('ds000012-0000-0000-0000-000000000012', 'en', 'Dozen'),
    ('ds000012-0000-0000-0000-000000000012', 'ar', 'دستة')
on conflict (menu_item_size_id, locale) do nothing;

commit;

-- ============================================================================
-- EXISTING CATEGORY IDs (for reference)
-- ============================================================================
-- Use these when adding items to existing categories:
--
-- '11111111-1111-1111-1111-111111111111' = Dozen (الدزينة)
-- '22222222-2222-2222-2222-222222222222' = Pizza (البيتزا)
-- '33333333-3333-3333-3333-333333333333' = Manoushe & Mashrouha (المناقيش والمشروحة)
-- '44444444-4444-4444-4444-444444444444' = Kaake (الكعكة)
-- '55555555-5555-5555-5555-555555555555' = Drinks (مشروبات)
-- '66666666-6666-6666-6666-666666666666' = Bread & Dough (خبز ومعجين)
-- ============================================================================

-- ============================================================================
-- COMMON SIZE TRANSLATIONS (for reference)
-- ============================================================================
-- Pizza sizes:
--   English: 'Large', 'Medium', 'Small'
--   Arabic:  'كبير', 'وسط', 'صغير'
--
-- Manoushe sizes:
--   English: 'Mashrouha', 'Manoushe'
--   Arabic:  'مشروحة', 'منقوشة'
--
-- Dozen:
--   English: 'Dozen'
--   Arabic:  'دستة'
--
-- Kaake:
--   English: 'Each', 'Piece'
--   Arabic:  'حبة', 'قطعة'
-- ============================================================================

-- ============================================================================
-- PRICE CONVERSION REFERENCE
-- ============================================================================
-- Display Price (LBP) → Database Value (multiply by 100)
--
-- 10,000 LBP    → 1000000
-- 50,000 LBP    → 5000000
-- 100,000 LBP   → 10000000
-- 150,000 LBP   → 15000000
-- 250,000 LBP   → 25000000
-- 500,000 LBP   → 50000000
-- 1,000,000 LBP → 100000000
-- ============================================================================

-- ============================================================================
-- QUICK START CHECKLIST
-- ============================================================================
-- [ ] 1. Generate UUIDs for your new items
-- [ ] 2. Choose the category ID (existing or create new)
-- [ ] 3. Create a URL-friendly slug (lowercase, hyphens, no spaces)
-- [ ] 4. Add English and Arabic names/descriptions
-- [ ] 5. Convert prices (multiply LBP by 100)
-- [ ] 6. Add size translations for each size
-- [ ] 7. Test the insert in Supabase SQL Editor
-- [ ] 8. Verify the items appear in your app
-- ============================================================================
