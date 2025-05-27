
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface TimelineItem {
  id: number;
  title: string;
  team: string;
  status: "completed" | "in-progress" | "upcoming" | "delayed";
  startDate: string;
  endDate: string;
  progress: number;
  blockers?: string[];
}

export function TimelineView() {
  const timelineData: TimelineItem[] = [
    {
      id: 1,
      title: "User Authentication System",
      team: "Backend Team",
      status: "completed",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      progress: 100,
    },
    {
      id: 2,
      title: "Mobile App UI Redesign",
      team: "Frontend Team",
      status: "in-progress",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      progress: 78,
    },
    {
      id: 3,
      title: "API Documentation",
      team: "Backend Team",
      status: "delayed",
      startDate: "2024-02-15",
      endDate: "2024-03-01",
      progress: 45,
      blockers: ["Waiting for API finalization", "Resource allocation"],
    },
    {
      id: 4,
      title: "User Testing Phase",
      team: "QA Team",
      status: "upcoming",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      progress: 0,
    },
    {
      id: 5,
      title: "Performance Optimization",
      team: "Frontend Team",
      status: "in-progress",
      startDate: "2024-02-20",
      endDate: "2024-03-20",
      progress: 60,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "completed": "bg-green-100 text-green-800",
      "in-progress": "bg-blue-100 text-blue-800",
      "upcoming": "bg-gray-100 text-gray-800",
      "delayed": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Timeline</h1>
        <div className="text-sm text-gray-500">
          Generated from daily standup reports
        </div>
      </div>

      {/* Timeline Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">1</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Delayed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Items */}
      <div className="space-y-4">
        {timelineData.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.team}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace("-", " ")}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                  <p className="font-medium">{new Date(item.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                  <p className="font-medium">{new Date(item.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Progress</p>
                  <p className="font-medium">{item.progress}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={item.progress} className="h-2" />
                {item.blockers && item.blockers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Blockers</p>
                    <div className="space-y-1">
                      {item.blockers.map((blocker, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-700">{blocker}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
