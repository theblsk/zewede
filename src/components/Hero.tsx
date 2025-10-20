'use client';

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  const sinceText = t('since');
  const sinceMatch = sinceText.match(/^(.*?)(\d{3,})$/);
  const sinceLabel = sinceMatch ? sinceMatch[1].trim() : sinceText;
  const sinceYear = sinceMatch ? sinceMatch[2] : '';

  return (
    <section id="home" className="py-16 px-6 bg-hlb-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Text content */}
          <div className="flex-1 text-start">
            <div className="mb-6 flex justify-start">
              <Chip
                className="bg-gradient-to-r from-hlb-primary/5 via-hlb-primary/10 to-hlb-gold/10 border-1.5 border-hlb-primary/25 text-hlb-primary font-semibold text-sm sm:text-base md:text-lg px-1 sm:px-3 py-6 sm:py-7 h-auto"
                variant="flat"
              >
                {t('subtitle')}
              </Chip>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-hlb-primary mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-hlb-text-light text-lg mb-8 leading-relaxed">
              {t('description')}
            </p>
            <Button
              size="lg"
              className="bg-hlb-primary text-white hover:bg-hlb-primary/90 font-semibold px-8 py-3"
            >
              {t('cta')}
            </Button>
          </div>

          {/* Right side - Images */}
          <div className="flex-1 flex flex-col items-center">
            {/* Baklava images */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative w-32 h-32 bg-hlb-gold/20 rounded-lg flex items-center justify-center">
                <div className="w-24 h-24 bg-hlb-gold/40 rounded-lg flex items-center justify-center">
                  <span className="text-hlb-gold text-2xl">🥮</span>
                </div>
              </div>
              <div className="relative w-32 h-32 bg-hlb-gold/20 rounded-lg flex items-center justify-center">
                <div className="w-24 h-24 bg-hlb-gold/40 rounded-lg flex items-center justify-center">
                  <span className="text-hlb-gold text-2xl">🥮</span>
                </div>
              </div>
            </div>

            {/* Since 1881 card */}
            <Card className="relative max-w-xs w-full overflow-hidden border-none shadow-lg shadow-hlb-primary/20 bg-gradient-to-br from-white via-hlb-bg to-hlb-gold/10">
              <div className="pointer-events-none absolute -top-16 right-10 h-32 w-32 rounded-full bg-hlb-gold/30 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-14 left-6 h-20 w-20 rounded-full border border-hlb-primary/20" />
              <CardBody className="relative flex flex-col items-center gap-4 px-8 py-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-hlb-primary/20 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-hlb-primary">
                  <span className="h-2 w-2 rounded-full bg-hlb-gold" />
                  {sinceLabel}
                </span>
                {sinceYear ? (
                  <h3 className="text-4xl font-extrabold tracking-tight text-hlb-primary">
                    {sinceYear}
                  </h3>
                ) : (
                  <h3 className="text-2xl font-semibold tracking-tight text-hlb-primary text-center">
                    {sinceText}
                  </h3>
                )}
                <p className="text-sm leading-relaxed text-hlb-text-light text-center">
                  {t('traditional')}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
