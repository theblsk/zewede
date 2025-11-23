'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@heroui/react';
import { Edit2, Plus, Search, Trash2, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  deleteCategory,
  deleteMenuItem,
  toggleCategoryActive,
} from '@/app/[locale]/(dashboard)/dashboard/actions';
import { MenuItemPriceRowType, MenuItemWithRelations } from '@/types/derived';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { MutateCategoryModal } from '@/components/dashboard/MutateCategoryModal';

type DashboardClientProps = {
  locale: string;
  translations: {
    pageTitle: string;
    pageSubtitle: string;
  };
  categories: Array<{
    id: string;
    name: string;
    name_ar?: string | null;
    is_active: boolean;
    description: string | null;
    description_ar?: string | null;
    menu_items: MenuItemWithRelations[];
  }>;
  searchItems: MenuItemWithRelations[];
};

type SearchItem = MenuItemWithRelations & { category_name?: string | null };
type SearchFormState = { query: string; results: SearchItem[] };

type DeleteConfirmation = {
  type: 'category' | 'item';
  id: string;
  name: string;
} | null;

type ToggleConfirmation = {
  categoryId: string;
  categoryName: string;
  isCurrentlyActive: boolean;
} | null;

const mapPrice = (price: MenuItemPriceRowType) => `${price.count} ${price.type} • ${price.price} USD`;

export default function DashboardClient({
  locale,
  translations,
  categories,
}: DashboardClientProps) {
  const router = useRouter();
  const {
    isOpen: isCategoryModalOpen,
    onOpen: onCategoryModalOpen,
    onOpenChange: onCategoryModalChange,
    onClose: onCategoryModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onOpenChange: onDeleteConfirmationChange,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure();
  const {
    isOpen: isToggleConfirmationOpen,
    onOpen: onToggleConfirmationOpen,
    onOpenChange: onToggleConfirmationChange,
    onClose: onToggleConfirmationClose,
  } = useDisclosure();

  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    name_ar?: string | null;
    description: string | null;
    description_ar?: string | null;
    is_active: boolean;
  } | null>(null);

  const [isPending, startTransition] = useTransition();
  const [searchState, setSearchState] = useState<SearchFormState>({
    query: '',
    results: [],
  });
  const [deletingItem, setDeletingItem] = useState<DeleteConfirmation>(null);
  const [toggleConfirmation, setToggleConfirmation] = useState<ToggleConfirmation>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [priceTypeFilter, setPriceTypeFilter] = useState<Set<string>>(new Set());
  const [availabilityFilter, setAvailabilityFilter] = useState<Set<string>>(new Set());
  const [activeStatusFilter, setActiveStatusFilter] = useState<Set<string>>(new Set());

  const handleDeleteCategory = async (categoryId: string) => {
    const formData = new FormData();
    formData.append('id', categoryId);
    formData.append('locale', locale);
    const response = await deleteCategory(formData);
    if (response.ok) {
      startTransition(() => {
        router.refresh();
      });
      onCategoryModalClose();
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const formData = new FormData();
    formData.append('id', itemId);
    formData.append('locale', locale);
    const response = await deleteMenuItem(formData);
    if (response.ok) {
      startTransition(() => {
        router.refresh();
      });
    }
  };


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-hlb-primary">
            {translations.pageTitle}
          </h1>
          <p className="text-hlb-text/80">{translations.pageSubtitle}</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={() => {
            setCategoryModalMode('create');
            setEditingCategory(null);
            onCategoryModalOpen();
          }}
        >
          New Category
        </Button>
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium">Category & Menu Management</h2>
            <p className="text-sm text-hlb-text/70">Manage categories and menu items in one place.</p>
          </div>
        </CardHeader>
        <CardBody>
          {categories.length > 0 && (
            <div className="space-y-4">
              <div className="max-w-xs">
                <Select
                  label="Select Category"
                  placeholder="Choose a category"
                  selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys as Set<string>)[0];
                    setSelectedCategoryId(key ?? null);
                  }}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {selectedCategoryId && (
                (() => {
                  const category = categories.find((c) => c.id === selectedCategoryId);
                  if (!category) return null;
                  
                  const q = searchState.query.trim().toLowerCase();
                  
                  const matchesQuery = (item: MenuItemWithRelations) =>
                    !q ||
                    item.name.toLowerCase().includes(q) ||
                    (item.name_ar ?? '').toLowerCase().includes(q) ||
                    (item.description ?? '').toLowerCase().includes(q) ||
                    (item.description_ar ?? '').toLowerCase().includes(q);

                  const matchesPriceType = (item: MenuItemWithRelations) =>
                    priceTypeFilter.size === 0 || (item.menu_item_price ?? []).some((p) => priceTypeFilter.has(p.type));

                  const matchesAvailability = (item: MenuItemWithRelations) => {
                    const allSelected = availabilityFilter.has('available') && availabilityFilter.has('unavailable');
                    if (availabilityFilter.size === 0 || allSelected) return true;
                    return availabilityFilter.has(item.availability ? 'available' : 'unavailable');
                  };

                  const matchesActive = (item: MenuItemWithRelations) => {
                    const allSelected = activeStatusFilter.has('active') && activeStatusFilter.has('inactive');
                    if (activeStatusFilter.size === 0 || allSelected) return true;
                    return activeStatusFilter.has(item.is_active ? 'active' : 'inactive');
                  };

                  const filteredItems = category.menu_items.filter((item) =>
                    matchesQuery(item) && matchesPriceType(item) && matchesAvailability(item) && matchesActive(item)
                  );

                  return (
                    <div className="space-y-4">
                      {/* Category Actions Row */}
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          startContent={<Edit2 size={14} />}
                          onPress={() => {
                            setCategoryModalMode('edit');
                            setEditingCategory({
                              id: category.id,
                              name: category.name,
                              name_ar: (category as { name_ar?: string | null }).name_ar ?? null,
                              description: category.description ?? null,
                              description_ar: (category as { description_ar?: string | null }).description_ar ?? null,
                              is_active: category.is_active,
                            });
                            onCategoryModalOpen();
                          }}
                        >
                          Edit Category
                        </Button>
                        <Button
                          size="sm"
                          color={category.is_active ? 'warning' : 'success'}
                          variant="flat"
                          onPress={() => {
                            setToggleConfirmation({
                              categoryId: category.id,
                              categoryName: category.name,
                              isCurrentlyActive: category.is_active,
                            });
                            onToggleConfirmationOpen();
                          }}
                        >
                          {category.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          startContent={<Trash2 size={14} />}
                          onPress={() => {
                            setDeletingItem({ type: 'category', id: category.id, name: category.name });
                            onDeleteConfirmationOpen();
                          }}
                        >
                          Delete
                        </Button>
                        <Link href={`/${locale}/dashboard/menu-items/new?category=${category.id}`}>
                          <Button
                            size="sm"
                            startContent={<Plus size={14} />}
                          >
                            Add Item
                          </Button>
                        </Link>
                      </div>

                      {/* Search + Filters Toolbar */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full max-w-md">
                          <Input
                            aria-label="search"
                            placeholder="Search in this category"
                            startContent={<Search size={16} />}
                            variant="bordered"
                            value={searchState.query}
                            onValueChange={(val) => {
                              setSearchState((state: SearchFormState) => ({ ...state, query: val }));
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Popover placement="bottom-end">
                            <PopoverTrigger>
                              <Button size="sm" variant="flat" startContent={<Filter size={14} />}>Filters</Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-sm">
                              <div className="p-3 w-[280px] space-y-3">
                                <Select
                                  selectionMode="multiple"
                                  label="Price Unit"
                                  placeholder="All"
                                  selectedKeys={priceTypeFilter}
                                  onSelectionChange={(keys) => setPriceTypeFilter(new Set(keys as Set<string>))}
                                >
                                  <SelectItem key="gram">Gram</SelectItem>
                                  <SelectItem key="box">Box</SelectItem>
                                </Select>
                                <Select
                                  selectionMode="multiple"
                                  label="Availability"
                                  placeholder="All"
                                  selectedKeys={availabilityFilter}
                                  onSelectionChange={(keys) => setAvailabilityFilter(new Set(keys as Set<string>))}
                                >
                                  <SelectItem key="available">Available</SelectItem>
                                  <SelectItem key="unavailable">Unavailable</SelectItem>
                                </Select>
                                <Select
                                  selectionMode="multiple"
                                  label="Active Status"
                                  placeholder="All"
                                  selectedKeys={activeStatusFilter}
                                  onSelectionChange={(keys) => setActiveStatusFilter(new Set(keys as Set<string>))}
                                >
                                  <SelectItem key="active">Active</SelectItem>
                                  <SelectItem key="inactive">Inactive</SelectItem>
                                </Select>
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="light" onPress={() => {
                                    setPriceTypeFilter(new Set());
                                    setAvailabilityFilter(new Set());
                                    setActiveStatusFilter(new Set());
                                  }}>
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <Table aria-label="Menu items">
                        <TableHeader>
                          <TableColumn>Name</TableColumn>
                          <TableColumn>Arabic Name</TableColumn>
                          <TableColumn>Status</TableColumn>
                          <TableColumn>Prices</TableColumn>
                          <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={q ? 'No items match your search' : 'No items yet'}>
                          {filteredItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{(item as { name_ar?: string | null }).name_ar ?? '—'}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Chip size="sm" color={item.availability ? 'success' : 'warning'}>
                                    {item.availability ? 'Available' : 'Unavailable'}
                                  </Chip>
                                  <Chip size="sm" color={item.is_active ? 'primary' : 'default'}>
                                    {item.is_active ? 'Active' : 'Inactive'}
                                  </Chip>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {item.menu_item_price?.map((price) => (
                                    <Chip key={price.id} size="sm" variant="flat">
                                      {mapPrice(price)}
                                    </Chip>
                                  )) ?? '—'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Link href={`/${locale}/dashboard/menu-items/${item.id}/edit`}>
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="flat"
                                      startContent={<Edit2 size={14} />}
                                      aria-label="Edit menu item"
                                    />
                                  </Link>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    startContent={<Trash2 size={14} />}
                                    onPress={() => {
                                      setDeletingItem({ type: 'item', id: item.id, name: item.name });
                                      onDeleteConfirmationOpen();
                                    }}
                                    aria-label="Delete menu item"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {categoryModalMode === 'create' ? (
        <MutateCategoryModal
          mode="create"
          isOpen={isCategoryModalOpen}
          onOpenChange={onCategoryModalChange}
          title="New Category"
          onSuccess={() => {
            setEditingCategory(null);
          }}
        />
      ) : (
        editingCategory && (
          <MutateCategoryModal
            mode="edit"
            isOpen={isCategoryModalOpen}
            onOpenChange={onCategoryModalChange}
            title="Edit Category"
            categoryId={editingCategory.id}
            category={{
              id: editingCategory.id,
              name: editingCategory.name,
              name_ar: editingCategory.name_ar ?? null,
              description: editingCategory.description ?? null,
              description_ar: editingCategory.description_ar ?? null,
              is_active: editingCategory.is_active,
            }}
            onSuccess={() => {
              setEditingCategory(null);
            }}
          />
        )
      )}

      <ConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onOpenChange={onDeleteConfirmationChange}
        onConfirm={() => {
          if (deletingItem) {
            if (deletingItem.type === 'category') {
              handleDeleteCategory(deletingItem.id);
            } else {
              handleDeleteItem(deletingItem.id);
            }
          }
          setDeletingItem(null);
          onDeleteConfirmationClose();
        }}
        onCancel={onDeleteConfirmationClose}
        title="Confirm Deletion"
        content={`Are you sure you want to delete ${deletingItem?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
      />

      <ConfirmationModal
        isOpen={isToggleConfirmationOpen}
        onOpenChange={onToggleConfirmationChange}
        onConfirm={() => {
          if (toggleConfirmation) {
            const formData = new FormData();
            formData.append('id', toggleConfirmation.categoryId);
            formData.append('locale', locale);
            formData.append('is_active', String(!toggleConfirmation.isCurrentlyActive));
            startTransition(async () => {
              await toggleCategoryActive(formData);
              router.refresh();
            });
          }
          setToggleConfirmation(null);
          onToggleConfirmationClose();
        }}
        onCancel={onToggleConfirmationClose}
        title={`Confirm ${toggleConfirmation?.isCurrentlyActive ? 'Disable' : 'Enable'}`}
        content={`Are you sure you want to ${toggleConfirmation?.isCurrentlyActive ? 'disable' : 'enable'} ${toggleConfirmation?.categoryName}?`}
        confirmText={toggleConfirmation?.isCurrentlyActive ? 'Disable' : 'Enable'}
        cancelText="Cancel"
        confirmColor={toggleConfirmation?.isCurrentlyActive ? 'warning' : 'success'}
      />
      <LoadingOverlay isLoading={isPending} />
    </div>
  );
}


