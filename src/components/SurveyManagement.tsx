
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
import { Calendar, Clock, Plus, Send, Edit, Trash2, Eye, Users, User, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SurveyResponses } from "@/components/SurveyResponses";

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
  const [dailyTimes, setDailyTimes] = useState<string[]>([""]);
  const [weeklyTimes, setWeeklyTimes] = useState<string[]>([""]);
  const [monthlyTimes, setMonthlyTimes] = useState<string[]>([""]);
  const [viewingResponses, setViewingResponses] = useState<{ surveyId: number; surveyTitle: string } | null>(null);
  
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    description: "",
    questions: [""],
    scheduleDate: "",
    scheduleTime: "",
    status: "draft"
  });

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearch.toLowerCase())
  );

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const monthDates = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const surveyStatuses = ["draft", "active", "paused", "completed"];

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

  const addTime = (type: "daily" | "weekly" | "monthly") => {
    switch (type) {
      case "daily":
        setDailyTimes([...dailyTimes, ""]);
        break;
      case "weekly":
        setWeeklyTimes([...weeklyTimes, ""]);
        break;
      case "monthly":
        setMonthlyTimes([...monthlyTimes, ""]);
        break;
    }
  };

  const updateTime = (type: "daily" | "weekly" | "monthly", index: number, value: string) => {
    switch (type) {
      case "daily":
        const updatedDaily = [...dailyTimes];
        updatedDaily[index] = value;
        setDailyTimes(updatedDaily);
        break;
      case "weekly":
        const updatedWeekly = [...weeklyTimes];
        updatedWeekly[index] = value;
        setWeeklyTimes(updatedWeekly);
        break;
      case "monthly":
        const updatedMonthly = [...monthlyTimes];
        updatedMonthly[index] = value;
        setMonthlyTimes(updatedMonthly);
        break;
    }
  };

  const removeTime = (type: "daily" | "weekly" | "monthly", index: number) => {
    switch (type) {
      case "daily":
        if (dailyTimes.length > 1) {
          setDailyTimes(dailyTimes.filter((_, i) => i !== index));
        }
        break;
      case "weekly":
        if (weeklyTimes.length > 1) {
          setWeeklyTimes(weeklyTimes.filter((_, i) => i !== index));
        }
        break;
      case "monthly":
        if (monthlyTimes.length > 1) {
          setMonthlyTimes(monthlyTimes.filter((_, i) => i !== index));
        }
        break;
    }
  };

  const handleCreateSurvey = () => {
    console.log("Creating survey:", {
      ...newSurvey,
      recipientType,
      selectedUsers: recipientType === "specific" ? selectedUsers : null,
      deliveryMode,
      scheduleType: deliveryMode === "scheduled" ? scheduleType : null,
      selectedWeekdays: scheduleType === "weekly" ? selectedWeekdays : null,
      selectedDates: scheduleType === "monthly" ? selectedDates : null,
      dailyTimes: scheduleType === "daily" ? dailyTimes : null,
      weeklyTimes: scheduleType === "weekly" ? weeklyTimes : null,
      monthlyTimes: scheduleType === "monthly" ? monthlyTimes : null
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewResponses = (surveyId: number, surveyTitle: string) => {
    setViewingResponses({ surveyId, surveyTitle });
  };

  const handleBackToSurveys = () => {
    setViewingResponses(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Active": "default",
      "Completed": "secondary",
      "Draft": "outline",
      "Paused": "destructive"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  if (viewingResponses) {
    return (
      <SurveyResponses
        surveyId={viewingResponses.surveyId}
        surveyTitle={viewingResponses.surveyTitle}
        onBack={handleBackToSurveys}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Survey Management</h1>
          <p className="text-muted-foreground">Create and manage surveys for your organization</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Survey</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a new survey to collect feedback from your team members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">Survey Title</Label>
                  <Input
                    id="title"
                    value={newSurvey.title}
                    onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                    placeholder="Enter survey title"
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={newSurvey.description}
                    onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                    placeholder="Enter survey description"
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-foreground">Status</Label>
                  <Select value={newSurvey.status} onValueChange={(value) => setNewSurvey({ ...newSurvey, status: value })}>
                    <SelectTrigger className="bg-background border-input text-foreground">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {surveyStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-foreground hover:bg-accent">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-foreground">Questions</Label>
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
                      className="flex-1 bg-background border-input text-foreground"
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
                <Label className="text-base font-semibold text-foreground">Recipients</Label>
                <RadioGroup value={recipientType} onValueChange={(value: "all" | "specific") => setRecipientType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-users" />
                    <Label htmlFor="all-users" className="flex items-center text-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      All Users (324)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-users" />
                    <Label htmlFor="specific-users" className="flex items-center text-foreground">
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
                      className="bg-background border-input text-foreground"
                    />
                    <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto bg-background">
                      <div className="space-y-2">
                        {filteredUsers.slice(0, 50).map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                            />
                            <Label htmlFor={`user-${user.id}`} className="text-sm text-foreground">
                              {user.name} ({user.email}) - {user.department}
                            </Label>
                          </div>
                        ))}
                        {filteredUsers.length > 50 && (
                          <p className="text-sm text-muted-foreground">Showing first 50 results. Use search to narrow down.</p>
                        )}
                      </div>
                    </div>
                    {selectedUsers.length > 0 && (
                      <p className="text-sm text-muted-foreground">{selectedUsers.length} users selected</p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Mode Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">Delivery Mode</Label>
                <RadioGroup value={deliveryMode} onValueChange={(value: "immediate" | "scheduled") => setDeliveryMode(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate" className="flex items-center text-foreground">
                      <Send className="h-4 w-4 mr-1" />
                      Send Immediately
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled" className="flex items-center text-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryMode === "scheduled" && (
                  <div className="space-y-4 pl-6">
                    <Select value={scheduleType} onValueChange={(value: "once" | "daily" | "weekly" | "monthly") => setScheduleType(value)}>
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="once" className="text-foreground hover:bg-accent">One Time</SelectItem>
                        <SelectItem value="daily" className="text-foreground hover:bg-accent">Daily</SelectItem>
                        <SelectItem value="weekly" className="text-foreground hover:bg-accent">Weekly</SelectItem>
                        <SelectItem value="monthly" className="text-foreground hover:bg-accent">Monthly</SelectItem>
                      </SelectContent>
                    </Select>

                    {scheduleType === "once" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-foreground">Date</Label>
                          <Input
                            type="date"
                            value={newSurvey.scheduleDate}
                            onChange={(e) => setNewSurvey({ ...newSurvey, scheduleDate: e.target.value })}
                            className="bg-background border-input text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-foreground">Time</Label>
                          <Input
                            type="time"
                            value={newSurvey.scheduleTime}
                            onChange={(e) => setNewSurvey({ ...newSurvey, scheduleTime: e.target.value })}
                            className="bg-background border-input text-foreground"
                          />
                        </div>
                      </div>
                    )}

                    {scheduleType === "daily" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-foreground">Times</Label>
                          <Button variant="outline" size="sm" onClick={() => addTime("daily")}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Time
                          </Button>
                        </div>
                        {dailyTimes.map((time, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              type="time"
                              value={time}
                              onChange={(e) => updateTime("daily", index, e.target.value)}
                              className="bg-background border-input text-foreground"
                            />
                            {dailyTimes.length > 1 && (
                              <Button variant="outline" size="sm" onClick={() => removeTime("daily", index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {scheduleType === "weekly" && (
                      <div className="space-y-3">
                        <Label className="text-foreground">Select Weekdays</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {weekdays.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={selectedWeekdays.includes(day)}
                                onCheckedChange={(checked) => handleWeekdaySelection(day, checked as boolean)}
                              />
                              <Label htmlFor={day} className="text-sm text-foreground">{day}</Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-foreground">Times</Label>
                            <Button variant="outline" size="sm" onClick={() => addTime("weekly")}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Time
                            </Button>
                          </div>
                          {weeklyTimes.map((time, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="time"
                                value={time}
                                onChange={(e) => updateTime("weekly", index, e.target.value)}
                                className="bg-background border-input text-foreground"
                              />
                              {weeklyTimes.length > 1 && (
                                <Button variant="outline" size="sm" onClick={() => removeTime("weekly", index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {scheduleType === "monthly" && (
                      <div className="space-y-3">
                        <Label className="text-foreground">Select Dates</Label>
                        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                          {monthDates.map((date) => (
                            <div key={date} className="flex items-center space-x-1">
                              <Checkbox
                                id={`date-${date}`}
                                checked={selectedDates.includes(date)}
                                onCheckedChange={(checked) => handleDateSelection(date, checked as boolean)}
                              />
                              <Label htmlFor={`date-${date}`} className="text-sm text-foreground">{date}</Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-foreground">Times</Label>
                            <Button variant="outline" size="sm" onClick={() => addTime("monthly")}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Time
                            </Button>
                          </div>
                          {monthlyTimes.map((time, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="time"
                                value={time}
                                onChange={(e) => updateTime("monthly", index, e.target.value)}
                                className="bg-background border-input text-foreground"
                              />
                              {monthlyTimes.length > 1 && (
                                <Button variant="outline" size="sm" onClick={() => removeTime("monthly", index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Existing Surveys</CardTitle>
          <CardDescription className="text-muted-foreground">Manage and view all surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-foreground">Title</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Recipients</TableHead>
                <TableHead className="text-foreground">Scheduled Date</TableHead>
                <TableHead className="text-foreground">Responses</TableHead>
                <TableHead className="text-foreground">Created</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingSurveys.map((survey) => (
                <TableRow key={survey.id} className="border-border">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{survey.title}</div>
                      <div className="text-sm text-muted-foreground">{survey.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(survey.status)}</TableCell>
                  <TableCell className="text-sm text-foreground">{survey.recipients}</TableCell>
                  <TableCell>
                    {survey.scheduledDate ? (
                      <div className="flex items-center text-sm text-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {survey.scheduledDate}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">
                      {survey.responses}/{survey.totalSent}
                      {survey.totalSent > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {Math.round((survey.responses / survey.totalSent) * 100)}% response rate
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{survey.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewResponses(survey.id, survey.title)}
                        disabled={survey.responses === 0}
                        className="text-foreground hover:bg-accent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent">
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
