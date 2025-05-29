
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Trash2, Plus, Upload, UserPlus, Settings as SettingsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import * as XLSX from 'xlsx';

interface Team {
  id: number;
  name: string;
  members: number;
  maintainer: string;
  project: string;
  status: string;
  createdDate: string;
  googleSheetsEnabled: boolean;
  autoUpdates: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  designation: string;
  role: string;
  status: string;
}

interface TeamMember {
  name: string;
  email: string;
  designation: string;
}

const availableMaintainers = [
  "Sarah Chen",
  "Mike Johnson", 
  "Emily Davis",
  "Alex Rodriguez",
  "Lisa Wang",
  "John Smith"
];

const availableRoles = ["Admin", "Manager", "Member", "Viewer"];

export function Settings() {
  const [activeTab, setActiveTab] = useState("teams");
  
  // Team Management State
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamMaintainer, setNewTeamMaintainer] = useState("");
  const [newTeamProject, setNewTeamProject] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Frontend Team",
      members: 5,
      maintainer: "Sarah Chen",
      project: "Mobile App Redesign",
      status: "Active",
      createdDate: "2024-01-15",
      googleSheetsEnabled: true,
      autoUpdates: false
    },
    {
      id: 2,
      name: "Backend Team",
      members: 4,
      maintainer: "Mike Johnson",
      project: "API Infrastructure",
      status: "Active",
      createdDate: "2024-01-10",
      googleSheetsEnabled: false,
      autoUpdates: true
    },
  ]);

  // User Management State
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserDesignation, setNewUserDesignation] = useState("");
  const [newUserRole, setNewUserRole] = useState("");

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Sarah Chen", email: "sarah@company.com", designation: "Product Manager", role: "Admin", status: "active" },
    { id: 2, name: "Mike Johnson", email: "mike@company.com", designation: "Developer", role: "Manager", status: "active" },
  ]);

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.maintainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.designation.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as TeamMember[];
      
      setTeamMembers(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const handleUserFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
      
      const newUsers = jsonData.map((userData, index) => ({
        id: users.length + index + 1,
        name: userData.name || "",
        email: userData.email || "",
        designation: userData.designation || "",
        role: userData.role || "Member",
        status: "active"
      }));
      
      setUsers([...users, ...newUsers]);
    };
    reader.readAsBinaryString(file);
  };

  const handleAddTeam = () => {
    if (!newTeamName || !newTeamMaintainer || !newTeamProject) return;

    const newTeam: Team = {
      id: teams.length + 1,
      name: newTeamName,
      members: teamMembers.length || 1,
      maintainer: newTeamMaintainer,
      project: newTeamProject,
      status: "Active",
      createdDate: new Date().toISOString().split('T')[0],
      googleSheetsEnabled: false,
      autoUpdates: false
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setNewTeamMaintainer("");
    setNewTeamProject("");
    setTeamMembers([]);
    setShowAddTeam(false);
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserDesignation || !newUserRole) return;

    const newUser: User = {
      id: users.length + 1,
      name: newUserName,
      email: `${newUserName.toLowerCase().replace(' ', '.')}@company.com`,
      designation: newUserDesignation,
      role: newUserRole,
      status: "active"
    };

    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserDesignation("");
    setNewUserRole("");
    setShowAddUser(false);
  };

  const handleDeleteTeam = (teamId: number) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const toggleTeamFeature = (teamId: number, feature: 'googleSheetsEnabled' | 'autoUpdates') => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, [feature]: !team[feature] }
        : team
    ));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      "Admin": "bg-red-100 text-red-800",
      "Manager": "bg-blue-100 text-blue-800",
      "Member": "bg-green-100 text-green-800",
      "Viewer": "bg-gray-100 text-gray-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("teams")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "teams"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Team Management
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "users"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          User Management
        </button>
      </div>

      {/* Team Management Tab */}
      {activeTab === "teams" && (
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
                  
                  {/* File Upload for Team Members */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Team Members (XLSX)</label>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">Expected columns: name, email, designation</p>
                    {teamMembers.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        {teamMembers.length} members loaded from file
                      </p>
                    )}
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
                  <TableHead>Google Sheets</TableHead>
                  <TableHead>Auto Updates</TableHead>
                  <TableHead>Status</TableHead>
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
                      <Switch
                        checked={team.googleSheetsEnabled}
                        onCheckedChange={() => toggleTeamFeature(team.id, 'googleSheetsEnabled')}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={team.autoUpdates}
                        onCheckedChange={() => toggleTeamFeature(team.id, 'autoUpdates')}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(team.status)}>
                        {team.status}
                      </Badge>
                    </TableCell>
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
      )}

      {/* User Management Tab */}
      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                User Management
              </CardTitle>
              <Button 
                onClick={() => setShowAddUser(!showAddUser)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add User Form */}
            {showAddUser && (
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="User name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                    <Input
                      placeholder="Designation"
                      value={newUserDesignation}
                      onChange={(e) => setNewUserDesignation(e.target.value)}
                    />
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* File Upload for Users */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Users (XLSX)</label>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleUserFileUpload}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">Expected columns: name, email, designation, role</p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddUser} size="sm">Add User</Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddUser(false)} 
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
                placeholder="Search users..." 
                className="pl-10"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.designation}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
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
      )}
    </div>
  );
}
