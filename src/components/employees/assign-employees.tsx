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
            await api.assignEmployeeToSubDivision(employee.user_uuid, parsed)
            .then(() => {
                toast.success("Employee assigned successfully!");
            })
            .catch(() => {
                toast.error("Failed to assign employee.");
            });
        } else {
            await api.removeEmployeeFromSubDivision(employee.user_uuid, employee.subDivision!.uuid)
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
                <Button variant={mode === "assign" ? "outline" : "destructive"} size="sm" className="rounded-lg">
                    {t(mode === "assign" ? "assignButton" : "removeButton")}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t(mode === "assign" ? "assignTitle" : "removeTitle", {
                            name: employee.name.fullname,
                            department: employee.subDivision?.name ?? "",
                        })}
                    </DialogTitle>
                    {mode === "assign" && (
                        <p className="text-sm text-gray-600">{t("assignDescription")}</p>
                    )}
                </DialogHeader>

                {mode === "assign" ? (
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Select Department</label>
                            <Select
                                value={selectedSubDivision}
                                onValueChange={(value) => setSelectedSubDivision(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a sub-division..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {subDivisionData.map((subdivision) => (
                                        <SelectItem
                                            key={subdivision.uuid}
                                            value={JSON.stringify({ uuid: subdivision.uuid, name: subdivision.name })}
                                        >
                                            {subdivision.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 mt-2">{t("removeDescription")}</p>
                )}

                <div className="flex justify-end mt-6 gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleAction}
                        variant={mode === "assign" ? "default" : "destructive"}
                        disabled={mode === "assign" && !selectedSubDivision}
                    >
                        {t(mode === "assign" ? "confirmAssign" : "confirmRemove")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
