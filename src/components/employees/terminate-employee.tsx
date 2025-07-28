"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TerminateEmployeeDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    employeeNameOrEmail: string
}

export default function TerminateEmployeeDialog({
    isOpen,
    onClose,
    onConfirm,
    employeeNameOrEmail,
}: TerminateEmployeeDialogProps) {
    const [reason, setReason] = useState("")
    const [confirmText, setConfirmText] = useState("")

    const isConfirmed = confirmText.trim() === employeeNameOrEmail.trim()

    const handleConfirm = () => {
        if (isConfirmed && reason.trim()) {
            onConfirm(reason)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-red-200">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-red-900">
                                Terminate Employee
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground mt-2">
                        Anda yakin ingin mengakhiri hubungan kerja dengan <b>{employeeNameOrEmail}</b>?
                        Tindakan ini tidak dapat dibatalkan.
                        Harap masukkan nama/email karyawan dan alasan penghentian untuk melanjutkan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Alasan</Label>
                        <Input
                            placeholder="Masukkan alasan penghentian..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Konfirmasi Nama/Email</Label>
                        <Input
                            placeholder={`Ketik: ${employeeNameOrEmail}`}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-200 hover:bg-gray-50 bg-transparent"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!isConfirmed || !reason.trim()}
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Terminate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
