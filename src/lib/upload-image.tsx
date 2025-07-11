import React, { useState } from "react"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Image from "next/image"

type Props = {
    value?: string
    folder: string
    onChange: (value: string) => void
}

export default function FileDropUploader({ value, folder, onChange }: Props) {
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(value ? `/r2/${value}` : null)
    const [progress, setProgress] = useState<number | null>(null)

    const validateFile = (file: File): boolean => {
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.")
            return false
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB.")
            return false
        }
        return true
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", `upload/${folder}`)

        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/upload", true)

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100
                setProgress(percent)
            }
        }

        xhr.onload = () => {
            setProgress(null)
            try {
                const res = JSON.parse(xhr.responseText)
                if (xhr.status >= 200 && xhr.status < 300) {
                    setPreview(res.url)
                    onChange(res.name)
                    toast.success("Upload success")
                } else {
                    toast.error(res.error || "Upload failed")
                }
            } catch {
                toast.error("Upload failed")
            }
        }

        xhr.onerror = () => {
            setProgress(null)
            toast.error("Upload error")
        }

        xhr.send(formData)
    }

    const handleFile = async (file: File) => {
        if (!validateFile(file)) return
        await uploadFile(file)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) await handleFile(file)
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files[0]
        if (file) await handleFile(file)
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    return (
        <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive ? "border-orange-400 bg-orange-50" : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/50"
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
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-orange-600" />
                </div>
                {preview ? (
                    <div className="space-y-2">
                        <Image
                            src={preview}
                            alt="Preview"
                            className="mx-auto max-h-40 rounded-md object-contain"
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                            }}
                        />
                        <p className="text-sm text-gray-600">Click to change or drag a new image</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="font-medium text-gray-700">Drop your logo here, or click to browse</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                )}
            </div>
            {progress !== null && (
                <div className="mt-4">
                    <Progress value={progress} className="h-2 [&>div]:bg-green-500" />
                    <p className="text-sm text-gray-500 mt-1 text-center">Uploading... {Math.round(progress)}%</p>
                </div>
            )}
        </div>
    )
}
