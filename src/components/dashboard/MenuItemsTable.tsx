"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from "@heroui/react";
import {
  Edit2,
  Plus,
  Power,
  PowerOff,
  Search,
  Trash2,
  Filter,
  Wheat,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/image-upload";

import {
  deleteMenuItem,
  getCategoriesForDashboard,
  toggleMenuItemActive,
  getMenuItemsForDashboard,
} from "@/app/[locale]/(dashboard)/dashboard/actions";
import type { MenuItemSizeRowType, MenuItemSizeTranslationRowType } from "@/types/derived";
import { ConfirmationModal } from "@/components/ConfirmationModal";

type MenuItemsTableProps = {
  locale: string;
};

type DeleteConfirmation = {
  itemId: string;
  itemName: string;
} | null;

type ToggleConfirmation = {
  itemId: string;
  itemName: string;
  isCurrentlyActive: boolean;
} | null;

const mapSize = (size: MenuItemSizeRowType & { menu_item_size_translations?: MenuItemSizeTranslationRowType[] }) => {
  const enName = size.menu_item_size_translations?.find((t) => t.locale === "en")?.name ?? "";
  return `${enName}: ${Number(size.price).toLocaleString()} LBP`;
};

export function MenuItemsTable({ locale }: MenuItemsTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const [activeStatusFilter, setActiveStatusFilter] = useState<Set<string>>(
    new Set()
  );
  const t = useTranslations("dashboard.items");
  const selectedCategoryIds = useMemo(
    () => Array.from(categoryFilter).sort(),
    [categoryFilter]
  );
  const selectedActiveStatuses = useMemo(
    () =>
      Array.from(activeStatusFilter)
        .filter((status): status is "active" | "inactive" => status === "active" || status === "inactive")
        .sort(),
    [activeStatusFilter]
  );
  const searchTerm = searchQuery.trim();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchTerm);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

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

  const [deletingItem, setDeletingItem] = useState<DeleteConfirmation>(null);
  const [toggleConfirmation, setToggleConfirmation] =
    useState<ToggleConfirmation>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const { data: menuItems = [], isLoading, isFetching } = useQuery({
    queryKey: ["menuItems", selectedCategoryIds, selectedActiveStatuses, debouncedSearchQuery],
    queryFn: () =>
      getMenuItemsForDashboard({
        categoryIds: selectedCategoryIds,
        activeStatuses: selectedActiveStatuses,
        search: debouncedSearchQuery,
      }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesForDashboard(),
  });

  const categoryOptions = useMemo(() => {
    return categories
      .map((category) => ({ id: category.id, name: category.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const handleDeleteItem = async (itemId: string) => {
    const formData = new FormData();
    formData.append("id", itemId);
    formData.append("locale", locale);
    const response = await deleteMenuItem(formData);
    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      startTransition(() => {
        router.refresh();
      });
      onDeleteConfirmationClose();
    }
  };

  const handleToggleItem = async (
    itemId: string,
    isCurrentlyActive: boolean
  ) => {
    setIsConfirming(true);
    try {
      const formData = new FormData();
      formData.append("id", itemId);
      formData.append("locale", locale);
      formData.append("is_active", String(!isCurrentlyActive));
      const response = await toggleMenuItemActive(formData);
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["menuItems"] });
        startTransition(() => {
          router.refresh();
        });
        onToggleConfirmationClose();
      }
    } catch (error) {
      console.error("Failed to toggle menu item", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const isTableLoading =
    isLoading || isFetching || searchTerm !== debouncedSearchQuery;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Input
            aria-label={t("ariaLabels.search")}
            placeholder={t("search.placeholder")}
            startContent={<Search size={16} />}
            variant="bordered"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        <div className="flex items-center gap-2">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                size="sm"
                variant="flat"
                startContent={<Filter size={14} />}
              >
                {t("filters.title")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-sm">
              <div className="p-3 w-[280px] space-y-3">
                <Select
                  selectionMode="multiple"
                  label={t("filters.category")}
                  placeholder={t("filters.all")}
                  selectedKeys={categoryFilter}
                  onSelectionChange={(keys) =>
                    setCategoryFilter(new Set(keys as Set<string>))
                  }
                >
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id}>{category.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  selectionMode="multiple"
                  label={t("filters.activeStatus")}
                  placeholder={t("filters.all")}
                  selectedKeys={activeStatusFilter}
                  onSelectionChange={(keys) =>
                    setActiveStatusFilter(new Set(keys as Set<string>))
                  }
                >
                  <SelectItem key="active">{t("filters.active")}</SelectItem>
                  <SelectItem key="inactive">{t("filters.inactive")}</SelectItem>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setCategoryFilter(new Set());
                      setActiveStatusFilter(new Set());
                    }}
                  >
                    {t("filters.clear")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Link href={`/${locale}/dashboard/menu-items/create`}>
            <Button color="primary" startContent={<Plus size={16} />}>
              {t("new")}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">{t("table.title")}</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label={t("table.ariaLabel")}>
            <TableHeader>
              <TableColumn>{t("table.columns.image")}</TableColumn>
              <TableColumn>{t("table.columns.name")}</TableColumn>
              <TableColumn>{t("table.columns.nameAr")}</TableColumn>
              <TableColumn>{t("table.columns.category")}</TableColumn>
              <TableColumn>{t("table.columns.status")}</TableColumn>
              <TableColumn>{t("table.columns.prices")}</TableColumn>
              <TableColumn>{t("table.columns.actions")}</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isTableLoading}
              loadingContent={<Spinner size="sm" color="primary" />}
              emptyContent={
                debouncedSearchQuery ? t("table.empty.search") : t("table.empty.default")
              }
            >
              {menuItems.map((item) => {
                const imageUrl = getImageUrl(item.image_key);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {imageUrl ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-default-200 flex items-center justify-center">
                          <Wheat size={20} className="text-default-400" strokeWidth={1.5} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {(item as { name_ar?: string | null }).name_ar ?? "—"}
                    </TableCell>
                    <TableCell>
                      {item.category ? (
                        <Chip size="sm" variant="flat">
                          {item.category.name}
                        </Chip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={item.is_active ? "primary" : "default"}>
                        {item.is_active ? t("filters.active") : t("filters.inactive")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {item.menu_item_sizes && item.menu_item_sizes.length > 0 ? (
                          item.menu_item_sizes
                            .filter((size) => size.is_active)
                            .map((size) => (
                              <Chip key={size.id} size="sm" variant="flat">
                                {mapSize(size)}
                              </Chip>
                            ))
                        ) : (
                          "—"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          href={`/${locale}/dashboard/menu-items/${item.id}/edit`}
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            startContent={<Edit2 size={14} />}
                            aria-label={t("ariaLabels.edit")}
                          />
                        </Link>
                        <Button
                          isIconOnly
                          size="sm"
                          color={item.is_active ? "warning" : "success"}
                          variant="flat"
                          startContent={
                            item.is_active ? (
                              <PowerOff size={14} />
                            ) : (
                              <Power size={14} />
                            )
                          }
                          onPress={() => {
                            setToggleConfirmation({
                              itemId: item.id,
                              itemName: item.name,
                              isCurrentlyActive: item.is_active,
                            });
                            onToggleConfirmationOpen();
                          }}
                          aria-label={
                            item.is_active
                              ? t("ariaLabels.disable")
                              : t("ariaLabels.enable")
                          }
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          startContent={<Trash2 size={14} />}
                          onPress={() => {
                            setDeletingItem({
                              itemId: item.id,
                              itemName: item.name,
                            });
                            onDeleteConfirmationOpen();
                          }}
                          aria-label={t("ariaLabels.delete")}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <ConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onOpenChange={onDeleteConfirmationChange}
        onConfirm={() => {
          if (deletingItem) {
            handleDeleteItem(deletingItem.itemId);
          }
          setDeletingItem(null);
          onDeleteConfirmationClose();
        }}
        onCancel={onDeleteConfirmationClose}
        title={t("confirmations.delete.title")}
        content={t("confirmations.delete.content", { name: deletingItem?.itemName ?? "" })}
        confirmText={t("confirmations.delete.confirm")}
        cancelText={t("confirmations.delete.cancel")}
        confirmColor="danger"
      />
      {toggleConfirmation ? (
        <ConfirmationModal
          isOpen={isToggleConfirmationOpen}
          onOpenChange={onToggleConfirmationChange}
          onConfirm={() => {
            if (toggleConfirmation) {
              handleToggleItem(
                toggleConfirmation.itemId,
                toggleConfirmation.isCurrentlyActive
              );
            }
            setToggleConfirmation(null);
            onToggleConfirmationClose();
          }}
          onCancel={onToggleConfirmationClose}
          title={
            toggleConfirmation.isCurrentlyActive
              ? t("confirmations.disable.title")
              : t("confirmations.enable.title")
          }
          content={
            toggleConfirmation.isCurrentlyActive
              ? t("confirmations.disable.content", { name: toggleConfirmation.itemName })
              : t("confirmations.enable.content", { name: toggleConfirmation.itemName })
          }
          confirmText={
            toggleConfirmation.isCurrentlyActive
              ? t("confirmations.disable.confirm")
              : t("confirmations.enable.confirm")
          }
          cancelText={t("confirmations.disable.cancel")}
          confirmColor={
            toggleConfirmation.isCurrentlyActive ? "warning" : "success"
          }
          isLoading={isConfirming}
        />
      ) : null}
    </div>
  );
}
