"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Search,
  Building2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  FolderTree,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { toast } from "sonner"

/* ---------- Types ---------- */
interface DepartmentMember {
  uuid: string
  name: string
  position_name?: string
  email: string
  phone?: string
  join_date?: string
  status?: "active" | "on-leave" | "remote"
}

interface Department {
  uuid: string
  name: string
  description?: string
  manager_name?: string
  location?: string
  members: DepartmentMember[]
}

interface DepartmentGroup {
  uuid: string
  name: string
  description?: string
  departments: Department[]
}

/* ---------- Component ---------- */
export default function OrganizationPage() {
  const { currentCompany } = useCompanyStore()
  const [groups, setGroups] = useState<DepartmentGroup[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  /** Fetch department groups (each with departments + members) */
  useEffect(() => {
    const fetchData = async () => {
      if (!currentCompany?.uuid) return
      try {
        setLoading(true)
        const res = await employeeAPI.getDepartments(currentCompany.uuid)
        setGroups(res.data || [])
      } catch (err) {
        console.error("❌ Failed to fetch department groups:", err)
        toast.error("Failed to load organization structure.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentCompany?.uuid])

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups
    const term = searchTerm.toLowerCase()
    return groups
      .map((g) => ({
        ...g,
        departments: g.departments.filter(
          (d) =>
            d.name.toLowerCase().includes(term) ||
            d.description?.toLowerCase().includes(term) ||
            d.manager_name?.toLowerCase().includes(term)
        ),
      }))
      .filter((g) => g.departments.length > 0)
  }, [groups, searchTerm])

  const toggleGroup = (uuid: string) => {
    setExpandedGroups((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    )
  }

  const toggleDepartment = (uuid: string) => {
    setExpandedDepartments((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    )
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-0 rounded-full"
      case "remote":
        return "bg-blue-100 text-blue-700 border-0 rounded-full"
      case "on-leave":
        return "bg-yellow-100 text-yellow-700 border-0 rounded-full"
      default:
        return "bg-gray-100 text-gray-700 border-0 rounded-full"
    }
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Department
              </h1>
              <p className="text-gray-600 text-sm">
                Explore your company structure and team hierarchy
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search departments or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 w-72 rounded-2xl border-gray-200 bg-white focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Department Groups */}
      <div className="max-w-5xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading organization data...</p>
        ) : filteredGroups.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No departments found.</p>
        ) : (
          filteredGroups.map((group) => (
            <Card
              key={group.uuid}
              className="border-0 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden"
            >
              <CardHeader
                className="cursor-pointer hover:bg-orange-50 transition-all"
                onClick={() => toggleGroup(group.uuid)}
              >
                <CardTitle className="flex items-center justify-between text-xl text-gray-900">
                  <div className="flex items-center space-x-3">
                    {expandedGroups.includes(group.uuid) ? (
                      <ChevronDown className="w-5 h-5 text-orange-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-orange-600" />
                    )}
                    <span>{group.name}</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-0 rounded-full">
                    {group.departments?.length || 0} departments
                  </Badge>
                </CardTitle>
              </CardHeader>

              {/* Departments in Group */}
              {expandedGroups.includes(group.uuid) && (
                <CardContent className="space-y-4 pt-2">
                  {group.departments.map((dept) => (
                    <div
                      key={dept.uuid}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-4"
                    >
                      {/* Department Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleDepartment(dept.uuid)}
                      >
                        <div className="flex items-center space-x-2">
                          {expandedDepartments.includes(dept.uuid) ? (
                            <ChevronDown className="w-4 h-4 text-orange-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-orange-600" />
                          )}
                          <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full">
                          {dept.members?.length || 0} members
                        </Badge>
                      </div>

                      {/* Department Details */}
                      {expandedDepartments.includes(dept.uuid) && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {dept.members.map((member) => (
                            <Card
                              key={member.uuid}
                              className="border border-gray-100 bg-white rounded-2xl hover:shadow-md transition-all"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarFallback className="bg-orange-600 text-white">
                                      {member.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                                      <Badge className={getStatusColor(member.status)}>
                                        {member.status || "active"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {member.position_name || "-"}
                                    </p>
                                    <div className="space-y-1 text-xs text-gray-600">
                                      {member.email && (
                                        <div className="flex items-center space-x-1">
                                          <Mail className="w-3 h-3" />
                                          <span className="truncate">{member.email}</span>
                                        </div>
                                      )}
                                      {member.phone && (
                                        <div className="flex items-center space-x-1">
                                          <Phone className="w-3 h-3" />
                                          <span>{member.phone}</span>
                                        </div>
                                      )}
                                      {member.join_date && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>Joined {new Date(member.join_date).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
