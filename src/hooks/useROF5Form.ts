
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { DocumentGenerator, DocumentVariable } from "@/services/documentGenerator";

export interface ROF5FormData {
  // Site Details
  siteCode: string;
  siteLocation: string;
  county: string;
  subCounty: string;
  ward: string;
  
  // Title Details
  titleNumber: string;
  titleType: string;
  registrationSection: string;
  landArea: string;
  landUse: string;
  
  // Landlord Information
  landlordName: string;
  landlordType: string;
  landlordAddress: string;
  landlordPhone: string;
  landlordEmail: string;
  landlordId: string;
  
  // Lease Terms
  leaseType: string;
  leaseTerm: string;
  commencementDate: string;
  monthlyRent: string;
  deposit: string;
  rentEscalation: string;
  
  // Additional Terms
  permitType: string;
  specialConditions: string;
  documentsReceived: string[];
  
  // Internal Details
  instructingCounsel: string;
  urgencyLevel: string;
  expectedCompletionDate: string;
}

const initialFormData: ROF5FormData = {
  siteCode: "",
  siteLocation: "",
  county: "",
  subCounty: "",
  ward: "",
  titleNumber: "",
  titleType: "",
  registrationSection: "",
  landArea: "",
  landUse: "",
  landlordName: "",
  landlordType: "",
  landlordAddress: "",
  landlordPhone: "",
  landlordEmail: "",
  landlordId: "",
  leaseType: "",
  leaseTerm: "",
  commencementDate: "",
  monthlyRent: "",
  deposit: "",
  rentEscalation: "5",
  permitType: "",
  specialConditions: "",
  documentsReceived: [],
  instructingCounsel: "",
  urgencyLevel: "",
  expectedCompletionDate: ""
};

export const useROF5Form = () => {
  const { toast } = useToast();
  const { addInstruction, generateDocuments } = useWorkflow();
  const [formData, setFormData] = useState<ROF5FormData>(initialFormData);

  const handleInputChange = (field: keyof ROF5FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentCheck = (document: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documentsReceived: checked 
        ? [...prev.documentsReceived, document]
        : prev.documentsReceived.filter(d => d !== document)
    }));
  };

  const generateDocumentVariables = (): DocumentVariable[] => {
    return [
      { key: 'current_date', value: new Date().toLocaleDateString() },
      { key: 'site_code', value: formData.siteCode },
      { key: 'site_location', value: formData.siteLocation },
      { key: 'landlord_name', value: formData.landlordName },
      { key: 'landlord_address', value: formData.landlordAddress },
      { key: 'title_number', value: formData.titleNumber },
      { key: 'land_area', value: formData.landArea },
      { key: 'commencement_date', value: formData.commencementDate },
      { key: 'lease_term', value: formData.leaseTerm },
      { key: 'monthly_rent', value: formData.monthlyRent },
      { key: 'escalation_rate', value: formData.rentEscalation },
      { key: 'deposit', value: formData.deposit },
      { key: 'lease_type', value: formData.leaseType },
      { key: 'file_ref', value: `${formData.siteCode}/2024` }
    ];
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    handleInputChange,
    handleDocumentCheck,
    generateDocumentVariables,
    resetForm,
    addInstruction,
    generateDocuments,
    toast
  };
};
