
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Settings } from "lucide-react";

const teams = [
  {
    id: 1,
    name: "Development Team",
    description: "Frontend and backend developers",
    memberCount: 8,
    role: "Team Lead",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Design Team",
    description: "UI/UX designers and researchers",
    memberCount: 5,
    role: "Member",
    color: "bg-purple-500"
  },
  {
    id: 3,
    name: "Product Team",
    description: "Product managers and analysts",
    memberCount: 4,
    role: "Member",
    color: "bg-green-500"
  }
];

export function Teams() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-gray-600">Manage your team memberships and roles</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Join Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-3 h-3 rounded-full ${team.color}`} />
                <Badge variant={team.role === "Team Lead" ? "default" : "secondary"}>
                  {team.role}
                </Badge>
              </div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{team.memberCount} members</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
