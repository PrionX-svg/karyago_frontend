"use client"

import { useEffect, useMemo, useState } from "react"
import { useEmployeeSelfStore } from "@/stores/employee-self-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User, Mail, Phone, Calendar, Briefcase, Users,
  Edit, Save, X, Camera, Shield, Circle,
  FolderTree,
} from "lucide-react"
import { useTranslations } from "next-intl"

function fmtDate(d?: string | null) {
  if (!d) return "-"
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString()
}

export default function ProfilePage() {
  const tprofilePage = useTranslations("employeeProfilePage")
  const { selfProfile, fetchSelfProfile, updateSelfProfile } = useEmployeeSelfStore()
  const [isEditing, setIsEditing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [draft, setDraft] = useState<any>(null)
  const loading = !selfProfile && !draft

  useEffect(() => {
    fetchSelfProfile()
  }, [fetchSelfProfile])

  useEffect(() => {
    if (selfProfile) setDraft(selfProfile)
  }, [selfProfile, fetchSelfProfile])

  const canSave = useMemo(() => {
    if (!draft) return false
    return (draft.email?.length ?? 0) > 3
  }, [draft])

  const onSave = async () => {
    await updateSelfProfile({
      name: draft?.name,
      email: draft?.email,
      phone: draft?.phone,
      birth_date: draft?.birth_date,
    })
    setIsEditing(false)
  }

  const onCancel = () => {
    setDraft(selfProfile)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded-3xl border bg-white p-8 text-gray-500">Loading profile…</div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="mb-8 flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        {/* Left section (Title + Subtitle) */}
        <div className="flex flex-col items-center sm:items-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
           {tprofilePage("title")}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            {tprofilePage("description")}
          </p>
        </div>

        {/* Right section (Buttons) */}
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl px-5 py-2 shadow-md hover:shadow-lg transition-all"
          >
            <Edit className="w-4 h-4 mr-2" /> {tprofilePage("buttonEditProfile")}
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-2xl w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" /> {tprofilePage("buttonCancel")}
            </Button>
            <Button
              disabled={!canSave}
              onClick={onSave}
              className="rounded-2xl w-full sm:w-auto bg-emerald-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" /> {tprofilePage("buttonSaveChanges")}
            </Button>
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
        {/* Avatar + About */}
        <div className="lg:col-span-2 lg:row-span-2">
          <Card className="rounded-3xl">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
                    <Camera className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-bold">{selfProfile?.name || "-"}</h2>
              <Badge className="mt-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white">
                <Shield className="w-3 h-3 mr-1" /> {tprofilePage("badgeRole")}
              </Badge>

            </CardContent>
          </Card>
        </div>

        {/* Personal Info */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="w-6 h-6 mr-3 text-orange-500" /> {tprofilePage("sectionPersonalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" /> {tprofilePage("labelEmail")}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={selfProfile?.email ?? ""}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{selfProfile?.email || "-"}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" /> {tprofilePage("labelPhone")}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={selfProfile?.phone ?? ""}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{selfProfile?.phone || "-"}</p>
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
                      value={selfProfile?.birth_date ?? ""}
                      onChange={(e) => setDraft({ ...draft, birth_date: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{fmtDate(selfProfile?.birth_date)}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Circle className="w-4 h-4 mr-2 text-gray-500" /> {tprofilePage("labelGender")}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={selfProfile?.gender ?? ""}
                      onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{draft?.gender || "-"}</p>
                  )}
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
          <Card className="rounded-3xl">
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
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">{icon}{label}</Label>
      <p className="p-3 bg-gray-50 rounded-xl">{value || "-"}</p>
    </div>
  )
}
