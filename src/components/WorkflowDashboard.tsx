
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Eye
} from "lucide-react";

const WorkflowDashboard = () => {
  const activeInstructions = [
    {
      id: "ROF-2024-001",
      siteCode: "NBI001",
      location: "Westlands, Nairobi",
      landlord: "ABC Properties Ltd",
      stage: "Document Drafting",
      progress: 35,
      daysActive: 5,
      nextAction: "EC Review",
      priority: "high",
      assignee: "John Doe (IC)"
    },
    {
      id: "ROF-2024-002",
      siteCode: "MSA002",
      location: "Mombasa Road",
      landlord: "XYZ Holdings",
      stage: "Execution",
      progress: 75,
      daysActive: 12,
      nextAction: "POA Signature",
      priority: "medium",
      assignee: "Jane Smith (EC)"
    },
    {
      id: "ROF-2024-003",
      siteCode: "ELD003",
      location: "Eldoret Central",
      landlord: "PQR Investments",
      stage: "Registration",
      progress: 90,
      daysActive: 18,
      nextAction: "Document Return",
      priority: "low",
      assignee: "Mike Johnson (POA)"
    }
  ];

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case "Document Drafting": return "bg-blue-100 text-blue-800";
      case "Execution": return "bg-yellow-100 text-yellow-800";
      case "Registration": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Active Property Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeInstructions.map((instruction) => (
              <div key={instruction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{instruction.id}</h3>
                      <Badge className={getStatusColor(instruction.stage)}>
                        {instruction.stage}
                      </Badge>
                      <AlertTriangle className={`w-4 h-4 ${getPriorityColor(instruction.priority)}`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{instruction.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{instruction.landlord}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{instruction.daysActive} days active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Next: {instruction.nextAction}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{instruction.progress}%</span>
                  </div>
                  <Progress value={instruction.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Assigned to: {instruction.assignee}</span>
                    <span>Site: {instruction.siteCode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Stages Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Stages Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { stage: "ROF 5 Received", count: 8, color: "bg-blue-500" },
              { stage: "Document Drafting", count: 12, color: "bg-yellow-500" },
              { stage: "Under Execution", count: 6, color: "bg-orange-500" },
              { stage: "Registration & Closure", count: 4, color: "bg-green-500" }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg border">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.count}</h3>
                <p className="text-sm text-gray-600">{item.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDashboard;
