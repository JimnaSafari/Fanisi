
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
  Eye,
  Download,
  MoreHorizontal,
  Star,
  Activity
} from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";
import LocationMap from "@/components/LocationMap";

const DarkWorkflowDashboard = () => {
  const { instructions } = useWorkflow();
  const { toast } = useToast();

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case "document-drafting": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "execution": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "registration": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <Star className="w-4 h-4 text-red-400 fill-red-400" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "low": return <Activity className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleAction = (action: string, instructionId: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} for instruction ${instructionId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <LocationMap />

      {/* Instructions Table */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-orange-400" />
              <span>Active Instructions</span>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {instructions.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instructions.map((instruction) => (
              <div 
                key={instruction.id} 
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:bg-slate-700 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Priority & ID */}
                  <div className="col-span-3 flex items-center space-x-3">
                    {getPriorityIcon(instruction.priority)}
                    <div>
                      <p className="font-medium text-white">{instruction.id}</p>
                      <p className="text-xs text-slate-400">{instruction.siteCode}</p>
                    </div>
                  </div>

                  {/* Location & Landlord */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <p className="text-sm text-white truncate">{instruction.siteLocation}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-400 truncate">{instruction.landlordName}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge className={getStatusColor(instruction.stage)}>
                      {instruction.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{instruction.progress}%</span>
                      </div>
                      <Progress 
                        value={instruction.progress} 
                        className="h-2 bg-slate-600"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction("View", instruction.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction("Download ROF 6", instruction.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {Math.floor((new Date().getTime() - new Date(instruction.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Next: {instruction.nextAction}</span>
                    </div>
                  </div>
                  <div>
                    Assigned to: <span className="text-white">{instruction.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DarkWorkflowDashboard;
