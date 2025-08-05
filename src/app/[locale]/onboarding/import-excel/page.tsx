"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Upload, Download, CheckCircle, X, Building, Phone, Briefcase, Cake, Mail, User, UserRound, BadgeCheck, Activity, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import employee from "@/lib/queries/employee-queries"
import { useUserStore } from "@/stores/user-store"
import { api } from "@/lib/api/api"
import { useCompanyStore } from "@/stores/company-store"
import roles from "@/lib/queries/role-queries"
import { useRoleStore } from "@/stores/role-store"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useEmployeeStore } from "@/stores/employee-store"
import ExcelImportSkeleton from "./loading"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MergedEmployeeType } from "@/lib/types/employee-type"

export type EmployeeType = {
  company_uuid: string
  user_uuid: string
  employee_uuid: string
  role: {
    name: string
    uuid: string
  }
  name: {
    fullname: string
    firstname: string
    lastname: string
  }
  phone: string
  email: string
  dob: string | null
  gender: string | null
  is_freelance: boolean
}

export type EmployeeHistoryType = {
  uuid: string
  employee: {
    uuid: string
    full_name: string
    email: string
  }
  company: {
    uuid: string
    name: string
  }
  role: {
    uuid: string
    name: string
  }
  position: string
  is_present: boolean
  start_date: string
  end_date?: string | null
}

export default function ImportFromExcel() {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const companyUuid = useCompanyStore.getState().company[0]?.uuid
  const employeeRole = useRoleStore.getState().roles[0]?.uuid

  const router = useRouter()
  const { exportExcel, isExportingExcel } = employee.useExportExcel()
  const { isFetchingRoles } = roles.useGetRolesByCompanyUuid(companyUuid)
  const employeeData = useEmployeeStore.getState().employees
  const employeeHistoryData = useEmployeeStore.getState().employeeHistory
  const { isImportingEmployee, importEmployee } = employee.useImportEmployee()
  const userUuid = useUserStore((state) => state.user.userUuid)
  const ap = useTranslations("api")
  const ie = useTranslations("import-excel")
  const co = useTranslations("common")

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
    if (!file || !companyUuid) return
    setImporting(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("company_uuid", companyUuid)
    formData.append("role_uuid", employeeRole)

    importEmployee(formData)
      .then(() => {
        toast.success(ap("importSuccess"))
        setFile(null)
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || ap("importError") || "Import failed"
        toast.error(errorMessage)
      })
      .finally(() => {
        setImporting(false)
      })
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
          await api.getCompanyByUserUuid(userUuid, true)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchCompanyData()
  }, [userUuid])

  if (loading || isFetchingRoles) {
    return <ExcelImportSkeleton />
  }

  const employeeDataMap = new Map(
    (employeeData || []).map(emp => [emp.employee_uuid, {
      user_uuid: emp.user_uuid,
      employee_uuid: emp.employee_uuid,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      dob: emp.dob,
      gender: emp.gender,
      is_freelance: emp.is_freelance,
      company_uuid: emp.company_uuid,
      company_name: "",
      role_name: emp.role.name,
      role_uuid: emp.role.uuid,
      source: "basic" as const
    }])
  )

  const historyOnly = (employeeHistoryData || []).filter(hist => {
    return !employeeDataMap.has(hist.employee.uuid)
  }).map(hist => ({
    user_uuid: hist.employee.uuid,
    employee_uuid: hist.employee.uuid,
    name: {
      fullname: hist.employee.full_name,
      firstname: "",
      lastname: ""
    },
    email: hist.employee.email,
    phone: "",
    dob: null,
    gender: null,
    is_freelance: false,
    company_uuid: hist.company.uuid,
    company_name: hist.company.name,
    role_name: hist.role.name,
    role_uuid: hist.role.uuid,
    position: hist.position,
    is_present: hist.is_present,
    start_date: hist.start_date,
    end_date: hist.end_date,
    source: "history" as const
  }))

  const mergedEmployees: MergedEmployeeType[] = [
    ...employeeDataMap.values(),
    ...historyOnly
  ]

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8 flex-1">
        <motion.div className="w-full max-w-6xl mx-auto" variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Template Download */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardContent className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ie("downloadTemplate")}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ie("downloadTemplateDescription")}</p>
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

              {/* Import Rules */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      {ie("importRules")}
                    </CardTitle>
                    <CardDescription>
                      {ie("importRulesDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-4">
                    <ul className="space-y-4 list-disc pl-5">
                      <li>
                        <p className="text-sm font-semibold text-gray-900">{ie("rule1Title")}</p>
                        <p className="text-xs text-gray-600">
                          {ie("rule1Description")}
                          <br />
                          {ie("rule1Additional")}
                          <br />
                          {ie("rule2Additional")}
                        </p>
                      </li>
                      <li>
                        <p className="text-sm font-semibold text-gray-900">{ie("rule2Title")}</p>
                        <p className="text-xs text-gray-600">{ie("rule2Description")}</p>
                      </li>
                      <li>
                        <p className="text-sm font-semibold text-gray-900">{ie("rule3Title")}</p>
                        <p className="text-xs text-gray-600">{ie("rule3Description")}</p>
                      </li>
                      <li>
                        <p className="text-sm font-semibold text-gray-900">{ie("rule4Title")}</p>
                        <p className="text-xs text-gray-600">
                          {ie("rule4Description")}{" "}
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">default123</code>{" "}
                          {ie("rule4Additional")}
                        </p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* File Upload */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{ie("uploadFile")}</CardTitle>
                    <CardDescription>{ie("uploadFileDescription")}</CardDescription>
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
                            <p className="text-sm text-gray-600">
                              {(file.size / (1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 2 })} MB
                            </p>
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
                            <p className="text-lg font-semibold text-gray-900">{ie("dropZone")}</p>
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

              {/* Uploaded Data Dialog Trigger */}
              <motion.div variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDialog(true)}
                  disabled={(!employeeData?.length && !employeeHistoryData?.length)}
                >
                  {ie("viewUploadedData") || "View Uploaded Data"}
                </Button>
              </motion.div>

              {/* Uploaded Data Dialog */}
              {showDialog && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{ie("uploadedData") || "Uploaded Data"}</DialogTitle>
                      <DialogDescription>
                        {ie("uploadedDataDescription") || "Data that has been successfully imported"}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] w-full pr-2">
                      <div className="space-y-6">
                        {mergedEmployees.length > 0 ? (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              {ie("employees") || "Employees"} ({mergedEmployees.length})
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid gap-2">
                                {mergedEmployees.map((emp, idx) => (
                                  <div
                                    key={emp.employee_uuid || idx}
                                    className="flex flex-col p-3 bg-white rounded-md shadow-sm border border-gray-100"
                                  >
                                    {/* --- Nama, Status, dan Badge --- */}
                                    <div className="flex items-center gap-2 mb-1">
                                      <CheckCircle className={`h-4 w-4 ${emp.source === "basic" ? "text-green-500" : "text-blue-500"}`} />
                                      <span className="font-medium text-gray-900">{emp.name.fullname}</span>

                                      {emp.is_freelance && (
                                        <span className="ml-2 px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs flex items-center gap-1">
                                          <Briefcase className="h-3 w-3" /> Freelance
                                        </span>
                                      )}

                                      {emp.is_present === false && emp.end_date && (
                                        <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs flex items-center gap-1">
                                          <X className="h-3 w-3" /> Left
                                        </span>
                                      )}
                                    </div>

                                    {/* --- Company --- */}
                                    {emp.company_name && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <Building className="h-3 w-3" /> {emp.company_name}
                                      </div>
                                    )}

                                    {/* --- Email --- */}
                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                      <Mail className="h-4 w-4" /> {emp.email}
                                    </div>

                                    {/* --- Role --- */}
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                      <User className="h-3 w-3" /> {emp.role_name}
                                    </div>

                                    {/* --- Phone --- */}
                                    {emp.phone && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                        <Phone className="h-3 w-3" /> {emp.phone}
                                      </div>
                                    )}

                                    {/* --- Position --- */}
                                    {emp.position && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                        <Briefcase className="h-3 w-3" /> {emp.position}
                                      </div>
                                    )}

                                    {/* --- Date of Birth --- */}
                                    {emp.dob && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <Cake className="h-3 w-3" /> {new Date(emp.dob).toLocaleDateString()}
                                      </div>
                                    )}

                                    {/* --- Gender --- */}
                                    {emp.gender && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <UserRound className="h-3 w-3" /> {emp.gender}
                                      </div>
                                    )}

                                    {/* --- Employment Status (is_freelance / is_present) --- */}
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                      {emp.is_freelance !== undefined ? (
                                        <>
                                          <BadgeCheck className="h-3 w-3" />
                                          {emp.is_freelance ? "Freelance" : "Employee"}
                                        </>
                                      ) : emp.is_present !== undefined ? (
                                        <>
                                          <Activity className="h-3 w-3" />
                                          {emp.is_present
                                            ? "Present"
                                            : emp.end_date
                                              ? new Date(emp.end_date).toLocaleDateString()
                                              : ""}
                                        </>
                                      ) : null}
                                    </div>

                                    {/* --- Start Date --- */}
                                    {emp.start_date && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <CalendarClock className="h-3 w-3" /> {new Date(emp.start_date).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                ))}

                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">
                            {ie("noData") || "No uploaded data"}
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDialog(false)}>
                        {co("close") || "Close"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Action Buttons - Full Width Below Grid */}
          <motion.div className="flex justify-between pt-6" variants={itemVariants}>
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              disabled={importing || isImportingEmployee}
            >
              {co("cancel")}
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleImport}
                disabled={!file || importing || isImportingEmployee}
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
                    {ie("importing")}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {ie("importExcelButton")}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
