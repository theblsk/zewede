begin;

alter table if exists public.categories
    drop constraint if exists categories_display_order_non_negative;

alter table if exists public.categories
    drop column if exists display_order;

commit;

