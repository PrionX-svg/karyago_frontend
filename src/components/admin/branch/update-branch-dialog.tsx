import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import FileUploader from "./FileUploader";
import { Building2 } from "lucide-react";

interface UpdateBranchForm {
  branchUuid: string
  companyUuid: string
  name: string
  address: string
  email: string
  phone: string
  image: string | null
}

interface UpdateBranchDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: UpdateBranchForm
  setForm: React.Dispatch<React.SetStateAction<UpdateBranchForm>>
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, image: string) => void
  isUpdating: boolean
}


export function UpdateBranchDialog({
  open,
  setOpen,
  form,
  handleInput,
  handleSubmit,
  setForm,
  isUpdating,
}: UpdateBranchDialogProps) {
  const t = useTranslations('branchPage');
  // File state for deferred upload
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    form.image || null
  );

  React.useEffect(() => {
    if (open) {
      setPreviewUrl(form.image || null);
      setSelectedFile(null);
    }
  }, [open, form.image]);

  // When file is selected, update preview only (not form.image)
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setForm((prev: any) => ({ ...prev, image: "" }));
    }
  };

  // On dialog close, reset file state
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedFile(null);
      setPreviewUrl(form.image || null);
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="flex flex-col items-center py-6 px-6 bg-gradient-to-br from-gray-50 to-white dark:from-stone-900 dark:to-stone-950">
          <Building2 size={40} className="mb-2 text-primary" />
          <DialogHeader className="w-full items-center text-center mb-2">
            <DialogTitle className="text-xl font-bold">
              {t("updateBranch")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {t("editBranchDetails")}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              let imageName = form.image || "";
              if (selectedFile) {
                // Upload file before submit (sequential)
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("folder", "branch-images");
                try {
                  // Await the import and upload before continuing
                  const m = await import("@/lib/api/postAPI");
                  const res = await m.default(formData, "/upload/");
                  if (res.status === 200 && res.data?.url?.file_name) {
                    imageName = res.data.url.file_name;
                  }
                } catch {
                  // Optionally show error
                }
              }
              await handleSubmit(e, imageName);
              setSelectedFile(null);
            }}
            className="w-full space-y-4 mt-2"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("branchName")}
              </label>
              <Input
                id="name"
                name="name"
                placeholder={t("branchNamePlaceholder")}
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
                {t("address")}
              </label>
              <Input
                id="address"
                name="address"
                placeholder={t("addressPlaceholder")}
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
                {t("email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
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
                {t("phone")}
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder={t("phonePlaceholder")}
                value={form.phone}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("branchImage")}
              </label>
              <FileUploader
                value={selectedFile ? undefined : form.image || null}
                onChange={handleFileChange}
                previewUrl={previewUrl}
                disabled={isUpdating}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={isUpdating}
              >
                {isUpdating ? t("updating") : t("updateBranchButton")}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
