
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Zap,
  TrendingUp,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import WorkflowDashboard from "@/components/WorkflowDashboard";
import ROF5Form from "@/components/ROF5Form";
import DocumentTemplates from "@/components/DocumentTemplates";
import { useToast } from "@/hooks/use-toast";
import UserSelector from "@/components/UserSelector";
import { useUser } from "@/contexts/UserContext";
import NotificationBell from "@/components/NotificationBell";
import ReminderManager from "@/components/ReminderManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { currentUser, hasPermission } = useUser();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fanisi Workflow
              </h1>
              <p className="text-sm text-gray-600">Property Instruction Automation</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-3 animate-fade-in animation-delay-200">
            <NotificationBell />
            <UserSelector />
            {hasPermission('manage-users') && (
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
            {hasPermission('create-instruction') && (
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Instruction
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/80 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Dashboard</TabsTrigger>
            <TabsTrigger value="rof5" disabled={!hasPermission('create-instruction')} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              ROF 5 Entry
            </TabsTrigger>
            <TabsTrigger value="templates" disabled={!hasPermission('view-dashboard')} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Templates
            </TabsTrigger>
            <TabsTrigger value="reminders" disabled={!hasPermission('view-dashboard')} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Reminders
            </TabsTrigger>
            <TabsTrigger value="reports" disabled={!hasPermission('generate-reports')} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
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

            {/* Search and Filter Bar */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search instructions by site code, landlord, or location..." 
                      className="pl-10 border-0 bg-gray-50/50 focus:bg-white transition-colors duration-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    {hasPermission('generate-reports') && (
                      <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="animate-fade-in animation-delay-400">
              <WorkflowDashboard />
            </div>
          </TabsContent>

          <TabsContent value="rof5" className="animate-fade-in">
            {hasPermission('create-instruction') ? (
              <ROF5Form />
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">You don't have permission to create new instructions.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="animate-fade-in">
            <DocumentTemplates />
          </TabsContent>

          <TabsContent value="reminders" className="animate-fade-in">
            {hasPermission('view-dashboard') ? (
              <ReminderManager />
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">You don't have permission to manage reminders.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Reports & Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced reports and analytics functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
