
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Trash2, Plus } from "lucide-react";

interface Team {
  id: number;
  name: string;
  members: number;
  maintainer: string;
  project: string;
  status: string;
  createdDate: string;
}

const availableMaintainers = [
  "Sarah Chen",
  "Mike Johnson", 
  "Emily Davis",
  "Alex Rodriguez",
  "Lisa Wang",
  "John Smith"
];

export function Settings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamMaintainer, setNewTeamMaintainer] = useState("");
  const [newTeamProject, setNewTeamProject] = useState("");

  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Frontend Team",
      members: 5,
      maintainer: "Sarah Chen",
      project: "Mobile App Redesign",
      status: "Active",
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Backend Team",
      members: 4,
      maintainer: "Mike Johnson",
      project: "API Infrastructure",
      status: "Active",
      createdDate: "2024-01-10"
    },
    {
      id: 3,
      name: "QA Team",
      members: 3,
      maintainer: "Alex Rodriguez",
      project: "Testing Phase",
      status: "Active",
      createdDate: "2024-01-20"
    },
    {
      id: 4,
      name: "Design Team",
      members: 3,
      maintainer: "Emily Davis",
      project: "UI/UX Design",
      status: "Active",
      createdDate: "2024-01-12"
    },
  ]);

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.maintainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeam = () => {
    if (!newTeamName || !newTeamMaintainer || !newTeamProject) return;

    const newTeam: Team = {
      id: teams.length + 1,
      name: newTeamName,
      members: 1,
      maintainer: newTeamMaintainer,
      project: newTeamProject,
      status: "Active",
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setNewTeamMaintainer("");
    setNewTeamProject("");
    setShowAddTeam(false);
  };

  const handleDeleteTeam = (teamId: number) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Team Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </CardTitle>
            <Button 
              onClick={() => setShowAddTeam(!showAddTeam)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Team Form */}
          {showAddTeam && (
            <Card className="border-2 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    placeholder="Team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                  <Select value={newTeamMaintainer} onValueChange={setNewTeamMaintainer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maintainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMaintainers.map((maintainer) => (
                        <SelectItem key={maintainer} value={maintainer}>
                          {maintainer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Project name"
                    value={newTeamProject}
                    onChange={(e) => setNewTeamProject(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTeam} size="sm">Add Team</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddTeam(false)} 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search teams..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Teams Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Maintainer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.maintainer}</TableCell>
                  <TableCell>{team.project}</TableCell>
                  <TableCell>{team.members}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(team.status)}>
                      {team.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{team.createdDate}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
