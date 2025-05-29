import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Trash2, Plus, Upload, UserPlus, Settings as SettingsIcon, Send, MessageSquare, BarChart3, Edit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

interface BroadcastMessage {
  id: number;
  title: string;
  message: string;
  recipients: string[];
  schedule: string;
  frequency: string;
  status: string;
  createdDate: string;
  sentCount: number;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  questions: string[];
  recipients: string[];
  status: string;
  createdDate: string;
  responses: number;
  isEdited: boolean;
}

interface SurveyResponse {
  id: number;
  surveyId: number;
  userName: string;
  answers: string[];
  submittedDate: string;
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
const scheduleFrequencies = ["One Time", "Daily", "Weekly", "Monthly"];

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

  // Broadcast Messages State
  const [showAddBroadcast, setShowAddBroadcast] = useState(false);
  const [newBroadcastTitle, setNewBroadcastTitle] = useState("");
  const [newBroadcastMessage, setNewBroadcastMessage] = useState("");
  const [newBroadcastRecipients, setNewBroadcastRecipients] = useState<string[]>([]);
  const [newBroadcastSchedule, setNewBroadcastSchedule] = useState("");
  const [newBroadcastFrequency, setNewBroadcastFrequency] = useState("");

  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([
    {
      id: 1,
      title: "Weekly Team Update",
      message: "Please submit your weekly reports by Friday.",
      recipients: ["All Users"],
      schedule: "2024-01-20",
      frequency: "Weekly",
      status: "Active",
      createdDate: "2024-01-15",
      sentCount: 15
    }
  ]);

  // Survey Management State
  const [showAddSurvey, setShowAddSurvey] = useState(false);
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [newSurveyDescription, setNewSurveyDescription] = useState("");
  const [newSurveyQuestions, setNewSurveyQuestions] = useState<string[]>([""]);
  const [newSurveyRecipients, setNewSurveyRecipients] = useState<string[]>([]);
  const [editingSurveyId, setEditingSurveyId] = useState<number | null>(null);

  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: 1,
      title: "Employee Satisfaction Survey",
      description: "Annual survey to measure employee satisfaction and engagement.",
      questions: ["How satisfied are you with your current role?", "Rate the work-life balance"],
      recipients: ["All Users"],
      status: "Active",
      createdDate: "2024-01-10",
      responses: 8,
      isEdited: false
    }
  ]);

  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([
    {
      id: 1,
      surveyId: 1,
      userName: "Sarah Chen",
      answers: ["Very Satisfied", "Good"],
      submittedDate: "2024-01-12"
    }
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

  // Broadcast Message Handlers
  const handleAddBroadcast = () => {
    if (!newBroadcastTitle || !newBroadcastMessage) return;

    const newBroadcast: BroadcastMessage = {
      id: broadcasts.length + 1,
      title: newBroadcastTitle,
      message: newBroadcastMessage,
      recipients: newBroadcastRecipients.length > 0 ? newBroadcastRecipients : ["All Users"],
      schedule: newBroadcastSchedule || new Date().toISOString().split('T')[0],
      frequency: newBroadcastFrequency || "One Time",
      status: "Active",
      createdDate: new Date().toISOString().split('T')[0],
      sentCount: 0
    };

    setBroadcasts([...broadcasts, newBroadcast]);
    setNewBroadcastTitle("");
    setNewBroadcastMessage("");
    setNewBroadcastRecipients([]);
    setNewBroadcastSchedule("");
    setNewBroadcastFrequency("");
    setShowAddBroadcast(false);
  };

  const handleDeleteBroadcast = (broadcastId: number) => {
    setBroadcasts(broadcasts.filter(broadcast => broadcast.id !== broadcastId));
  };

  const toggleBroadcastStatus = (broadcastId: number) => {
    setBroadcasts(broadcasts.map(broadcast => 
      broadcast.id === broadcastId 
        ? { ...broadcast, status: broadcast.status === "Active" ? "Paused" : "Active" }
        : broadcast
    ));
  };

  // Survey Handlers
  const handleAddSurvey = () => {
    if (!newSurveyTitle || !newSurveyDescription || newSurveyQuestions.filter(q => q.trim()).length === 0) return;

    const newSurvey: Survey = {
      id: surveys.length + 1,
      title: newSurveyTitle,
      description: newSurveyDescription,
      questions: newSurveyQuestions.filter(q => q.trim()),
      recipients: newSurveyRecipients.length > 0 ? newSurveyRecipients : ["All Users"],
      status: "Active",
      createdDate: new Date().toISOString().split('T')[0],
      responses: 0,
      isEdited: false
    };

    setSurveys([...surveys, newSurvey]);
    setNewSurveyTitle("");
    setNewSurveyDescription("");
    setNewSurveyQuestions([""]);
    setNewSurveyRecipients([]);
    setShowAddSurvey(false);
  };

  const handleEditSurvey = (surveyId: number) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey || survey.isEdited) return;

    setEditingSurveyId(surveyId);
    setNewSurveyTitle(survey.title);
    setNewSurveyDescription(survey.description);
    setNewSurveyQuestions(survey.questions);
    setNewSurveyRecipients(survey.recipients);
    setShowAddSurvey(true);
  };

  const handleUpdateSurvey = () => {
    if (!editingSurveyId || !newSurveyTitle || !newSurveyDescription) return;

    setSurveys(surveys.map(survey => 
      survey.id === editingSurveyId 
        ? { 
            ...survey, 
            title: newSurveyTitle,
            description: newSurveyDescription,
            questions: newSurveyQuestions.filter(q => q.trim()),
            recipients: newSurveyRecipients.length > 0 ? newSurveyRecipients : ["All Users"],
            isEdited: true
          }
        : survey
    ));

    setNewSurveyTitle("");
    setNewSurveyDescription("");
    setNewSurveyQuestions([""]);
    setNewSurveyRecipients([]);
    setEditingSurveyId(null);
    setShowAddSurvey(false);
  };

  const handleDeleteSurvey = (surveyId: number) => {
    setSurveys(surveys.filter(survey => survey.id !== surveyId));
    setSurveyResponses(surveyResponses.filter(response => response.surveyId !== surveyId));
  };

  const addSurveyQuestion = () => {
    setNewSurveyQuestions([...newSurveyQuestions, ""]);
  };

  const updateSurveyQuestion = (index: number, value: string) => {
    const updated = [...newSurveyQuestions];
    updated[index] = value;
    setNewSurveyQuestions(updated);
  };

  const removeSurveyQuestion = (index: number) => {
    if (newSurveyQuestions.length > 1) {
      setNewSurveyQuestions(newSurveyQuestions.filter((_, i) => i !== index));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-red-100 text-red-800",
      "Paused": "bg-yellow-100 text-yellow-800",
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
        <button
          onClick={() => setActiveTab("broadcasts")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "broadcasts"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Broadcast Messages
        </button>
        <button
          onClick={() => setActiveTab("surveys")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "surveys"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Survey Management
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

      {/* Broadcast Messages Tab */}
      {activeTab === "broadcasts" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Broadcast Messages
              </CardTitle>
              <Button 
                onClick={() => setShowAddBroadcast(!showAddBroadcast)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Broadcast
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Broadcast Form */}
            {showAddBroadcast && (
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Broadcast title"
                      value={newBroadcastTitle}
                      onChange={(e) => setNewBroadcastTitle(e.target.value)}
                    />
                    <Select value={newBroadcastFrequency} onValueChange={setNewBroadcastFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleFrequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mb-4">
                    <Textarea
                      placeholder="Broadcast message"
                      value={newBroadcastMessage}
                      onChange={(e) => setNewBroadcastMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipients</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={newBroadcastRecipients.includes("All Users")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewBroadcastRecipients(["All Users"]);
                              } else {
                                setNewBroadcastRecipients([]);
                              }
                            }}
                          />
                          <span className="text-sm">All Users</span>
                        </div>
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={newBroadcastRecipients.includes(user.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewBroadcastRecipients([...newBroadcastRecipients.filter(r => r !== "All Users"), user.name]);
                                } else {
                                  setNewBroadcastRecipients(newBroadcastRecipients.filter(r => r !== user.name));
                                }
                              }}
                              disabled={newBroadcastRecipients.includes("All Users")}
                            />
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Schedule Date</label>
                      <Input
                        type="date"
                        value={newBroadcastSchedule}
                        onChange={(e) => setNewBroadcastSchedule(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddBroadcast} size="sm">Create Broadcast</Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddBroadcast(false)} 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Broadcasts Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts.map((broadcast) => (
                  <TableRow key={broadcast.id}>
                    <TableCell className="font-medium">{broadcast.title}</TableCell>
                    <TableCell>{broadcast.recipients.join(", ")}</TableCell>
                    <TableCell>{broadcast.frequency}</TableCell>
                    <TableCell>{broadcast.schedule}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(broadcast.status)}>
                          {broadcast.status}
                        </Badge>
                        <Switch
                          checked={broadcast.status === "Active"}
                          onCheckedChange={() => toggleBroadcastStatus(broadcast.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{broadcast.sentCount}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBroadcast(broadcast.id)}
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

      {/* Survey Management Tab */}
      {activeTab === "surveys" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Survey Management
              </CardTitle>
              <Button 
                onClick={() => setShowAddSurvey(!showAddSurvey)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add/Edit Survey Form */}
            {showAddSurvey && (
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Survey title"
                      value={newSurveyTitle}
                      onChange={(e) => setNewSurveyTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Textarea
                      placeholder="Survey description"
                      value={newSurveyDescription}
                      onChange={(e) => setNewSurveyDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Questions</label>
                    {newSurveyQuestions.map((question, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder={`Question ${index + 1}`}
                          value={question}
                          onChange={(e) => updateSurveyQuestion(index, e.target.value)}
                        />
                        {newSurveyQuestions.length > 1 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeSurveyQuestion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addSurveyQuestion}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Recipients</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={newSurveyRecipients.includes("All Users")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewSurveyRecipients(["All Users"]);
                            } else {
                              setNewSurveyRecipients([]);
                            }
                          }}
                        />
                        <span className="text-sm">All Users</span>
                      </div>
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox 
                            checked={newSurveyRecipients.includes(user.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewSurveyRecipients([...newSurveyRecipients.filter(r => r !== "All Users"), user.name]);
                              } else {
                                setNewSurveyRecipients(newSurveyRecipients.filter(r => r !== user.name));
                              }
                            }}
                            disabled={newSurveyRecipients.includes("All Users")}
                          />
                          <span className="text-sm">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={editingSurveyId ? handleUpdateSurvey : handleAddSurvey} 
                      size="sm"
                    >
                      {editingSurveyId ? "Update Survey" : "Create Survey"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddSurvey(false);
                        setEditingSurveyId(null);
                        setNewSurveyTitle("");
                        setNewSurveyDescription("");
                        setNewSurveyQuestions([""]);
                        setNewSurveyRecipients([]);
                      }} 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Surveys Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">{survey.title}</TableCell>
                    <TableCell>{survey.recipients.join(", ")}</TableCell>
                    <TableCell>{survey.questions.length}</TableCell>
                    <TableCell>{survey.responses}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(survey.status)}>
                        {survey.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{survey.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {!survey.isEdited && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditSurvey(survey.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteSurvey(survey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Survey Responses Section */}
            {surveys.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Survey Responses</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Survey</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Answers</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveyResponses.map((response) => {
                      const survey = surveys.find(s => s.id === response.surveyId);
                      return (
                        <TableRow key={response.id}>
                          <TableCell className="font-medium">{survey?.title}</TableCell>
                          <TableCell>{response.userName}</TableCell>
                          <TableCell>{response.answers.join(", ")}</TableCell>
                          <TableCell>{response.submittedDate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
