"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search, Users, Mail, Phone, Briefcase, User, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEmployeeStore } from "@/stores/employee-store"
import { EmployeesDialog } from "@/components/employees/employeesDialog"
import { decrypt } from "@/lib/encrypt"
import { api } from "@/lib/api/api"
import TerminateEmployeeDialog from "@/components/employees/terminate-employee"
import { EmployeeType } from "@/lib/types/employee-type"
import { toast } from "sonner"

export default function EmployeePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [viewType, setViewType] = useState<"card" | "table">("table")
    const [showTerminated, setShowTerminated] = useState(false)
    const [isTerminateOpen, setIsTerminateOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null)

    const employeesData = useEmployeeStore((state) => state.employees)
    const storedUuid = localStorage.getItem("atem")

    const handleDeleteClick = (employee: EmployeeType) => {
        setSelectedEmployee(employee)
        setIsTerminateOpen(true)
    }

    const handleConfirmTerminate = async (reason: string) => {
        if (!selectedEmployee || !storedUuid) return
        try {
            const decryptedCompanyUuid = await decrypt(storedUuid)
            await api.deleteUser(selectedEmployee.user_uuid, decryptedCompanyUuid, reason)
                .then(() => toast.success("Employee terminated successfully"))
                .catch((error) => toast.error(`Failed to terminate employee: ${error.message}`))
        } catch (error) {
            console.error("Failed to terminate employee", error);
        } finally {
            setIsTerminateOpen(false);
            setSelectedEmployee(null);
        }
    }

    const filteredEmployees = employeesData.filter((employee) => {
        // Exclude employees with a termination object
        if (employee.termination) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            employee.name.fullname.toLowerCase().includes(searchLower) ||
            employee.email?.toLowerCase().includes(searchLower) ||
            employee.phone?.toLowerCase().includes(searchLower)
        );
    });
    const terminatedEmployees = employeesData.filter(e => e.termination && e.termination.reason && e.termination.date)


    useEffect(() => {
        const fetchDivisions = async () => {
            if (!storedUuid) return;
            try {
                const decryptedUuid = decrypt(storedUuid)
                await api.getEmployeeByCompanyUuid(await decryptedUuid)
            } catch (error) {
                console.error("Error fetching divisions:", error)
            }
        }
        fetchDivisions()
    }, [storedUuid])

    return (
        <div className="min-h-screen">
            {/* HEADER SECTION */}
            <div className="bg-white">
                <div className="pb-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-purple-200">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                                <p className="text-gray-600 mt-1">Organize and manage your employees</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{employeesData.length}</p>
                                <p className="text-sm text-gray-500">Total Employees</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY SECTION */}
            <div className="pt-3">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search divisions, descriptions, or responsible person..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowTerminated((prev) => !prev)}
                            variant="outline"
                        >
                            {showTerminated ? "Hide Terminated Employees" : "Show Terminated Employees"}
                        </Button>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={viewType === "table" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("table")}
                                className={`gap-2 rounded-md ${viewType === "table"
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <List className={`w-4 h-4 ${viewType === "table" ? "text-white" : "text-gray-500"}`} />
                                Table
                            </Button>
                            <Button
                                variant={viewType === "card" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("card")}
                                className={`gap-2 rounded-md ${viewType === "card"
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <LayoutGrid className={`w-4 h-4 ${viewType === "card" ? "text-white" : "text-gray-500"}`} />
                                Cards
                            </Button>
                        </div>
                        <EmployeesDialog mode="create" />
                    </div>
                </div>

                {/* Content Area */}
                {filteredEmployees.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-600 mb-4">No employees match your search criteria.</p>
                        <Button onClick={() => setSearchTerm("")} variant="outline" className="rounded-lg">
                            Clear Search
                        </Button>
                    </div>
                ) : viewType === "card" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredEmployees.map((employee) => (
                            <Card
                                key={employee.employee_uuid}
                                className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-200 transition-all duration-300 group overflow-hidden"
                            >
                                <CardHeader className="pb-4 relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent rounded-full opacity-60 -mr-12 -mt-12"></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 group-hover:from-orange-100 group-hover:to-orange-200 transition-colors">
                                                <User className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-orange-900 transition-colors">
                                                    {employee.name.fullname}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500 mt-1">{employee.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm text-neutral-400">{employee.phone || <span className="italic text-neutral-400">No phone</span>}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-gray-900">{employee.is_freelance ? "Freelance" : "Employee"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <th className="text-left py-4 px-6 font-bold text-gray-900 first:rounded-tl-xl">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Employee Name
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Employee Email
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Employee Phone
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-bold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                Freelance Status
                                            </div>
                                        </th>
                                        <th className="text-right py-4 px-6 font-bold text-gray-900 last:rounded-tr-xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee, index) => (
                                        <tr
                                            key={employee.employee_uuid}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{employee.name.fullname}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-900">{employee.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-900">{employee.phone}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-900">{employee.is_freelance ? "Freelance" : "Employee"}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end gap-2">
                                                    <EmployeesDialog mode="edit" employeeData={employee} />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(employee)}
                                                        className="h-8 w-8 rounded-lg"
                                                    >
                                                        <Trash className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <TerminateEmployeeDialog
                    isOpen={isTerminateOpen}
                    onClose={() => setIsTerminateOpen(false)}
                    onConfirm={handleConfirmTerminate}
                    employeeNameOrEmail={selectedEmployee?.email || ""}
                />
                {/* Terminated Employees Section */}
                {showTerminated && terminatedEmployees.length > 0 && (
                    <div className="mt-8">
                        {/* Section Separator for Terminated Employees */}
                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="mx-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">
                                Terminated Employees
                            </span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        {viewType === "table" ? (
                            <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden shadow-inner opacity-75">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-gray-300">
                                                <th className="text-left py-3 px-5 font-bold text-gray-800">Name</th>
                                                <th className="text-left py-3 px-5 font-bold text-gray-800">Email</th>
                                                <th className="text-left py-3 px-5 font-bold text-gray-800">Termination Date</th>
                                                <th className="text-left py-3 px-5 font-bold text-gray-800">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {terminatedEmployees.map((employee) => (
                                                <tr key={employee.employee_uuid} className="border-t border-gray-200 bg-gray-100">
                                                    <td className="py-3 px-5 text-gray-600">{employee.name.fullname}</td>
                                                    <td className="py-3 px-5 text-gray-600">{employee.email}</td>
                                                    <td className="py-3 px-5 text-gray-600">
                                                        {new Date(employee.termination?.date || "").toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-5 text-gray-600 italic">
                                                        {employee.termination?.reason}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {terminatedEmployees.map((employee) => (
                                    <Card
                                        key={employee.employee_uuid}
                                        className="bg-gray-50 border border-gray-300 rounded-xl shadow-inner opacity-75 group overflow-hidden"
                                    >
                                        <CardHeader className="pb-4 relative">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-60 -mr-12 -mt-12"></div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-300">
                                                        <User className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg font-bold text-gray-800">
                                                            {employee.name.fullname}
                                                        </CardTitle>
                                                        <p className="text-sm text-gray-500 mt-1">{employee.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">Terminated</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(employee.termination?.date || "").toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-600 italic">
                                                    Reason: {employee.termination?.reason}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}