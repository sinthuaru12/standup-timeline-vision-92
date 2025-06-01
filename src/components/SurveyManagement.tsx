import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  X,
  Users,
  Send,
  Filter,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Survey {
  id: number;
  title: string;
  description: string;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: string;
  recipients: number;
  responses: number;
  questions: string[];
  deliveryType: "immediate" | "scheduled";
  scheduleDetails?: {
    type: "one-time" | "daily" | "weekly" | "monthly";
    date?: Date;
    times: string[];
    weekdays?: string[];
    monthDates?: number[];
  };
}

interface Question {
  id: string;
  type: "text" | "multiple-choice" | "rating";
  question: string;
  options?: string[];
  required: boolean;
}

export function SurveyManagement() {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: 1,
      title: "Team Satisfaction Survey",
      description: "Monthly team satisfaction and feedback survey",
      status: "active",
      createdAt: "2024-01-15",
      recipients: 25,
      responses: 18,
      questions: ["How satisfied are you with your current role?", "Rate team collaboration"],
      deliveryType: "scheduled",
      scheduleDetails: {
        type: "monthly",
        times: ["09:00"],
        monthDates: [1]
      }
    },
    {
      id: 2,
      title: "Project Feedback",
      description: "Feedback on current project progress",
      status: "draft",
      createdAt: "2024-01-20",
      recipients: 12,
      responses: 0,
      questions: ["Rate project management", "Suggest improvements"],
      deliveryType: "immediate"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyStatus, setSurveyStatus] = useState<"draft" | "active" | "paused" | "completed">("draft");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deliveryType, setDeliveryType] = useState<"immediate" | "scheduled">("immediate");
  const [scheduleType, setScheduleType] = useState<"one-time" | "daily" | "weekly" | "monthly">("one-time");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(["09:00"]);
  const [scheduleWeekdays, setScheduleWeekdays] = useState<string[]>([]);
  const [scheduleMonthDates, setScheduleMonthDates] = useState<number[]>([]);
  const [recipientType, setRecipientType] = useState<"all" | "specific">("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const mockUsers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com" },
    { id: "4", name: "Sarah Wilson", email: "sarah@example.com" },
    { id: "5", name: "Tom Brown", email: "tom@example.com" },
  ];

  const weekdays = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "text",
      question: "",
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addTime = () => {
    setScheduleTimes([...scheduleTimes, "09:00"]);
  };

  const updateTime = (index: number, time: string) => {
    const newTimes = [...scheduleTimes];
    newTimes[index] = time;
    setScheduleTimes(newTimes);
  };

  const removeTime = (index: number) => {
    if (scheduleTimes.length > 1) {
      setScheduleTimes(scheduleTimes.filter((_, i) => i !== index));
    }
  };

  const handleWeekdayChange = (weekday: string, checked: boolean) => {
    if (checked) {
      setScheduleWeekdays([...scheduleWeekdays, weekday]);
    } else {
      setScheduleWeekdays(scheduleWeekdays.filter(w => w !== weekday));
    }
  };

  const handleMonthDateChange = (date: number, checked: boolean) => {
    if (checked) {
      setScheduleMonthDates([...scheduleMonthDates, date]);
    } else {
      setScheduleMonthDates(scheduleMonthDates.filter(d => d !== date));
    }
  };

  const resetForm = () => {
    setSurveyTitle("");
    setSurveyDescription("");
    setSurveyStatus("draft");
    setQuestions([]);
    setDeliveryType("immediate");
    setScheduleType("one-time");
    setScheduleDate(undefined);
    setScheduleTimes(["09:00"]);
    setScheduleWeekdays([]);
    setScheduleMonthDates([]);
    setRecipientType("all");
    setSelectedUsers([]);
  };

  const handleCreateSurvey = () => {
    const newSurvey: Survey = {
      id: Date.now(),
      title: surveyTitle,
      description: surveyDescription,
      status: surveyStatus,
      createdAt: new Date().toISOString().split('T')[0],
      recipients: recipientType === "all" ? mockUsers.length : selectedUsers.length,
      responses: 0,
      questions: questions.map(q => q.question),
      deliveryType,
      scheduleDetails: deliveryType === "scheduled" ? {
        type: scheduleType,
        date: scheduleDate,
        times: scheduleTimes,
        weekdays: scheduleWeekdays,
        monthDates: scheduleMonthDates
      } : undefined
    };

    setSurveys([...surveys, newSurvey]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || survey.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Survey Management</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Create and manage team surveys</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Survey</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Create New Survey</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Survey Title</Label>
                  <Input
                    id="title"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    placeholder="Enter survey title"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={surveyDescription}
                    onChange={(e) => setSurveyDescription(e.target.value)}
                    placeholder="Enter survey description"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Select value={surveyStatus} onValueChange={(value: any) => setSurveyStatus(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label className="text-sm font-medium">Questions</Label>
                  <Button onClick={addQuestion} size="sm" variant="outline" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                
                <ScrollArea className="h-32 sm:h-48 border rounded-md p-2 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="p-3 sm:p-4">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                                placeholder="Enter question"
                                className="text-sm"
                              />
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Select 
                                  value={question.type} 
                                  onValueChange={(value) => updateQuestion(question.id, "type", value)}
                                >
                                  <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={question.required}
                                    onCheckedChange={(checked) => updateQuestion(question.id, "required", checked)}
                                  />
                                  <Label className="text-xs">Required</Label>
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeQuestion(question.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {questions.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No questions added yet. Click "Add Question" to get started.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Recipients Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Recipients</Label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant={recipientType === "all" ? "default" : "outline"}
                      onClick={() => setRecipientType("all")}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      All Users
                    </Button>
                    <Button
                      variant={recipientType === "specific" ? "default" : "outline"}
                      onClick={() => setRecipientType("specific")}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Specific Users
                    </Button>
                  </div>

                  {recipientType === "specific" && (
                    <div className="space-y-3">
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-sm"
                      />
                      <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="space-y-2">
                          {filteredUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Delivery</Label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant={deliveryType === "immediate" ? "default" : "outline"}
                      onClick={() => setDeliveryType("immediate")}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                    <Button
                      variant={deliveryType === "scheduled" ? "default" : "outline"}
                      onClick={() => setDeliveryType("scheduled")}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>

                  {deliveryType === "scheduled" && (
                    <div className="space-y-4 p-3 sm:p-4 border rounded-md">
                      <Select value={scheduleType} onValueChange={(value: any) => setScheduleType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>

                      {scheduleType === "one-time" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={scheduleDate}
                              onSelect={setScheduleDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}

                      {scheduleType === "weekly" && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Select Days</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {weekdays.map((day) => (
                              <div key={day.id} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={scheduleWeekdays.includes(day.id)}
                                  onCheckedChange={(checked) => handleWeekdayChange(day.id, !!checked)}
                                />
                                <Label className="text-sm">{day.label}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {scheduleType === "monthly" && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Select Dates</Label>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                              <div key={date} className="flex items-center justify-center">
                                <Checkbox
                                  checked={scheduleMonthDates.includes(date)}
                                  onCheckedChange={(checked) => handleMonthDateChange(date, !!checked)}
                                />
                                <Label className="text-xs ml-1">{date}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <Label className="text-sm font-medium">Times</Label>
                          <Button onClick={addTime} size="sm" variant="outline" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Time
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {scheduleTimes.map((time, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="time"
                                value={time}
                                onChange={(e) => updateTime(index, e.target.value)}
                                className="flex-1"
                              />
                              {scheduleTimes.length > 1 && (
                                <Button
                                  onClick={() => removeTime(index)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 px-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleCreateSurvey} className="w-full sm:flex-1">
                  Create Survey
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)} variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="block sm:hidden space-y-4">
        {filteredSurveys.map((survey) => (
          <Card key={survey.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{survey.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{survey.description}</p>
                </div>
                <Badge className={cn("ml-2 shrink-0", getStatusColor(survey.status))}>
                  {survey.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Recipients:</span>
                  <span className="ml-1 font-medium">{survey.recipients}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Responses:</span>
                  <span className="ml-1 font-medium">{survey.responses}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="ml-1 font-medium">{survey.createdAt}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Delivery:</span>
                  <span className="ml-1 font-medium capitalize">{survey.deliveryType}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Card>
          <CardHeader>
            <CardTitle>Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{survey.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{survey.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{survey.recipients}</TableCell>
                      <TableCell>{survey.responses}</TableCell>
                      <TableCell>{survey.createdAt}</TableCell>
                      <TableCell className="capitalize">{survey.deliveryType}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
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
    </div>
  );
}
