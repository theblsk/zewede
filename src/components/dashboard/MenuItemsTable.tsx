"use client";

import { useState, useTransition } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/image-upload";

import {
  deleteMenuItem,
  toggleMenuItemActive,
  getMenuItemsForDashboard,
} from "@/app/[locale]/(dashboard)/dashboard/actions";
import { MenuItemPriceRowType } from "@/types/derived";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { LoadingOverlay } from "@/components/LoadingOverlay";

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

const mapPrice = (price: MenuItemPriceRowType) =>
  `${price.count} ${price.type} • ${price.price} USD`;

export function MenuItemsTable({ locale }: MenuItemsTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceTypeFilter, setPriceTypeFilter] = useState<Set<string>>(
    new Set()
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<Set<string>>(
    new Set()
  );
  const [activeStatusFilter, setActiveStatusFilter] = useState<Set<string>>(
    new Set()
  );
  const t = useTranslations("dashboard.items");

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

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItemsForDashboard,
  });

  const filteredItems = menuItems.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.name_ar ?? "").toLowerCase().includes(q) ||
      (item.description ?? "").toLowerCase().includes(q) ||
      (item.description_ar ?? "").toLowerCase().includes(q);

    const matchesPriceType =
      priceTypeFilter.size === 0 ||
      (item.menu_item_price ?? []).some((p) => priceTypeFilter.has(p.type));

    const matchesAvailability = (() => {
      const allSelected =
        availabilityFilter.has("available") &&
        availabilityFilter.has("unavailable");
      if (availabilityFilter.size === 0 || allSelected) return true;
      return availabilityFilter.has(
        item.availability ? "available" : "unavailable"
      );
    })();

    const matchesActive = (() => {
      const allSelected =
        activeStatusFilter.has("active") && activeStatusFilter.has("inactive");
      if (activeStatusFilter.size === 0 || allSelected) return true;
      return activeStatusFilter.has(item.is_active ? "active" : "inactive");
    })();

    return (
      matchesQuery && matchesPriceType && matchesAvailability && matchesActive
    );
  });

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
            placeholder="Search menu items"
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
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-sm">
              <div className="p-3 w-[280px] space-y-3">
                <Select
                  selectionMode="multiple"
                  label="Price Unit"
                  placeholder="All"
                  selectedKeys={priceTypeFilter}
                  onSelectionChange={(keys) =>
                    setPriceTypeFilter(new Set(keys as Set<string>))
                  }
                >
                  <SelectItem key="gram">Gram</SelectItem>
                  <SelectItem key="box">Box</SelectItem>
                </Select>
                <Select
                  selectionMode="multiple"
                  label="Availability"
                  placeholder="All"
                  selectedKeys={availabilityFilter}
                  onSelectionChange={(keys) =>
                    setAvailabilityFilter(new Set(keys as Set<string>))
                  }
                >
                  <SelectItem key="available">Available</SelectItem>
                  <SelectItem key="unavailable">Unavailable</SelectItem>
                </Select>
                <Select
                  selectionMode="multiple"
                  label="Active Status"
                  placeholder="All"
                  selectedKeys={activeStatusFilter}
                  onSelectionChange={(keys) =>
                    setActiveStatusFilter(new Set(keys as Set<string>))
                  }
                >
                  <SelectItem key="active">Active</SelectItem>
                  <SelectItem key="inactive">Inactive</SelectItem>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setPriceTypeFilter(new Set());
                      setAvailabilityFilter(new Set());
                      setActiveStatusFilter(new Set());
                    }}
                  >
                    Clear
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
          <h2 className="text-xl font-medium">Menu Items</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Menu items">
            <TableHeader>
              <TableColumn>Image</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Arabic Name</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Prices</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                searchQuery ? "No items match your search" : "No items yet"
              }
            >
              {filteredItems.map((item) => {
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
                          <span className="text-xs text-default-400">
                            No image
                          </span>
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
                      <div className="flex gap-2">
                        <Chip
                          size="sm"
                          color={item.availability ? "success" : "warning"}
                        >
                          {item.availability ? "Available" : "Unavailable"}
                        </Chip>
                        <Chip
                          size="sm"
                          color={item.is_active ? "primary" : "default"}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {item.menu_item_price?.map((price) => (
                          <Chip key={price.id} size="sm" variant="flat">
                            {mapPrice(price)}
                          </Chip>
                        )) ?? "—"}
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
                            aria-label="Edit menu item"
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
                              ? "Disable menu item"
                              : "Enable menu item"
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
                          aria-label="Delete menu item"
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
        title="Confirm Deletion"
        content={`Are you sure you want to delete ${deletingItem?.itemName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
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
          title={`Confirm ${
            toggleConfirmation.isCurrentlyActive ? "Disable" : "Enable"
          }`}
          content={`Are you sure you want to ${
            toggleConfirmation.isCurrentlyActive ? "disable" : "enable"
          } ${toggleConfirmation.itemName}?`}
          confirmText={
            toggleConfirmation.isCurrentlyActive ? "Disable" : "Enable"
          }
          cancelText="Cancel"
          confirmColor={
            toggleConfirmation.isCurrentlyActive ? "warning" : "success"
          }
          isLoading={isConfirming}
        />
      ) : null}
      <LoadingOverlay isLoading={isPending} />
    </div>
  );
}
