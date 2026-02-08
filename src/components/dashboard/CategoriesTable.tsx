'use client';

import { useEffect, useState, useTransition } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@heroui/react';
import { Edit2, Plus, Power, PowerOff, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
  deleteCategory,
  toggleCategoryActive,
  getCategoriesForDashboard,
} from '@/app/[locale]/(dashboard)/dashboard/actions';
import { ConfirmationModal } from '@/components/ConfirmationModal';

type CategoriesTableProps = {
  locale: string;
};

type ConfirmationConfig =
  | { type: 'delete'; id: string; name: string }
  | { type: 'toggle'; id: string; name: string; isActive: boolean };

export function CategoriesTable({ locale }: CategoriesTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const t = useTranslations('dashboard.categories');
  const searchTerm = searchQuery.trim();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchTerm);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onOpenChange: onConfirmationChange,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const [confirmationConfig, setConfirmationConfig] = useState<ConfirmationConfig | null>(null);

  const { data: categories = [], isLoading, isFetching } = useQuery({
    queryKey: ['categories', debouncedSearchQuery],
    queryFn: () => getCategoriesForDashboard({ search: debouncedSearchQuery }),
  });

  const isTableLoading =
    isLoading || isFetching || searchTerm !== debouncedSearchQuery;

  const handleDeleteCategory = async (categoryId: string) => {
    setIsConfirming(true);
    try {
      const formData = new FormData();
      formData.append('id', categoryId);
      formData.append('locale', locale);
      const response = await deleteCategory(formData);
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        startTransition(() => {
          router.refresh();
        });
        onConfirmationClose();
      }
    } catch (error) {
      console.error('Failed to delete category', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleToggleCategory = async (categoryId: string, isCurrentlyActive: boolean) => {
    setIsConfirming(true);
    try {
      const formData = new FormData();
      formData.append('id', categoryId);
      formData.append('locale', locale);
      formData.append('is_active', String(!isCurrentlyActive));
      const response = await toggleCategoryActive(formData);
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        startTransition(() => {
          router.refresh();
        });
        onConfirmationClose();
      }
    } catch (error) {
      console.error('Failed to toggle category', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const getConfirmationProps = () => {
    if (!confirmationConfig) return null;

    if (confirmationConfig.type === 'delete') {
      return {
        title: t('confirmations.delete.title'),
        content: t('confirmations.delete.content', { name: confirmationConfig.name }),
        confirmText: t('confirmations.delete.confirm'),
        cancelText: t('confirmations.delete.cancel'),
        confirmColor: 'danger' as const,
        onConfirm: () => handleDeleteCategory(confirmationConfig.id),
      };
    }

    if (confirmationConfig.type === 'toggle') {
      return {
        title: confirmationConfig.isActive
          ? t('confirmations.disable.title')
          : t('confirmations.enable.title'),
        content: confirmationConfig.isActive
          ? t('confirmations.disable.content', { name: confirmationConfig.name })
          : t('confirmations.enable.content', { name: confirmationConfig.name }),
        confirmText: confirmationConfig.isActive
          ? t('confirmations.disable.confirm')
          : t('confirmations.enable.confirm'),
        cancelText: t('confirmations.disable.cancel'),
        confirmColor: (confirmationConfig.isActive ? 'warning' : 'success') as 'warning' | 'success',
        onConfirm: () => handleToggleCategory(confirmationConfig.id, confirmationConfig.isActive),
      };
    }
    return null;
  };

  const confirmationProps = getConfirmationProps();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Input
            aria-label={t('ariaLabels.search')}
            placeholder={t('search.placeholder')}
            startContent={<Search size={16} />}
            variant="bordered"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        <Button
          as={Link}
          href={`/${locale}/dashboard/categories/create`}
          color="primary"
          startContent={<Plus size={16} />}
        >
          {t('new')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">{t('table.title')}</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label={t('table.ariaLabel')}>
            <TableHeader>
              <TableColumn>{t('table.columns.name')}</TableColumn>
              <TableColumn>{t('table.columns.nameAr')}</TableColumn>
              <TableColumn>{t('table.columns.status')}</TableColumn>
              <TableColumn>{t('table.columns.description')}</TableColumn>
              <TableColumn>{t('table.columns.actions')}</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isTableLoading}
              loadingContent={<Spinner size="sm" color="primary" />}
              emptyContent={
                debouncedSearchQuery ? t('table.empty.search') : t('table.empty.default')
              }
            >
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.name_ar ?? '—'}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={category.is_active ? 'primary' : 'default'}>
                      {category.is_active ? t('status.active') : t('status.inactive')}
                    </Chip>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        href={`/${locale}/dashboard/categories/${category.id}`}
                        isIconOnly
                        size="sm"
                        variant="flat"
                        startContent={<Edit2 size={14} />}
                        aria-label={t('ariaLabels.edit')}
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        color={category.is_active ? 'warning' : 'success'}
                        variant="flat"
                        startContent={category.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                        onPress={() => {
                          setConfirmationConfig({
                            type: 'toggle',
                            id: category.id,
                            name: category.name,
                            isActive: category.is_active,
                          });
                          onConfirmationOpen();
                        }}
                        aria-label={category.is_active ? t('ariaLabels.disable') : t('ariaLabels.enable')}
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<Trash2 size={14} />}
                        onPress={() => {
                          setConfirmationConfig({
                            type: 'delete',
                            id: category.id,
                            name: category.name,
                          });
                          onConfirmationOpen();
                        }}
                        aria-label={t('ariaLabels.delete')}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {confirmationProps ? (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onOpenChange={onConfirmationChange}
          onCancel={onConfirmationClose}
          isLoading={isConfirming}
          {...confirmationProps}
        />
      ) : null}
    </div>
  );
}
