import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Github, Linkedin, ArrowRight } from "lucide-react";
import Image from "next/image";

interface IntegrationCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: "slack" | "github" | "linkedin";
  image?: string;
  connected?: boolean;
}

const iconMap = {
  slack: MessageSquare,
  github: Github,
  linkedin: Linkedin,
};

export function IntegrationCard({
  title,
  description,
  buttonText,
  buttonIcon,
  image,
  connected = false,
}: IntegrationCardProps) {
  const Icon = iconMap[buttonIcon];

  return (
    <Card
      className={`p-0 integration-card card-hover-lift animate-fade-in rounded-sm ${
        connected ? "integration-card-connected" : ""
      }`}
    >
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-balance">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
            {description}
          </p>
        </div>

        {image && (
          <div className="relative h-32 rounded-lg overflow-hidden bg-muted animate-scale-in">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 animate-slide-up">
          <Icon className="w-4 h-4 mr-2" />
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
