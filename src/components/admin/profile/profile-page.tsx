"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { User, Edit3, X, Save, Camera } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { UpdateUserPayload } from "@/lib/interfaces/user-interface";
import { api } from "@/lib/api/api";
import { toast } from "sonner";
import { decrypt } from "@/lib/encrypt";
import { profileSchema, ProfileSchemaType } from "@/lib/schema";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [decryptedUuid, setDecryptedUuid] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileSchemaType, string>>
  >({});
  const userData = useUserStore((state) => state.user);

  const mapUserToPayload = (): ProfileSchemaType => ({
    firstname: userData.name.firstName || "",
    lastname: userData.name.lastName || "",
    email: userData.email,
    phone: userData.phone || "",
    dob: userData.dob || "",
    gender: userData.gender || "",
    is_freelance: userData.isFreelance,
  });

  const [editData, setEditData] = useState<ProfileSchemaType>(
    mapUserToPayload()
  );

  const handleEdit = () => {
    setEditData(mapUserToPayload());
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(mapUserToPayload());
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toDateInputValue = (dateString?: string | null) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Ambil format "YYYY-MM-DD"
  };

  const toRFC3339 = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString(); // Ubah ke RFC3339
  };

  const handleSave = async () => {
    const result = profileSchema.safeParse(editData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileSchemaType, string>> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ProfileSchemaType;
        if (fieldName) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setErrors({});

    const payload: UpdateUserPayload = {
      ...result.data,
      dob: toRFC3339(editData.dob),
      company_uuid: decryptedUuid || undefined,
      role_uuid: userData.role.uuid,
    };

    try {
      await api.updateUser(payload, userData.userUuid);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update profile error:", error);
    }
  };

  const handleInputChange = (
    field: keyof ProfileSchemaType,
    value: string | boolean
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-background pb-3">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="p-3 bg-card rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border dark:border-stone-700">
              <User className="w-6 h-6 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">
                Profile Settings
              </h1>
              <p className="mt-1 text-gray-600 dark:text-muted-foreground text-sm sm:text-base">
                Manage your personal information and account preferences
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 w-full lg:w-auto">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="gap-2 bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="gap-2 bg-transparent w-full sm:w-auto"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-3 space-y-6">
        {/* 🔶 Card Oranye */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-stone-800 shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                    {getInitials(userData.name.fullName)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-foreground">
                  {userData.name.fullName}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium capitalize">
                  {userData.role.name}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-muted-foreground">
                  {userData.branch?.name && (
                    <>
                      <span>{userData.branch.name}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>
                    {userData.isFreelance ? "Freelance" : "Full-time Employee"}
                  </span>
                </div>
              </div>

              {/* <div>
                <div className="flex items-center p-3 rounded-lg bg-white/70 dark:bg-stone-900/50 border border-orange-200/60 dark:border-orange-800/60 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-foreground">
                        Available PTO
                      </div>
                      <div className="text-xs text-gray-500 dark:text-muted-foreground">
                        Paid time off
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-lg font-bold text-gray-900 dark:text-foreground">
                      18
                    </div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground">
                      days
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* 🔳 Card Putih */}
        <Card className="bg-white dark:bg-card border border-gray-200 dark:border-stone-700 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-foreground">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First & Last Name */}
            {isEditing ? (
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label>First Name</Label>
                  <Input
                    placeholder="First Name"
                    value={editData.firstname}
                    onChange={(e) =>
                      handleInputChange("firstname", e.target.value)
                    }
                    className={errors.firstname ? "border-red-500" : ""}
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-sm">{errors.firstname}</p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Last Name"
                    value={editData.lastname}
                    onChange={(e) =>
                      handleInputChange("lastname", e.target.value)
                    }
                    className={errors.lastname ? "border-red-500" : ""}
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-sm">{errors.lastname}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="info-box">
                  {userData.name.firstName} {userData.name.lastName}
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              {isEditing ? (
                <>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </>
              ) : (
                <div className="info-box">{userData.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              {isEditing ? (
                <>
                  <Input
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </>
              ) : (
                <div className="info-box">{userData.phone}</div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              {isEditing ? (
                <>
                  <Select
                    value={editData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${errors.gender ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </>
              ) : (
                <div className="info-box capitalize">
                  {userData.gender || (
                    <span className="italic text-muted-foreground">
                      Not set
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              {isEditing ? (
                <>
                  <Input
                    type="date"
                    value={toDateInputValue(editData.dob)}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className={errors.dob ? "border-red-500" : ""}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob}</p>
                  )}
                </>
              ) : (
                <div className="info-box">
                  {userData.dob ? (
                    formatDate(userData.dob)
                  ) : (
                    <span className="italic text-muted-foreground">
                      Not set
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label>Employment Type</Label>
              {isEditing ? (
                <>
                  <Select
                    value={editData.is_freelance ? "freelance" : "fulltime"}
                    onValueChange={(value) =>
                      handleInputChange("is_freelance", value === "freelance")
                    }
                  >
                    <SelectTrigger
                      className={`border w-full ${
                        errors.is_freelance
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">
                        Full-time Employee
                      </SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.is_freelance && (
                    <p className="text-red-500 text-sm">
                      {errors.is_freelance}
                    </p>
                  )}
                </>
              ) : (
                <div className="info-box">
                  {userData.isFreelance ? "Freelance" : "Full-time Employee"}
                </div>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="info-box capitalize">{userData.role.name}</div>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label>Branch/Division</Label>
              <div className="info-box">
                {userData.branch?.name ? (
                  userData.branch.name
                ) : (
                  <span className="italic text-muted-foreground">
                    Not assigned
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
