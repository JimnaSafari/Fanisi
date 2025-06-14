
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkflowInstruction {
  id: string;
  siteCode: string;
  siteLocation: string;
  landlordName: string;
  stage: 'document-drafting' | 'execution' | 'registration' | 'completed';
  progress: number;
  createdAt: string;
  lastUpdated: string;
  assignee: string;
  nextAction: string;
  priority: 'low' | 'medium' | 'high';
  formData: any;
  generatedDocuments: string[];
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

interface WorkflowContextType {
  instructions: WorkflowInstruction[];
  addInstruction: (instruction: WorkflowInstruction) => void;
  updateInstruction: (id: string, updates: Partial<WorkflowInstruction>) => void;
  addAuditEntry: (instructionId: string, entry: Omit<AuditEntry, 'id'>) => void;
  generateDocuments: (instructionId: string, templateIds: string[]) => Promise<string[]>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [instructions, setInstructions] = useState<WorkflowInstruction[]>([
    {
      id: "ROF-2024-001",
      siteCode: "NBI001",
      siteLocation: "Westlands, Nairobi",
      landlordName: "ABC Properties Ltd",
      stage: "document-drafting",
      progress: 35,
      createdAt: "2024-01-10",
      lastUpdated: "2024-01-15",
      assignee: "John Doe (IC)",
      nextAction: "EC Review",
      priority: "high",
      formData: {},
      generatedDocuments: [],
      auditTrail: []
    }
  ]);

  const addInstruction = (instruction: WorkflowInstruction) => {
    setInstructions(prev => [...prev, instruction]);
  };

  const updateInstruction = (id: string, updates: Partial<WorkflowInstruction>) => {
    setInstructions(prev => 
      prev.map(inst => 
        inst.id === id 
          ? { ...inst, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : inst
      )
    );
  };

  const addAuditEntry = (instructionId: string, entry: Omit<AuditEntry, 'id'>) => {
    const auditEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    updateInstruction(instructionId, {
      auditTrail: [...(instructions.find(i => i.id === instructionId)?.auditTrail || []), auditEntry]
    });
  };

  const generateDocuments = async (instructionId: string, templateIds: string[]): Promise<string[]> => {
    // Simulate document generation
    const generatedDocs = templateIds.map(templateId => `${templateId}-${instructionId}.pdf`);
    
    updateInstruction(instructionId, {
      generatedDocuments: generatedDocs,
      progress: 50,
      stage: 'execution'
    });

    addAuditEntry(instructionId, {
      action: 'Documents Generated',
      user: 'System',
      timestamp: new Date().toISOString(),
      details: `Generated ${templateIds.length} documents: ${templateIds.join(', ')}`
    });

    return generatedDocs;
  };

  return (
    <WorkflowContext.Provider value={{
      instructions,
      addInstruction,
      updateInstruction,
      addAuditEntry,
      generateDocuments
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
