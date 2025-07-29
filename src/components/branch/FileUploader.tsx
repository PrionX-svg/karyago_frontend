import React, { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type FileUploaderProps = {
  value?: string | null; // file name or url
  onChange: (file: File | null) => void;
  previewUrl?: string | null; // for previewing existing image
  disabled?: boolean;
};

/**
 * FileUploader allows selecting an image file, shows preview, but does NOT upload until parent calls upload logic.
 * onChange is called with File or null. Parent is responsible for uploading on form submit.
 */
const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  previewUrl,
  disabled,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // If parent resets value, clear preview and file
    if (!value && !previewUrl) {
      setPreview(null);
      setFile(null);
    }
    if (previewUrl) {
      setPreview(previewUrl);
    }
  }, [value, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    onChange(f);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      if (!f.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB.");
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      onChange(f);
    }
  };

  return (
    <div
      className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 border-gray-300 hover:border-orange-300 hover:bg-orange-50/50"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
      <div className="space-y-3">
        {!preview && (
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Upload className="h-6 w-6 text-orange-600" />
          </div>
        )}
        {preview ? (
          <div className="space-y-2">
            <div
              className="relative mx-auto group"
              style={{ width: 128, height: 128 }}
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-md mx-auto w-full h-full"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
                type="button"
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Click to change or drag a new image
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium text-gray-700">
              Drop your logo here, or click to browse
            </p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
