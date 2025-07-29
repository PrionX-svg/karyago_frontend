"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Image from "next/image";
import postAPI from "./api/postAPI";
import { Button } from "@/components/ui/button";

type Props = {
  folder: string;
  onChange: (value: string) => void;
};

export default function FileDropUploader({ onChange, folder }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await postAPI(formData, "/upload/");
      if (res.status === 200) {
        setProgress(100);
        setTimeout(() => setProgress(null), 1500);

        const url = res.data?.url?.url;
        const fileName = res.data?.url?.file_name;
        if (url) {
          setPreview(url);
          onChange(fileName);
          toast.success("File uploaded successfully!");
        } else {
          throw new Error("No URL returned from upload response.");
        }
      } else {
        setProgress(null);
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const deleteFile = async () => {
    if (!preview) return;

    try {
      const urlParts = preview.split("/");
      const fileNameWithParams = urlParts[urlParts.length - 1];
      const fileName = `${folder}/${fileNameWithParams.split("?")[0]}`;
      const res = await postAPI({ file_name: fileName }, "/upload/delete");

      if (res.status === 200) {
        setPreview(null);
        onChange("");
        toast.success("File deleted successfully!");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;
    await uploadFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        dragActive
          ? "border-orange-400 bg-orange-50"
          : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-3">
        {!preview && (
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Upload className="h-6 w-6 text-orange-600" />
          </div>
        )}
        {preview ? (
          <div className="space-y-2">
            <ImagePreviewContainer src={preview} onDelete={deleteFile} />
            <p className="text-sm text-gray-600 text-center">
              Click to change or drag a new image
            </p>
          </div>
        ) : (
          //
          <div className="space-y-2">
            <p className="font-medium text-gray-700">
              Drop your logo here, or click to browse
            </p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
      {progress !== null && (
        <div className="mt-4">
          <Progress
            value={progress ?? 0}
            className="h-2 [&>div]:bg-green-500"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">
            Uploading... {Math.round(progress ?? 0)}%
          </p>
        </div>
      )}
    </div>
  );
}

// Dynamically sized image preview container
function ImagePreviewContainer({
  src,
  onDelete,
}: {
  src: string;
  onDelete: () => void;
}) {
  const [aspect, setAspect] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto group"
      style={{ width: 128, height: 128 / aspect, transition: "height 0.2s" }}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt="Preview"
        fill
        style={{ objectFit: "contain" }}
        className="rounded-md mx-auto w-full h-full"
        onLoadingComplete={(img) => {
          if (img.naturalWidth && img.naturalHeight) {
            setAspect(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
