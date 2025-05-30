
import { Users, Calendar, BarChart3, Settings, Home, UserCircle, AlertTriangle, TrendingUp, Timer } from "lucide-react";
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

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: Home },
  { id: "team-members", title: "Team Members", icon: UserCircle },
  { id: "timeline", title: "Timeline", icon: Calendar },
  { id: "risk-analysis", title: "Risk Analysis", icon: AlertTriangle },
  { id: "individual-timelines", title: "Individual Timelines", icon: TrendingUp },
  { id: "sprint-dashboard", title: "Sprint Dashboard", icon: Timer },
  { id: "settings", title: "Settings", icon: Settings },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <SidebarContainer 
      className="w-64 border-r bg-white group-data-[collapsible=icon]:w-16 transition-all duration-300 group-hover/sidebar-wrapper:w-64"
      collapsible="icon"
    >
      <SidebarHeader className="p-6 group-data-[collapsible=icon]:p-3 transition-all duration-300">
        <div className="flex items-center space-x-2 group-data-[collapsible=icon]:justify-center">
          <BarChart3 className="h-8 w-8 text-blue-600 flex-shrink-0" />
          <span className="text-xl font-bold text-gray-900 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden transition-all duration-300 group-hover/sidebar-wrapper:opacity-100 group-hover/sidebar-wrapper:w-auto">
            ProjectFlow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:h-0 overflow-hidden transition-all duration-300 group-hover/sidebar-wrapper:opacity-100 group-hover/sidebar-wrapper:h-auto">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    tooltip={item.title}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group-data-[collapsible=icon]:justify-center ${
                      activeView === item.id 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden transition-all duration-300 group-hover/sidebar-wrapper:opacity-100 group-hover/sidebar-wrapper:w-auto">
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
