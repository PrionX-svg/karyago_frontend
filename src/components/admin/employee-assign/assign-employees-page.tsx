"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search, Users, User, Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEmployeeStore } from "@/stores/employee-store"
import { decrypt } from "@/lib/encrypt"
import { api } from "@/lib/api/api"
import { useTranslations } from "next-intl"
import { AssignEmployeeDialog } from "@/components/admin/employee-assign/assignDialog"

export default function AssignEmployeePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [viewType, setViewType] = useState<"card" | "table">("table")
    const [storedUuid, setStoredUuid] = useState<string | null>(null)

    const employeesData = useEmployeeStore((state) => state.employees)
    const em = useTranslations("assignEmployees")

    const filteredEmployees = employeesData.filter((employee) => {
        if (employee.termination) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            employee.name.fullname.toLowerCase().includes(searchLower) ||
            employee.email?.toLowerCase().includes(searchLower) ||
            employee.phone?.toLowerCase().includes(searchLower)
        );
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!storedUuid) return;
            try {
                const decryptedUuid = await decrypt(storedUuid)
                await api.getEmployeeByCompanyUuid(decryptedUuid)
            } catch (error) {
                console.error("Error fetching employees:", error)
            }
        }
        fetchEmployees()
    }, [storedUuid])

    useEffect(() => {
        const uuid = localStorage.getItem("atem")
        setStoredUuid(uuid)
    }, [])

    return (
        <div className="min-h-screen">
            {/* HEADER SECTION */}
            <div>
                <div className="pb-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-xl border">
                                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{em('assignTitle')}</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{em('assignDescription')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{employeesData.length}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{em('totalEmployees')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY SECTION */}
            <div className="pt-3">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <Input
                                placeholder={em('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
                            <Button
                                variant={viewType === "table" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("table")}
                                className={`gap-2 rounded-md ${viewType === "table"
                                    ? "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
                                    }`}
                            >
                                <List className={`w-4 h-4 ${viewType === "table" ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                                {em('viewTable')}
                            </Button>
                            <Button
                                variant={viewType === "card" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("card")}
                                className={`gap-2 rounded-md ${viewType === "card"
                                    ? "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
                                    }`}
                            >
                                <LayoutGrid className={`w-4 h-4 ${viewType === "card" ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                                {em('viewCards')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {filteredEmployees.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{em('noEmployeesFoundTitle')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{em('noEmployeesFoundDesc')}</p>
                        <Button onClick={() => setSearchTerm("")} variant="outline" className="rounded-lg">
                            {em('clearSearch')}
                        </Button>
                    </div>
                ) : viewType === "card" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...filteredEmployees]
                            .sort((a, b) => {
                                if (a.subDivision?.name && !b.subDivision?.name) return -1;
                                if (!a.subDivision?.name && b.subDivision?.name) return 1;
                                return 0;
                            })
                            .map((employee) => (
                                <Card
                                    key={employee.employee_uuid}
                                    className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-300 group overflow-hidden"
                                >
                                    <CardHeader className="relative px-5 py-4">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900 dark:to-transparent rounded-full opacity-40 -mr-12 -mt-12 pointer-events-none"></div>

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-lg border border-orange-200 dark:border-orange-900 group-hover:from-orange-100 group-hover:to-orange-200 dark:group-hover:from-orange-950 dark:group-hover:to-orange-900 transition-colors shadow-sm">
                                                    <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-900 dark:group-hover:text-orange-300 transition-colors">
                                                        {employee.name.fullname || em('unassigned')}
                                                    </CardTitle>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{employee.email}</p>
                                                </div>
                                            </div>
                                            {employee.subDivision?.name ? (
                                                <AssignEmployeeDialog employee={employee} mode="remove" storedUuid={storedUuid} />
                                            ) : (
                                                <AssignEmployeeDialog employee={employee} mode="assign" storedUuid={storedUuid} />
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-4 space-y-3">
                                        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
                                                    {em("department")}
                                                </span>
                                            </div>
                                            {employee.subDivision?.name ? (
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {employee.subDivision.name}
                                                </span>
                                            ) : (
                                                <span className="italic text-sm text-neutral-400 dark:text-neutral-500">
                                                    {em("unassigned")}
                                                </span>
                                            )}
                                        </div>

                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100 first:rounded-tl-xl">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                {em('employeeName')}
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                                            {em('employeeEmail')}
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                                            {em('employeePhone')}
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                                            {em('freelanceStatus')}
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                                            {em('department')}
                                        </th>
                                        <th className="text-right py-4 px-6 font-bold text-gray-900 dark:text-gray-100 last:rounded-tr-xl">
                                            {em('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...filteredEmployees]
                                        .sort((a, b) => {
                                            if (a.subDivision?.name && !b.subDivision?.name) return -1;
                                            if (!a.subDivision?.name && b.subDivision?.name) return 1;
                                            return 0;
                                        })
                                        .map((employee, index) => (
                                            <tr
                                                key={employee.employee_uuid}
                                                className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-gray-50/30 dark:bg-neutral-800/50"
                                                    }`}
                                            >
                                                <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">{employee.name.fullname}</td>
                                                <td className="py-4 px-6 text-gray-900 dark:text-gray-100">{employee.email}</td>
                                                <td className="py-4 px-6 text-gray-900 dark:text-gray-100">{employee.phone}</td>
                                                <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                                                    {employee.is_freelance ? em('freelance') : em('employee')}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {employee.subDivision?.name ? (
                                                        <span className="text-gray-900 dark:text-gray-100">{employee.subDivision.name}</span>
                                                    ) : (
                                                        <span className="italic text-neutral-400 dark:text-neutral-500">{em('unassigned')}</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 flex justify-end">
                                                    {employee.subDivision?.name ? (
                                                        <AssignEmployeeDialog employee={employee} mode="remove" storedUuid={storedUuid} />
                                                    ) : (
                                                        <AssignEmployeeDialog employee={employee} mode="assign" storedUuid={storedUuid} />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
