"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import company from "@/lib/queries/company-queries";
import { decrypt } from "@/lib/encrypt";
import { useCompanyStore } from "@/stores/company-store";
import {
  Building2,
  Edit3,
  ExternalLink,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { AddBranchDialog } from "@/components/admin/branch/add-branch-dialog";
import { UpdateBranchDialog } from "@/components/admin/branch/update-branch-dialog";
import { CompanyBranchType } from "@/lib/types/company-type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function BranchPage() {
  const t = useTranslations("branchPage");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<CompanyBranchType | null>(null);
  const { deleteBranch, isDeletingBranch } = company.useDeleteBranch(branchToDelete?.uuid || "");

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    try {
      await deleteBranch();
      setDeleteDialogOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const [decryptedUuid, setDecryptedUuid] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  // Dialog states
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    image: null as string | null,
  });
  const [updateForm, setUpdateForm] = useState({
    branchUuid: "",
    companyUuid: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    image: null as string | null,
  });

  const { createBranch } = company.useCreateBranch({
    company_uuid: decryptedUuid,
    name: form.name,
    address: form.address,
    email: form.email,
    phone: form.phone,
    image: form.image || "",
  });

  const { updateBranch, isUpdatingBranch } = company.useUpdateBranch(updateForm.branchUuid);
  const { isFetchingBranches } = company.useGetBranchesByCompanyUuid(decryptedUuid);
  const companyBranches = useCompanyStore((state) => state.companyBranch);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setForm({ name: "", address: "", email: "", phone: "", image: null });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createBranch();
      setOpen(false);
      setForm({ name: "", address: "", email: "", phone: "", image: null });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBranch = (branch: CompanyBranchType) => {
    setUpdateForm({
      branchUuid: branch.uuid,
      companyUuid: branch.company.uuid,
      name: branch.name,
      address: branch.address,
      email: branch.email,
      phone: branch.phone,
      image: branch.image || null,
    });
    setUpdateOpen(true);
  };

  const handleUpdateInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUpdateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>, image: string) => {
    e.preventDefault();
    try {
      await updateBranch({
        company_uuid: updateForm.companyUuid,
        name: updateForm.name,
        address: updateForm.address,
        email: updateForm.email,
        phone: updateForm.phone,
        image: image || "",
      });
      setUpdateOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setHasMounted(true);
      const uuid = localStorage.getItem("atem");
      if (uuid) {
        const decrypted = await decrypt(uuid);
        setDecryptedUuid(decrypted);
      }
    };
    fetchData();
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {t("description")}
            </p>
            {companyBranches.length > 0 && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {companyBranches.length} active{" "}
                {companyBranches.length === 1 ? "branch" : "branches"}
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            <AddBranchDialog
              open={open}
              setOpen={handleDialogOpenChange}
              form={form}
              setForm={setForm}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isFetchingBranches ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-md border-0 bg-white dark:bg-slate-800">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </Card>
            ))
          ) : companyBranches.length > 0 ? (
            companyBranches.map((branch) => (
              <Card
                key={branch.uuid}
                className="group overflow-hidden bg-card rounded-xl border border-gray-200 dark:border-stone-700 transition-all hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative">
                  {branch.image ? (
                    <Image
                      src={branch.image || "/placeholder.png"}
                      alt={branch.name}
                      width={500}
                      height={300}
                      className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      <ImageIcon className="h-10 w-10 text-slate-400" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  {/* Desktop: overlay on hover */}
                  <div
                    className="
                        hidden sm:flex absolute top-3 right-3 gap-2 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200
                      "
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEditBranch(branch)}
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-stone-800 dark:hover:bg-stone-700 shadow-sm"
                    >
                      <Edit3 className="h-4 w-4 text-gray-600" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setBranchToDelete(branch);
                        setDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0 shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile: always visible below image */}
                  <div className="flex sm:hidden justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-stone-700 bg-white dark:bg-stone-900">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBranch(branch)}
                      className="flex-1 text-sm"
                    >
                      <Edit3 className="w-4 h-4 mr-1" /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setBranchToDelete(branch);
                        setDeleteDialogOpen(true);
                      }}
                      className="flex-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>

                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {branch.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                        {branch.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <p className="truncate text-slate-600 dark:text-slate-300">{branch.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <p className="text-slate-600 dark:text-slate-300">{branch.phone}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 transition-colors"
                    >
                      View on Maps
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-10 text-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                <div className="space-y-5">
                  <Building2 className="h-12 w-12 mx-auto text-slate-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      No branches yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Start building your presence by adding your first branch.
                    </p>
                  </div>
                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Branch
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{branchToDelete?.name}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeletingBranch}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBranch}
              disabled={isDeletingBranch}
              className="flex-1"
            >
              {isDeletingBranch ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <UpdateBranchDialog
        open={updateOpen}
        setOpen={setUpdateOpen}
        form={updateForm}
        setForm={setUpdateForm}
        handleInput={handleUpdateInput}
        handleSubmit={handleUpdateSubmit}
        isUpdating={isUpdatingBranch}
      />
    </>
  );
}
