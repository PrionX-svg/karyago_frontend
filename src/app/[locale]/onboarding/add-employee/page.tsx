"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Users,
  UserCheck,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCompanyStore } from "@/stores/company-store";
import { useUserStore } from "@/stores/user-store";
import { api } from "@/lib/api/api";
import { useEmployeeStore } from "@/stores/employee-store";
import employee from "@/lib/queries/employee-queries";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useTranslations } from "next-intl";

export interface FormData {
  company_uuid: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  is_freelance: boolean;
}

export interface EmployeeHistoryFormData {
  employee_uuid: string;
  company_uuid: string;
  position: string;
  is_present: boolean;
  start_date: string;
  end_date: string;
}

interface FormErrors {
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  password?: string;
  dob?: string;
  gender?: string;
  position?: string;
  start_date?: string;
  end_date?: string;
}

export default function AddUserManually() {
  const [formData, setFormData] = useState<FormData>({
    company_uuid: "",
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    is_freelance: false,
  });

  const [employeeHistoryData, setEmployeeHistoryData] =
    useState<EmployeeHistoryFormData>({
      employee_uuid: "",
      company_uuid: "",
      position: "",
      is_present: true,
      start_date: "",
      end_date: "",
    });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const employees = useEmployeeStore((state) => state.employees);
  const userUuid = useUserStore((state) => state.user.userUuid);
  const companyUuid = useCompanyStore((state) => state.company[0]?.uuid);
  const { createEmployee, isCreatingEmployee } = employee.useCreateEmployee();
  const { createEmployeeHistory, isCreatingEmployeeHistory } =
    employee.useCreateEmployeeHistory();
  const ae = useTranslations("employeeOnboarding");
  const ap = useTranslations("api");
  const co = useTranslations("common");

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const onBack = () => {
    router.push("/onboarding");
  };

  const generatePassword = () => {
    const length = 12;
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*";

    let password = "";
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));

    const allCharacters = lowercase + uppercase + numbers + special;
    for (let i = 4; i < length; i++) {
      password += allCharacters.charAt(
        Math.floor(Math.random() * allCharacters.length)
      );
    }
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setFormData((prev) => ({
      ...prev,
      password: password,
    }));

    setErrors((prev) => ({
      ...prev,
      password: undefined,
    }));
  };

  const handleInputChange = (
    field: keyof (FormData & { confirmPassword: string }),
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEmployeeHistoryChange = (
    field: keyof EmployeeHistoryFormData,
    value: string | boolean
  ) => {
    setEmployeeHistoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    sessionStorage.removeItem("onboardingStep");
    sessionStorage.removeItem("meta");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = ae("firstNameMissing");
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = ae("lastNameMissing");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = ae("phoneMissing");
    }

    if (!formData.email.trim()) {
      newErrors.email = ae("emailMissing");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ae("emailInvalid");
    }

    if (!formData.password.trim()) {
      newErrors.password = ae("passwordMissing");
    } else if (formData.password.length < 8) {
      newErrors.password = ae("password<8");
    }

    if (!formData.dob) {
      newErrors.dob = ae("dobMissing");
    }

    if (!formData.gender) {
      newErrors.gender = ae("genderMissing");
    }

    if (!employeeHistoryData.position.trim()) {
      newErrors.position = ae("positionMissing");
    }

    if (!employeeHistoryData.start_date) {
      newErrors.start_date = ae("startDateMissing");
    }

    if (!employeeHistoryData.is_present && !employeeHistoryData.end_date) {
      newErrors.end_date = ae("endDateMissing");
    } else if (
      employeeHistoryData.end_date &&
      new Date(employeeHistoryData.end_date) <
        new Date(employeeHistoryData.start_date)
    ) {
      newErrors.end_date = ae("endDateError");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    createEmployee({
      company_uuid: formData.company_uuid,
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
      is_freelance: formData.is_freelance,
    })
      .then((employee) => {
        const employee_uuid = employee?.employee_uuid;
        if (!employee_uuid) {
          throw new Error("User UUID missing");
        }

        const historyPayload = {
          company_uuid: formData.company_uuid,
          employee_uuid: employee_uuid,
          position: employeeHistoryData.position,
          start_date: employeeHistoryData.start_date,
          is_present: employeeHistoryData.is_present,
          ...(employeeHistoryData.is_present === false && {
            end_date: employeeHistoryData.end_date,
          }),
        };

        return createEmployeeHistory(historyPayload);
      })
      .then(() => {
        toast.success(ap("createEmployeeSuccess"));

        setFormData({
          ...formData,
          firstname: "",
          lastname: "",
          phone: "",
          email: "",
          password: "",
          dob: "",
          is_freelance: false,
        });
        setEmployeeHistoryData((prev) => ({
          ...prev,
          employee_uuid: "",
          position: "",
          is_present: true,
          start_date: "",
          end_date: "",
        }));
      })
      .catch((error) => {
        console.error(error);
        toast.error(ap("createEmployeeFailed"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  useEffect(() => {
    if (!userUuid) {
      api.getMe();
    }
  }, [userUuid]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (userUuid) {
        setLoading(true);
        try {
          await api.getCompanyByUserUuid(userUuid, true);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCompanyData();
  }, [userUuid]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (companyUuid) {
        setLoading(true);
        try {
          await api.getEmployeeByCompanyUuid(companyUuid);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEmployeeData();
  }, [companyUuid]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      company_uuid: companyUuid,
    }));
    setEmployeeHistoryData((prev) => ({
      ...prev,
      company_uuid: companyUuid || "",
      end_date: "",
    }));
  }, [companyUuid]);

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-4 flex-1">
        <motion.div
          className="w-full max-w-7xl mx-auto"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Form Section */}
            <div className="lg:col-span-2 h-full">
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 overflow-hidden">
                  <CardContent className="px-8 py-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <motion.div className="space-y-6" variants={itemVariants}>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {ae("firstFormTitle")}
                            </h3>
                            <div className="text-xs text-gray-400 italic flex items-center gap-1">
                              {ae("firstFormDescription")}
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="firstname"
                              className="text-sm font-medium text-gray-700"
                            >
                              {ae("firstName")}
                            </Label>
                            <Input
                              id="firstname"
                              value={formData.firstname}
                              onChange={(e) =>
                                handleInputChange("firstname", e.target.value)
                              }
                              placeholder="John"
                              className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                errors.firstname
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            />
                            {errors.firstname && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm flex items-center"
                              >
                                {errors.firstname}
                              </motion.p>
                            )}
                          </motion.div>
                          <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="lastname"
                              className="text-sm font-medium text-gray-700"
                            >
                              {ae("lastName")}
                            </Label>
                            <Input
                              id="lastname"
                              value={formData.lastname}
                              onChange={(e) =>
                                handleInputChange("lastname", e.target.value)
                              }
                              placeholder="Doe"
                              className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                errors.lastname
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            />
                            {errors.lastname && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm flex items-center"
                              >
                                {errors.lastname}
                              </motion.p>
                            )}
                          </motion.div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="phone"
                              className="text-sm font-medium text-gray-700"
                            >
                              {ae("phone")}
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                placeholder="628123456789"
                                className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                  errors.phone
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              />
                            </div>
                            {errors.phone && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm flex items-center"
                              >
                                {errors.phone}
                              </motion.p>
                            )}
                          </motion.div>
                          <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="dob"
                              className="text-sm font-medium text-gray-700"
                            >
                              {ae("dob")}
                            </Label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                              <Input
                                id="dob"
                                type="date"
                                value={
                                  formData.dob
                                    ? new Date(formData.dob)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) => {
                                  const dateValue = e.target.value
                                    ? new Date(e.target.value).toISOString()
                                    : "";
                                  handleInputChange("dob", dateValue);
                                }}
                                className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                  errors.dob
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              />
                            </div>
                            {errors.dob && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm flex items-center"
                              >
                                {errors.dob}
                              </motion.p>
                            )}
                          </motion.div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="gender"
                              className="text-sm font-medium text-gray-700"
                            >
                              {ae("gender")}
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                handleInputChange("gender", value)
                              }
                            >
                              <SelectTrigger
                                className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                  errors.gender
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <SelectValue
                                  placeholder={ae("genderPlaceholder")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">
                                  {ae("male")}
                                </SelectItem>
                                <SelectItem value="female">
                                  {ae("female")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.gender && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm flex items-center"
                              >
                                {errors.gender}
                              </motion.p>
                            )}
                          </motion.div>
                          <motion.div
                            variants={itemVariants}
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-3">
                              <Switch
                                id="is_freelance"
                                checked={formData.is_freelance}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "is_freelance",
                                    checked as boolean
                                  )
                                }
                                className="data-[state=checked]:bg-orange-500"
                              />
                              <Label
                                htmlFor="is_freelance"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {ae("isFreelance")}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Switch
                                id="is_present"
                                checked={employeeHistoryData.is_present}
                                onCheckedChange={(checked) => {
                                  handleEmployeeHistoryChange(
                                    "is_present",
                                    checked as boolean
                                  );
                                  if (checked) {
                                    handleEmployeeHistoryChange("end_date", "");
                                  }
                                }}
                                className="data-[state=checked]:bg-orange-500"
                              />
                              <Label
                                htmlFor="is_present"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {ae("isActive")}
                              </Label>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                      {/* Employee History Form */}
                      <motion.div className="space-y-6" variants={itemVariants}>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {ae("secondFormTitle")}
                          </h3>
                        </div>
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                              variants={itemVariants}
                              className="space-y-2"
                            >
                              <Label
                                htmlFor="position"
                                className="text-sm font-medium text-gray-700"
                              >
                                {ae("position")}
                              </Label>
                              <Input
                                id="position"
                                value={employeeHistoryData.position}
                                onChange={(e) =>
                                  handleEmployeeHistoryChange(
                                    "position",
                                    e.target.value
                                  )
                                }
                                placeholder="Senior Backend Developer"
                                className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                  errors.position
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              />
                              {errors.position && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-red-500 text-sm flex items-center"
                                >
                                  {errors.position}
                                </motion.p>
                              )}
                            </motion.div>
                            <motion.div
                              variants={itemVariants}
                              className="space-y-2"
                            >
                              <Label
                                htmlFor="start_date"
                                className="text-sm font-medium text-gray-700"
                              >
                                {ae("startDate")}
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                <Input
                                  id="start_date"
                                  type="date"
                                  value={
                                    employeeHistoryData.start_date
                                      ? new Date(employeeHistoryData.start_date)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const dateValue = e.target.value
                                      ? new Date(e.target.value).toISOString()
                                      : "";
                                    handleEmployeeHistoryChange(
                                      "start_date",
                                      dateValue
                                    );
                                  }}
                                  className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                    errors.start_date
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                />
                              </div>
                              {errors.start_date && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-red-500 text-sm flex items-center"
                                >
                                  {errors.start_date}
                                </motion.p>
                              )}
                            </motion.div>
                          </div>
                          {!employeeHistoryData.is_present && (
                            <motion.div
                              variants={itemVariants}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2"
                            >
                              <Label
                                htmlFor="end_date"
                                className="text-sm font-medium text-gray-700"
                              >
                                {ae("endDate")}
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                <Input
                                  id="end_date"
                                  type="date"
                                  value={
                                    employeeHistoryData.end_date
                                      ? new Date(employeeHistoryData.end_date)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const dateValue = e.target.value
                                      ? new Date(e.target.value).toISOString()
                                      : "";
                                    handleEmployeeHistoryChange(
                                      "end_date",
                                      dateValue
                                    );
                                  }}
                                  className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                    errors.end_date
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                />
                              </div>
                              {errors.end_date && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-red-500 text-sm flex items-center"
                                >
                                  {errors.end_date}
                                </motion.p>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                      {/* Account Information */}
                      <motion.div className="space-y-6" variants={itemVariants}>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Lock className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {ae("thirdFormTitle")}
                          </h3>
                        </div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            {ae("email")}
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              placeholder="john.doe2@example.com"
                              className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                errors.email
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-sm flex items-center"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="password"
                              className="text-sm font-medium text-gray-700"
                            >
                              {ae("password")}
                            </Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generatePassword}
                                className="text-xs px-3 py-1 h-auto border-orange-200 text-orange-600 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
                              >
                                {ae("generatePassword")}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    formData.password
                                  );
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="text-xs px-3 py-1 h-auto border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                                disabled={!formData.password}
                              >
                                {copied ? co("copied") : co("copy")}
                              </Button>
                            </div>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type="text"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              placeholder="Enter secure password"
                              className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${
                                errors.password
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            />
                          </div>
                          {errors.password && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-sm flex items-center"
                            >
                              {errors.password}
                            </motion.p>
                          )}
                        </motion.div>
                      </motion.div>
                      {/* Action Buttons */}
                      <motion.div
                        className="flex justify-between"
                        variants={itemVariants}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onBack}
                          className="h-12 px-8 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-transparent"
                          disabled={isSubmitting}
                        >
                          {co("cancel")}
                        </Button>
                        <div className="flex flex-row gap-2">
                          {/* Save Button */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="h-12 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                              disabled={
                                isSubmitting ||
                                loading ||
                                isCreatingEmployee ||
                                isCreatingEmployeeHistory
                              }
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {isCreatingEmployee
                                ? ae("creatingEmployee")
                                : isSubmitting
                                ? ae("creatingAccount")
                                : ae("createAccount")}
                            </Button>
                          </motion.div>
                          {/* Complete Button with Confirmation */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => setShowConfirm(true)}
                              className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                              disabled={
                                isSubmitting ||
                                loading ||
                                isCreatingEmployee ||
                                isCreatingEmployeeHistory
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {ae("complete")}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Employee List Section */}
            <div className="lg:col-span-1 h-full">
              <motion.div variants={itemVariants}>
                <Card className="h-full border-0 shadow-2xl backdrop-blur-sm bg-white/80 overflow-hidden sticky top-4">
                  <CardContent className="p-0 pb-8">
                    <div className="max-h-[600px] overflow-y-auto">
                      {employees.filter((e) => e.role?.name !== "owner")
                        .length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-orange-400" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            {ae("noEmployee")}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {ae("noEmployeeDescription")}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {employees
                            .filter(
                              (employee) => employee.role?.name !== "owner"
                            )
                            .map((employee, index) => (
                              <motion.div
                                key={`${employee.email}-${index}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 group"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-medium text-sm">
                                      {employee.name.firstname
                                        .charAt(0)
                                        .toUpperCase()}
                                      {employee.name.lastname
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h4 className="font-medium text-gray-900 text-sm truncate">
                                        {employee.name.firstname}{" "}
                                        {employee.name.lastname}
                                      </h4>
                                      {employee.is_freelance && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs border-amber-200 text-amber-600"
                                        >
                                          <Briefcase className="h-3 w-3 mr-1" />
                                          {ae("freelanceStatus")}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                      <Mail className="h-3 w-3" />
                                      <span className="truncate">
                                        {employee.email}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{employee.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          {ae("born")}{" "}
                                          {formatDate(employee.dob || "")}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="secondary"
                                        className={`text-xs ${
                                          employee.gender === "male"
                                            ? "bg-blue-100 text-blue-700"
                                            : employee.gender === "female"
                                            ? "bg-pink-100 text-pink-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        {employee.gender || "Invalid"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      )}
                    </div>
                    {employees.filter((e) => e.role?.name !== "owner").length >
                      0 && (
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100 absolute bottom-0 left-0 right-0">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                          <UserCheck className="h-4 w-4 text-orange-500" />
                          <span>
                            {ae("total", {
                              count: employees.filter(
                                (e) => e.role?.name !== "owner"
                              ).length,
                              plural:
                                employees.filter(
                                  (e) => e.role?.name !== "owner"
                                ).length !== 1
                                  ? "s"
                                  : "",
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {/* Confirmation Dialog */}
        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full"
            >
              <h2
                id="confirm-dialog-title"
                className="text-lg font-semibold mb-4"
              >
                {ae("confirmCompleteTitle")}
              </h2>
              <p className="mb-6 text-gray-600">{ae("confirmCompleteDesc")}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="px-4"
                >
                  {co("cancel")}
                </Button>
                <Link href="/">
                  <Button
                    onClick={() => {
                      handleComplete();
                      setShowConfirm(false);
                    }}
                    className="px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  >
                    {ae("confirmCompleteButton")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
