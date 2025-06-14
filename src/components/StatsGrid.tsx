
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Users,
  MapPin
} from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";

const StatsGrid = () => {
  const { instructions } = useWorkflow();

  const stats = [
    {
      title: "Total Instructions",
      value: instructions.length,
      change: "+12%",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      title: "In Progress",
      value: instructions.filter(i => i.stage !== 'completed').length,
      change: "+5%",
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30"
    },
    {
      title: "Completed",
      value: instructions.filter(i => i.stage === 'completed').length,
      change: "+8%",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30"
    },
    {
      title: "Active Miners",
      value: "14",
      change: "+3",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
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
  );
};

export default StatsGrid;
