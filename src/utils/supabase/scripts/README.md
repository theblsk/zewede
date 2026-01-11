# Supabase Scripts

This folder contains SQL scripts for populating your ZEWEDE menu database.

## Files

- **`populate_menu_items.sql`** - Complete script with all initial menu items
- **`template_add_menu_item.sql`** - Template for adding new menu items (copy & paste)

## populate_menu_items.sql

This script adds all menu items from the ZEWEDE menu image to your database.

### What it includes:

1. **Categories** (6 total):
   - الدزينة (Dozen)
   - البيتزا (Pizza)
   - المناقيش والمشروحة (Manoushe & Mashrouha)
   - الكعكة (Kaake)
   - مشروبات (Drinks)
   - خبز ومعجين (Bread & Dough)

2. **Menu Items** (37 total):
   - 11 Dozen items
   - 7 Pizza items (with 3 sizes each)
   - 11 Manoushe & Mashrouha items
   - 6 Kaake items
   - 2 Drink items
   - 2 Bread & Dough items

3. **Translations**: All items include both English and Arabic translations

4. **Sizes & Prices**: All prices are stored in the smallest currency unit (cents/fils)
   - For example: 150,000 LBP is stored as 15000000 (150,000 * 100)

### Prerequisites:

Make sure you have run all migrations first:
1. `000_users_table.sql`
2. `001_menu_tables.sql`
3. `002_menu_rls.sql`
4. `003_remove_categories_display_order.sql`
5. `004_menu_item_max_order_limits.sql`
6. `005_menu_item_max_order_limits_rls.sql`
7. `006_zewede_migration.sql`
8. `007_menu_item_sizes_atomic_insert.sql`
9. `008_change_price_to_bigint.sql`

### How to run:

#### Option 1: Via Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy the contents of `populate_menu_items.sql`
4. Paste and run

#### Option 2: Via Supabase CLI
```bash
supabase db execute --file src/utils/supabase/scripts/populate_menu_items.sql
```

#### Option 3: Via psql
```bash
psql -h <your-supabase-host> -U postgres -d postgres -f src/utils/supabase/scripts/populate_menu_items.sql
```

### Notes:

- The script uses `on conflict (id) do nothing` to prevent duplicate entries
- All IDs are predefined UUIDs for consistency
- Prices are in the smallest unit (multiply display price by 100)
- The script is idempotent - you can run it multiple times safely

### Price Conversion Examples:

From the menu:
- 150,000 LBP → stored as 15000000
- 60,000 LBP → stored as 6000000
- 720,000 LBP → stored as 72000000

When displaying prices, divide by 100:
```javascript
const displayPrice = storedPrice / 100; // 15000000 / 100 = 150000
```

---

## template_add_menu_item.sql

This is a **copy-paste template** for adding new menu items to your database.

### What it includes:

1. **Template for new category** (if needed)
2. **Template for menu item with multiple sizes** (like Pizza)
3. **Template for menu item with single size** (like Dozen)
4. **Real working example** (Nutella Dozen) ready to use
5. **Quick reference** for existing category IDs
6. **Common size translations** reference
7. **Price conversion** reference
8. **Step-by-step checklist**

### How to use:

1. Open `template_add_menu_item.sql`
2. Copy the relevant section (single size or multiple sizes)
3. Replace the placeholder values:
   - Generate new UUIDs at https://www.uuidgenerator.net/
   - Update names, descriptions, slugs
   - Set prices (remember to multiply by 100)
   - Add translations in English and Arabic
4. Paste into Supabase SQL Editor and run

### Quick Example:

To add a new "Halloumi Pizza":

1. Copy the "Multiple Sizes" example
2. Replace UUIDs with new ones
3. Set `category_id` to Pizza category: `'22222222-2222-2222-2222-222222222222'`
4. Set `slug` to `'pizza-halloumi'`
5. Set prices for Large, Medium, Small
6. Add Arabic translation: `'هلومي'`
7. Run the script!

### Existing Category IDs:

Copy these IDs when adding items to existing categories:

- **Dozen**: `11111111-1111-1111-1111-111111111111`
- **Pizza**: `22222222-2222-2222-2222-222222222222`
- **Manoushe & Mashrouha**: `33333333-3333-3333-3333-333333333333`
- **Kaake**: `44444444-4444-4444-4444-444444444444`
- **Drinks**: `55555555-5555-5555-5555-555555555555`
- **Bread & Dough**: `66666666-6666-6666-6666-666666666666`
