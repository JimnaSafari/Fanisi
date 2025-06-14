
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowDashboard from "@/components/WorkflowDashboard";
import ROF5Form from "@/components/ROF5Form";
import DocumentTemplates from "@/components/DocumentTemplates";
import Reports from "@/components/Reports";
import ReminderManager from "@/components/ReminderManager";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import SearchFilterBar from "@/components/SearchFilterBar";
import BackgroundElements from "@/components/BackgroundElements";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { hasPermission } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <BackgroundElements />
      <Header />

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
            <StatsGrid />
            <SearchFilterBar />
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
            {hasPermission('generate-reports') ? (
              <Reports />
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">You don't have permission to generate reports.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
