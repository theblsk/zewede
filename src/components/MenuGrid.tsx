'use client';

import { useMemo, useState } from 'react';

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AnimatePresence, motion } from 'framer-motion';
import Image from "next/image";
import { useLocale, useTranslations } from 'next-intl';
import { getImageUrl } from '@/utils/image-upload';

type MenuCategory = {
  id: string;
  name: string;
};

type MenuGridItem = {
  id: string;
  name: string;
  description: string | null;
  availability: boolean;
  priceLabel: string | null;
  imageKey: string | null;
  categoryName: string | null;
  categoryId: string | null;
};

type MenuGridProps = {
  categories: MenuCategory[];
  items: MenuGridItem[];
};

export default function MenuGrid({ categories, items }: MenuGridProps) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const itemStagger = 0.08;

  const categoryIdsWithItems = useMemo(() => {
    const ids = new Set<string>();
    items.forEach((item) => {
      if (item.categoryId) {
        ids.add(item.categoryId);
      }
    });
    return ids;
  }, [items]);

  const visibleCategories = useMemo(
    () => categories.filter((category) => categoryIdsWithItems.has(category.id)),
    [categories, categoryIdsWithItems]
  );

  const filteredItems = activeCategoryId
    ? items.filter((item) => item.categoryId === activeCategoryId)
    : items;

  const hasItems = filteredItems.length > 0;

  return (
    <section id="menu" className="py-16 px-6 bg-hlb-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl font-bold text-hlb-primary mb-4">
            {t('title')}
          </h2>
          <p className="text-hlb-text-light text-lg">
            {t('subtitle')}
          </p>
        </div>

        {visibleCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
            <motion.button
              layout
              type="button"
              onClick={() => setActiveCategoryId(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                activeCategoryId === null
                  ? 'bg-hlb-primary text-white border-hlb-primary'
                  : 'bg-white text-hlb-primary border-hlb-primary/20'
              }`}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
            >
              {t('all')}
            </motion.button>
            {visibleCategories.map((category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <motion.button
                  layout
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setActiveCategoryId((current) => (current === category.id ? null : category.id))
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                    isActive
                      ? 'bg-hlb-primary text-white border-hlb-primary'
                      : 'bg-white text-hlb-primary border-hlb-primary/20 hover:border-hlb-primary/60'
                  }`}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -2 }}
                >
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        )}

        {!hasItems && (
          <div className="text-center text-hlb-text-light">
            <p>{locale === 'ar' ? 'لا توجد عناصر حالياً.' : 'No menu items available right now.'}</p>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const imageUrl = getImageUrl(item.imageKey);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  transition={{ duration: 0.35, delay: index * itemStagger }}
                >
                  <Card className="bg-hlb-card-bg shadow-hlb rounded-xl overflow-hidden" dir="ltr">
                    <div className="relative">
                      {imageUrl ? (
                        <div className="w-full h-48 relative">
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-hlb-gold/20 flex items-center justify-center">
                          <span className="text-hlb-gold text-6xl">🥮</span>
                        </div>
                      )}

                      {/* Availability tag */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            item.availability
                              ? 'bg-hlb-available'
                              : 'bg-hlb-order-tomorrow'
                          }`}
                        >
                          {item.availability ? t('availableToday') : t('orderTomorrow')}
                        </span>
                      </div>
                    </div>

                    <CardBody className="p-6">
                      <h3 className="text-xl font-bold text-hlb-primary mb-2">
                        {item.name}
                      </h3>

                      {item.categoryName && (
                        <p className="text-xs uppercase tracking-wide text-hlb-gold mb-2">
                          {item.categoryName}
                        </p>
                      )}

                      {item.description && (
                        <p className="text-hlb-text-light text-sm mb-4 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-hlb-primary">
                          {item.priceLabel ?? '—'}
                        </span>
                        <Button
                          size="sm"
                          className="bg-hlb-primary text-white hover:bg-hlb-primary/90 font-semibold"
                        >
                          {t('addToOrder')}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
