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
  Download
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
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Actions",
      value: "12",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Completed This Month",
      value: "8",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Overdue Items",
      value: "3",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Fanisi Workflow</h1>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Property Instruction Automation
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <UserSelector />
            {hasPermission('manage-users') && (
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
            {hasPermission('create-instruction') && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Instruction
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="rof5" disabled={!hasPermission('create-instruction')}>
              ROF 5 Entry
            </TabsTrigger>
            <TabsTrigger value="templates" disabled={!hasPermission('view-dashboard')}>
              Templates
            </TabsTrigger>
            <TabsTrigger value="reminders" disabled={!hasPermission('view-dashboard')}>
              Reminders
            </TabsTrigger>
            <TabsTrigger value="reports" disabled={!hasPermission('generate-reports')}>
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search and Filter Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search instructions by site code, landlord, or location..." 
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    {hasPermission('generate-reports') && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <WorkflowDashboard />
          </TabsContent>

          <TabsContent value="rof5">
            {hasPermission('create-instruction') ? (
              <ROF5Form />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">You don't have permission to create new instructions.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates">
            <DocumentTemplates />
          </TabsContent>

          <TabsContent value="reminders">
            {hasPermission('view-dashboard') ? (
              <ReminderManager />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">You don't have permission to manage reminders.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reports and analytics functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
