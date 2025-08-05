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
import { AddBranchDialog } from "@/components/branch/add-branch-dialog";
import { UpdateBranchDialog } from "@/components/branch/update-branch-dialog";
import { CompanyBranchType } from "@/lib/types/company-type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function BranchPage() {
  // Delete Branch Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] =
    useState<CompanyBranchType | null>(null);
  const { deleteBranch, isDeletingBranch } = company.useDeleteBranch(
    branchToDelete?.uuid || ""
  );

  // Handle delete branch
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
  // Dialog state for Add Branch
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    image: null as string | null,
  });

  // Update Branch Dialog state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    branchUuid: "",
    companyUuid: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    image: null as string | null,
  });
  const [selectedBranchUuid, setSelectedBranchUuid] = useState<string | null>(
    null
  );

  // useUpdateBranch hook
  const { updateBranch, isUpdatingBranch } = company.useUpdateBranch(
    updateForm.branchUuid
  );

  // Open update dialog and fill form
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
    setSelectedBranchUuid(branch.uuid);
    setUpdateOpen(true);
  };

  // Handle update form input
  const handleUpdateInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUpdateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle update submit (accepts image from dialog)
  const handleUpdateSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    image: string
  ) => {
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
      setUpdateForm({
        branchUuid: "",
        companyUuid: "",
        name: "",
        address: "",
        email: "",
        phone: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Reset form when dialog closes
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setForm({ name: "", address: "", email: "", phone: "", image: null });
    }
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // For now, only send image name or empty string; adapt as needed for backend
  const { createBranch, isCreatingBranch } = company.useCreateBranch({
    company_uuid: decryptedUuid,
    name: form.name,
    address: form.address,
    email: form.email,
    phone: form.phone,
    image: form.image || "",
  });

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

  const { isFetchingBranches } =
    company.useGetBranchesByCompanyUuid(decryptedUuid);
  const companyBranches = useCompanyStore((state) => state.companyBranch);

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

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <div className="p-6 mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Branch Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage and organize your company locations efficiently
            </p>
            {companyBranches.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {companyBranches.length} active{" "}
                  {companyBranches.length === 1 ? "branch" : "branches"}
                </span>
              </div>
            )}
          </div>
          <AddBranchDialog
            open={open}
            setOpen={handleDialogOpenChange}
            form={form}
            setForm={setForm}
            handleInput={handleInput}
            handleSubmit={handleSubmit}
          />
        </div>
        {/* Enhanced Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isFetchingBranches ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden shadow-lg border-0 bg-white dark:bg-slate-800"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
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
                className="p-0 group overflow-hidden bg-card rounded-xl border border-gray-200 dark:border-stone-700"
              >
                {/* Enhanced Image Section */}
                <div className="relative overflow-hidden">
                  {branch.image ? (
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          No image available
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditBranch(branch)}
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg dark:bg-slate-800/90 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setBranchToDelete(branch);
                        setDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0 shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Content Section */}
                <div className="p-6 pt-0 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {branch.name}
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 line-clamp-2">
                        {branch.address}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 truncate">
                        {branch.email}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">
                        {branch.phone}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Map Link */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        branch.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200 group/link"
                    >
                      <span className="text-sm font-medium">View on Maps</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <Card className="w-full max-w-md p-12 text-center bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 shadow-lg">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                      <Building2 className="h-12 w-12 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      No branches yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Start building your business presence by adding your first
                      branch location.
                    </p>
                  </div>

                  <Button
                    onClick={() => setOpen(true)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create First Branch
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      {/* Enhanced Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Delete Branch
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {branchToDelete?.name}
              </span>
              ? This action cannot be undone and will permanently remove all
              branch data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
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
              {isDeletingBranch ? "Deleting..." : "Delete Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
