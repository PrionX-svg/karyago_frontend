"use client"

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

interface DeleteConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
}

export default function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-white/95 backdrop-blur-sm border-red-200">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-red-900">{title}</DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground mt-2">{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-200 hover:bg-gray-50 bg-transparent"
                    >
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
