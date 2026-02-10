'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardBody, CardHeader, Checkbox, Input, Spinner, Textarea } from '@heroui/react';
import { ImagePlus, RotateCcw, Save } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { getSiteSettingsForDashboard, updateSiteSettingsFromValues } from '@/app/[locale]/(dashboard)/dashboard/actions';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import {
  CLOSED_DAY_VALUES,
  DEFAULT_HERO_IMAGE_PATH,
  DEFAULT_SITE_SETTINGS,
  LANDING_ASSETS_BUCKET,
  normalizeClosedDays,
} from '@/utils/site-settings';
import { settingsFormSchema, type SettingsFormValues } from '@/validators/settings';

type SettingsPanelProps = {
  locale: string;
};

export function SettingsPanel({ locale }: SettingsPanelProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const activeLocale = useLocale();
  const [, startTransition] = useTransition();
  const t = useTranslations('dashboard.settings');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<SettingsFormValues>({
    hero_image_key: '',
    call_phone_number: DEFAULT_SITE_SETTINGS.call_phone_number,
    whatsapp_phone_number: DEFAULT_SITE_SETTINGS.whatsapp_phone_number,
    opening_hours_en: DEFAULT_SITE_SETTINGS.opening_hours_en,
    opening_hours_ar: DEFAULT_SITE_SETTINGS.opening_hours_ar,
    closed_days: [],
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => getSiteSettingsForDashboard(),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setValues({
      hero_image_key: data.hero_image_key ?? '',
      call_phone_number: data.call_phone_number,
      whatsapp_phone_number: data.whatsapp_phone_number,
      opening_hours_en: data.opening_hours_en,
      opening_hours_ar: data.opening_hours_ar,
      closed_days: normalizeClosedDays(data.closed_days),
    });
  }, [data]);

  const backupHeroImageKey = data?.hero_image_backup_key ?? null;
  const hasBackupImage = Boolean(backupHeroImageKey);
  const isBusy = isLoading || isFetching;
  const dayOptions = useMemo(() => CLOSED_DAY_VALUES, []);

  const toggleClosedDay = (day: (typeof CLOSED_DAY_VALUES)[number], checked: boolean) => {
    setValues((current) => {
      const next = new Set(current.closed_days);
      if (checked) {
        next.add(day);
      } else {
        next.delete(day);
      }

      return {
        ...current,
        closed_days: Array.from(next),
      };
    });
  };

  const handleSubmit = async () => {
    setFormError(null);

    const parsed = settingsFormSchema.safeParse(values);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setFormError(firstIssue?.message ?? t('validationError'));
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateSiteSettingsFromValues({
        locale: activeLocale ?? locale,
        ...parsed.data,
      });

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <h2 className="text-xl font-medium">{t('title')}</h2>
          <p className="text-sm text-hlb-text/80">{t('subtitle')}</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        {isBusy ? (
          <div className="py-10 flex items-center justify-center">
            <Spinner size="sm" color="primary" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-hlb-text/80">
                <ImagePlus size={16} />
                <span>{t('heroImageLabel')}</span>
              </div>
              <ImageUpload
                value={values.hero_image_key}
                onChange={(value) => setValues((current) => ({ ...current, hero_image_key: value ?? '' }))}
                label={t('heroImageInput')}
                disabled={isSaving}
                bucket={LANDING_ASSETS_BUCKET}
              />
              <p className="text-xs text-hlb-text/70">{t('heroImageFallbackHint', { path: DEFAULT_HERO_IMAGE_PATH })}</p>
              {hasBackupImage && (
                <Button
                  variant="flat"
                  size="sm"
                  startContent={<RotateCcw size={14} />}
                  onPress={() =>
                    setValues((current) => ({
                      ...current,
                      hero_image_key: backupHeroImageKey ?? '',
                    }))
                  }
                >
                  {t('useBackupImage')}
                </Button>
              )}
            </div>

            <Input
              label={t('callPhoneLabel')}
              variant="bordered"
              value={values.call_phone_number}
              onValueChange={(next) => setValues((current) => ({ ...current, call_phone_number: next }))}
            />

            <Input
              label={t('whatsappPhoneLabel')}
              variant="bordered"
              value={values.whatsapp_phone_number}
              onValueChange={(next) => setValues((current) => ({ ...current, whatsapp_phone_number: next }))}
            />

            <Textarea
              label={t('openingHoursEnglishLabel')}
              variant="bordered"
              value={values.opening_hours_en}
              onValueChange={(next) => setValues((current) => ({ ...current, opening_hours_en: next }))}
            />

            <Textarea
              label={t('openingHoursArabicLabel')}
              variant="bordered"
              value={values.opening_hours_ar}
              onValueChange={(next) => setValues((current) => ({ ...current, opening_hours_ar: next }))}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium">{t('closedDaysLabel')}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {dayOptions.map((day) => (
                  <Checkbox
                    key={day}
                    isSelected={values.closed_days.includes(day)}
                    onValueChange={(checked) => toggleClosedDay(day, checked)}
                  >
                    {t(`days.${day}`)}
                  </Checkbox>
                ))}
              </div>
            </div>

            {formError && <p className="text-sm text-danger">{formError}</p>}

            <Button
              color="primary"
              startContent={<Save size={16} />}
              onPress={handleSubmit}
              isLoading={isSaving}
              isDisabled={isSaving}
            >
              {t('save')}
            </Button>
          </>
        )}
      </CardBody>
    </Card>
  );
}
