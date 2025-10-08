"use client"

import { useEffect, useMemo, useState } from "react"
import { useEmployeeSelfStore } from "@/stores/employee-self-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Users, Building2,
  Edit, Save, X, Camera, Award, Clock, Shield, Star, Heart, Target,
} from "lucide-react"

function fmtDate(d?: string | null) {
  if (!d) return "-"
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString()
}

export default function ProfilePage() {
  const { selfProfile, fetchSelfProfile, updateSelfProfile } = useEmployeeSelfStore()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<any>(null)
  const loading = !selfProfile && !draft

  useEffect(() => {
    fetchSelfProfile()
  }, [])

  useEffect(() => {
    if (selfProfile) setDraft(selfProfile)
  }, [selfProfile])

  const canSave = useMemo(() => {
    if (!draft) return false
    return (draft.email?.length ?? 0) > 3 // rule sederhana; ganti sesuai kebutuhan
  }, [draft])

  const onSave = async () => {
    await updateSelfProfile({
      name: draft?.name,
      email: draft?.email,
      phone: draft?.phone,
      address: draft?.address,
      birth_date: draft?.birth_date,
      bio: draft?.bio,
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="rounded-2xl">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button disabled={!canSave} onClick={onSave} className="rounded-2xl bg-emerald-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Save Changes
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

              <h2 className="text-2xl font-bold">{draft?.name || "-"}</h2>
              <p className="text-gray-600">{draft?.position_name || "-"}</p>
              <Badge className="mt-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white">
                <Shield className="w-3 h-3 mr-1" /> Employee
              </Badge>

              <div className="w-full mt-6">
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">About Me</Label>
                {isEditing ? (
                  <Textarea
                    rows={4}
                    value={draft?.bio ?? ""}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    className="rounded-2xl"
                  />
                ) : (
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl">
                    {draft?.bio || "-"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Info */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="w-6 h-6 mr-3 text-orange-500" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" /> Email
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft?.email ?? ""}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{draft?.email || "-"}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" /> Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft?.phone ?? ""}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{draft?.phone || "-"}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <Label className="text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" /> Birth Date
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={draft?.birth_date ?? ""}
                      onChange={(e) => setDraft({ ...draft, birth_date: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{fmtDate(draft?.birth_date)}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <Label className="text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" /> Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={draft?.address ?? ""}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                      className="rounded-xl bg-gray-50"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl">{draft?.address || "-"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Info */}
        <div className="md:col-span-2 lg:col-span-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Briefcase className="w-6 h-6 mr-3 text-orange-500" /> Work Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoBlock icon={<Briefcase className="w-4 h-4" />} label="Position" value={draft?.position_name} />
              <InfoBlock icon={<Users className="w-4 h-4" />} label="Department" value={draft?.department_name} />
              <InfoBlock icon={<Building2 className="w-4 h-4" />} label="Employee ID" value={draft?.employee_id} />
              <InfoBlock icon={<Calendar className="w-4 h-4" />} label="Join Date" value={fmtDate(draft?.join_date)} />
              <InfoBlock icon={<User className="w-4 h-4" />} label="Supervisor" value={draft?.manager_name} />
              <InfoBlock icon={<Clock className="w-4 h-4" />} label="Work Schedule" value={draft?.work_schedule || "-"} />
            </CardContent>
          </Card>
        </div>

        {/* Achievements (dummy dekoratif) */}
        <div className="md:col-span-2 lg:col-span-4">
          <Card className="rounded-3xl bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Award className="w-6 h-6 mr-3 text-orange-500" /> Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <BadgeCard icon={<Star className="w-8 h-8 text-white" />} title="Perfect Attendance" subtitle="3 months" />
                <BadgeCard icon={<Target className="w-8 h-8 text-white" />} title="Goal Achiever" subtitle="Q4 2024" />
                <BadgeCard icon={<Heart className="w-8 h-8 text-white" />} title="Team Player" subtitle="2024" />
                <BadgeCard icon={<Award className="w-8 h-8 text-white" />} title="Top Performer" subtitle="2023" />
              </div>
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

/** Badge dekoratif */
function BadgeCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-900 text-center">{title}</p>
      <p className="text-xs text-gray-500 text-center mt-1">{subtitle}</p>
    </div>
  )
}
