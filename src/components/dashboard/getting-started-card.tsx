import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GettingStartedCardProps {
  title: string;
  description: string;
  icon: "task" | "clock" | "document";
}

const iconMap = {
  task: CheckSquare,
  clock: Clock,
  document: FileText,
};

export function GettingStartedCard({
  title,
  description,
  icon,
}: GettingStartedCardProps) {
  const Icon = iconMap[icon];

  return (
    <Card className={cn("p-0 rounded-sm")}>
      <CardContent className="p-6 space-y-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center border"
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
