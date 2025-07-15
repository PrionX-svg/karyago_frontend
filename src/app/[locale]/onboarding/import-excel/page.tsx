"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Employee, ImportResult, ImportStatus } from "@/app/[locale]/onboarding/add-employee/page"


interface ImportFromExcelProps {
    onBack: () => void
    onImport: (data: Employee[]) => void
}

export default function ImportFromExcel({ onBack, onImport }: ImportFromExcelProps) {
    const [dragActive, setDragActive] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const [importing, setImporting] = useState<boolean>(false)
    const [importStatus, setImportStatus] = useState<ImportStatus | null>(null)
    const [previewData, setPreviewData] = useState<Employee[]>([])
    const [progress, setProgress] = useState<number>(0)

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

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            if (
                droppedFile.type.includes("spreadsheet") ||
                droppedFile.name.endsWith(".xlsx") ||
                droppedFile.name.endsWith(".xls")
            ) {
                setFile(droppedFile)
                // Simulate preview data
                setPreviewData([
                    {
                        id: "1",
                        firstName: "John",
                        lastName: "Doe",
                        email: "john@company.com",
                        position: "Developer",
                        department: "engineering",
                        startDate: "2024-01-15",
                    },
                    {
                        id: "2",
                        firstName: "Jane",
                        lastName: "Smith",
                        email: "jane@company.com",
                        position: "Designer",
                        department: "marketing",
                        startDate: "2024-01-20",
                    },
                    {
                        id: "3",
                        firstName: "Bob",
                        lastName: "Johnson",
                        email: "bob@company.com",
                        position: "Manager",
                        department: "operations",
                        startDate: "2024-02-01",
                    },
                ])
            }
        }
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            // Simulate preview data
            setPreviewData([
                {
                    id: "1",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@company.com",
                    position: "Developer",
                    department: "engineering",
                    startDate: "2024-01-15",
                },
                {
                    id: "2",
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane@company.com",
                    position: "Designer",
                    department: "marketing",
                    startDate: "2024-01-20",
                },
                {
                    id: "3",
                    firstName: "Bob",
                    lastName: "Johnson",
                    email: "bob@company.com",
                    position: "Manager",
                    department: "operations",
                    startDate: "2024-02-01",
                },
            ])
        }
    }

    const handleImport = async (): Promise<void> => {
        if (!file) return

        setImporting(true)
        setProgress(0)

        try {
            // Simulate import process with progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 300)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 3000))

            clearInterval(progressInterval)
            setProgress(100)

            const result: ImportResult = {
                status: {
                    total: 25,
                    success: 23,
                    errors: 1,
                    warnings: 1,
                },
                errors: [],
                data: previewData,
            }

            setImportStatus(result.status)
            onImport(result.data)
        } catch (error) {
            console.error("Error importing employees:", error)
        } finally {
            setImporting(false)
        }
    }

    const downloadTemplate = (): void => {
        // Simulate template download
        const link = document.createElement("a")
        link.href = "/employee-template.xlsx"
        link.download = "employee-template.xlsx"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const resetFile = (): void => {
        setFile(null)
        setPreviewData([])
        setImportStatus(null)
        setProgress(0)
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
                    {/* Header */}
                    <motion.div className="mb-8" variants={itemVariants}>
                        <Button variant="ghost" onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Setup
                        </Button>
                        <div className="text-center">
                            <motion.div
                                className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4"
                                animate={{
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            >
                                <FileSpreadsheet className="h-8 w-8 text-orange-600" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900">Import from Excel</h1>
                            <p className="text-gray-600 mt-2">Upload an Excel file to add multiple employees at once</p>
                        </div>
                    </motion.div>

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

                        {/* Preview Data */}
                        {previewData.length > 0 && (
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-gray-900">Data Preview</CardTitle>
                                        <CardDescription>Preview of the first 3 rows from your Excel file</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-2 font-semibold">First Name</th>
                                                        <th className="text-left p-2 font-semibold">Last Name</th>
                                                        <th className="text-left p-2 font-semibold">Email</th>
                                                        <th className="text-left p-2 font-semibold">Position</th>
                                                        <th className="text-left p-2 font-semibold">Department</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {previewData.map((row, index) => (
                                                        <motion.tr
                                                            key={row.id || index}
                                                            className="border-b hover:bg-gray-50"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <td className="p-2">{row.firstName}</td>
                                                            <td className="p-2">{row.lastName}</td>
                                                            <td className="p-2">{row.email}</td>
                                                            <td className="p-2">{row.position}</td>
                                                            <td className="p-2">{row.department}</td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Import Progress */}
                        {importing && (
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="text-center space-y-4">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                            >
                                                <Upload className="h-8 w-8 text-orange-600 mx-auto" />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Importing employees...</p>
                                                <p className="text-sm text-gray-600">Please wait while we process your file</p>
                                            </div>
                                            <Progress value={progress} className="w-full max-w-md mx-auto" />
                                            <p className="text-sm text-gray-500">{progress}% complete</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Import Results */}
                        {importStatus && (
                            <motion.div variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-gray-900 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                            Import Complete
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-900">{importStatus.total}</div>
                                                <div className="text-sm text-gray-600">Total Records</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">{importStatus.success}</div>
                                                <div className="text-sm text-gray-600">Successful</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-red-600">{importStatus.errors}</div>
                                                <div className="text-sm text-gray-600">Errors</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-600">{importStatus.warnings}</div>
                                                <div className="text-sm text-gray-600">Warnings</div>
                                            </div>
                                        </div>

                                        {importStatus.errors > 0 && (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    Some records could not be imported due to validation errors. Please check the error report for
                                                    details.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

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
