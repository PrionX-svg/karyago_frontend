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
            <DialogContent className="sm:max-w-[400px] backdrop-blur-sm ">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-red-900 dark:text-red-200">{title}</DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground mt-2 dark:text-zinc-300">{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-transparent dark:text-zinc-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
