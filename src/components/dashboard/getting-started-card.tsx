import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GettingStartedCardProps {
  title: string;
  description: string;
  icon: "task" | "clock" | "document";
  color: "blue" | "purple" | "green";
}

const iconMap = {
  task: CheckSquare,
  clock: Clock,
  document: FileText,
};

const colorMap = {
  blue: "bg-feature-task/10 text-feature-task border-feature-task/20",
  purple:
    "bg-feature-time-off/10 text-feature-time-off border-feature-time-off/20",
  green: "bg-feature-payroll/10 text-feature-payroll border-feature-payroll/20",
};

const cardTypeMap = {
  blue: "feature-card-task",
  purple: "feature-card-time-off",
  green: "feature-card-payroll",
};

export function GettingStartedCard({
  title,
  description,
  icon,
  color,
}: GettingStartedCardProps) {
  const Icon = iconMap[icon];

  return (
    <Card
      className={cn("p-0 feature-card card-hover-lift", cardTypeMap[color])}
    >
      <CardContent className="p-6 space-y-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center border",
            colorMap[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-balance">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
            {description}
          </p>
        </div>

        <Button
          variant="ghost"
          className="p-0 h-auto text-primary hover:text-primary/80 animate-fade-in"
        >
          Learn more
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
