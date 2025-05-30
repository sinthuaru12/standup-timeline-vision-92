
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Dashboard } from "@/components/Dashboard";
import { TeamMemberManagement } from "@/components/TeamMemberManagement";
import { TimelineView } from "@/components/TimelineView";
import { RiskAnalysis } from "@/components/RiskAnalysis";
import { IndividualTimelines } from "@/components/IndividualTimelines";
import { SprintDashboard } from "@/components/SprintDashboard";
import { Settings } from "@/components/Settings";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [currentTeam, setCurrentTeam] = useState("Development Team");

  // Mock data - in real app this would come from your auth/data layer
  const userData = {
    name: "John Doe",
    avatar: "", // You can add a default avatar URL here
  };

  const teams = [
    "Development Team",
    "Design Team", 
    "Marketing Team",
    "Sales Team",
    "HR Team",
    "Product Team",
    "Engineering Team",
    "QA Team",
    "DevOps Team",
    "Data Science Team",
    "Customer Success Team",
    "Finance Team",
    "Legal Team",
    "Operations Team",
    "Business Development Team",
    "Research Team",
    "Security Team",
    "Infrastructure Team",
    "Mobile Team",
    "Frontend Team",
    "Backend Team",
    "Analytics Team",
    "Content Team",
    "Social Media Team",
    "Support Team"
  ];

  const handleTeamChange = (team: string) => {
    setCurrentTeam(team);
    console.log("Team changed to:", team);
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Add logout logic here
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "team-members":
        return <TeamMemberManagement />;
      case "timeline":
        return <TimelineView />;
      case "risk-analysis":
        return <RiskAnalysis />;
      case "individual-timelines":
        return <IndividualTimelines />;
      case "sprint-dashboard":
        return <SprintDashboard />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gray-50">
        <TopBar
          userName={userData.name}
          userAvatar={userData.avatar}
          currentTeam={currentTeam}
          teams={teams}
          onTeamChange={handleTeamChange}
          onLogout={handleLogout}
          activeView={activeView}
        />
        <div className="flex flex-1">
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
