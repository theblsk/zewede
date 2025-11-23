'use client';

import { useState, useTransition } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
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
import { LoadingOverlay } from '@/components/LoadingOverlay';

type CategoriesTableProps = {
  locale: string;
};

type ConfirmationConfig =
  | { type: 'delete'; id: string; name: string }
  | { type: 'toggle'; id: string; name: string; isActive: boolean };

export function CategoriesTable({ locale }: CategoriesTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const t = useTranslations('dashboard.categories');

  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onOpenChange: onConfirmationChange,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const [confirmationConfig, setConfirmationConfig] = useState<ConfirmationConfig | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesForDashboard,
  });

  const filteredCategories = categories.filter((category) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      category.name.toLowerCase().includes(q) ||
      (category.name_ar ?? '').toLowerCase().includes(q) ||
      (category.description ?? '').toLowerCase().includes(q) ||
      (category.description_ar ?? '').toLowerCase().includes(q)
    );
  });

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
        title: 'Confirm Deletion',
        content: `Are you sure you want to delete ${confirmationConfig.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'danger' as const,
        onConfirm: () => handleDeleteCategory(confirmationConfig.id),
      };
    }

    if (confirmationConfig.type === 'toggle') {
      const action = confirmationConfig.isActive ? 'disable' : 'enable';
      const Action = confirmationConfig.isActive ? 'Disable' : 'Enable';
      return {
        title: `Confirm ${Action}`,
        content: `Are you sure you want to ${action} ${confirmationConfig.name}?`,
        confirmText: Action,
        cancelText: 'Cancel',
        confirmColor: (confirmationConfig.isActive ? 'warning' : 'success') as 'warning' | 'success',
        onConfirm: () => handleToggleCategory(confirmationConfig.id, confirmationConfig.isActive),
      };
    }
    return null;
  };

  const confirmationProps = getConfirmationProps();

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="flex items-center justify-center py-8">
            <LoadingOverlay isLoading={true} />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Input
            aria-label="search"
            placeholder="Search categories"
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
          <h2 className="text-xl font-medium">Categories</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Categories">
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Arabic Name</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={searchQuery ? 'No categories match your search' : 'No categories yet'}>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.name_ar ?? '—'}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={category.is_active ? 'primary' : 'default'}>
                      {category.is_active ? 'Active' : 'Inactive'}
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
                        aria-label="Edit category"
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
                        aria-label={category.is_active ? 'Disable category' : 'Enable category'}
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
                        aria-label="Delete category"
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

      <LoadingOverlay isLoading={isPending} />
    </div>
  );
}
