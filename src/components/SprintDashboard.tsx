
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface SprintTask {
  jiraRef: string;
  taskSummary: string;
  dev: string;
  qa: string;
  totalEstimatedHours: number;
  totalSpentHours: number;
  completionPercentage: number;
  requestedHours: number;
  deviationHours: number;
  risk: "Risk" | "Open" | "Resolved" | "-";
  plannedDueDate: string;
  status: "In Progress" | "Open" | "Resolved" | "-";
  dailyProgress: {
    day1: string;
    day2: string;
    day3: string;
    day4: string;
    day5: string;
    day6: string;
  };
}

export function SprintDashboard() {
  const sprintTasks: SprintTask[] = [
    {
      jiraRef: "KU-15805",
      taskSummary: "Operational dashboard External Developments",
      dev: "nisithh@codegen.net",
      qa: "hpalam@codegen.n",
      totalEstimatedHours: 80,
      totalSpentHours: 103,
      completionPercentage: 100,
      requestedHours: 24,
      deviationHours: -24,
      risk: "Resolved",
      plannedDueDate: "2024-12-03",
      status: "Resolved",
      dailyProgress: { day1: "-", day2: "-", day3: "-", day4: "-", day5: "-", day6: "-" }
    },
    {
      jiraRef: "KU-16150",
      taskSummary: "A user can export a Booking Report",
      dev: "wikum@codegen.net",
      qa: "",
      totalEstimatedHours: 0,
      totalSpentHours: 0,
      completionPercentage: 100,
      requestedHours: 0,
      deviationHours: 0,
      risk: "Resolved",
      plannedDueDate: "none",
      status: "Resolved",
      dailyProgress: { day1: "-", day2: "-", day3: "-", day4: "-", day5: "-", day6: "-" }
    },
    {
      jiraRef: "KU-15915",
      taskSummary: "CHECK_RATE seemingly changing without prompt on a multiroom booking",
      dev: "chathuml@codegen.net",
      qa: "",
      totalEstimatedHours: 10,
      totalSpentHours: 5,
      completionPercentage: 80,
      requestedHours: 6,
      deviationHours: -4,
      risk: "-",
      plannedDueDate: "none",
      status: "In Progress",
      dailyProgress: { day1: "In Progress", day2: "In Progress", day3: "-", day4: "-", day5: "-", day6: "-" }
    },
    {
      jiraRef: "KU-14707",
      taskSummary: "[P] LCC via Wide Search – Sorting Order",
      dev: "wikum@codegen.net",
      qa: "",
      totalEstimatedHours: 24,
      totalSpentHours: 7,
      completionPercentage: 100,
      requestedHours: 0,
      deviationHours: 0,
      risk: "Risk",
      plannedDueDate: "2024-11-25",
      status: "In Progress",
      dailyProgress: { day1: "-", day2: "-", day3: "-", day4: "In Progress", day5: "Risk", day6: "-" }
    },
    {
      jiraRef: "KU-15944",
      taskSummary: "Titium - Duplicated results when searching for multiple rooms",
      dev: "dilini@codegen.net",
      qa: "",
      totalEstimatedHours: 16,
      totalSpentHours: 4,
      completionPercentage: 50,
      requestedHours: 2,
      deviationHours: 6,
      risk: "-",
      plannedDueDate: "2025-02-17",
      status: "Open",
      dailyProgress: { day1: "-", day2: "-", day3: "-", day4: "-", day5: "-", day6: "-" }
    },
    {
      jiraRef: "KU-16134",
      taskSummary: "Alternative Transfer functionality - linked",
      dev: "dilini@codegen.net",
      qa: "shanid@codegen.nt",
      totalEstimatedHours: 10,
      totalSpentHours: 6.5,
      completionPercentage: 10,
      requestedHours: 0,
      deviationHours: 0,
      risk: "Risk",
      plannedDueDate: "2024-11-22",
      status: "In Progress",
      dailyProgress: { day1: "-", day2: "-", day3: "Risk", day4: "In Progress", day5: "Resolved", day6: "-" }
    },
    {
      jiraRef: "KU-16084",
      taskSummary: "ns - Transfers API|SearchFlow Respon",
      dev: "sulajana@codegen.net",
      qa: "",
      totalEstimatedHours: 12,
      totalSpentHours: 6,
      completionPercentage: 60,
      requestedHours: 4,
      deviationHours: 0.8,
      risk: "-",
      plannedDueDate: "2024-12-04",
      status: "In Progress",
      dailyProgress: { day1: "-", day2: "-", day3: "-", day4: "-", day5: "-", day6: "-" }
    },
    {
      jiraRef: "KU-14909",
      taskSummary: "ONEDJDB lock caused by missing indi",
      dev: "dinukak@codegen.net",
      qa: "",
      totalEstimatedHours: 0,
      totalSpentHours: 0,
      completionPercentage: 0,
      requestedHours: 0,
      deviationHours: 0,
      risk: "Risk",
      plannedDueDate: "none",
      status: "In Progress",
      dailyProgress: { day1: "-", day2: "-", day3: "-", day4: "-", day5: "-", day6: "-" }
    }
  ];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Risk": return "bg-red-100 text-red-800 border-red-200";
      case "Open": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "text-blue-600";
      case "Open": return "text-yellow-600";
      case "Resolved": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return "text-green-600 font-semibold";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getDayProgressColor = (progress: string) => {
    switch (progress) {
      case "Risk": return "bg-red-500 text-white";
      case "In Progress": return "bg-blue-500 text-white";
      case "Resolved": return "bg-green-500 text-white";
      case "Open": return "bg-yellow-500 text-white";
      default: return "bg-gray-100 text-gray-400";
    }
  };

  const isOverdue = (dueDate: string) => {
    if (dueDate === "none") return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sprint Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Total Tasks: {sprintTasks.length}
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">
              {sprintTasks.filter(task => task.risk === "Risk").length} At Risk
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Sprint Task Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Jira Ref</TableHead>
                  <TableHead className="min-w-48">Task Summary</TableHead>
                  <TableHead className="w-32">Dev</TableHead>
                  <TableHead className="w-24">QA</TableHead>
                  <TableHead className="w-20 text-center">Est. Hours</TableHead>
                  <TableHead className="w-20 text-center">Spent Hours</TableHead>
                  <TableHead className="w-20 text-center">Completion %</TableHead>
                  <TableHead className="w-20 text-center">Req. Hours</TableHead>
                  <TableHead className="w-20 text-center">Deviation</TableHead>
                  <TableHead className="w-16 text-center">Risk</TableHead>
                  <TableHead className="w-24">Due Date</TableHead>
                  <TableHead className="w-16">Day 1</TableHead>
                  <TableHead className="w-16">Day 2</TableHead>
                  <TableHead className="w-16">Day 3</TableHead>
                  <TableHead className="w-16">Day 4</TableHead>
                  <TableHead className="w-16">Day 5</TableHead>
                  <TableHead className="w-16">Day 6</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sprintTasks.map((task) => (
                  <TableRow 
                    key={task.jiraRef} 
                    className={`hover:bg-gray-50 ${task.risk === "Risk" ? "bg-red-50" : ""}`}
                  >
                    <TableCell className="font-mono text-xs">{task.jiraRef}</TableCell>
                    <TableCell className="text-sm">{task.taskSummary}</TableCell>
                    <TableCell className="text-xs text-gray-600">{task.dev}</TableCell>
                    <TableCell className="text-xs text-gray-600">{task.qa || "-"}</TableCell>
                    <TableCell className="text-center text-sm">{task.totalEstimatedHours}</TableCell>
                    <TableCell className="text-center text-sm">{task.totalSpentHours}</TableCell>
                    <TableCell className={`text-center text-sm ${getCompletionColor(task.completionPercentage)}`}>
                      {task.completionPercentage}%
                    </TableCell>
                    <TableCell className="text-center text-sm">{task.requestedHours}</TableCell>
                    <TableCell className={`text-center text-sm ${task.deviationHours > 0 ? 'text-red-600' : task.deviationHours < 0 ? 'text-green-600' : ''}`}>
                      {task.deviationHours}
                    </TableCell>
                    <TableCell className="text-center">
                      {task.risk !== "-" ? (
                        <Badge className={`text-xs ${getRiskBadgeColor(task.risk)}`}>
                          {task.risk}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className={isOverdue(task.plannedDueDate) ? "text-red-600 font-medium" : ""}>
                        {task.plannedDueDate === "none" ? "-" : task.plannedDueDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getDayProgressColor(task.dailyProgress.day1)} ${task.dailyProgress.day1 === "-" ? "bg-transparent text-gray-400 border-none" : ""}`}
                      >
                        {task.dailyProgress.day1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getDayProgressColor(task.dailyProgress.day2)} ${task.dailyProgress.day2 === "-" ? "bg-transparent text-gray-400 border-none" : ""}`}
                      >
                        {task.dailyProgress.day2}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getDayProgressColor(task.dailyProgress.day3)} ${task.dailyProgress.day3 === "-" ? "bg-transparent text-gray-400 border-none" : ""}`}
                      >
                        {task.dailyProgress.day3}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getDayProgressColor(task.dailyProgress.day4)} ${task.dailyProgress.day4 === "-" ? "bg-transparent text-gray-400 border-none" : ""}`}
                      >
                        {task.dailyProgress.day4}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getDayProgressColor(task.dailyProgress.day5)} ${task.dailyProgress.day5 === "-" ? "bg-transparent text-gray-400 border-none" : ""}`}
                      >
                        {task.dailyProgress.day5}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getDayProgressColor(task.dailyProgress.day6)} ${task.dailyProgress.day6 === "-" ? "bg-transparent text-gray-400 border-none" : ""}`}
                      >
                        {task.dailyProgress.day6}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk Tasks</p>
                <p className="text-2xl font-bold text-red-600">
                  {sprintTasks.filter(t => t.risk === "Risk").length}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-green-600">
                  {sprintTasks.filter(t => t.completionPercentage === 100).length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600">
                  {sprintTasks.filter(t => isOverdue(t.plannedDueDate)).length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(sprintTasks.reduce((acc, t) => acc + t.completionPercentage, 0) / sprintTasks.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
