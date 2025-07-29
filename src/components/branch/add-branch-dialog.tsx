import React, { useRef } from "react";
import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileDropUploader from "@/lib/upload-image";

interface AddBranchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: {
    name: string;
    address: string;
    email: string;
    phone: string;
    image?: string | null;
  };
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setForm: (form: any) => void;
}

export function AddBranchDialog({
  open,
  setOpen,
  form,
  handleInput,
  handleSubmit,
  setForm,
}: AddBranchDialogProps) {
  // Track last uploaded image file name to delete on dialog close
  const lastImageRef = useRef<string | null>(null);

  // Update lastImageRef when image changes
  React.useEffect(() => {
    if (form.image) {
      lastImageRef.current = form.image;
    }
  }, [form.image]);

  // Delete uploaded file if dialog is closed without submitting
  const handleOpenChange = async (nextOpen: boolean) => {
    if (!nextOpen && lastImageRef.current) {
      // Only delete if there is an uploaded image
      try {
        // Call the same delete API as FileDropUploader
        const fileName = `branch-images/${lastImageRef.current}`;
        const res = await import("@/lib/api/postAPI").then((m) =>
          m.default({ file_name: fileName }, "/upload/delete")
        );
        if (res.status === 200) {
          setForm((prev: any) => ({ ...prev, image: "" }));
        }
      } catch (e) {
        // Ignore error
      }
      lastImageRef.current = null;
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">Add Branch</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="flex flex-col items-center py-6 px-6 bg-gradient-to-br from-gray-50 to-white dark:from-stone-900 dark:to-stone-950">
          <Building2 size={40} className="mb-2 text-primary" />
          <DialogHeader className="w-full items-center text-center mb-2">
            <DialogTitle className="text-xl font-bold">
              Add New Branch
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Fill in the details to create a new branch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Branch Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Jakarta Office"
                value={form.name}
                onChange={handleInput}
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <Input
                id="address"
                name="address"
                placeholder="e.g. Jl. Sudirman No. 1"
                value={form.address}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. branch@email.com"
                value={form.email}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g. 0812-3456-7890"
                value={form.phone}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Branch Image
              </label>
              <FileDropUploader
                folder="/branch-images"
                onChange={(fileName: string) =>
                  setForm((prev: any) => ({ ...prev, image: fileName }))
                }
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" variant="default" className="w-full">
                Create Branch
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
