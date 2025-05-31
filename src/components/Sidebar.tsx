
import { Users, Calendar, BarChart3, Settings, Home, UserCircle, AlertTriangle, TrendingUp, Timer, MessageSquare, Send } from "lucide-react";
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
  isAdminMode: boolean;
}

const teamMenuItems = [
  { id: "dashboard", title: "Dashboard", icon: Home },
  { id: "team-members", title: "Team Members", icon: UserCircle },
  { id: "timeline", title: "Timeline", icon: Calendar },
  { id: "risk-analysis", title: "Risk Analysis", icon: AlertTriangle },
  { id: "individual-timelines", title: "Individual Timelines", icon: TrendingUp },
  { id: "sprint-dashboard", title: "Sprint Dashboard", icon: Timer },
];

const adminMenuItems = [
  { id: "user-management", title: "User Management", icon: Users },
  { id: "team-management", title: "Team Management", icon: Users },
  { id: "survey-management", title: "Survey Management", icon: MessageSquare },
  { id: "broadcast-messages", title: "Broadcast Messages", icon: Send },
  { id: "settings", title: "Settings", icon: Settings },
];

export function Sidebar({ activeView, onViewChange, isAdminMode }: SidebarProps) {
  const menuItems = isAdminMode ? adminMenuItems : teamMenuItems;

  return (
    <SidebarContainer 
      className="w-64 border-r bg-background"
      collapsible="none"
    >
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600 flex-shrink-0" />
          <span className="text-xl font-bold text-foreground">
            ProjectFlow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-2">
            {isAdminMode ? "Admin" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeView === item.id 
                        ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600" 
                        : "text-foreground hover:bg-accent"
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
      </SidebarContent>
    </SidebarContainer>
  );
}
