"use client"

import { CheckCircle, Plus, Upload, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpFooter } from "../layout/help-footer"
import { motion } from "framer-motion"
import { useCompanyStore } from "@/stores/company-store"
import Link from "next/link"
import { useEffect, useState } from "react"
import { decrypt } from "@/lib/encrypt"
import company from "@/lib/queries/company-queries"

interface TeamMembersProps {
    finishOnboarding: () => void
}

export function TeamMembers({ finishOnboarding }: TeamMembersProps) {
    const divisions = useCompanyStore((state) => state.division)
    const subDivision = useCompanyStore((state) => state.subDivision)
    const [resolvedCompanyUuid, setResolvedCompanyUuid] = useState("")
    const storedCompanyUuid = sessionStorage.getItem("meta")

    useEffect(() => {
        if (storedCompanyUuid) {
            decrypt(storedCompanyUuid).then((decryptedUuid) => {
                setResolvedCompanyUuid(decryptedUuid)
            }).catch((error) => {
                console.error("Decryption failed:", error)
                setResolvedCompanyUuid("")
            })
        }
    }, [storedCompanyUuid])

    company.useGetDivisions(resolvedCompanyUuid ?? "")
    company.useGetSubDivisions(resolvedCompanyUuid ?? "")

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
        },
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
                {/* Main Content */}
                <motion.div className="w-full max-w-4xl" variants={itemVariants}>
                    <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Card className="border-0 shadow-xl backdrop-blur-sm">
                            <CardHeader className="pb-6">
                                <motion.div className="text-center space-y-4" variants={itemVariants}>
                                    <motion.div
                                        className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatType: "reverse",
                                        }}
                                    >
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </motion.div>
                                    <div>
                                        <CardTitle className="text-3xl font-bold text-gray-900">Setup Complete!</CardTitle>
                                        <CardDescription className="text-lg mt-2">
                                            Your organizational structure is ready. You can now start adding employees and begin using the
                                            HRIS system.
                                        </CardDescription>
                                    </div>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                {/* Action Cards */}
                                <motion.div
                                    className="grid md:grid-cols-2 gap-6"
                                    variants={itemVariants}
                                >
                                    <motion.div
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            pointerEvents:
                                                divisions.length === 0 ||
                                                    (divisions.length === 1 &&
                                                        subDivision.length === 0)
                                                    ? "none"
                                                    : "auto",
                                            opacity:
                                                divisions.length === 0 ||
                                                    (divisions.length === 1 &&
                                                        subDivision.length === 0)
                                                    ? 0.5
                                                    : 1,
                                        }}
                                    >
                                        <Card className="border-orange-200 hover:border-orange-300 transition-colors cursor-pointer group">
                                            <CardContent className="p-6 text-center space-y-4">
                                                <motion.div
                                                    className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors"
                                                    whileHover={{ rotate: 15 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Plus className="h-8 w-8 text-orange-600" />
                                                </motion.div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900">Add Employee Manually</h3>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Add team members one by one with detailed information
                                                    </p>
                                                </div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Link href="/onboarding/add-employee">
                                                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Employee Now
                                                        </Button>
                                                    </Link>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            pointerEvents:
                                                divisions.length === 0 ||
                                                    (divisions.length === 1 &&
                                                        subDivision.length === 0)
                                                    ? "none"
                                                    : "auto",
                                            opacity:
                                                divisions.length === 0 ||
                                                    (divisions.length === 1 &&
                                                        subDivision.length === 0)
                                                    ? 0.5
                                                    : 1,
                                        }}
                                    >
                                        <Card className="border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
                                            <CardContent className="p-6 text-center space-y-4">
                                                <motion.div
                                                    className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors"
                                                    whileHover={{ y: -5 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Upload className="h-8 w-8 text-blue-600" />
                                                </motion.div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900">Import from Excel</h3>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Upload an Excel file to add multiple employees at once
                                                    </p>
                                                </div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Import from Excel
                                                    </Button>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>

                                {/* Navigation */}
                                <motion.div className="flex justify-between pt-6" variants={itemVariants}>
                                    <div />
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" onClick={finishOnboarding} className="bg-green-600 hover:bg-green-700 text-white px-8">
                                            Complete Setup
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
            <HelpFooter />
        </motion.div>
    )
}
