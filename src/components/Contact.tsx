'use client';

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Instagram, Phone, MapPin, Clock3, MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import type { ClosedDayValue } from '@/utils/site-settings';

type ContactProps = {
  callPhoneNumber: string;
  whatsappPhoneNumber: string;
  openingHours: string;
  closedDays: ClosedDayValue[];
};

export default function Contact({
  callPhoneNumber,
  whatsappPhoneNumber,
  openingHours,
  closedDays,
}: ContactProps) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const telHref = `tel:${callPhoneNumber.replace(/[^+\d]/g, '')}`;
  const whatsappHref = `https://wa.me/${whatsappPhoneNumber.replace(/[^\d]/g, '')}`;
  const instagramHref = "https://www.instagram.com/furnzewede/";
  const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d205.7858834785793!2d35.78710307249401!3d34.386750156807345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1521f1315f611be5%3A0x950c4b2b2c3e4bab!2sZewede!5e0!3m2!1sen!2slb!4v1770558694139!5m2!1sen!2slb";
  const closedDaysLabel =
    closedDays.length > 0
      ? closedDays.map((day) => t(`days.${day}`)).join(locale === 'ar' ? '، ' : ', ')
      : null;
  const statusLabel = closedDaysLabel
    ? t('statusClosedDays', { days: closedDaysLabel })
    : t('statusOpenEveryDay');

  return (
    <section id="contact" className="py-16 px-6 bg-hlb-bg">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl font-bold text-hlb-primary mb-4">
            {t('title')}
          </h2>
          <p className="text-hlb-text-light text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-hlb-card-bg shadow-hlb rounded-xl border border-hlb-primary/10">
              <CardBody className="p-6 sm:p-8">
                <div className={`flex items-center gap-3 mb-5 ${isRTL ? 'justify-start text-right' : 'justify-start text-left'}`}>
                  <div className="h-11 w-11 rounded-full bg-hlb-primary/10 flex items-center justify-center text-hlb-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-hlb-primary">
                    {t('phone')}
                  </h3>
                </div>

                <p
                  className={`text-2xl font-semibold text-hlb-text mb-6 ${isRTL ? 'text-right' : 'text-left'}`}
                  dir="ltr"
                  style={{ unicodeBidi: 'bidi-override' }}
                >
                  {callPhoneNumber}
                </p>

                <Button
                  as="a"
                  href={telHref}
                  className="w-full bg-hlb-gold text-white hover:bg-hlb-gold/90 font-semibold h-12 mb-3"
                >
                  <Phone className="h-4 w-4" />
                  {t('callNow')}
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    as="a"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="bordered"
                    className="border-hlb-primary text-hlb-primary font-semibold h-11"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t('whatsapp')}
                  </Button>
                  <Button
                    as="a"
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="bordered"
                    className="border-hlb-primary text-hlb-primary font-semibold h-11"
                  >
                    <Instagram className="h-4 w-4" />
                    {t('instagram')}
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-hlb-card-bg shadow-hlb rounded-xl border border-hlb-primary/10">
              <CardBody className="p-6 sm:p-8 space-y-6">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="flex items-center gap-2 mb-2 justify-start">
                    <MapPin className="h-5 w-5 text-hlb-primary shrink-0" />
                    <h4 className="font-bold text-hlb-primary">{t('location')}</h4>
                  </div>
                  <p className="text-hlb-text">{t('address')}</p>
                  <p className="text-hlb-text-light">{t('city')}</p>
                </div>

                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="flex items-center gap-2 mb-2 justify-start">
                    <Clock3 className="h-5 w-5 text-hlb-primary shrink-0" />
                    <h4 className="font-bold text-hlb-primary">{t('hours')}</h4>
                  </div>
                  <p className="text-hlb-text">{openingHours}</p>
                  <p className="text-hlb-text-light">{statusLabel}</p>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="lg:col-span-3 bg-hlb-card-bg shadow-hlb rounded-xl border border-hlb-primary/10 overflow-hidden">
            <CardBody className="p-0">
              <div className={`px-6 py-5 border-b border-hlb-primary/10 bg-hlb-primary/5 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-2 text-hlb-primary ${isRTL ? 'justify-start text-right' : 'justify-start text-left'}`}>
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-xl font-bold">{t('location')}</h3>
                </div>
                <p className="text-hlb-text-light mt-1">{t('address')}</p>
              </div>
              <div className="h-[340px] sm:h-[420px] w-full">
                <iframe
                  src={mapEmbedSrc}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ZEWEDE location map"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
