
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SurveyResponsesProps {
  surveyId: number;
  surveyTitle: string;
  onBack: () => void;
}

// Mock survey response data
const mockResponses = [
  {
    id: 1,
    userName: "John Doe",
    email: "john.doe@company.com",
    submittedAt: "2024-01-16 10:30 AM",
    responses: {
      "How satisfied are you with your current role?": "Very Satisfied",
      "What improvements would you suggest for team collaboration?": "Better communication tools and regular team meetings",
      "Rate your work-life balance": "Good"
    }
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane.smith@company.com",
    submittedAt: "2024-01-16 11:15 AM",
    responses: {
      "How satisfied are you with your current role?": "Satisfied",
      "What improvements would you suggest for team collaboration?": "More cross-functional projects",
      "Rate your work-life balance": "Excellent"
    }
  },
  {
    id: 3,
    userName: "Mike Johnson",
    email: "mike.johnson@company.com",
    submittedAt: "2024-01-16 02:45 PM",
    responses: {
      "How satisfied are you with your current role?": "Neutral",
      "What improvements would you suggest for team collaboration?": "Clearer project goals and deadlines",
      "Rate your work-life balance": "Fair"
    }
  },
  {
    id: 4,
    userName: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    submittedAt: "2024-01-17 09:20 AM",
    responses: {
      "How satisfied are you with your current role?": "Very Satisfied",
      "What improvements would you suggest for team collaboration?": "Regular feedback sessions",
      "Rate your work-life balance": "Good"
    }
  }
];

export function SurveyResponses({ surveyId, surveyTitle, onBack }: SurveyResponsesProps) {
  const questions = Object.keys(mockResponses[0]?.responses || {});

  const handleExport = () => {
    console.log("Exporting survey responses for survey:", surveyId);
    // Export functionality would be implemented here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Surveys</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{surveyTitle}</h1>
            <p className="text-muted-foreground">Survey Responses</p>
          </div>
        </div>
        <Button onClick={handleExport} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Responses</span>
        </Button>
      </div>

      {/* Response Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResponses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14%</div>
            <p className="text-xs text-muted-foreground">{mockResponses.length} of 324 sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">2024-01-17</div>
            <p className="text-xs text-muted-foreground">09:20 AM</p>
          </CardContent>
        </Card>
      </div>

      {/* Responses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Responses</CardTitle>
          <CardDescription>Detailed responses from survey participants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Submitted</TableHead>
                {questions.map((question, index) => (
                  <TableHead key={index} className="min-w-[200px]">
                    {question}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{response.userName}</div>
                      <div className="text-sm text-muted-foreground">{response.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{response.submittedAt}</TableCell>
                  {questions.map((question, index) => (
                    <TableCell key={index} className="max-w-[300px]">
                      <div className="text-sm">{response.responses[question]}</div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
