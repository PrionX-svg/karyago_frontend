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
import { useTranslations } from "next-intl"

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

    const td = useTranslations("terminateDialog")

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-red-200">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <DialogTitle className="text-lg font-semibold text-red-900">
                            {td("title")}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground mt-2">
                        {td("confirmDesc", { email: employeeNameOrEmail })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>{td("reasonLabel")}</Label>
                        <Input
                            placeholder={td("reasonPlaceholder")}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{td("confirmPlaceholder", { email: employeeNameOrEmail })}</Label>
                        <Input
                            placeholder={td("confirmPlaceholder", { email: employeeNameOrEmail })}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {td("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!isConfirmed || !reason.trim()}
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {td("submit")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
