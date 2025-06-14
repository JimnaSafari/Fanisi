
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Users,
  MapPin,
  Settings
} from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";

const StatsGrid = () => {
  const { instructions } = useWorkflow();

  // Calculate stage-based statistics
  const stageStats = {
    total: instructions.length,
    documentDrafting: instructions.filter(i => i.stage === 'document-drafting').length,
    execution: instructions.filter(i => i.stage === 'execution').length,
    registration: instructions.filter(i => i.stage === 'registration').length,
    completed: instructions.filter(i => i.stage === 'completed').length,
    inProgress: instructions.filter(i => i.stage !== 'completed').length,
    avgProgress: Math.round(instructions.reduce((sum, i) => sum + i.progress, 0) / instructions.length)
  };

  const stats = [
    {
      title: "Total Instructions",
      value: stageStats.total,
      change: "+12%",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      title: "In Progress",
      value: stageStats.inProgress,
      change: "+5%",
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30"
    },
    {
      title: "Completed",
      value: stageStats.completed,
      change: "+8%",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30"
    },
    {
      title: "Avg Progress",
      value: `${stageStats.avgProgress}%`,
      change: "+3%",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stage Breakdown */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-orange-400" />
            <span>Workflow Stage Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{stageStats.documentDrafting}</div>
              <p className="text-sm text-slate-400">Document Drafting</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{stageStats.execution}</div>
              <p className="text-sm text-slate-400">Execution</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{stageStats.registration}</div>
              <p className="text-sm text-slate-400">Registration</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div className="text-2xl font-bold text-slate-400">{stageStats.completed}</div>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;
