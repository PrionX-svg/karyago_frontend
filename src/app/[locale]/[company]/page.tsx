"use client";

import { GettingStartedCard } from "@/components/dashboard/getting-started-card";
import { IntegrationCard } from "@/components/dashboard/integration-card";
import { GitHubContribution } from "@/components/dashboard/github-contribution";
import { ClockWidget } from "@/components/dashboard/clock-widget";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Getting Started
        </h1>
        <p className="text-muted-foreground">
          Take few minutes to discover about new feature!
        </p>
      </div>

      {/* Clock Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <ClockWidget />
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GettingStartedCard
              title="Easy Manage Task"
              description="With this new feature, it is very easy for users to manage tasks and easily collaborate with all departmental lines in your company"
              icon="task"
            />
            <GettingStartedCard
              title="Easy Request Time-off"
              description="Simplify your vacation leave with just one click, and you can customize it however you like, let's plan your vacation right now"
              icon="clock"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GettingStartedCard
          title="Easy Manage Task"
          description="With this new feature, it is very easy for users to manage tasks and easily collaborate with all departmental lines in your company"
          icon="task"
        />
        <GettingStartedCard
          title="Easy Request Time-off"
          description="Simplify your vacation leave with just one click, and you can customize it however you like, let's plan your vacation right now"
          icon="clock"
        />
        <GettingStartedCard
          title="Payroll History"
          description="Your payroll report now has a fresher look and makes it easier for users to see all your achievements in your company"
          icon="document"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationCard
          title="Community Sharing"
          description="With easy access between platforms you can use it at the same time it's very easy to be able to share successful moments while working, be the first to try!"
          buttonText="Connect LinkedIn Account"
          buttonIcon="linkedin"
          image="https://user-images.githubusercontent.com/6633808/160689302-3fe5e5d4-ba24-4525-8ed1-a8351ccbc0ef.png"
        />
        <IntegrationCard
          title="Slack Integration"
          description="Quick features now makes it easy to collaborate using the Slack platform, to increase your productivity between departments in your team"
          buttonText="Connect Slack Account"
          buttonIcon="slack"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GitHubContribution />
        <IntegrationCard
          title="Github Integration"
          description="Easy access to log your work activity properly easy to handle all about development with your Github account, suitable for your profile as developer or engineer"
          buttonText="Connect Github Account"
          buttonIcon="github"
        />
      </div>
    </div>
  );
}
