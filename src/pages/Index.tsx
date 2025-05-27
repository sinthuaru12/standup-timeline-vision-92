
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { UserManagement } from "@/components/UserManagement";
import { TeamOverview } from "@/components/TeamOverview";
import { TimelineView } from "@/components/TimelineView";
import { RiskAnalysis } from "@/components/RiskAnalysis";
import { IndividualTimelines } from "@/components/IndividualTimelines";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserManagement />;
      case "teams":
        return <TeamOverview />;
      case "timeline":
        return <TimelineView />;
      case "risk-analysis":
        return <RiskAnalysis />;
      case "individual-timelines":
        return <IndividualTimelines />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
