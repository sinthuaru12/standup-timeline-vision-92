
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SurveyResponses } from "@/components/SurveyResponses";

// Mock data for existing surveys
const existingSurveys = [
  {
    id: 1,
    title: "Team Satisfaction Survey",
    description: "Quarterly team satisfaction assessment",
    status: "Active",
    recipients: {
      type: "all",
      count: 324,
      list: []
    },
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
    recipients: {
      type: "specific",
      count: 12,
      list: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown", "Emma Davis", "Alex Turner", "Lisa Garcia", "Tom Anderson", "Maria Rodriguez", "Chris Lee", "Amy Chen"]
    },
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
    recipients: {
      type: "specific",
      count: 45,
      list: ["Engineering Team", "Design Team", "Marketing Team"]
    },
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
  
  // New structure for weekly scheduling - object with weekday as key and array of times as value
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>({});
  
  // New structure for monthly scheduling - object with date as key and array of times as value
  const [monthlySchedule, setMonthlySchedule] = useState<Record<string, string[]>>({});
  
  const [onceTimes, setOnceTimes] = useState<string[]>([""]);
  const [dailyTimes, setDailyTimes] = useState<string[]>([""]);
  const [viewingResponses, setViewingResponses] = useState<{ surveyId: number; surveyTitle: string } | null>(null);
  
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    description: "",
    questions: [""],
    scheduleDate: "",
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

  // New functions for weekly scheduling
  const addWeeklyTime = (weekday: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [weekday]: [...(prev[weekday] || []), ""]
    }));
  };

  const updateWeeklyTime = (weekday: string, timeIndex: number, value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [weekday]: prev[weekday].map((time, index) => index === timeIndex ? value : time)
    }));
  };

  const removeWeeklyTime = (weekday: string, timeIndex: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [weekday]: prev[weekday].filter((_, index) => index !== timeIndex)
    }));
  };

  const toggleWeekday = (weekday: string, checked: boolean) => {
    if (checked) {
      setWeeklySchedule(prev => ({
        ...prev,
        [weekday]: [""]
      }));
    } else {
      setWeeklySchedule(prev => {
        const newSchedule = { ...prev };
        delete newSchedule[weekday];
        return newSchedule;
      });
    }
  };

  // New functions for monthly scheduling
  const addMonthlyTime = (date: string) => {
    setMonthlySchedule(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), ""]
    }));
  };

  const updateMonthlyTime = (date: string, timeIndex: number, value: string) => {
    setMonthlySchedule(prev => ({
      ...prev,
      [date]: prev[date].map((time, index) => index === timeIndex ? value : time)
    }));
  };

  const removeMonthlyTime = (date: string, timeIndex: number) => {
    setMonthlySchedule(prev => ({
      ...prev,
      [date]: prev[date].filter((_, index) => index !== timeIndex)
    }));
  };

  const toggleMonthDate = (date: string, checked: boolean) => {
    if (checked) {
      setMonthlySchedule(prev => ({
        ...prev,
        [date]: [""]
      }));
    } else {
      setMonthlySchedule(prev => {
        const newSchedule = { ...prev };
        delete newSchedule[date];
        return newSchedule;
      });
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

  const addTime = (type: "once" | "daily") => {
    switch (type) {
      case "once":
        setOnceTimes([...onceTimes, ""]);
        break;
      case "daily":
        setDailyTimes([...dailyTimes, ""]);
        break;
    }
  };

  const updateTime = (type: "once" | "daily", index: number, value: string) => {
    switch (type) {
      case "once":
        const updatedOnce = [...onceTimes];
        updatedOnce[index] = value;
        setOnceTimes(updatedOnce);
        break;
      case "daily":
        const updatedDaily = [...dailyTimes];
        updatedDaily[index] = value;
        setDailyTimes(updatedDaily);
        break;
    }
  };

  const removeTime = (type: "once" | "daily", index: number) => {
    switch (type) {
      case "once":
        if (onceTimes.length > 1) {
          setOnceTimes(onceTimes.filter((_, i) => i !== index));
        }
        break;
      case "daily":
        if (dailyTimes.length > 1) {
          setDailyTimes(dailyTimes.filter((_, i) => i !== index));
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
      weeklySchedule: scheduleType === "weekly" ? weeklySchedule : null,
      monthlySchedule: scheduleType === "monthly" ? monthlySchedule : null,
      onceTimes: scheduleType === "once" ? onceTimes : null,
      dailyTimes: scheduleType === "daily" ? dailyTimes : null
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

  const formatRecipients = (recipients: any) => {
    if (recipients.type === "all") {
      return (
        <div className="space-y-1">
          <div className="flex items-center text-sm font-medium text-foreground">
            <Users className="h-4 w-4 mr-1" />
            All Users
          </div>
          <div className="text-xs text-muted-foreground">{recipients.count} users</div>
        </div>
      );
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="space-y-1 cursor-pointer">
                <div className="flex items-center text-sm font-medium text-foreground">
                  <User className="h-4 w-4 mr-1" />
                  Specific Users
                </div>
                <div className="text-xs text-muted-foreground">{recipients.count} users selected</div>
                {recipients.list.length > 0 && (
                  <div className="text-xs text-muted-foreground max-w-48 truncate">
                    {recipients.list.slice(0, 3).join(", ")}
                    {recipients.list.length > 3 && "..."}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1">
                <div className="font-medium">Selected Users:</div>
                <div className="text-sm">
                  {recipients.list.join(", ")}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Survey Management</h1>
          <p className="text-muted-foreground">Create and manage surveys for your organization</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="space-y-4">
                        <div>
                          <Label className="text-foreground">Date</Label>
                          <Input
                            type="date"
                            value={newSurvey.scheduleDate}
                            onChange={(e) => setNewSurvey({ ...newSurvey, scheduleDate: e.target.value })}
                            className="bg-background border-input text-foreground"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-foreground">Times</Label>
                            <Button variant="outline" size="sm" onClick={() => addTime("once")}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Time
                            </Button>
                          </div>
                          {onceTimes.map((time, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="time"
                                value={time}
                                onChange={(e) => updateTime("once", index, e.target.value)}
                                className="bg-background border-input text-foreground"
                              />
                              {onceTimes.length > 1 && (
                                <Button variant="outline" size="sm" onClick={() => removeTime("once", index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
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
                      <div className="space-y-4">
                        <Label className="text-foreground">Select Weekdays and Times</Label>
                        <div className="space-y-4">
                          {weekdays.map((day) => (
                            <div key={day} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={day}
                                  checked={weeklySchedule[day] !== undefined}
                                  onCheckedChange={(checked) => toggleWeekday(day, checked as boolean)}
                                />
                                <Label htmlFor={day} className="text-sm font-medium text-foreground">{day}</Label>
                              </div>
                              {weeklySchedule[day] && (
                                <div className="ml-6 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-xs text-muted-foreground">Times for {day}</Label>
                                    <Button variant="outline" size="sm" onClick={() => addWeeklyTime(day)}>
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Time
                                    </Button>
                                  </div>
                                  {weeklySchedule[day].map((time, timeIndex) => (
                                    <div key={timeIndex} className="flex gap-2">
                                      <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => updateWeeklyTime(day, timeIndex, e.target.value)}
                                        className="bg-background border-input text-foreground"
                                      />
                                      {weeklySchedule[day].length > 1 && (
                                        <Button variant="outline" size="sm" onClick={() => removeWeeklyTime(day, timeIndex)}>
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {scheduleType === "monthly" && (
                      <div className="space-y-4">
                        <Label className="text-foreground">Select Dates and Times</Label>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {monthDates.map((date) => (
                            <div key={date} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`date-${date}`}
                                  checked={monthlySchedule[date] !== undefined}
                                  onCheckedChange={(checked) => toggleMonthDate(date, checked as boolean)}
                                />
                                <Label htmlFor={`date-${date}`} className="text-sm font-medium text-foreground">
                                  {date}{date === "1" || date === "21" || date === "31" ? "st" : 
                                      date === "2" || date === "22" ? "nd" : 
                                      date === "3" || date === "23" ? "rd" : "th"}
                                </Label>
                              </div>
                              {monthlySchedule[date] && (
                                <div className="ml-6 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-xs text-muted-foreground">Times for {date}{date === "1" || date === "21" || date === "31" ? "st" : 
                                        date === "2" || date === "22" ? "nd" : 
                                        date === "3" || date === "23" ? "rd" : "th"}</Label>
                                    <Button variant="outline" size="sm" onClick={() => addMonthlyTime(date)}>
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Time
                                    </Button>
                                  </div>
                                  {monthlySchedule[date].map((time, timeIndex) => (
                                    <div key={timeIndex} className="flex gap-2">
                                      <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => updateMonthlyTime(date, timeIndex, e.target.value)}
                                        className="bg-background border-input text-foreground"
                                      />
                                      {monthlySchedule[date].length > 1 && (
                                        <Button variant="outline" size="sm" onClick={() => removeMonthlyTime(date, timeIndex)}>
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleCreateSurvey} className="w-full sm:w-auto">
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
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {existingSurveys.map((survey) => (
              <Card key={survey.id} className="bg-background border-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{survey.title}</h3>
                        <p className="text-sm text-muted-foreground">{survey.description}</p>
                      </div>
                      {getStatusBadge(survey.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Recipients:</span>
                        {formatRecipients(survey.recipients)}
                      </div>
                      
                      {survey.scheduledDate && (
                        <div className="flex items-center text-sm text-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {survey.scheduledDate}
                        </div>
                      )}
                      
                      <div className="text-sm text-foreground">
                        Responses: {survey.responses}/{survey.totalSent}
                        {survey.totalSent > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({Math.round((survey.responses / survey.totalSent) * 100)}%)
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Created: {survey.createdAt}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-1">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
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
                    <TableCell>{formatRecipients(survey.recipients)}</TableCell>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
