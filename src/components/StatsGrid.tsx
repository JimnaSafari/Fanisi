
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from "lucide-react";

const StatsGrid = () => {
  const stats = [
    {
      title: "Active Instructions",
      value: "24",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      trend: "+12%"
    },
    {
      title: "Pending Actions",
      value: "12",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-r from-yellow-50 to-yellow-100",
      trend: "-5%"
    },
    {
      title: "Completed This Month",
      value: "8",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      trend: "+18%"
    },
    {
      title: "Overdue Items",
      value: "3",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-gradient-to-r from-red-50 to-red-100",
      trend: "-2"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor} transform hover:scale-110 transition-transform duration-200`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
