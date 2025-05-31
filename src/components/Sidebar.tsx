
import { Users, Calendar, BarChart3, Settings, Home, UserCircle, AlertTriangle, TrendingUp, Timer, User, Users2, MessageSquare, Send, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const mainMenuItems = [
  { id: "dashboard", title: "Dashboard", icon: Home },
  { id: "team-members", title: "Team Members", icon: UserCircle },
  { id: "timeline", title: "Timeline", icon: Calendar },
  { id: "risk-analysis", title: "Risk Analysis", icon: AlertTriangle },
  { id: "individual-timelines", title: "Individual Timelines", icon: TrendingUp },
  { id: "sprint-dashboard", title: "Sprint Dashboard", icon: Timer },
];

const profileTeamsItems = [
  { id: "profile", title: "Profile", icon: User },
  { id: "teams", title: "Teams", icon: Users2 },
];

const adminItems = [
  { id: "user-management", title: "User Management", icon: Users },
  { id: "team-management", title: "Team Management", icon: Users2 },
  { id: "survey-management", title: "Survey Management", icon: MessageSquare },
  { id: "broadcast-messages", title: "Broadcast Messages", icon: Send },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    profileTeams: false,
    admin: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <SidebarContainer 
      className="w-64 border-r bg-white"
      collapsible="none"
    >
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600 flex-shrink-0" />
          <span className="text-xl font-bold text-gray-900">
            ProjectFlow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeView === item.id 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile & Teams Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => toggleSection('profileTeams')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Profile & Teams</span>
                  </div>
                  {expandedSections.profileTeams ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </SidebarMenuButton>
              </SidebarMenuItem>
              {expandedSections.profileTeams && profileTeamsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors ${
                      activeView === item.id 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => toggleSection('admin')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Admin</span>
                  </div>
                  {expandedSections.admin ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </SidebarMenuButton>
              </SidebarMenuItem>
              {expandedSections.admin && adminItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors ${
                      activeView === item.id 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
}
