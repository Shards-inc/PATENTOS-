export enum AgentStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Patent {
  id: string;
  title: string;
  abstract: string;
  assignee: string;
  filingDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Expiring Soon';
  jurisdictions: string[];
  ukReplicabilityScore: number; // 0 to 100
  ukReplicabilityReason: string;
  opportunityType: 'Public Domain' | 'Licensing' | 'Risk High' | 'Territorial Gap';
  // New Intelligence Fields
  riskScore: number; // 0-100 General Legal Risk
  reverseEngineeringFeasibility: 'High' | 'Medium' | 'Low';
  isTradeSecretCandidate: boolean;
  priorArtReport?: string; // Optional field for deep scan results
}

export interface AgentLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action' | 'error';
}

export interface SearchState {
  query: string;
  results: Patent[];
  status: AgentStatus;
  logs: AgentLog[];
  selectedPatent: Patent | null;
}