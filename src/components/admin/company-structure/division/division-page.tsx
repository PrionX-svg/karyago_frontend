"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash,
  LayoutGrid,
  List,
  Search,
  Building2,
  Crown,
  Building,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCompanyStore } from "@/stores/company-store";
import { decrypt } from "@/lib/encrypt";
import { api } from "@/lib/api/api";
import {DivisionForm} from "@/components/admin/company-structure/division-form";
import DeleteConfirmDialog from "@/components/admin/company-structure/delete-confirm-dialog";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function DivisionsPage() {
  const [decryptedUuid, setDecryptedUuid] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [viewType, setViewType] = useState<"card" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const divisionsData = useCompanyStore((state) => state.division);
  const t = useTranslations("divisions");

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                         */
  /* ------------------------------------------------------------------ */
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

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!decryptedUuid) return;
      try {
        await api.getDivisionsByCompanyUuid(decryptedUuid);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
  }, [decryptedUuid]);

  if (!hasMounted) return null;

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */
  const handleDeleteClick = (uuid: string) => {
    setSelectedDivision(uuid);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDivision) return;
    try {
      await api
        .deleteDivision(selectedDivision)
        .then(() => toast.success(t("deleteSuccess")))
        .catch((error) => toast.error(`${t("deleteError")}: ${error.message}`));
    } catch (error) {
      console.error("Failed to delete division", error);
    } finally {
      setIsDeleteOpen(false);
      setSelectedDivision(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Filters                                                           */
  /* ------------------------------------------------------------------ */
  const filteredDivisions = divisionsData.filter((division) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      division.name.toLowerCase().includes(searchLower) ||
      division.desc?.toLowerCase().includes(searchLower) ||
      division.responsible?.name?.toLowerCase().includes(searchLower)
    );
  });

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-background">
        <div className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-card rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border dark:border-stone-700">
                <Building className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {t("title")}
                </h1>
                <p className="mt-1 text-gray-600 dark:text-muted-foreground">
                  {t("description")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {divisionsData.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-muted-foreground">
                  {t("totalDivisions")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-3">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-gray-200 dark:border-stone-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 rounded-lg dark:border-stone-700 dark:bg-stone-800 dark:text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-stone-800 rounded-lg p-1">
              <Button
                variant={viewType === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("table")}
                className={`gap-2 rounded-md ${viewType === "table"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                  }`}
              >
                <List className="w-4 h-4" />
                {t("viewTable")}
              </Button>
              <Button
                variant={viewType === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("card")}
                className={`gap-2 rounded-md ${viewType === "card"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                {t("viewCards")}
              </Button>
            </div>

            <DivisionForm mode="create" isOpen={false} onClose={function (): void {
              throw new Error("Function not implemented.");
            } } onSubmit={function (): void {
              throw new Error("Function not implemented.");
            } } />
          </div>
        </div>

        {/* Content */}
        {filteredDivisions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border-2 border-dashed border-gray-300 dark:border-stone-700">
            <Building2 className="w-12 h-12 text-gray-400 dark:text-stone-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
              {t("noDivisionsFoundTitle")}
            </h3>
            <p className="mb-4 text-gray-600 dark:text-muted-foreground">
              {t("noDivisionsFoundDesc")}
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="rounded-lg"
            >
              {t("clearSearch")}
            </Button>
          </div>
        ) : viewType === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDivisions.map((division) => (
              <Card
                key={division.uuid}
                className="bg-white dark:bg-card border border-gray-200 dark:border-stone-700 rounded-xl hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-600 transition-all duration-300 group overflow-hidden"
              >
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 dark:from-orange-950/40 to-transparent rounded-full opacity-60 -mr-12 -mt-12"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/50 rounded-xl border border-orange-200 dark:border-orange-800 group-hover:from-orange-100 dark:group-hover:from-orange-900/60 transition-colors">
                        <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-foreground group-hover:text-orange-900 dark:group-hover:text-orange-400 transition-colors">
                          {division.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                          {t("divisionDepartment")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <DivisionForm
                        mode="edit"
                        division={division}
                        trigger={<Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </Button>} isOpen={false} onClose={function (): void {
                          throw new Error("Function not implemented.");
                        } } onSubmit={function (): void {
                          throw new Error("Function not implemented.");
                        } }                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(division.uuid)}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-stone-800 dark:to-stone-900 rounded-lg border border-gray-200 dark:border-stone-700">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-neutral-400 dark:text-stone-400">
                        {t("responsible")}
                      </span>
                    </div>
                    {division.responsible?.name ? (
                      <div className="text-gray-900 dark:text-foreground">
                        {division.responsible.name}
                      </div>
                    ) : (
                      <div className="text-neutral-400 italic">
                        {t("unassigned")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-card border border-gray-200 dark:border-stone-700 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-stone-800 dark:to-stone-900 border-b border-gray-200 dark:border-stone-700">
                    <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-foreground first:rounded-tl-xl">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {t("divisionName")}
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-foreground">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        {t("responsible")}
                      </div>
                    </th>
                    <th className="text-right py-4 px-6 font-bold text-gray-900 dark:text-foreground last:rounded-tr-xl">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDivisions.map((division, index) => (
                    <tr
                      key={division.uuid}
                      className={`border-b border-gray-100 dark:border-stone-800 hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors ${index % 2 === 0
                        ? "bg-white dark:bg-card"
                        : "bg-gray-50/30 dark:bg-stone-800/30"
                        }`}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 dark:text-foreground">
                          {division.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {division.responsible?.name ? (
                          <div className="text-gray-900 dark:text-foreground">
                            {division.responsible.name}
                          </div>
                        ) : (
                          <div className="text-neutral-400 italic">
                            {t("unassigned")}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <DivisionForm
                            mode="edit"
                            division={division}
                            trigger={<Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                            >
                              <Pencil className="w-4 h-4 text-gray-500" />
                            </Button>} isOpen={false} onClose={function (): void {
                              throw new Error("Function not implemented.");
                            } } onSubmit={function (): void {
                              throw new Error("Function not implemented.");
                            } }                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(division.uuid)}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title={t("deleteTitle")}
          description={t("deleteDescription")}
        />
      </div>
    </div>
  );
}
