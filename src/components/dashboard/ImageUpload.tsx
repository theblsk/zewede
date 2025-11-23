"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { ImagePlus, X } from "lucide-react";
import { getImageUrl, uploadImage } from "@/utils/image-upload";
import Image from "next/image";

type ImageUploadProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  label?: string;
  disabled?: boolean;
};

export function ImageUpload({ value, onChange, label = "Image", disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(getImageUrl(value ?? null));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase
      const path = await uploadImage(file);
      onChange(path);
      
      // Update preview with remote URL (optional, but good for consistency)
      setPreviewUrl(getImageUrl(path));
    } catch (error) {
      console.error("Error uploading image:", error);
      // Revert preview if upload fails
      setPreviewUrl(getImageUrl(value ?? null));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-default-500">{label}</span>
      
      {previewUrl ? (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-default-200 group">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              isIconOnly
              color="danger"
              variant="flat"
              size="sm"
              onPress={handleRemove}
              isDisabled={disabled}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="w-40 h-40 rounded-xl border-2 border-dashed border-default-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors bg-default-50 hover:bg-default-100"
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <ImagePlus className="text-default-400" size={24} />
          <span className="text-xs text-default-500 font-medium">Upload Image</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      {isUploading && <span className="text-xs text-primary">Uploading...</span>}
    </div>
  );
}

