
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Target, TrendingUp } from "lucide-react";

interface Team {
  id: number;
  name: string;
  members: number;
  progress: number;
  status: string;
  lead: string;
  project: string;
}

export function TeamOverview() {
  const teams: Team[] = [
    {
      id: 1,
      name: "Frontend Team",
      members: 5,
      progress: 78,
      status: "On Track",
      lead: "Sarah Chen",
      project: "Mobile App Redesign"
    },
    {
      id: 2,
      name: "Backend Team",
      members: 4,
      progress: 65,
      status: "At Risk",
      lead: "Mike Johnson",
      project: "API Infrastructure"
    },
    {
      id: 3,
      name: "QA Team",
      members: 3,
      progress: 90,
      status: "Ahead",
      lead: "Alex Rodriguez",
      project: "Testing Phase"
    },
    {
      id: 4,
      name: "Design Team",
      members: 3,
      progress: 85,
      status: "On Track",
      lead: "Emily Davis",
      project: "UI/UX Design"
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "On Track": "bg-green-100 text-green-800",
      "At Risk": "bg-red-100 text-red-800",
      "Ahead": "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const teamStats = [
    { title: "Total Teams", value: "4", icon: Users, color: "text-blue-600" },
    { title: "Active Projects", value: "4", icon: Target, color: "text-green-600" },
    { title: "Average Progress", value: "80%", icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{team.name}</span>
                <Badge className={getStatusColor(team.status)}>
                  {team.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium">{team.project}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Team Lead:</span>
                <span className="font-medium">{team.lead}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Members:</span>
                <span className="font-medium">{team.members}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{team.progress}%</span>
                </div>
                <Progress value={team.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
