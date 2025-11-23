'use client';

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="home"
      className="relative pb-20 pt-12 px-6 bg-hlb-bg min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,228,179,0.45),_transparent_65%)] pointer-events-none" />
      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col justify-center flex-1">
        <div className="flex flex-col items-center gap-8">
          
          {/* 1881 Badge */}
          <div className="relative p-[2px] rounded-full bg-gradient-to-r from-hlb-gold/90 via-yellow-400/80 to-hlb-gold/90 shadow-lg animate-fade-in">
             <Chip
              variant="shadow"
              size="lg"
              classNames={{
                base: "bg-hlb-bg text-hlb-primary border-none px-5 py-2 rounded-full",
                content: "font-bold tracking-[0.6em] text-xs md:text-sm uppercase"
              }}
            >
              {t('since')}
            </Chip>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-hlb-primary leading-[1.15] tracking-tight">
            {t('title')}
          </h1>

          {/* Branch Subtitle */}
           <div className="flex items-center justify-center gap-4 text-hlb-primary/70 font-medium text-base md:text-xl">
             <span className="hidden sm:block w-10 h-[1px] bg-hlb-gold/50"></span>
             <span className="italic">{t('subtitle')}</span>
             <span className="hidden sm:block w-10 h-[1px] bg-hlb-gold/50"></span>
           </div>
          
          {/* Description */}
          <p className="text-hlb-text-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-2">
            {t('description')}
          </p>
          
          {/* CTA */}
          <div className="mt-6">
            <Button
              as="a"
              href="#menu"
              size="lg"
              className="bg-hlb-primary text-white hover:bg-hlb-primary/90 font-semibold px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              radius="full"
            >
              {t('cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
