"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
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
  const companyUuid = useCompanyStore.getState().company[0]?.uuid;
  
  const router = useRouter()
  const { exportExcel, isExportingExcel } = employee.useExportExcel()
  const userUuid = useUserStore((state) => state.user.uuid)

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
    if (!file) return
    setImporting(true)

    try {
      // TODO: Parse Excel file
      // const employees = await parseExcelFile(file)
      // setProgress(50)

      // TODO: Import employees via API
      // const status = await importEmployees(employees)
      // setImportStatus(status)
      // setProgress(100)

      console.log("Import function called - implement API calls here")
    } catch (error) {
      console.error("Error importing employees:", error)
      // TODO: Handle import errors
    } finally {
      setImporting(false)
    }
  }

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

  if (loading) {
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
                      <h3 className="font-semibold text-gray-900">Download Template</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Use our template to ensure your data is formatted correctly
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
                        Download Template
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
                  <CardTitle className="text-xl text-gray-900">Upload Excel File</CardTitle>
                  <CardDescription>Drag and drop your Excel file here, or click to browse</CardDescription>
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
                          Remove
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div className="space-y-4">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">Drop your Excel file here</p>
                          <p className="text-sm text-gray-600 mt-1">Supports .xlsx and .xls files up to 10MB</p>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileInput}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload">
                            <Button variant="outline" className="cursor-pointer bg-transparent">
                              Browse Files
                            </Button>
                          </label>
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
                Cancel
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
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Employees
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
