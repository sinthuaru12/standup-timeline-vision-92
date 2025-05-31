
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, Check, ChevronsUpDown, Plus, X, Clock, Users, Search } from "lucide-react";
import { format } from "date-fns";

// Mock user data
const mockUsers = Array.from({ length: 350 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR'][i % 5]
}));

const weekdays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

export function SurveyManagement() {
  const [recipientType, setRecipientType] = useState<'all' | 'specific'>('all');
  const [selectedUsers, setSelectedUsers] = useState<typeof mockUsers>([]);
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [schedulingMode, setSchedulingMode] = useState<'immediate' | 'schedule'>('immediate');
  const [scheduleType, setScheduleType] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [monthlyDates, setMonthlyDates] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleUserSelect = (user: typeof mockUsers[0]) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleWeekdayToggle = (weekday: string) => {
    setSelectedWeekdays(prev =>
      prev.includes(weekday)
        ? prev.filter(w => w !== weekday)
        : [...prev, weekday]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Survey Management</h1>
          <p className="text-gray-600">Create and manage surveys for your teams</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Survey</CardTitle>
          <CardDescription>Design and schedule your survey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Survey Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surveyTitle">Survey Title</Label>
              <Input id="surveyTitle" placeholder="Enter survey title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyCategory">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feedback">Team Feedback</SelectItem>
                  <SelectItem value="satisfaction">Job Satisfaction</SelectItem>
                  <SelectItem value="engagement">Employee Engagement</SelectItem>
                  <SelectItem value="performance">Performance Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surveyDescription">Description</Label>
            <Textarea id="surveyDescription" placeholder="Describe your survey purpose and goals" />
          </div>

          {/* Recipients Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Recipients</Label>
            <RadioGroup value={recipientType} onValueChange={(value) => setRecipientType(value as 'all' | 'specific')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-users" />
                <Label htmlFor="all-users">All Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific-users" />
                <Label htmlFor="specific-users">Specific Users</Label>
              </div>
            </RadioGroup>

            {recipientType === 'specific' && (
              <div className="space-y-3">
                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={userSearchOpen}
                      className="w-full justify-between"
                    >
                      <div className="flex items-center">
                        <Search className="h-4 w-4 mr-2" />
                        Search and select users...
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search users by name, email, or department..." 
                        value={userSearchQuery}
                        onValueChange={setUserSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                          {filteredUsers.slice(0, 50).map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => {
                                handleUserSelect(user);
                                setUserSearchQuery('');
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selectedUsers.find(u => u.id === user.id) ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div className="flex flex-col">
                                <span>{user.name}</span>
                                <span className="text-xs text-gray-500">{user.email} • {user.department}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Users ({selectedUsers.length})</Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                      {selectedUsers.map((user) => (
                        <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                          {user.name}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleUserRemove(user.id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scheduling Mode */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Delivery Mode</Label>
            <RadioGroup value={schedulingMode} onValueChange={(value) => setSchedulingMode(value as 'immediate' | 'schedule')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate">Send Immediately</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule">Schedule Delivery</Label>
              </div>
            </RadioGroup>

            {schedulingMode === 'schedule' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Schedule Type</Label>
                  <Select value={scheduleType} onValueChange={(value) => setScheduleType(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One Time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {scheduleType === 'once' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input 
                        type="time" 
                        value={scheduleTime} 
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {scheduleType === 'daily' && (
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input 
                      type="time" 
                      value={scheduleTime} 
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                )}

                {scheduleType === 'weekly' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Weekdays</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {weekdays.map((day) => (
                          <div key={day.value} className="flex items-center space-x-2">
                            <Checkbox 
                              id={day.value}
                              checked={selectedWeekdays.includes(day.value)}
                              onCheckedChange={() => handleWeekdayToggle(day.value)}
                            />
                            <Label htmlFor={day.value} className="text-sm">{day.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input 
                        type="time" 
                        value={scheduleTime} 
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {scheduleType === 'monthly' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Dates of the Month</Label>
                      <Input 
                        placeholder="Enter dates (e.g., 1,15,30)" 
                        value={monthlyDates.join(',')}
                        onChange={(e) => setMonthlyDates(e.target.value.split(',').filter(Boolean))}
                      />
                      <p className="text-xs text-gray-500">Enter comma-separated dates (1-31)</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input 
                        type="time" 
                        value={scheduleTime} 
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Save as Draft</Button>
            <Button>Create Survey</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
