'use client';

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { getImageUrl } from '@/utils/image-upload';
import { DEFAULT_HERO_IMAGE_PATH, LANDING_ASSETS_BUCKET } from '@/utils/site-settings';

type HeroProps = {
  heroImageKey: string | null;
  heroImageBackupKey: string | null;
};

export default function Hero({ heroImageKey, heroImageBackupKey }: HeroProps) {
  const t = useTranslations('hero');
  const heroImageSrc =
    getImageUrl(heroImageKey, LANDING_ASSETS_BUCKET) ??
    getImageUrl(heroImageBackupKey, LANDING_ASSETS_BUCKET) ??
    DEFAULT_HERO_IMAGE_PATH;

  return (
    <section
      id="home"
      className="relative pb-20 pt-20 px-6 bg-hlb-bg min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="max-w-6xl mx-auto z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-6">
          <div className="relative p-[2px] rounded-full bg-linear-to-r from-hlb-gold/70 via-hlb-primary/60 to-hlb-gold/70 shadow-lg animate-fade-in">
            <Chip
              variant="shadow"
              size="lg"
              classNames={{
                base: "bg-hlb-bg text-hlb-text border-none px-5 py-2 rounded-full",
                content: "font-semibold tracking-wide text-xs md:text-sm uppercase",
              }}
            >
              {t('badge')}
            </Chip>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-hlb-text leading-[1.08] tracking-tight">
            {t('title')}
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-4 text-hlb-text/70 font-medium text-base md:text-xl">
            <span className="hidden sm:block w-10 h-px bg-hlb-gold/50"></span>
            <span className="italic">{t('subtitle')}</span>
            <span className="hidden sm:block w-10 h-px bg-hlb-gold/50"></span>
          </div>

          <p className="text-hlb-text-light text-base md:text-lg leading-relaxed max-w-2xl mt-1">
            {t('description')}
          </p>

          <div className="mt-3">
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

        <div className="relative w-full max-w-xl mx-auto lg:mx-0">
          <div className="absolute -inset-6 bg-[radial-gradient(circle_at_center,rgba(197,133,84,0.30),transparent_65%)]" />
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-30px_rgba(51,29,22,0.55)] border border-hlb-primary/20">
            <Image
              src={heroImageSrc}
              alt={t('imageAlt')}
              width={1200}
              height={900}
              priority
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
