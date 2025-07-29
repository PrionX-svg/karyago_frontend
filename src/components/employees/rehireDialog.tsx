"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { EmployeeType } from "@/lib/types/employee-type"
import { decrypt } from "@/lib/encrypt"
import { api } from "@/lib/api/api"

interface RehireEmployeeDialogProps {
    employeeData: EmployeeType
    triggerLabel?: string
}

export function RehireEmployeeDialog({
    employeeData,
    triggerLabel = "Rehire Employee",
}: RehireEmployeeDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const storedUuid = localStorage.getItem("atem")

    const isConfirmed = confirmText.trim() === employeeData.email.trim()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!storedUuid) return
        setLoading(true)
        try {
            const decryptedCompanyUuid = await decrypt(storedUuid)
            api.rehireUser(employeeData.user_uuid, decryptedCompanyUuid)
                .then(() => {
                    toast.success("Employee rehired successfully")
                    setOpen(false)
                })
                .catch((error) => {
                    toast.error(`Failed to rehire employee: ${error.message}`)
                })
        } catch (error) {
            console.error("Failed to rehire employee", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger button */}
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {triggerLabel}
                </Button>
            </DialogTrigger>

            {/* Dialog content */}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-700">
                        <RefreshCw className="w-5 h-5" />
                        Rehire Employee
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <p className="text-sm text-gray-600">
                        Apakah Anda yakin ingin merekrut kembali <b>{employeeData.email}</b>? <br />
                        Harap ketik nama/email karyawan untuk konfirmasi.
                    </p>

                    <div className="space-y-2">
                        <Label>Konfirmasi Nama/Email</Label>
                        <Input
                            placeholder={`Ketik: ${employeeData.email}`}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isConfirmed || loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Rehire
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
