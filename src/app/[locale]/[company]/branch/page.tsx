"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import company from "@/lib/queries/company-queries";
import { decrypt } from "@/lib/encrypt";
import { useCompanyStore } from "@/stores/company-store";
import { Building2, ImageIcon } from "lucide-react";
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Branches</h1>
            <p className="text-muted-foreground">
              Manage your company branches efficiently.
            </p>
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
        <div className="grid gap-6 md:grid-cols-2 lg-:grid-cols-3 xl:grid-cols-4">
          {isFetchingBranches ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-6 flex flex-col gap-3">
                <Skeleton className="h-32 w-full mb-2" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))
          ) : companyBranches.length > 0 ? (
            companyBranches.map((branch) => (
              <Card
                key={branch.uuid}
                className="p-6 flex flex-col gap-3 shadow-md relative"
              >
                {branch.image ? (
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-64 object-cover rounded-md mb-2 bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-64 rounded-md mb-2 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-bold">
                      <ImageIcon size={40} />
                    </span>
                  </div>
                )}
                <div className="font-semibold text-lg mb-1">{branch.name}</div>
                <div className="text-sm text-gray-500">{branch.address}</div>
                <div className="text-sm text-gray-500">
                  Email:{" "}
                  <span className="font-medium text-gray-700">
                    {branch.email}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Phone:{" "}
                  <span className="font-medium text-gray-700">
                    {branch.phone}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=  ${encodeURIComponent(
                    branch.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:underline text-sm font-medium"
                >
                  View on Maps
                </a>
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBranch(branch)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setBranchToDelete(branch);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
                {/* Delete Branch Confirmation Dialog */}
                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Branch</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the branch
                        <span className="font-semibold">
                          {" "}
                          {branchToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={isDeletingBranch}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteBranch}
                        disabled={isDeletingBranch}
                      >
                        {isDeletingBranch ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center w-full">
              <Card className="w-full p-8 flex flex-col items-center justify-center gap-4 bg-card rounded-xl border-2 border-dashed border-gray-300 dark:border-stone-700">
                <Building2 size={48} className="text-gray-400 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  No branches found
                </h3>
                <p className="text-sm max-w-xs text-center text-gray-600 dark:text-muted-foreground">
                  You haven't added any branches yet. Start by creating your
                  first branch to manage your company locations.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setOpen(true)}
                >
                  Add Branch
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
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
