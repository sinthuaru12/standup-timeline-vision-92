
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search, Trash2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  designation: string;
  status: string;
  lastActive: string;
}

const availableUsers = [
  { name: "David Wilson", email: "david@company.com", designation: "Backend Developer" },
  { name: "Rachel Green", email: "rachel@company.com", designation: "UI/UX Designer" },
  { name: "Tom Anderson", email: "tom@company.com", designation: "DevOps Engineer" },
  { name: "Sophie Martin", email: "sophie@company.com", designation: "Data Analyst" },
  { name: "James Brown", email: "james@company.com", designation: "Frontend Developer" },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");
  
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Sarah Chen", email: "sarah@company.com", designation: "Product Manager", status: "active", lastActive: "2 hours ago" },
    { id: 2, name: "Mike Johnson", email: "mike@company.com", designation: "Developer", status: "active", lastActive: "1 hour ago" },
    { id: 3, name: "Emily Davis", email: "emily@company.com", designation: "Designer", status: "active", lastActive: "30 minutes ago" },
    { id: 4, name: "Alex Rodriguez", email: "alex@company.com", designation: "QA Engineer", status: "inactive", lastActive: "2 days ago" },
    { id: 5, name: "Lisa Wang", email: "lisa@company.com", designation: "Developer", status: "active", lastActive: "4 hours ago" },
    { id: 6, name: "John Smith", email: "john@company.com", designation: "Scrum Master", status: "active", lastActive: "1 hour ago" },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation = designationFilter === "all" || user.designation === designationFilter;
    return matchesSearch && matchesDesignation;
  });

  const handleAddUser = () => {
    if (!selectedUser) return;
    
    const userToAdd = availableUsers.find(u => u.name === selectedUser);
    if (!userToAdd) return;

    const newUser: User = {
      id: users.length + 1,
      name: userToAdd.name,
      email: userToAdd.email,
      designation: userToAdd.designation,
      status: "active",
      lastActive: "Just now"
    };

    setUsers([...users, newUser]);
    setSelectedUser("");
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getDesignationColor = (designation: string) => {
    const colors: { [key: string]: string } = {
      "Product Manager": "bg-purple-100 text-purple-800",
      "Developer": "bg-blue-100 text-blue-800",
      "Designer": "bg-green-100 text-green-800",
      "QA Engineer": "bg-orange-100 text-orange-800",
      "Scrum Master": "bg-red-100 text-red-800",
      "Backend Developer": "bg-indigo-100 text-indigo-800",
      "UI/UX Designer": "bg-pink-100 text-pink-800",
      "DevOps Engineer": "bg-yellow-100 text-yellow-800",
      "Data Analyst": "bg-teal-100 text-teal-800",
      "Frontend Developer": "bg-cyan-100 text-cyan-800",
    };
    return colors[designation] || "bg-gray-100 text-gray-800";
  };

  const availableUsersToAdd = availableUsers.filter(
    availableUser => !users.some(user => user.email === availableUser.email)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select user to add" />
            </SelectTrigger>
            <SelectContent>
              {availableUsersToAdd.map((user) => (
                <SelectItem key={user.email} value={user.name}>
                  {user.name} - {user.designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddUser} 
            disabled={!selectedUser}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={designationFilter} onValueChange={setDesignationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                <SelectItem value="Scrum Master">Scrum Master</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getDesignationColor(user.designation)}>
                      {user.designation}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{user.lastActive}</TableCell>
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
    </div>
  );
}
