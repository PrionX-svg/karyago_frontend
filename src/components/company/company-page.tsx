"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Heart,
} from "lucide-react";
import { MetricCard } from "../metric-card";

// Mock company data
const companyInfo = {
  name: "AmaHR Technologies",
  founded: "2018",
  headquarters: "San Francisco, CA",
  employees: 418,
  offices: 5,
  revenue: "$12.5M",
  website: "www.amahr.com",
  email: "contact@amahr.com",
  phone: "+1 (555) 123-4567",
  description:
    "Leading provider of innovative HR management solutions, helping companies streamline their human resources processes with cutting-edge technology and exceptional service.",
};

const leadership = [
  {
    name: "Trisha Kyrlova",
    position: "Chief Executive Officer",
    department: "Executive",
    avatar: "/placeholder.svg?height=60&width=60&text=TK",
    bio: "Visionary leader with 15+ years in HR technology",
    email: "trisha@amahr.com",
  },
  {
    name: "John Smith",
    position: "Chief Technology Officer",
    department: "Engineering",
    avatar: "/placeholder.svg?height=60&width=60&text=JS",
    bio: "Tech innovator specializing in scalable HR solutions",
    email: "john@amahr.com",
  },
  {
    name: "Sarah Wilson",
    position: "Chief People Officer",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=60&width=60&text=SW",
    bio: "HR expert focused on employee experience and culture",
    email: "sarah@amahr.com",
  },
  {
    name: "Mike Johnson",
    position: "Chief Financial Officer",
    department: "Finance",
    avatar: "/placeholder.svg?height=60&width=60&text=MJ",
    bio: "Financial strategist driving sustainable growth",
    email: "mike@amahr.com",
  },
];

const offices = [
  {
    city: "San Francisco",
    country: "USA",
    address: "123 Market Street, San Francisco, CA 94105",
    employees: 180,
    type: "Headquarters",
  },
  {
    city: "New York",
    country: "USA",
    address: "456 Broadway, New York, NY 10013",
    employees: 95,
    type: "Regional Office",
  },
  {
    city: "Austin",
    country: "USA",
    address: "789 Congress Ave, Austin, TX 78701",
    employees: 75,
    type: "Development Center",
  },
  {
    city: "London",
    country: "UK",
    address: "321 Oxford Street, London W1C 2HT",
    employees: 45,
    type: "European Office",
  },
  {
    city: "Toronto",
    country: "Canada",
    address: "654 King Street, Toronto, ON M5V 1M7",
    employees: 23,
    type: "Canadian Office",
  },
];

const companyValues = [
  {
    title: "Innovation",
    description:
      "We continuously push boundaries to create cutting-edge HR solutions",
    icon: Target,
    color: "bg-blue-500/20 text-blue-600",
  },
  {
    title: "People First",
    description:
      "Our employees and customers are at the heart of everything we do",
    icon: Heart,
    color: "bg-red-500/20 text-red-600",
  },
  {
    title: "Excellence",
    description:
      "We strive for excellence in every product and service we deliver",
    icon: Award,
    color: "bg-yellow-500/20 text-yellow-600",
  },
  {
    title: "Growth",
    description:
      "We foster continuous learning and development for all team members",
    icon: TrendingUp,
    color: "bg-green-500/20 text-green-600",
  },
];

const milestones = [
  {
    year: "2018",
    event: "Company Founded",
    description: "AmaHR Technologies established in San Francisco",
  },
  {
    year: "2019",
    event: "First Product Launch",
    description: "Released our flagship HR management platform",
  },
  {
    year: "2020",
    event: "Series A Funding",
    description: "Raised $5M in Series A funding round",
  },
  {
    year: "2021",
    event: "100 Employees",
    description: "Reached milestone of 100+ team members",
  },
  {
    year: "2022",
    event: "International Expansion",
    description: "Opened offices in London and Toronto",
  },
  {
    year: "2023",
    event: "Series B Funding",
    description: "Secured $15M Series B for global expansion",
  },
  {
    year: "2024",
    event: "400+ Employees",
    description: "Growing team across 5 global offices",
  },
];

export function CompanyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-2 font-poppins">
          About {companyInfo.name}
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          {companyInfo.description}
        </p>
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Founded"
          value={companyInfo.founded}
          change="6 years ago"
          trend="neutral"
          icon={Calendar}
          variant="primary"
        />
        <MetricCard
          title="Employees"
          value={companyInfo.employees.toString()}
          change="+45 this year"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Global Offices"
          value={companyInfo.offices.toString()}
          change="2 countries"
          trend="up"
          icon={Building2}
        />
        <MetricCard
          title="Annual Revenue"
          value={companyInfo.revenue}
          change="+28% YoY"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Company Information */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.headquarters}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.website}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Team Size</p>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.employees} employees
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Established</p>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.founded}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leadership Team */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            Leadership Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <Avatar className="w-16 h-16 ring-2 ring-border">
                  <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold font-poppins">{leader.name}</h3>
                  <p className="text-sm text-primary font-medium">
                    {leader.position}
                  </p>
                  <Badge variant="outline" className="mt-2 rounded-xl">
                    {leader.department}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {leader.bio}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {leader.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Values */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            Our Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold font-poppins mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global Offices */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            Global Offices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold font-poppins">
                      {office.city}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {office.country}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-xl">
                    {office.type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {office.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {office.employees} employees
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Timeline */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            Company Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {milestone.year}
                    </span>
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-px h-12 bg-border mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="font-semibold font-poppins">
                    {milestone.event}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
