import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { User, Calendar, TrendingUp, Clock, ChartGantt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DeveloperTask {
  developerId: string;
  developerName: string;
  tasks: {
    taskId: string;
    title: string;
    dueDate: string;
    currentCompletion: number;
    plannedStartDate: string;
    plannedEndDate: string;
    taskType: "development" | "qa" | "review";
    dependencies?: string[];
    dailyUpdates: {
      date: string;
      completion: number;
      remainingTime: number;
      notes?: string;
    }[];
  }[];
}

export function IndividualTimelines() {
  const [viewMode, setViewMode] = useState<"timeline" | "gantt">("timeline");

  const developerData: DeveloperTask[] = [
    {
      developerId: "dev-001",
      developerName: "Sarah Chen",
      tasks: [
        {
          taskId: "PROJ-123",
          title: "API Authentication Implementation",
          dueDate: "2024-03-15",
          currentCompletion: 45,
          plannedStartDate: "2024-03-01",
          plannedEndDate: "2024-03-13",
          taskType: "development",
          dailyUpdates: [
            { date: "2024-03-01", completion: 10, remainingTime: 16 },
            { date: "2024-03-04", completion: 20, remainingTime: 15 },
            { date: "2024-03-05", completion: 25, remainingTime: 14 },
            { date: "2024-03-06", completion: 30, remainingTime: 13 },
            { date: "2024-03-07", completion: 32, remainingTime: 13 },
            { date: "2024-03-08", completion: 35, remainingTime: 13 },
            { date: "2024-03-11", completion: 40, remainingTime: 12 },
            { date: "2024-03-12", completion: 45, remainingTime: 12 },
          ]
        },
        {
          taskId: "PROJ-126",
          title: "User Dashboard Components",
          dueDate: "2024-03-22",
          currentCompletion: 75,
          plannedStartDate: "2024-03-05",
          plannedEndDate: "2024-03-20",
          taskType: "development",
          dailyUpdates: [
            { date: "2024-03-01", completion: 30, remainingTime: 8 },
            { date: "2024-03-04", completion: 45, remainingTime: 6 },
            { date: "2024-03-05", completion: 55, remainingTime: 5 },
            { date: "2024-03-06", completion: 65, remainingTime: 4 },
            { date: "2024-03-07", completion: 70, remainingTime: 3 },
            { date: "2024-03-08", completion: 72, remainingTime: 3 },
            { date: "2024-03-11", completion: 75, remainingTime: 2 },
            { date: "2024-03-12", completion: 75, remainingTime: 2 },
          ]
        }
      ]
    },
    {
      developerId: "dev-002",
      developerName: "Mike Johnson",
      tasks: [
        {
          taskId: "PROJ-124",
          title: "Database Migration Script",
          dueDate: "2024-03-18",
          currentCompletion: 70,
          plannedStartDate: "2024-03-02",
          plannedEndDate: "2024-03-16",
          taskType: "development",
          dailyUpdates: [
            { date: "2024-03-02", completion: 20, remainingTime: 12 },
            { date: "2024-03-04", completion: 35, remainingTime: 10 },
            { date: "2024-03-06", completion: 50, remainingTime: 8 },
            { date: "2024-03-08", completion: 60, remainingTime: 7 },
            { date: "2024-03-10", completion: 65, remainingTime: 6 },
            { date: "2024-03-11", completion: 68, remainingTime: 5 },
            { date: "2024-03-13", completion: 70, remainingTime: 5 },
          ]
        }
      ]
    },
    {
      developerId: "qa-001",
      developerName: "Emily Davis",
      tasks: [
        {
          taskId: "PROJ-125",
          title: "UI Component Testing",
          dueDate: "2024-03-20",
          currentCompletion: 30,
          plannedStartDate: "2024-03-14",
          plannedEndDate: "2024-03-19",
          taskType: "qa",
          dependencies: ["PROJ-123"],
          dailyUpdates: [
            { date: "2024-03-03", completion: 5, remainingTime: 25 },
            { date: "2024-03-05", completion: 10, remainingTime: 24 },
            { date: "2024-03-07", completion: 15, remainingTime: 23 },
            { date: "2024-03-08", completion: 18, remainingTime: 22 },
            { date: "2024-03-11", completion: 25, remainingTime: 21 },
            { date: "2024-03-12", completion: 28, remainingTime: 20 },
            { date: "2024-03-14", completion: 30, remainingTime: 20 },
          ]
        },
        {
          taskId: "PROJ-127",
          title: "Database Migration Testing",
          dueDate: "2024-03-21",
          currentCompletion: 0,
          plannedStartDate: "2024-03-17",
          plannedEndDate: "2024-03-21",
          taskType: "qa",
          dependencies: ["PROJ-124"],
          dailyUpdates: []
        }
      ]
    }
  ];

  const chartConfig = {
    completion: {
      label: "Completion %",
      color: "hsl(var(--chart-1))",
    },
    remainingTime: {
      label: "Remaining Time (hrs)",
      color: "hsl(var(--chart-2))",
    },
  };

  const calculateVelocity = (updates: any[]) => {
    if (updates.length < 2) return 0;
    const recent = updates.slice(-3);
    const avgProgress = recent.reduce((acc, curr, index) => {
      if (index === 0) return 0;
      return acc + (curr.completion - recent[index - 1].completion);
    }, 0) / (recent.length - 1);
    return Math.round(avgProgress * 10) / 10;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTaskTypeColor = (taskType: string) => {
    const colors = {
      "development": "bg-blue-500",
      "qa": "bg-green-500",
      "review": "bg-purple-500"
    };
    return colors[taskType as keyof typeof colors] || "bg-gray-500";
  };

  const getTaskTypeLabel = (taskType: string) => {
    const labels = {
      "development": "Dev",
      "qa": "QA",
      "review": "Review"
    };
    return labels[taskType as keyof typeof labels] || taskType;
  };

  const generateGanttData = () => {
    const allTasks = developerData.flatMap(dev => 
      dev.tasks.map(task => ({
        ...task,
        developerName: dev.developerName,
        developerId: dev.developerId
      }))
    );

    // Sort by planned start date
    return allTasks.sort((a, b) => 
      new Date(a.plannedStartDate).getTime() - new Date(b.plannedStartDate).getTime()
    );
  };

  const ganttTasks = generateGanttData();

  const getDatePosition = (date: string, startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = new Date(date).getTime();
    return ((current - start) / (end - start)) * 100;
  };

  const sprintStartDate = "2024-03-01";
  const sprintEndDate = "2024-03-22";

  const renderGanttView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChartGantt className="h-5 w-5" />
          <span>Sprint Gantt Chart</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Planned timeline with dependencies ({sprintStartDate} to {sprintEndDate})
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="grid grid-cols-12 gap-1 text-xs text-gray-500 border-b pb-2">
            <div className="col-span-3 font-medium">Task</div>
            <div className="col-span-9">
              <div className="grid grid-cols-21 gap-1">
                {Array.from({ length: 21 }, (_, i) => {
                  const date = new Date(sprintStartDate);
                  date.setDate(date.getDate() + i);
                  return (
                    <div key={i} className="text-center">
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gantt Bars */}
          {ganttTasks.map((task) => (
            <div key={task.taskId} className="grid grid-cols-12 gap-1 items-center py-2 border-b">
              <div className="col-span-3">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {task.taskId}
                    </Badge>
                    <Badge className={`text-xs text-white ${getTaskTypeColor(task.taskType)}`}>
                      {getTaskTypeLabel(task.taskType)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">{task.developerName}</div>
                  {task.dependencies && task.dependencies.length > 0 && (
                    <div className="text-xs text-orange-600">
                      Depends on: {task.dependencies.join(", ")}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-9 relative">
                <div className="h-8 bg-gray-100 rounded relative">
                  {/* Planned timeline bar */}
                  <div
                    className={`absolute top-1 h-6 rounded ${getTaskTypeColor(task.taskType)} opacity-60`}
                    style={{
                      left: `${getDatePosition(task.plannedStartDate, sprintStartDate, sprintEndDate)}%`,
                      width: `${getDatePosition(task.plannedEndDate, task.plannedStartDate, sprintEndDate) - getDatePosition(task.plannedStartDate, task.plannedStartDate, sprintEndDate)}%`
                    }}
                  />
                  {/* Progress overlay */}
                  <div
                    className={`absolute top-1 h-6 rounded ${getTaskTypeColor(task.taskType)}`}
                    style={{
                      left: `${getDatePosition(task.plannedStartDate, sprintStartDate, sprintEndDate)}%`,
                      width: `${((getDatePosition(task.plannedEndDate, task.plannedStartDate, sprintEndDate) - getDatePosition(task.plannedStartDate, task.plannedStartDate, sprintEndDate)) * task.currentCompletion) / 100}%`
                    }}
                  />
                  {/* Today indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                    style={{
                      left: `${getDatePosition(new Date().toISOString().split('T')[0], sprintStartDate, sprintEndDate)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{new Date(task.plannedStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="font-medium">{task.currentCompletion}%</span>
                  <span>{new Date(task.plannedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Development</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>QA</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-4 bg-red-500"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTimelineView = () => (
    <>
      {developerData.map((developer) => (
        <div key={developer.developerId} className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{developer.developerName}</h2>
            <Badge variant="outline">{developer.tasks.length} active tasks</Badge>
          </div>

          <div className="grid gap-6">
            {developer.tasks.map((task) => (
              <Card key={task.taskId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <p className="text-sm text-gray-600">{task.taskId}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {getDaysUntilDue(task.dueDate)} days remaining
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Current Progress</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion</span>
                          <span className="font-medium">{task.currentCompletion}%</span>
                        </div>
                        <Progress value={task.currentCompletion} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Velocity</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold">
                          {calculateVelocity(task.dailyUpdates)}% per day
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Remaining</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-lg font-semibold">
                          {task.dailyUpdates[task.dailyUpdates.length - 1]?.remainingTime || 0}h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Chart */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Progress Timeline</h4>
                    <ChartContainer config={chartConfig} className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={task.dailyUpdates}>
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="completion"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  {/* Daily Updates Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Updates</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {task.dailyUpdates.slice(-4).map((update, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-gray-900">
                            {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">{update.completion}%</p>
                          <p className="text-xs text-gray-500">{update.remainingTime}h left</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Individual Task Timelines</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="text-sm"
            >
              Timeline View
            </Button>
            <Button
              variant={viewMode === "gantt" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("gantt")}
              className="text-sm"
            >
              Gantt Chart
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Tracking progress from daily standups
          </div>
        </div>
      </div>

      {viewMode === "gantt" ? renderGanttView() : renderTimelineView()}
    </div>
  );
}
