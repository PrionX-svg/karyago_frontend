"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, MoreHorizontal, FileText, Download, Share, Eye, Upload, Star, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock documents data
const documents = [
  {
    id: "DOC001",
    name: "Employee Handbook 2024",
    type: "PDF",
    size: "2.4 MB",
    category: "Policy",
    lastModified: "2024-07-20",
    modifiedBy: "HR Team",
    shared: true,
    starred: true,
    downloads: 156,
    views: 342,
  },
  {
    id: "DOC002",
    name: "Q2 Performance Reports",
    type: "Excel",
    size: "1.8 MB",
    category: "Reports",
    lastModified: "2024-07-18",
    modifiedBy: "John Smith",
    shared: false,
    starred: false,
    downloads: 23,
    views: 89,
  },
  {
    id: "DOC003",
    name: "Project Proposal - Mobile App",
    type: "Word",
    size: "856 KB",
    category: "Proposals",
    lastModified: "2024-07-15",
    modifiedBy: "Sarah Wilson",
    shared: true,
    starred: true,
    downloads: 45,
    views: 127,
  },
  {
    id: "DOC004",
    name: "Training Materials - React",
    type: "PDF",
    size: "5.2 MB",
    category: "Training",
    lastModified: "2024-07-12",
    modifiedBy: "Mike Johnson",
    shared: true,
    starred: false,
    downloads: 78,
    views: 234,
  },
  {
    id: "DOC005",
    name: "Budget Analysis 2024",
    type: "Excel",
    size: "3.1 MB",
    category: "Finance",
    lastModified: "2024-07-10",
    modifiedBy: "Emily Davis",
    shared: false,
    starred: false,
    downloads: 12,
    views: 56,
  },
]

const categories = ["All", "Policy", "Reports", "Proposals", "Training", "Finance", "Legal"]
const fileTypes = ["All", "PDF", "Word", "Excel", "PowerPoint"]

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return (
        <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-red-600" />
        </div>
      )
    case "word":
      return (
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
      )
    case "excel":
      return (
        <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
      )
    default:
      return (
        <div className="w-10 h-10 rounded-2xl bg-gray-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-gray-600" />
        </div>
      )
  }
}

export function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory
    const matchesType = selectedType === "All" || doc.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-2 font-poppins">
            Document Management
          </h1>
          <p className="text-muted-foreground text-lg">Organize and manage your company documents</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl bg-transparent">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{documents.length}</div>
            <div className="text-sm text-muted-foreground">Total Documents</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <Share className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{documents.filter((d) => d.shared).length}</div>
            <div className="text-sm text-muted-foreground">Shared Documents</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{documents.filter((d) => d.starred).length}</div>
            <div className="text-sm text-muted-foreground">Starred Documents</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {documents.reduce((sum, d) => sum + d.downloads, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Downloads</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border/30 backdrop-blur-sm rounded-2xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 rounded-2xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48 rounded-2xl">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                {fileTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card
            key={doc.id}
            className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl hover:bg-card/70 transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold font-poppins text-sm leading-tight">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl">
                      <DropdownMenuItem className="rounded-xl">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl">
                        <Star className="w-4 h-4 mr-2" />
                        {doc.starred ? "Unstar" : "Star"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="rounded-xl">
                  {doc.category}
                </Badge>
                {doc.shared && (
                  <Badge className="bg-green-500 text-white rounded-xl">
                    <Share className="w-3 h-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Modified {new Date(doc.lastModified).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Avatar className="w-4 h-4">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {doc.modifiedBy
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">by {doc.modifiedBy}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{doc.views}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{doc.downloads}</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 rounded-xl">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" className="flex-1 rounded-xl bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
