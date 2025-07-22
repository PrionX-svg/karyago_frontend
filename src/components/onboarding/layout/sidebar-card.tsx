"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface SidebarCardProps {
    icon: LucideIcon
    title: string
    description: string
    items?: string[]
    variant?: "primary" | "secondary"
}

export function SidebarCard({ icon: Icon, title, description, items, variant = "primary" }: SidebarCardProps) {
    const bgColor = variant === "primary" ? "bg-gradient-to-br from-orange-300 to-orange-400" : "bg-white"
    const textColor = variant === "primary" ? "text-white" : "text-gray-800"
    const descColor = variant === "primary" ? "text-orange-50" : "text-gray-600"

    return (
        <Card
            className={`${bgColor} ${variant === "secondary" ? "border border-gray-200 shadow-sm" : "border-0 shadow-md"}`}
        >
            <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${variant === "primary" ? "text-white" : "text-orange-400"}`} />
                    <h3 className={`font-semibold text-sm lg:text-base ${textColor}`}>{title}</h3>
                </div>
                <p className={`text-xs lg:text-sm ${descColor} mb-3 lg:mb-4 leading-relaxed`}>{description}</p>
                {items && (
                    <ul className="space-y-1.5 lg:space-y-2">
                        {items.map((item, index) => (
                            <li key={index} className={`text-xs lg:text-sm ${descColor} flex items-start gap-2`}>
                                <span
                                    className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full ${variant === "primary" ? "bg-orange-100" : "bg-orange-400"} mt-1.5 lg:mt-2 flex-shrink-0`}
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
