import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, FileText, DollarSign, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkflow, WorkflowInstruction, AuditEntry } from "@/contexts/WorkflowContext";
import { DocumentGenerator, DocumentVariable } from "@/services/documentGenerator";

const ROF5Form = () => {
  const { toast } = useToast();
  const { addInstruction, generateDocuments, addAuditEntry } = useWorkflow();
  
  const [formData, setFormData] = useState({
    // Site Details
    siteCode: "",
    siteLocation: "",
    county: "",
    subCounty: "",
    ward: "",
    
    // Title Details
    titleNumber: "",
    titleType: "",
    registrationSection: "",
    landArea: "",
    landUse: "",
    
    // Landlord Information
    landlordName: "",
    landlordType: "",
    landlordAddress: "",
    landlordPhone: "",
    landlordEmail: "",
    landlordId: "",
    
    // Lease Terms
    leaseType: "",
    leaseTerm: "",
    commencementDate: "",
    monthlyRent: "",
    deposit: "",
    rentEscalation: "5",
    
    // Additional Terms
    permitType: "",
    specialConditions: "",
    documentsReceived: [],
    
    // Internal Details
    instructingCounsel: "",
    urgencyLevel: "",
    expectedCompletionDate: ""
  });

  const documentTypes = [
    "Title Deed Copy",
    "Survey Plan",
    "Consent to Lease",
    "Rates Clearance",
    "Land Control Board Consent",
    "Environmental Impact Assessment",
    "Building Plan Approval",
    "Other Permits"
  ];

  const handleInputChange = (field: string, value: string) => {
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
      setFormData({
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
      });

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
            
            {/* Site Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Site Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="siteCode">Site Code *</Label>
                  <Input
                    id="siteCode"
                    value={formData.siteCode}
                    onChange={(e) => handleInputChange("siteCode", e.target.value)}
                    placeholder="e.g., NBI001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="siteLocation">Site Location *</Label>
                  <Input
                    id="siteLocation"
                    value={formData.siteLocation}
                    onChange={(e) => handleInputChange("siteLocation", e.target.value)}
                    placeholder="e.g., Westlands, Nairobi"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="county">County *</Label>
                  <Select value={formData.county} onValueChange={(value) => handleInputChange("county", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select County" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kiambu">Kiambu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="uasin-gishu">Uasin Gishu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subCounty">Sub-County</Label>
                  <Input
                    id="subCounty"
                    value={formData.subCounty}
                    onChange={(e) => handleInputChange("subCounty", e.target.value)}
                    placeholder="Enter sub-county"
                  />
                </div>
                <div>
                  <Label htmlFor="ward">Ward</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    placeholder="Enter ward"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Title Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Title Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="titleNumber">Title Number *</Label>
                  <Input
                    id="titleNumber"
                    value={formData.titleNumber}
                    onChange={(e) => handleInputChange("titleNumber", e.target.value)}
                    placeholder="e.g., NAIROBI/BLOCK1/123"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="titleType">Title Type *</Label>
                  <Select value={formData.titleType} onValueChange={(value) => handleInputChange("titleType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Title Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freehold">Freehold</SelectItem>
                      <SelectItem value="leasehold">Leasehold</SelectItem>
                      <SelectItem value="sectional">Sectional Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="registrationSection">Registration Section</Label>
                  <Input
                    id="registrationSection"
                    value={formData.registrationSection}
                    onChange={(e) => handleInputChange("registrationSection", e.target.value)}
                    placeholder="Enter registration section"
                  />
                </div>
                <div>
                  <Label htmlFor="landArea">Land Area</Label>
                  <Input
                    id="landArea"
                    value={formData.landArea}
                    onChange={(e) => handleInputChange("landArea", e.target.value)}
                    placeholder="e.g., 0.5 hectares"
                  />
                </div>
                <div>
                  <Label htmlFor="landUse">Land Use</Label>
                  <Select value={formData.landUse} onValueChange={(value) => handleInputChange("landUse", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Land Use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Landlord Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Landlord Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landlordName">Landlord Name *</Label>
                  <Input
                    id="landlordName"
                    value={formData.landlordName}
                    onChange={(e) => handleInputChange("landlordName", e.target.value)}
                    placeholder="Full name or company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="landlordType">Landlord Type *</Label>
                  <Select value={formData.landlordType} onValueChange={(value) => handleInputChange("landlordType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="government">Government Entity</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="landlordAddress">Landlord Address *</Label>
                  <Textarea
                    id="landlordAddress"
                    value={formData.landlordAddress}
                    onChange={(e) => handleInputChange("landlordAddress", e.target.value)}
                    placeholder="Complete postal address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="landlordPhone">Phone Number</Label>
                  <Input
                    id="landlordPhone"
                    value={formData.landlordPhone}
                    onChange={(e) => handleInputChange("landlordPhone", e.target.value)}
                    placeholder="e.g., +254 700 000 000"
                  />
                </div>
                <div>
                  <Label htmlFor="landlordEmail">Email Address</Label>
                  <Input
                    id="landlordEmail"
                    type="email"
                    value={formData.landlordEmail}
                    onChange={(e) => handleInputChange("landlordEmail", e.target.value)}
                    placeholder="landlord@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="landlordId">ID/Registration Number</Label>
                  <Input
                    id="landlordId"
                    value={formData.landlordId}
                    onChange={(e) => handleInputChange("landlordId", e.target.value)}
                    placeholder="ID or company registration number"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Lease Terms */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Lease Terms</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="leaseType">Lease Type *</Label>
                  <Select value={formData.leaseType} onValueChange={(value) => handleInputChange("leaseType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lease Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lease">Lease Agreement</SelectItem>
                      <SelectItem value="licence">Licence Agreement</SelectItem>
                      <SelectItem value="agreement-to-lease">Agreement to Lease</SelectItem>
                      <SelectItem value="wayleave">Wayleave Agreement</SelectItem>
                      <SelectItem value="easement">Easement Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leaseTerm">Lease Term (Years) *</Label>
                  <Input
                    id="leaseTerm"
                    type="number"
                    value={formData.leaseTerm}
                    onChange={(e) => handleInputChange("leaseTerm", e.target.value)}
                    placeholder="e.g., 10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="commencementDate">Commencement Date *</Label>
                  <Input
                    id="commencementDate"
                    type="date"
                    value={formData.commencementDate}
                    onChange={(e) => handleInputChange("commencementDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent (KES) *</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                    placeholder="e.g., 50000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Security Deposit (KES)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => handleInputChange("deposit", e.target.value)}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div>
                  <Label htmlFor="rentEscalation">Rent Escalation (% p.a.)</Label>
                  <Input
                    id="rentEscalation"
                    type="number"
                    value={formData.rentEscalation}
                    onChange={(e) => handleInputChange("rentEscalation", e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Documents Received */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documents Received</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentTypes.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc}
                      checked={formData.documentsReceived.includes(doc)}
                      onCheckedChange={(checked) => handleDocumentCheck(doc, checked as boolean)}
                    />
                    <Label htmlFor={doc} className="text-sm">{doc}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructingCounsel">Instructing Counsel *</Label>
                  <Input
                    id="instructingCounsel"
                    value={formData.instructingCounsel}
                    onChange={(e) => handleInputChange("instructingCounsel", e.target.value)}
                    placeholder="Name of instructing counsel"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="urgencyLevel">Urgency Level</Label>
                  <Select value={formData.urgencyLevel} onValueChange={(value) => handleInputChange("urgencyLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expectedCompletionDate">Expected Completion Date</Label>
                  <Input
                    id="expectedCompletionDate"
                    type="date"
                    value={formData.expectedCompletionDate}
                    onChange={(e) => handleInputChange("expectedCompletionDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="specialConditions">Special Conditions/Notes</Label>
                <Textarea
                  id="specialConditions"
                  value={formData.specialConditions}
                  onChange={(e) => handleInputChange("specialConditions", e.target.value)}
                  placeholder="Any special conditions, requirements, or notes..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
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
