"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import type React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  List,
  Search,
  Users,
  Mail,
  Phone,
  Briefcase,
  User,
  Trash,
  Upload,
  Download,
  CheckCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEmployeeStore } from "@/stores/employee-store";
import { EmployeesDialog } from "@/components/employees/employeesDialog";
import { decrypt } from "@/lib/encrypt";
import { api } from "@/lib/api/api";
import TerminateEmployeeDialog from "@/components/employees/terminate-employee";
import type { EmployeeType } from "@/lib/types/employee-type";
import { toast } from "sonner";
import { RehireEmployeeDialog } from "@/components/employees/rehireDialog";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import employee from "@/lib/queries/employee-queries";
import { useUserStore } from "@/stores/user-store";

export default function EmployeePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"card" | "table">("table");
  const [showTerminated, setShowTerminated] = useState(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null
  );
  const [storedUuid, setStoredUuid] = useState<string | null>(null);

  // Import functionality states
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [showImportedDataDialog, setShowImportedDataDialog] = useState(false);
  const [importedData, setImportedData] = useState<EmployeeType[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userData = useUserStore((state) => state.user);

  const em = useTranslations("employees");
  const ap = useTranslations("api");

  const employeesData = useEmployeeStore((state) => state.employees);
  const terminatedEmployees = useEmployeeStore(
    (state) => state.terminatedEmployees
  );

  const { exportExcel, isExportingExcel } = employee.useExportExcel();
  const { importEmployee, isImportingEmployee } = employee.useImportEmployee();

  const handleDeleteClick = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsTerminateOpen(true);
  };

  const handleConfirmTerminate = async (reason: string) => {
    if (!selectedEmployee || !storedUuid) return;
    try {
      const decryptedCompanyUuid = await decrypt(storedUuid);
      await api
        .terminateUser(selectedEmployee.user_uuid, decryptedCompanyUuid, reason)
        .then(() => toast.success("Employee terminated successfully"))
        .catch((error) =>
          toast.error(`Failed to terminate employee: ${error.message}`)
        );
    } catch (error) {
      console.error("Failed to terminate employee", error);
    } finally {
      setIsTerminateOpen(false);
      setSelectedEmployee(null);
    }
  };

  // Import functionality handlers
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type.includes("sheet") ||
        droppedFile.name.endsWith(".xlsx") ||
        droppedFile.name.endsWith(".xls")
      ) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (): Promise<void> => {
    if (!file || !storedUuid) return;
    setImporting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_uuid", storedUuid);
    formData.append("role_uuid", userData.role.uuid);

    importEmployee(formData)
      .then((data) => {
        toast.success(ap("importSuccess"));
        setFile(null);
        if (data) {
          setImportedData(data);
          setShowImportedDataDialog(true);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || ap("importError") || "Import failed";
        toast.error(errorMessage);
      })
      .finally(() => {
        setImporting(false);
      });
  };

  const downloadTemplate = (): void => {
    exportExcel(storedUuid || "");
  };

  const resetFile = (): void => {
    setFile(null);
  };

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
    const uuid = localStorage.getItem("atem");
    const decryptUuid = async () => {
      if (!uuid) return;
      try {
        const decryptedUuid = await decrypt(uuid);
        setStoredUuid(decryptedUuid);
      } catch (error) {
        console.error("Error decrypting UUID:", error);
      }
    };
    decryptUuid().catch((error) =>
      console.error("Failed to decrypt UUID:", error)
    );
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!storedUuid) return;
      try {
        await api.getEmployeeByCompanyUuid(storedUuid);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchEmployees();
  }, [storedUuid]);

  return (
    <div>
      <div>
        <div className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {em("title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {em("description")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {employeesData.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {em("totalEmployees")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="pt-3">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder={em("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {terminatedEmployees.length > 0 && (
              <Button
                onClick={() => setShowTerminated((prev) => !prev)}
                variant="outline"
                className="dark:bg-neutral-900 dark:text-gray-100"
              >
                {showTerminated ? em("hideTerminated") : em("showTerminated")}
              </Button>
            )}

            {/* Import from Excel Button */}
            <Button
              onClick={() => setShowImportDialog(true)}
              variant="outline"
              className="gap-2 dark:bg-neutral-900 dark:text-gray-100 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Upload className="w-4 h-4" />
              Import Employees
            </Button>

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
                <List
                  className={`w-4 h-4 ${viewType === "table"
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400"
                    }`}
                />
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
                <LayoutGrid
                  className={`w-4 h-4 ${viewType === "card"
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400"
                    }`}
                />
              </Button>
            </div>
            <EmployeesDialog mode="create" />
          </div>
        </div>

        {/* Content Area */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {em("noEmployeesFoundTitle")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {em("noEmployeesFoundDesc")}
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="rounded-lg dark:bg-neutral-900 dark:text-gray-100"
            >
              {em("clearSearch")}
            </Button>
          </div>
        ) : viewType === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card
                key={employee.employee_uuid}
                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-600 transition-all duration-300 group overflow-hidden"
              >
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900 dark:to-transparent rounded-full opacity-60 -mr-12 -mt-12"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-xl border border-orange-200 dark:border-orange-800 group-hover:from-orange-100 group-hover:to-orange-200 dark:group-hover:from-orange-800 dark:group-hover:to-orange-900 transition-colors">
                        <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-900 dark:group-hover:text-orange-300 transition-colors">
                          {employee.name.fullname}
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <EmployeesDialog mode="edit" employeeData={employee} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(employee)}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Trash className="w-4 h-4 text-red-500 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm text-neutral-400 dark:text-neutral-300">
                        {employee.phone || (
                          <span className="italic text-neutral-400 dark:text-neutral-500">
                            No phone
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {employee.is_freelance
                          ? em("freelance")
                          : em("employee")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100 first:rounded-tl-xl">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {em("employeeName")}
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {em("employeeEmail")}
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {em("employeePhone")}
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {em("freelanceStatus")}
                      </div>
                    </th>
                    <th className="text-right py-4 px-6 font-bold text-gray-900 dark:text-gray-100 last:rounded-tr-xl">
                      {em("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <tr
                      key={employee.employee_uuid}
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${index % 2 === 0
                        ? "bg-white dark:bg-neutral-900"
                        : "bg-gray-50/30 dark:bg-neutral-800/30"
                        }`}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {employee.name.fullname}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-900 dark:text-gray-100">
                          {employee.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-900 dark:text-gray-100">
                          {employee.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-900 dark:text-gray-100">
                          {employee.is_freelance
                            ? em("freelance")
                            : em("employee")}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <EmployeesDialog
                            mode="edit"
                            employeeData={employee}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(employee)}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Trash className="w-4 h-4 text-red-500 dark:text-red-400" />
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
              <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
              <span className="mx-4 text-gray-500 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider">
                {em("terminatedSectionTitle")}
              </span>
              <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            </div>
            {viewType === "table" ? (
              <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner opacity-75">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-neutral-800 border-b border-gray-300 dark:border-gray-700">
                        <th className="text-left py-3 px-5 font-bold text-gray-800 dark:text-gray-100">
                          {em("employeeName")}
                        </th>
                        <th className="text-left py-3 px-5 font-bold text-gray-800 dark:text-gray-100">
                          {em("employeeEmail")}
                        </th>
                        <th className="text-left py-3 px-5 font-bold text-gray-800 dark:text-gray-100">
                          {em("terminationDate")}
                        </th>
                        <th className="text-left py-3 px-5 font-bold text-gray-800 dark:text-gray-100">
                          {em("reason")}
                        </th>
                        <th className="text-left py-3 px-5 font-bold text-gray-800 dark:text-gray-100">
                          {em("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {terminatedEmployees.map((employee) => (
                        <tr
                          key={employee.employee_uuid}
                          className="border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-neutral-800"
                        >
                          <td className="py-3 px-5 text-gray-600 dark:text-gray-300">
                            {employee.name.fullname}
                          </td>
                          <td className="py-3 px-5 text-gray-600 dark:text-gray-300">
                            {employee.email}
                          </td>
                          <td className="py-3 px-5 text-gray-600 dark:text-gray-300">
                            {new Date(
                              employee.termination?.date || ""
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-5 text-gray-600 dark:text-gray-300 italic">
                            {employee.termination?.reason}
                          </td>
                          <td className="py-3 px-5">
                            <RehireEmployeeDialog employeeData={employee} />
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
                    className="bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-inner opacity-75 group overflow-hidden"
                  >
                    <CardHeader className="pb-4 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent dark:from-neutral-800 dark:to-transparent rounded-full opacity-60 -mr-12 -mt-12"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-gray-300 dark:border-gray-700">
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
                              {employee.name.fullname}
                            </CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {em("terminated")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(
                              employee.termination?.date || ""
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-300 italic">
                          {em("reason")}: {employee.termination?.reason}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <RehireEmployeeDialog employeeData={employee} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-600" />
              Import Employees from Excel
            </DialogTitle>
            <DialogDescription>
              Upload an Excel file to import multiple employees at once
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Download Template Section */}
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Download Template
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get the Excel template with the correct format
                </p>
              </div>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                disabled={isExportingExcel}
                className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
                : file
                  ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      MB
                    </p>
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
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Drop your Excel file here
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Supports .xlsx and .xls files
                    </p>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={openFileExplorer}>
                      Browse Files
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Import Rules */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Import Rules
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-4">
                <li>Make sure all required fields are filled</li>
                <li>Email addresses must be unique and valid</li>
                <li>Phone numbers should be in correct format</li>
                <li>Date of birth should be in YYYY-MM-DD format</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || importing || isImportingEmployee}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {importing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Imported Data Success Dialog */}
      <Dialog
        open={showImportedDataDialog}
        onOpenChange={setShowImportedDataDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Import Successful
            </DialogTitle>
            <DialogDescription>
              The following employees have been successfully imported
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] w-full pr-2">
            <div className="space-y-4">
              {importedData.length > 0 ? (
                importedData.map((employee, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {employee.name?.fullname || "Unknown Name"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {employee.email}
                      </p>
                      {employee.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {employee.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No import data available
                </p>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              onClick={() => setShowImportedDataDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
