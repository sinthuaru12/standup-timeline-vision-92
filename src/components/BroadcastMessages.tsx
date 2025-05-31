
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, MessageSquare, Calendar, Users } from "lucide-react";

const recentMessages = [
  {
    id: 1,
    title: "Weekly Team Update",
    content: "Please review the project milestones for this week...",
    recipients: "Development Team",
    sentAt: "2024-01-15 09:00",
    status: "sent"
  },
  {
    id: 2,
    title: "Company Policy Update",
    content: "Important changes to our remote work policy...",
    recipients: "All Users",
    sentAt: "2024-01-14 14:30",
    status: "sent"
  },
  {
    id: 3,
    title: "Quarterly Review Reminder",
    content: "Don't forget to submit your quarterly reports...",
    recipients: "Design Team",
    sentAt: "2024-01-13 10:15",
    status: "scheduled"
  }
];

export function BroadcastMessages() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broadcast Messages</h1>
          <p className="text-gray-600">Send announcements and updates to teams</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Broadcast Message</CardTitle>
            <CardDescription>Send a message to selected teams or all users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="messageTitle">Message Title</Label>
              <Input id="messageTitle" placeholder="Enter message title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="development">Development Team</SelectItem>
                  <SelectItem value="design">Design Team</SelectItem>
                  <SelectItem value="marketing">Marketing Team</SelectItem>
                  <SelectItem value="sales">Sales Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="messageContent">Message Content</Label>
              <Textarea 
                id="messageContent" 
                placeholder="Enter your message content" 
                rows={5}
              />
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Your latest broadcast messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{message.title}</h4>
                    <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                      {message.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {message.recipients}
                    </div>
                    <span>{message.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
