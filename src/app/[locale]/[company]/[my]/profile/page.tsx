"use client"

import { useEffect, useState } from "react"
import { useEmployeeSelfStore } from "@/stores/employee-self-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  User, Mail, Phone, Calendar, Briefcase, Users, Shield, Circle,
  FolderTree,
  Edit3,
  Save,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { api } from "@/lib/api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/stores/user-store"
import { useCompanyStore } from "@/stores/company-store"

function fmtDate(d?: string | null) {
  if (!d) return "-"
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString()
}

export default function ProfilePage() {
  const tprofilePage = useTranslations("employeeProfilePage")
  const { selfProfile, fetchSelfProfile } = useEmployeeSelfStore()
  const userData = useUserStore((state) => state.user)
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
  });

  useEffect(() => {
    fetchSelfProfile()
  }, [fetchSelfProfile])

  useEffect(() => {
    if (selfProfile) {
      setDraft({
        name: selfProfile.name || "",
        email: selfProfile.email || "",
        phone: selfProfile.phone || "",
        birth_date: selfProfile.birth_date
          ? new Date(selfProfile.birth_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [selfProfile]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (selfProfile) {
      setDraft({
        name: selfProfile.name || "",
        email: selfProfile.email || "",
        phone: selfProfile.phone || "",
        birth_date: selfProfile.birth_date
          ? new Date(selfProfile.birth_date).toISOString().split("T")[0]
          : "",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!draft.name || !draft.email) {
        toast.error("Name dan email must filled");
        return;
      }

      const payload = {
        firstname: draft.name,
        lastname: selfProfile?.lastname || "", // biarkan kosong
        email: draft.email,
        phone: draft.phone,
        dob: new Date(draft.birth_date).toISOString(),
        gender: selfProfile?.gender || "",
        is_freelance: selfProfile?.is_freelance ?? false,
        company_uuid: selfProfile?.company_uuid || "",
        password: "", // tidak akan diubah di backend
        role_uuid: selfProfile?.role_uuid || "",
      };

      await api.updateUser(payload, userData?.userUuid || "");

      toast.success("Sucess update Profile");
      setIsEditing(false);
      fetchSelfProfile();
    } catch (err) {
      console.error(err);
      toast.error("Fail to update profile");
    }
  };


  if (!selfProfile) {
    return (
      <main className="p-6 text-gray-500">Loading profile…</main>
    );
  }

  return (
    <main className="p-6 bg-white dark:bg-[#0e0e0e] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="mb-8 flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        {/* Left section (Title + Subtitle) */}
        <div className="flex flex-col items-center sm:items-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-orange-500 bg-clip-text text-transparent leading-tight">
            {tprofilePage("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            {tprofilePage("description")}
          </p>

        </div>

        <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-3 sm:w-auto">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>

              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </>
          )}
        </div>


      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
        {/* Avatar + About */}
        <div className="lg:col-span-2 lg:row-span-2">
          <Card className="rounded-3xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>

              </div>
              {isEditing ? (
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              ) : (
                <h2 className="text-2xl font-bold">{selfProfile?.name || "-"}</h2>
              )}
              <Badge className="mt-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white">
                <Shield className="w-3 h-3 mr-1" /> {tprofilePage("badgeRole")}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Personal Info */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card className="rounded-3xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="w-6 h-6 mr-3 text-orange-500" /> {tprofilePage("sectionPersonalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <Label className="text-sm flex items-center text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {tprofilePage("labelEmail")}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft.email}
                      type="email"
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-xl">
                      {selfProfile.email}
                    </p>

                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" /> {tprofilePage("labelPhone")}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-xl">
                      {selfProfile.phone || "-"}
                    </p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" /> {tprofilePage("labelBirthDate")}
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={draft.birth_date}
                      onChange={(e) =>
                        setDraft({ ...draft, birth_date: e.target.value })
                      }
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-xl">
                      {fmtDate(selfProfile.birth_date)}
                    </p>
                  )}

                </div>

                {/* Gender */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Circle className="w-4 h-4 mr-2 text-gray-500" /> {tprofilePage("labelGender")}
                  </Label>
                  <p className="p-3 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-xl">{selfProfile?.gender || "-"}</p>
                </div>

                {/* Social ID */}
                {/* <div>
                  <Label className="text-sm flex items-center">
                    <IdCard className="w-4 h-4 mr-2 text-gray-500" /> Social ID
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft?.social_id ?? ""}
                      onChange={(e) => setDraft({ ...draft, ba: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{selfProfile?.social_id || "-"}</p>
                  )}
                </div> */}

                {/* Tax ID */}
                {/* <div>
                  <Label className="text-sm flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" /> Tax ID
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft?.tax_id ?? ""}
                      onChange={(e) => setDraft({ ...draft, ba: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{draft?.tax_id || "-"}</p>
                  )}
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Info */}
        <div className="md:col-span-2 lg:col-span-4">
          <Card className="rounded-3xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Briefcase className="w-6 h-6 mr-3 text-orange-500" /> {tprofilePage("sectionWorkInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoBlock icon={<Briefcase className="w-4 h-4" />} label={tprofilePage("labelCompany")} value={selfProfile?.company} />
              <InfoBlock icon={<Users className="w-4 h-4" />} label={tprofilePage("labelEmployeeId")} value={selfProfile?.employee_id} />
              <InfoBlock icon={<FolderTree className="w-4 h-4" />} label={tprofilePage("labelDepartment")} value={selfProfile?.department} />
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  )
}

/** Kartu info kecil */
function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {icon}{label}
      </Label>
      <p className="p-3 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-xl">
        {value || "-"}
      </p>
    </div>

  )
}
