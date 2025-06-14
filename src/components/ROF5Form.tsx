
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useROF5Form } from "@/hooks/useROF5Form";
import { useWorkflow, WorkflowInstruction } from "@/contexts/WorkflowContext";
import { DocumentGenerator } from "@/services/documentGenerator";
import SiteInformationSection from "@/components/ROF5/SiteInformationSection";
import TitleDetailsSection from "@/components/ROF5/TitleDetailsSection";
import LandlordInformationSection from "@/components/ROF5/LandlordInformationSection";
import LeaseTermsSection from "@/components/ROF5/LeaseTermsSection";
import DocumentsReceivedSection from "@/components/ROF5/DocumentsReceivedSection";
import AdditionalInformationSection from "@/components/ROF5/AdditionalInformationSection";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new instruction
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
      priority: formData.urgencyLevel as 'low' | 'medium' | 'high' || 'medium',
      formData: formData,
      generatedDocuments: [],
      auditTrail: [{
        id: `audit-${Date.now()}`,
        action: 'ROF 5 Submitted',
        user: formData.instructingCounsel,
        timestamp: new Date().toISOString(),
        details: 'Initial property instruction created'
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
        description: `Property instruction ${instructionId} created and documents generated.`,
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
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-6 h-6" />
            <span>Request for Opinion Form 5 (ROF 5)</span>
            <Badge variant="outline" className="ml-2">Property Instruction</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <SiteInformationSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <Separator />
            
            <TitleDetailsSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <Separator />
            
            <LandlordInformationSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <Separator />
            
            <LeaseTermsSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <Separator />
            
            <DocumentsReceivedSection 
              formData={formData} 
              onDocumentCheck={handleDocumentCheck} 
            />
            
            <Separator />
            
            <AdditionalInformationSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
