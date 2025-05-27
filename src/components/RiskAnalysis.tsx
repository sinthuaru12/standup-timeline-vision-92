
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, TrendingDown, User } from "lucide-react";

interface TaskUpdate {
  taskId: string;
  date: string;
  completion: number;
  remainingTime: number;
  dueDate: string;
}

interface RiskTask {
  taskId: string;
  title: string;
  assignee: string;
  dueDate: string;
  completion: number;
  remainingTime: number;
  riskLevel: "high" | "medium" | "low";
  riskFactors: string[];
  timeline: TaskUpdate[];
}

export function RiskAnalysis() {
  const atRiskTasks: RiskTask[] = [
    {
      taskId: "PROJ-123",
      title: "API Authentication Implementation",
      assignee: "Sarah Chen",
      dueDate: "2024-03-15",
      completion: 45,
      remainingTime: 12,
      riskLevel: "high",
      riskFactors: ["Behind schedule", "Low completion rate"],
      timeline: [
        { taskId: "PROJ-123", date: "2024-03-01", completion: 10, remainingTime: 16, dueDate: "2024-03-15" },
        { taskId: "PROJ-123", date: "2024-03-05", completion: 25, remainingTime: 14, dueDate: "2024-03-15" },
        { taskId: "PROJ-123", date: "2024-03-08", completion: 35, remainingTime: 13, dueDate: "2024-03-15" },
        { taskId: "PROJ-123", date: "2024-03-12", completion: 45, remainingTime: 12, dueDate: "2024-03-15" },
      ]
    },
    {
      taskId: "PROJ-124",
      title: "Database Migration Script",
      assignee: "Mike Johnson",
      dueDate: "2024-03-18",
      completion: 70,
      remainingTime: 8,
      riskLevel: "medium",
      riskFactors: ["Tight timeline"],
      timeline: [
        { taskId: "PROJ-124", date: "2024-03-02", completion: 20, remainingTime: 12, dueDate: "2024-03-18" },
        { taskId: "PROJ-124", date: "2024-03-06", completion: 40, remainingTime: 10, dueDate: "2024-03-18" },
        { taskId: "PROJ-124", date: "2024-03-10", completion: 60, remainingTime: 9, dueDate: "2024-03-18" },
        { taskId: "PROJ-124", date: "2024-03-13", completion: 70, remainingTime: 8, dueDate: "2024-03-18" },
      ]
    },
    {
      taskId: "PROJ-125",
      title: "UI Component Testing",
      assignee: "Emily Davis",
      dueDate: "2024-03-20",
      completion: 30,
      remainingTime: 20,
      riskLevel: "high",
      riskFactors: ["Scope creep", "Dependencies blocked"],
      timeline: [
        { taskId: "PROJ-125", date: "2024-03-03", completion: 5, remainingTime: 25, dueDate: "2024-03-20" },
        { taskId: "PROJ-125", date: "2024-03-07", completion: 15, remainingTime: 23, dueDate: "2024-03-20" },
        { taskId: "PROJ-125", date: "2024-03-11", completion: 25, remainingTime: 21, dueDate: "2024-03-20" },
        { taskId: "PROJ-125", date: "2024-03-14", completion: 30, remainingTime: 20, dueDate: "2024-03-20" },
      ]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <TrendingDown className="h-4 w-4 text-green-600" />;
    }
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Risk Analysis Dashboard</h1>
        <div className="text-sm text-gray-500">
          Based on daily standup reports
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Tasks</p>
                <p className="text-3xl font-bold text-red-600">
                  {atRiskTasks.filter(task => task.riskLevel === "high").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medium Risk Tasks</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {atRiskTasks.filter(task => task.riskLevel === "medium").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks Tracked</p>
                <p className="text-3xl font-bold text-blue-600">{atRiskTasks.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Tasks Requiring Attention</h2>
        {atRiskTasks.map((task) => (
          <Card key={task.taskId} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getRiskIcon(task.riskLevel)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.taskId}</p>
                  </div>
                </div>
                <Badge className={getRiskColor(task.riskLevel)}>
                  {task.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Assignee</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{task.assignee}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
                  <p className="font-medium mt-1">{new Date(task.dueDate).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{calculateDaysRemaining(task.dueDate)} days left</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Completion</p>
                  <p className="font-medium mt-1">{task.completion}%</p>
                  <Progress value={task.completion} className="h-2 mt-1" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining Time</p>
                  <p className="font-medium mt-1">{task.remainingTime} hours</p>
                </div>
              </div>

              {task.riskFactors.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Risk Factors</p>
                  <div className="flex flex-wrap gap-2">
                    {task.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Progress Timeline</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {task.timeline.map((update, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded">
                      <p className="font-medium">{new Date(update.date).toLocaleDateString()}</p>
                      <p className="text-gray-600">{update.completion}% complete</p>
                      <p className="text-gray-600">{update.remainingTime}h remaining</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
