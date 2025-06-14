
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap } from "lucide-react";
import { useROF5Form } from "@/hooks/useROF5Form";
import { useWorkflow, WorkflowInstruction } from "@/contexts/WorkflowContext";
import { DocumentGenerator } from "@/services/documentGenerator";
import { AIService } from "@/services/aiService";
import SiteInformationSection from "@/components/ROF5/SiteInformationSection";
import TitleDetailsSection from "@/components/ROF5/TitleDetailsSection";
import LandlordInformationSection from "@/components/ROF5/LandlordInformationSection";
import LeaseTermsSection from "@/components/ROF5/LeaseTermsSection";
import DocumentsReceivedSection from "@/components/ROF5/DocumentsReceivedSection";
import AdditionalInformationSection from "@/components/ROF5/AdditionalInformationSection";
import AISuggestions from "@/components/AISuggestions";

const ROF5Form = () => {
  const {
    formData,
    handleInputChange,
    handleDocumentCheck,
    generateDocumentVariables,
    resetForm,
    addInstruction,
    generateDocuments,
    toast
  } = useROF5Form();

  const [currentField, setCurrentField] = useState<string>('');
  const [aiEnabled, setAiEnabled] = useState(true);

  const handleInputChangeWithAI = (field: keyof typeof formData, value: string) => {
    handleInputChange(field, value);
    if (aiEnabled) {
      setCurrentField(field);
    }
  };

  const handleApplyAISuggestion = (field: string, value: string) => {
    handleInputChange(field as keyof typeof formData, value);
    toast({
      title: "AI Suggestion Applied",
      description: `${field} updated with AI suggestion`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use AI to calculate smart priority and deadline
    const aiPriority = AIService.calculateSmartPriority(formData);
    const aiDeadline = AIService.calculateSmartDeadline(formData, aiPriority);
    
    // Create new instruction with AI enhancements
    const instructionId = `ROF-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    const newInstruction: WorkflowInstruction = {
      id: instructionId,
      siteCode: formData.siteCode,
      siteLocation: formData.siteLocation,
      landlordName: formData.landlordName,
      stage: 'document-drafting',
      progress: 25,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      assignee: formData.instructingCounsel,
      nextAction: 'Generate Documents',
      priority: aiPriority,
      formData: { ...formData, expectedCompletionDate: aiDeadline },
      generatedDocuments: [],
      auditTrail: [{
        id: `audit-${Date.now()}`,
        action: 'ROF 5 Submitted with AI Enhancement',
        user: formData.instructingCounsel,
        timestamp: new Date().toISOString(),
        details: `Priority: ${aiPriority}, Deadline: ${aiDeadline}`
      }]
    };

    addInstruction(newInstruction);

    // Generate initial documents based on lease type
    const templateIds = [formData.leaseType || 'lease-agreement'];
    
    try {
      await generateDocuments(instructionId, templateIds);
      
      // Generate and download the main document
      const variables = generateDocumentVariables();
      const content = DocumentGenerator.populateTemplate(templateIds[0], variables);
      DocumentGenerator.downloadDocument(content, `${formData.siteCode}-${templateIds[0]}.txt`);
      
      toast({
        title: "ROF 5 Submitted Successfully",
        description: `Property instruction ${instructionId} created with AI-enhanced priority (${aiPriority}) and smart deadline.`,
      });

      // Reset form
      resetForm();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate documents. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>Request for Opinion Form 5 (ROF 5)</span>
              <Badge variant="outline" className="ml-2">Property Instruction</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAiEnabled(!aiEnabled)}
                className={aiEnabled ? "bg-blue-50 border-blue-200" : ""}
              >
                <Zap className="w-4 h-4 mr-2" />
                AI {aiEnabled ? "On" : "Off"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-8">
                <SiteInformationSection 
                  formData={formData} 
                  onInputChange={handleInputChangeWithAI} 
                />
                
                <Separator />
                
                <TitleDetailsSection 
                  formData={formData} 
                  onInputChange={handleInputChangeWithAI} 
                />
                
                <Separator />
                
                <LandlordInformationSection 
                  formData={formData} 
                  onInputChange={handleInputChangeWithAI} 
                />
                
                <Separator />
                
                <LeaseTermsSection 
                  formData={formData} 
                  onInputChange={handleInputChangeWithAI} 
                />
                
                <Separator />
                
                <DocumentsReceivedSection 
                  formData={formData} 
                  onDocumentCheck={handleDocumentCheck} 
                />
                
                <Separator />
                
                <AdditionalInformationSection 
                  formData={formData} 
                  onInputChange={handleInputChangeWithAI} 
                />
              </div>

              {aiEnabled && (
                <div className="space-y-4">
                  <AISuggestions
                    formData={formData}
                    currentField={currentField}
                    onApplySuggestion={handleApplyAISuggestion}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Zap className="w-4 h-4 mr-2" />
                Submit ROF 5 & Generate Documents
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ROF5Form;
