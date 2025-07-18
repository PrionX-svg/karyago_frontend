"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Upload, Download, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import employee from "@/lib/queries/employee-queries"
import { useUserStore } from "@/stores/user-store"
import { api } from "@/lib/api/api"
import ExcelImportSkeleton from "./loading"
import { useCompanyStore } from "@/stores/company-store"
import postAPI from "@/lib/api/postAPI"
import roles from "@/lib/queries/role-queries"
import { useRoleStore } from "@/stores/role-store"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export type EmployeeType = {
  company_uuid?: string
  firstname: string
  lastname: string
  phone: string
  email: string
  dob: string | null
  gender: string | null
  is_freelance: boolean
}

export default function ImportFromExcel() {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const companyUuid = useCompanyStore.getState().company[0]?.uuid;
  const employeeRole = useRoleStore.getState().roles[0]?.uuid;

  const router = useRouter()
  const { exportExcel, isExportingExcel } = employee.useExportExcel()
  const { isFetchingRoles } = roles.useGetRolesByCompanyUuid(companyUuid)
  const userUuid = useUserStore((state) => state.user.uuid)
  const ap = useTranslations("api");
  const ie = useTranslations("import-excel");
  const co = useTranslations("common");

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const onBack = () => {
    router.push("/onboarding")
  }

  const openFileExplorer = () => {
    fileInputRef.current?.click()
  }

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type.includes("sheet") ||
        droppedFile.name.endsWith(".xlsx") ||
        droppedFile.name.endsWith(".xls")
      ) {
        setFile(droppedFile)
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
    }
  }

  const handleImport = async (): Promise<void> => {
    if (!file || !companyUuid) return;
    setImporting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_uuid", companyUuid);
    formData.append("role_uuid", employeeRole);

    try {
      const res = await postAPI(formData, "/users/import");
      if (res.status === 200) {
        toast.success(ap('importSuccess'))
      } else {
        toast.error(ap('importFailed'))
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error(ap('somethingWentWrong'))
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = (): void => {
    exportExcel(companyUuid)
  }

  const resetFile = (): void => {
    setFile(null)
  }

  useEffect(() => {
    if (!userUuid) {
      api.getMe()
    }
  }, [userUuid])

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (userUuid) {
        setLoading(true)
        try {
          await api.getCompanyByUserUuid(userUuid)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchCompanyData()
  }, [userUuid])

  if (loading || isFetchingRoles) {
    return (
      <ExcelImportSkeleton />
    )
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8 flex-1">
        <motion.div className="w-full max-w-4xl mx-auto" variants={itemVariants}>
          <div className="space-y-6">
            {/* Template Download */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg">
                <CardContent className="px-6 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{ie('downloadTemplate')}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {ie('downloadTemplateDescription')}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={downloadTemplate}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                        disabled={isExportingExcel}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {ie("downloadTemplate")}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* File Upload */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{ie('uploadFile')}</CardTitle>
                  <CardDescription>{ie('uploadFileDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                      ? "border-orange-400 bg-orange-50"
                      : file
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFile}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          {co("remove")}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div className="space-y-4">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{ie('dropZone')}</p>
                          <p className="text-sm text-gray-600 mt-1">{ie("fileFormat")}</p>
                        </div>
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="cursor-pointer bg-transparent"
                            onClick={openFileExplorer}
                          >
                            {co("browseFiles")}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="flex justify-between pt-6" variants={itemVariants}>
              <Button
                variant="outline"
                onClick={onBack}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                disabled={importing}
              >
                {co('cancel')}
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                >
                  {importing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mr-2"
                      >
                        <Upload className="h-4 w-4" />
                      </motion.div>
                      {ie('importing')}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {ie('importExcelButton')}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
