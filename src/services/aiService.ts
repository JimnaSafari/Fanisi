
export interface AISuggestion {
  type: 'form-completion' | 'workflow-action' | 'priority' | 'deadline';
  field?: string;
  value: string;
  confidence: number;
  reason: string;
}

export interface WorkflowSuggestion {
  action: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDays: number;
}

export class AIService {
  static async getFormSuggestions(formData: any, field: string): Promise<AISuggestion[]> {
    // Simulate AI-powered form suggestions based on existing data
    const suggestions: AISuggestion[] = [];

    if (field === 'siteLocation' && formData.county) {
      const locationSuggestions = this.getLocationSuggestions(formData.county);
      suggestions.push(...locationSuggestions);
    }

    if (field === 'leaseTerm' && formData.siteLocation) {
      const termSuggestion = this.getLeaseTermSuggestion(formData.siteLocation);
      suggestions.push(termSuggestion);
    }

    if (field === 'monthlyRent' && formData.siteLocation && formData.landArea) {
      const rentSuggestion = this.getRentSuggestion(formData.siteLocation, formData.landArea);
      suggestions.push(rentSuggestion);
    }

    return suggestions;
  }

  static getWorkflowSuggestions(instruction: any): WorkflowSuggestion[] {
    const suggestions: WorkflowSuggestion[] = [];

    if (instruction.stage === 'document-drafting') {
      suggestions.push({
        action: 'Review and finalize lease agreement',
        reason: 'Standard lease template generated, requires legal review',
        priority: 'medium',
        estimatedDays: 2
      });

      if (instruction.formData?.urgencyLevel === 'high') {
        suggestions.push({
          action: 'Expedite external counsel review',
          reason: 'High priority instruction requires faster processing',
          priority: 'high',
          estimatedDays: 1
        });
      }
    }

    if (instruction.stage === 'execution') {
      suggestions.push({
        action: 'Schedule landlord meeting for signing',
        reason: 'Documents ready for execution, coordination needed',
        priority: 'medium',
        estimatedDays: 3
      });
    }

    return suggestions;
  }

  static calculateSmartPriority(formData: any): 'low' | 'medium' | 'high' {
    let score = 0;

    // Location-based priority
    if (formData.county?.toLowerCase().includes('nairobi')) score += 2;
    if (formData.siteLocation?.toLowerCase().includes('cbd')) score += 2;

    // Urgency level
    if (formData.urgencyLevel === 'high') score += 3;
    if (formData.urgencyLevel === 'medium') score += 1;

    // Lease value
    const rent = parseFloat(formData.monthlyRent || '0');
    if (rent > 500000) score += 2;
    if (rent > 200000) score += 1;

    // Lease term
    const term = parseInt(formData.leaseTerm || '0');
    if (term >= 10) score += 1;

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  static calculateSmartDeadline(formData: any, priority: string): string {
    const baseDate = new Date();
    let daysToAdd = 30; // Default

    // Adjust based on priority
    if (priority === 'high') daysToAdd = 14;
    if (priority === 'medium') daysToAdd = 21;

    // Adjust based on complexity
    if (formData.specialConditions?.length > 100) daysToAdd += 7;
    if (formData.leaseType === 'sublease') daysToAdd += 5;

    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate.toISOString().split('T')[0];
  }

  private static getLocationSuggestions(county: string): AISuggestion[] {
    const locationMap: Record<string, string[]> = {
      'nairobi': ['Westlands', 'Upper Hill', 'CBD', 'Karen', 'Runda'],
      'mombasa': ['Nyali', 'Bamburi', 'Diani', 'Kilifi'],
      'kisumu': ['Milimani', 'Kondele', 'Mamboleo']
    };

    const locations = locationMap[county.toLowerCase()] || [];
    return locations.map(location => ({
      type: 'form-completion' as const,
      field: 'siteLocation',
      value: location,
      confidence: 0.8,
      reason: `Common location in ${county} for telecom sites`
    }));
  }

  private static getLeaseTermSuggestion(location: string): AISuggestion {
    const term = location.toLowerCase().includes('cbd') ? '15' : '20';
    return {
      type: 'form-completion' as const,
      field: 'leaseTerm',
      value: term,
      confidence: 0.9,
      reason: `Standard lease term for ${location.includes('cbd') ? 'urban' : 'suburban'} areas`
    };
  }

  private static getRentSuggestion(location: string, landArea: string): AISuggestion {
    const area = parseFloat(landArea) || 1;
    let baseRate = 1000; // per sqm

    if (location.toLowerCase().includes('cbd')) baseRate = 2000;
    if (location.toLowerCase().includes('westlands')) baseRate = 1800;
    if (location.toLowerCase().includes('karen')) baseRate = 1500;

    const suggestedRent = Math.round(area * baseRate);

    return {
      type: 'form-completion' as const,
      field: 'monthlyRent',
      value: suggestedRent.toString(),
      confidence: 0.7,
      reason: `Based on market rates for ${location} (KES ${baseRate}/sqm)`
    };
  }
}
