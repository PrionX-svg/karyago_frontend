"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { EmployeeType } from "@/lib/types/employee-type"
import { useTranslations } from "next-intl"
import { useCompanyStore } from "@/stores/company-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api/api"
import { decrypt } from "@/lib/encrypt"
import { toast } from "sonner"

type EmployeeDialogProps = {
    employee: EmployeeType
    mode: "assign" | "remove"
    storedUuid: string | null
}

export function AssignEmployeeDialog({ employee, mode, storedUuid }: EmployeeDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedSubDivision, setSelectedSubDivision] = useState<string>("")
    const t = useTranslations(mode === "assign" ? "assignEmployeeDialog" : "removeEmployeeDialog")
    const subDivisionData = useCompanyStore((state) => state.subDivision)

    const handleAction = async () => {
        if (mode === "assign") {
            const parsed = JSON.parse(selectedSubDivision);
            await api.assignEmployeeToSubDivision(employee.employee_uuid, parsed)
                .then(() => {
                    toast.success("Employee assigned successfully!");
                })
                .catch(() => {
                    toast.error("Failed to assign employee.");
                });
        } else {
            await api.removeEmployeeFromSubDivision(employee.user_uuid)
                .then(() => {
                    toast.success("Employee removed successfully!");
                })
                .catch(() => {
                    toast.error("Failed to remove employee.");
                });
        }
        setOpen(false);
        setSelectedSubDivision("");
    };

    useEffect(() => {
        const fetchSubDivisions = async () => {
            if (!storedUuid || !open || mode !== "assign") return;

            try {
                const companyUuid = decrypt(storedUuid);
                await api.getSubDivisionsByCompanyUuid(await companyUuid);
            } catch (error) {
                console.error("Failed to fetch sub-divisions:", error);
            }
        };

        fetchSubDivisions();
    }, [storedUuid, open, mode]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={mode === "assign" ? "outline" : "destructive"}
                    size="sm"
                    className={`rounded-lg ${
                        mode === "remove"
                            ? "dark:bg-red-700 dark:text-white"
                            : "dark:bg-zinc-800 dark:text-white"
                    }`}
                >
                    {t(mode === "assign" ? "assignButton" : "removeButton")}
                </Button>
            </DialogTrigger>

            <DialogContent className="dark:bg-zinc-900 dark:text-white">
                <DialogHeader>
                    <DialogTitle>
                        {t(mode === "assign" ? "assignTitle" : "removeTitle", {
                            name: employee.name.fullname,
                            department: employee.subDivision?.name ?? "",
                        })}
                    </DialogTitle>
                    {mode === "assign" && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("assignDescription")}</p>
                    )}
                </DialogHeader>

                {mode === "assign" ? (
                    <div className="space-y-4 mt-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("selectDepartment")}</label>
                            <Select
                                value={selectedSubDivision}
                                onValueChange={(value) => setSelectedSubDivision(value)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 dark:text-white w-full">
                                    <SelectValue placeholder={t("selectDepartmentPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-800 dark:text-white">
                                    {subDivisionData.map((subdivision) => (
                                        <SelectItem
                                            key={subdivision.uuid}
                                            value={JSON.stringify({ uuid: subdivision.uuid, name: subdivision.name })}
                                            className="dark:bg-zinc-800 dark:text-white"
                                        >
                                            {subdivision.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{t("removeDescription")}</p>
                )}

                <div className="flex justify-end mt-6 gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="dark:bg-zinc-700 dark:text-white">
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleAction}
                        variant={mode === "assign" ? "default" : "destructive"}
                        disabled={mode === "assign" && !selectedSubDivision}
                        size = "sm"
                        className={
                            mode === "remove"
                                ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                                : "dark:text-white"
                        }
                    >
                        {t(mode === "assign" ? "confirmAssign" : "confirmRemove")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
