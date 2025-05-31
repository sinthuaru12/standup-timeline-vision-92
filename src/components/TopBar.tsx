
import { useState } from "react";
import { Search, ChevronDown, LogOut, User, Users, ArrowLeft, Shield, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

interface TopBarProps {
  userName: string;
  userAvatar?: string;
  currentTeam: string;
  teams: string[];
  onTeamChange: (team: string) => void;
  onLogout: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  isAdminMode: boolean;
  onAdminModeChange: (isAdmin: boolean) => void;
}

export function TopBar({ 
  userName, 
  userAvatar, 
  currentTeam, 
  teams, 
  onTeamChange, 
  onLogout,
  activeView,
  onViewChange,
  isAdminMode,
  onAdminModeChange
}: TopBarProps) {
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();

  const filteredTeams = teams.filter(team => 
    team.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  const handleBackToTeam = () => {
    onAdminModeChange(false);
    onViewChange("dashboard");
  };

  const handleAdminAccess = () => {
    onAdminModeChange(true);
    onViewChange("user-management");
  };

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left side - Current Team Display or Admin Mode */}
      <div className="flex items-center space-x-4">
        {isAdminMode ? (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleBackToTeam} className="flex items-center space-x-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Team</span>
            </Button>
            <span className="text-sm font-medium text-muted-foreground">Admin Mode</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">Team:</span>
            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800">
              <span className="font-semibold">{currentTeam}</span>
            </div>
          </div>
        )}
      </div>

      {/* Right side - User info and actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64"
          />
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{userName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onViewChange("profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange("teams")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Teams</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAdminAccess}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Users className="mr-2 h-4 w-4" />
                <span>Switch Team</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                <div className="p-2">
                  <Input
                    placeholder="Search teams..."
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredTeams.map((team) => (
                    <DropdownMenuItem 
                      key={team} 
                      onClick={() => onTeamChange(team)}
                      className={currentTeam === team ? "bg-accent" : ""}
                    >
                      <span>{team}</span>
                    </DropdownMenuItem>
                  ))}
                  {filteredTeams.length === 0 && (
                    <DropdownMenuItem disabled>
                      <span className="text-muted-foreground">No teams found</span>
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
