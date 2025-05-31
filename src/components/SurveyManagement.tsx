
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, Plus, Send, Edit, Trash2, Eye, Users, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for existing surveys
const existingSurveys = [
  {
    id: 1,
    title: "Team Satisfaction Survey",
    description: "Quarterly team satisfaction assessment",
    status: "Active",
    recipients: "All Users (324)",
    scheduledDate: "2024-01-15",
    responses: 45,
    totalSent: 324,
    createdAt: "2024-01-10"
  },
  {
    id: 2,
    title: "Project Feedback Survey",
    description: "End of project feedback collection",
    status: "Completed",
    recipients: "Development Team (12)",
    scheduledDate: "2024-01-01",
    responses: 12,
    totalSent: 12,
    createdAt: "2023-12-28"
  },
  {
    id: 3,
    title: "Annual Review Survey",
    description: "Annual performance and satisfaction review",
    status: "Draft",
    recipients: "All Users (324)",
    scheduledDate: null,
    responses: 0,
    totalSent: 0,
    createdAt: "2024-01-12"
  }
];

// Mock users data
const mockUsers = Array.from({ length: 324 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  department: ["Engineering", "Design", "Marketing", "Sales", "HR"][i % 5]
}));

export function SurveyManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<"all" | "specific">("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"immediate" | "scheduled">("immediate");
  const [scheduleType, setScheduleType] = useState<"once" | "daily" | "weekly" | "monthly">("once");
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    description: "",
    questions: [""],
    scheduleDate: "",
    scheduleTime: "",
    dailyTime: "",
    weeklyTime: "",
    monthlyTime: ""
  });

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearch.toLowerCase())
  );

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const monthDates = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleUserSelection = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleWeekdaySelection = (weekday: string, checked: boolean) => {
    if (checked) {
      setSelectedWeekdays([...selectedWeekdays, weekday]);
    } else {
      setSelectedWeekdays(selectedWeekdays.filter(day => day !== weekday));
    }
  };

  const handleDateSelection = (date: string, checked: boolean) => {
    if (checked) {
      setSelectedDates([...selectedDates, date]);
    } else {
      setSelectedDates(selectedDates.filter(d => d !== date));
    }
  };

  const addQuestion = () => {
    setNewSurvey({ ...newSurvey, questions: [...newSurvey.questions, ""] });
  };

  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[index] = value;
    setNewSurvey({ ...newSurvey, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = newSurvey.questions.filter((_, i) => i !== index);
    setNewSurvey({ ...newSurvey, questions: updatedQuestions });
  };

  const handleCreateSurvey = () => {
    console.log("Creating survey:", {
      ...newSurvey,
      recipientType,
      selectedUsers: recipientType === "specific" ? selectedUsers : null,
      deliveryMode,
      scheduleType: deliveryMode === "scheduled" ? scheduleType : null,
      selectedWeekdays: scheduleType === "weekly" ? selectedWeekdays : null,
      selectedDates: scheduleType === "monthly" ? selectedDates : null
    });
    setIsCreateDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Active": "default",
      "Completed": "secondary",
      "Draft": "outline"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Survey Management</h1>
          <p className="text-gray-600">Create and manage surveys for your organization</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
              <DialogDescription>
                Create a new survey to collect feedback from your team members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Survey Title</Label>
                  <Input
                    id="title"
                    value={newSurvey.title}
                    onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                    placeholder="Enter survey title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSurvey.description}
                    onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                    placeholder="Enter survey description"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Questions</Label>
                  <Button variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </div>
                {newSurvey.questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                      className="flex-1"
                    />
                    {newSurvey.questions.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeQuestion(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Recipients Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Recipients</Label>
                <RadioGroup value={recipientType} onValueChange={(value: "all" | "specific") => setRecipientType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-users" />
                    <Label htmlFor="all-users" className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      All Users (324)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-users" />
                    <Label htmlFor="specific-users" className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Specific Users
                    </Label>
                  </div>
                </RadioGroup>

                {recipientType === "specific" && (
                  <div className="space-y-3">
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                    <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {filteredUsers.slice(0, 50).map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                            />
                            <Label htmlFor={`user-${user.id}`} className="text-sm">
                              {user.name} ({user.email}) - {user.department}
                            </Label>
                          </div>
                        ))}
                        {filteredUsers.length > 50 && (
                          <p className="text-sm text-gray-500">Showing first 50 results. Use search to narrow down.</p>
                        )}
                      </div>
                    </div>
                    {selectedUsers.length > 0 && (
                      <p className="text-sm text-gray-600">{selectedUsers.length} users selected</p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Mode Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Delivery Mode</Label>
                <RadioGroup value={deliveryMode} onValueChange={(value: "immediate" | "scheduled") => setDeliveryMode(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate" className="flex items-center">
                      <Send className="h-4 w-4 mr-1" />
                      Send Immediately
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryMode === "scheduled" && (
                  <div className="space-y-4 pl-6">
                    <Select value={scheduleType} onValueChange={(value: "once" | "daily" | "weekly" | "monthly") => setScheduleType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">One Time</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>

                    {scheduleType === "once" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={newSurvey.scheduleDate}
                            onChange={(e) => setNewSurvey({ ...newSurvey, scheduleDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={newSurvey.scheduleTime}
                            onChange={(e) => setNewSurvey({ ...newSurvey, scheduleTime: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {scheduleType === "daily" && (
                      <div>
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={newSurvey.dailyTime}
                          onChange={(e) => setNewSurvey({ ...newSurvey, dailyTime: e.target.value })}
                        />
                      </div>
                    )}

                    {scheduleType === "weekly" && (
                      <div className="space-y-3">
                        <Label>Select Weekdays</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {weekdays.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={selectedWeekdays.includes(day)}
                                onCheckedChange={(checked) => handleWeekdaySelection(day, checked as boolean)}
                              />
                              <Label htmlFor={day} className="text-sm">{day}</Label>
                            </div>
                          ))}
                        </div>
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={newSurvey.weeklyTime}
                            onChange={(e) => setNewSurvey({ ...newSurvey, weeklyTime: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {scheduleType === "monthly" && (
                      <div className="space-y-3">
                        <Label>Select Dates</Label>
                        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                          {monthDates.map((date) => (
                            <div key={date} className="flex items-center space-x-1">
                              <Checkbox
                                id={`date-${date}`}
                                checked={selectedDates.includes(date)}
                                onCheckedChange={(checked) => handleDateSelection(date, checked as boolean)}
                              />
                              <Label htmlFor={`date-${date}`} className="text-sm">{date}</Label>
                            </div>
                          ))}
                        </div>
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={newSurvey.monthlyTime}
                            onChange={(e) => setNewSurvey({ ...newSurvey, monthlyTime: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSurvey}>
                  Create Survey
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Surveys</CardTitle>
          <CardDescription>Manage and view all surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{survey.title}</div>
                      <div className="text-sm text-gray-500">{survey.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(survey.status)}</TableCell>
                  <TableCell className="text-sm">{survey.recipients}</TableCell>
                  <TableCell>
                    {survey.scheduledDate ? (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {survey.scheduledDate}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {survey.responses}/{survey.totalSent}
                      {survey.totalSent > 0 && (
                        <div className="text-xs text-gray-500">
                          {Math.round((survey.responses / survey.totalSent) * 100)}% response rate
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{survey.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
