"use client";

import {useEffect, useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
	Pencil,
	Trash,
	Layers,
	Menu,
	Users2,
	Briefcase,
	Target,
} from "lucide-react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {useCompanyStore} from "@/stores/company-store"
import {decrypt} from "@/lib/encrypt"
import {api} from "@/lib/api/api"
import {SubDivisionDialog} from "@/components/company-structure/subdivision-form"
import DeleteConfirmDialog from "@/components/company-structure/delete-confirm-dialog"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export default function SubDivisionsRoundedTable() {
	const [decryptedUuid, setDecryptedUuid] = useState<string | null>(null);
	const [hasMounted, setHasMounted] = useState(false);
	const [selectedDivision, setSelectedDivision] = useState<string | undefined>()
	const [searchTerm, setSearchTerm] = useState("")
	const [viewType, setViewType] = useState<"card" | "table">("table")
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedSubDivision, setSubSelectedDivision] = useState<string | null>(null);
	const divisionsData = useCompanyStore((state) => state.division)
	const subDivisionsData = useCompanyStore((state) => state.subDivision)

	const handleDeleteClick = (uuid: string) => {
		setSubSelectedDivision(uuid);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedSubDivision) return;
		try {
			await api.deleteSubDivision(selectedSubDivision)
				.then(() => toast.success("Sub-Division deleted successfully"))
				.catch(() => toast.error("Failed to delete Sub-Division"))
		} catch (error) {
			console.error("Failed to delete Sub-Division", error);
		} finally {
			setIsDeleteOpen(false);
			setSubSelectedDivision(null);
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

	useEffect(() => {
		const fetchDivisions = async () => {
			if (!decryptedUuid) return;
			try {
				await api.getDivisionsByCompanyUuid(decryptedUuid);
			} catch (error) {
				console.error("Failed to fetch divisions:", error);
			}
		};
		fetchDivisions();
	}, [decryptedUuid]);

	useEffect(() => {
		const fetchSubDivisions = async () => {
			if (!decryptedUuid) return;
			try {
				await api.getSubDivisionsByCompanyUuid(decryptedUuid);
			} catch (error) {
				console.error("Failed to fetch sub-divisions:", error);
			}
		};
		fetchSubDivisions();
	}, [decryptedUuid]);

	if (!hasMounted) {
		return null;
	}

	const filteredSubDivisions = subDivisionsData.filter((sub) => {
		// Filter by division
		const matchesDivision = selectedDivision
			? sub.divisions?.name?.toLowerCase() === selectedDivision.toLowerCase()
			: true;

		// Filter by search term
		const term = searchTerm.toLowerCase();
		const matchesSearch = sub.name.toLowerCase().includes(term) || (sub.desc?.toLowerCase() ?? "").includes(term);

        return matchesDivision && matchesSearch;
    });

    const sd = useTranslations("subDivisions")

    return (
        <div className="min-h-screen">
            {/* HEADER */}
            <div className="pb-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                            <Users2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{sd("title")}</h1>
                            <p className="text-gray-600 mt-1">{sd("description")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{subDivisionsData.length}</p>
                            <p className="text-sm text-gray-500">{sd("activeTeams")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="min-w-full pt-3">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <div className="relative max-w-sm flex-1">
                            <input
                                type="text"
                                placeholder={sd("searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <Select
                            value={selectedDivision}
                            onValueChange={(value) => setSelectedDivision(value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="w-full sm:w-48 bg-white rounded-lg">
                                <SelectValue placeholder={sd("allDivisions")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{sd("allDivisions")}</SelectItem>
                                {divisionsData.map((division) => (
                                    <SelectItem key={division.uuid} value={division.name}>
                                        {division.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={viewType === "table" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("table")}
                                className={`gap-2 rounded-md ${viewType === "table" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <Menu className={`w-4 h-4 ${viewType === "table" ? "text-white" : "text-gray-500"}`} />
                                {sd("viewTable")}
                            </Button>
                            <Button
                                variant={viewType === "card" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("card")}
                                className={`gap-2 rounded-md ${viewType === "card" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <Layers className={`w-4 h-4 ${viewType === "card" ? "text-white" : "text-gray-500"}`} />
                                {sd("viewCards")}
                            </Button>
                        </div>
                        <SubDivisionDialog mode="create" />
                    </div>
                </div>

                {/* Content */}
                {filteredSubDivisions.length > 0 ? (
                    viewType === "table" ? (
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <th className="text-left py-4 px-6 font-bold text-gray-900 first:rounded-tl-xl">
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-4 h-4" />
                                                    {sd("name")}
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-bold text-gray-900">{sd("descriptionColumn")}</th>
                                            <th className="text-left py-4 px-6 font-bold text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4" />
                                                    {sd("parentDivision")}
                                                </div>
                                            </th>
                                            <th className="text-right py-4 px-6 font-bold text-gray-900 last:rounded-tr-xl">{sd("actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSubDivisions.map((sub, index) => (
                                            <tr
                                                key={sub.uuid}
                                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-900">{sub.name}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {sub.desc ? (
                                                        <div className="text-sm text-gray-700 max-w-xs truncate" title={sub.desc}>
                                                            {sub.desc}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm italic text-neutral-400">{sd("notSet")}</div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-700">
                                                        {sub.divisions?.name || sd("noParentDivision")}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end gap-2">
                                                        <SubDivisionDialog
                                                            mode="edit"
                                                            subDivision={sub}
                                                            trigger={
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                                </Button>
                                                            }
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteClick(sub.uuid)}
                                                            className="hover:bg-red-100 rounded-lg"
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
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredSubDivisions.map((sub) => (
                                <Card key={sub.uuid} className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-200 transition-all duration-300 group overflow-hidden">
                                    <CardHeader className="pb-4 relative">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent rounded-full opacity-60 -mr-12 -mt-12"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 group-hover:from-orange-100 group-hover:to-orange-200 transition-colors">
                                                    <Target className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-orange-900 transition-colors">
                                                        {sub.name}
                                                    </CardTitle>
                                                    {sub.divisions?.name ? (
                                                        <p className="text-sm text-neutral-500">{sub.divisions.name}</p>
                                                    ) : (
                                                        <p className="text-sm italic text-neutral-400">{sd("noParentDivision")}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <SubDivisionDialog
                                                    mode="edit"
                                                    subDivision={sub}
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                            <Pencil className="w-4 h-4 text-gray-500" />
                                                        </Button>
                                                    }
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(sub.uuid)}
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    <Trash className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-3 border border-gray-200 rounded-lg">
                                            {sub.desc ? (
                                                <p className="text-sm text-gray-900">{sub.desc}</p>
                                            ) : (
                                                <p className="text-sm italic text-neutral-400">{sd("descriptionNotSet")}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <Users2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{sd("noSubDivisionsFoundTitle")}</h3>
                        <p className="text-gray-600 mb-4">{sd("noSubDivisionsFoundDesc")}</p>
                        <Button onClick={() => setSelectedDivision(undefined)} variant="outline" className="rounded-lg">
                            {sd("clearFilter")}
                        </Button>
                    </div>
                )}
            </div>
            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title={sd("deleteTitle")}
                description={sd("deleteDescription")}
            />
        </div>
    )
}
