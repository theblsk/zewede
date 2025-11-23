'use client';

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useLocale, useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations('contact');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const phoneNumber = t('phoneNumber');
  const telHref = `tel:${phoneNumber.replace(/[^+\d]/g, '')}`;

  return (
    <section id="contact" className="py-16 px-6 bg-hlb-bg">
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

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Phone Card */}
          <Card className="bg-hlb-card-bg shadow-hlb rounded-xl">
            <CardBody className="p-8 text-center">
              <div className="text-hlb-primary text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-hlb-primary mb-4">
                {t('phone')}
              </h3>
              <p className="text-hlb-text text-lg mb-6" dir="ltr" style={{ unicodeBidi: 'bidi-override' }}>
                {t('phoneNumber')}
              </p>
              <Button
                as="a"
                href={telHref}
                className="bg-hlb-gold text-white hover:bg-hlb-gold/90 font-semibold"
              >
                {t('callNow')}
              </Button>
            </CardBody>
          </Card>

          {/* Location Card */}
          <Card className="bg-hlb-card-bg shadow-hlb rounded-xl">
            <CardBody className="p-8 text-center">
              <div className="text-hlb-primary text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-hlb-primary mb-4">
                {t('location')}
              </h3>
              <p className="text-hlb-text text-lg mb-2">
                {t('address')}
              </p>
              <p className="text-hlb-text-light">
                {t('city')}
              </p>
            </CardBody>
          </Card>

          {/* Hours Card */}
          <Card className="bg-hlb-card-bg shadow-hlb rounded-xl">
            <CardBody className="p-8 text-center">
              <div className="text-hlb-primary text-4xl mb-4">🕒</div>
              <h3 className="text-xl font-bold text-hlb-primary mb-4">
                {t('hours')}
              </h3>
              <p className="text-hlb-text text-lg mb-2">
                {t('schedule')}
              </p>
              <p className="text-hlb-text-light">
                {t('status')}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Footer Card */}
        <Card className="bg-hlb-card-bg shadow-hlb rounded-xl">
          <CardBody className="p-8 text-center">
            <h3 className="text-2xl font-bold text-hlb-primary mb-2">
              {tFooter('title')}
            </h3>
            <p className="text-hlb-text-light text-lg mb-6">
              {tFooter('subtitle')}
            </p>
            <Button
              as="a"
              href={telHref}
              size="lg"
              className="bg-hlb-primary text-white hover:bg-hlb-primary/90 font-semibold px-8 py-3"
            >
              📞 {tFooter('callNow')}
            </Button>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
