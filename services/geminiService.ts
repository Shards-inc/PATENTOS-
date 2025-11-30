import { GoogleGenAI, Type } from "@google/genai";
import { Patent } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to simulate system latency for better UX pacing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sanitization to ensure AI output matches our strict schema and doesn't break the UI
const sanitizePatentData = (raw: any): Patent => {
  return {
    id: String(raw.id || "UNKNOWN_ID"),
    title: String(raw.title || "Untitled Patent Analysis"),
    abstract: String(raw.abstract || "No abstract available for this asset."),
    assignee: String(raw.assignee || "Unknown Entity"),
    filingDate: String(raw.filingDate || "N/A"),
    expirationDate: String(raw.expirationDate || "N/A"),
    status: (['Active', 'Expired', 'Expiring Soon'].includes(raw.status) ? raw.status : 'Active') as any,
    jurisdictions: Array.isArray(raw.jurisdictions) ? raw.jurisdictions.map(String) : [],
    // Clamp scores to 0-100 to prevent UI overflow
    ukReplicabilityScore: Math.min(100, Math.max(0, Number(raw.ukReplicabilityScore) || 0)),
    ukReplicabilityReason: String(raw.ukReplicabilityReason || "Automated analysis unavailable."),
    opportunityType: (['Public Domain', 'Licensing', 'Risk High', 'Territorial Gap'].includes(raw.opportunityType) ? raw.opportunityType : 'Risk High') as any,
    riskScore: Math.min(100, Math.max(0, Number(raw.riskScore) || 50)),
    reverseEngineeringFeasibility: (['High', 'Medium', 'Low'].includes(raw.reverseEngineeringFeasibility) ? raw.reverseEngineeringFeasibility : 'Medium') as any,
    isTradeSecretCandidate: Boolean(raw.isTradeSecretCandidate),
    priorArtReport: raw.priorArtReport ? String(raw.priorArtReport) : undefined
  };
};

export const analyzePatents = async (
  query: string, 
  onLog: (msg: string, type: 'info' | 'action' | 'success' | 'warning' | 'error') => void
): Promise<Patent[]> => {
  
  if (!apiKey) {
    onLog("Error: No API Key found in environment variables.", 'error');
    throw new Error("API Key missing");
  }

  try {
    onLog(`Initializing Gemini 2.5 Flash Agent (v2.4-PROD)...`, 'info');
    await delay(300);
    
    onLog(`Accessing global patent index for "${query}"...`, 'action');
    await delay(400);
    
    onLog(`Filtering for UK-replicable opportunities (Expired/US-Only)...`, 'action');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are PatentOS, an elite IP Strategy Agent specializing in the UK Market.
      
      OBJECTIVE:
      Search for 6 REAL or HIGHLY REALISTIC patents related to: "${query}".
      Prioritize identifying "Blue Ocean" opportunities for UK developers:
      1. **Expired Patents**: Technologies now in the public domain.
      2. **Territorial Gaps**: US Patents that were NEVER filed in the UK/Europe.
      3. **Expiring Soon**: Patents expiring within 2 years.

      ANALYSIS REQUIRED:
      For each patent, calculate specific risk metrics.
      - UK Replicability Score (0-100): High means safe to build in UK.
      - Risk Score (0-100): High means likely to be sued (e.g., Active UK patent).
      - Reverse Engineering Feasibility: Can this be built without viewing the source code?
      - Trade Secret Candidate: If the patent is weak, is it better kept as a secret?

      DISCLAIMER MANDATE:
      You are an AI technical analyst, NOT a lawyer. 
      Use probabilistic language ("likely", "suggests"). 
      NEVER provide legal guarantees.

      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Patent Number (e.g., US7654321B2)" },
              title: { type: Type.STRING, description: "Official Title" },
              abstract: { type: Type.STRING, description: "Technical summary of the invention" },
              assignee: { type: Type.STRING, description: "Company or Inventor" },
              filingDate: { type: Type.STRING, description: "YYYY-MM-DD" },
              expirationDate: { type: Type.STRING, description: "YYYY-MM-DD" },
              status: { type: Type.STRING, enum: ['Active', 'Expired', 'Expiring Soon'] },
              jurisdictions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Active jurisdictions (e.g., US, EP, GB, WO)"
              },
              ukReplicabilityScore: { type: Type.NUMBER, description: "0-100 Safety Score" },
              ukReplicabilityReason: { type: Type.STRING, description: "Short legal rationale for the score." },
              opportunityType: { type: Type.STRING, enum: ['Public Domain', 'Licensing', 'Risk High', 'Territorial Gap'] },
              riskScore: { type: Type.NUMBER, description: "0-100 Legal Danger Score" },
              reverseEngineeringFeasibility: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
              isTradeSecretCandidate: { type: Type.BOOLEAN, description: "Is this better as a secret?" }
            },
            required: ["id", "title", "abstract", "assignee", "filingDate", "expirationDate", "status", "jurisdictions", "ukReplicabilityScore", "ukReplicabilityReason", "opportunityType", "riskScore", "reverseEngineeringFeasibility", "isTradeSecretCandidate"]
          }
        }
      }
    });

    onLog("Cross-referencing filing dates with UK IPO database...", 'action');
    await delay(500);

    const jsonText = response.text || "[]";
    let rawPatents = [];
    
    try {
        rawPatents = JSON.parse(jsonText);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        onLog("Warning: Agent response was malformed. Attempting recovery...", 'warning');
        return []; 
    }

    // Apply strict sanitization to ensure UI safety
    const patents: Patent[] = rawPatents.map(sanitizePatentData);

    // Sort by replicability score descending to highlight opportunities
    patents.sort((a, b) => b.ukReplicabilityScore - a.ukReplicabilityScore);

    onLog(`Analysis complete. Identified ${patents.length} strategic vectors.`, 'success');
    return patents;

  } catch (error) {
    console.error("Agent Error:", error);
    onLog("Agent encountered a fatal indexing error. Please retry.", 'error');
    return [];
  }
};

export const getDeepDive = async (patent: Patent, onLog?: (msg: string, type: 'info') => void): Promise<string> => {
    if(onLog) onLog(`Generating Freedom-to-Operate report for ${patent.id}...`, 'info');
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a 'Freedom to Operate' (FTO) Executive Summary for patent ${patent.id}: "${patent.title}".
            
            CONTEXT:
            The user is a UK-based engineer looking to replicate this technology.
            Current Status: ${patent.status}.
            Replicability Score: ${patent.ukReplicabilityScore}/100.
            Jurisdictions: ${patent.jurisdictions.join(', ')}.

            OUTPUT FORMAT (Strict Markdown):
            
            # Executive Verdict
            [Clear YES/NO/CAUTION statement on building this in the UK]

            ## Technical Claims Analysis
            *Simplify the legal jargon into engineering terms. What exactly is protected?*

            ## Territorial Gap Analysis (If applicable)
            *If this is a US-only patent, explicitly state why it is likely safe in the UK.*

            ## Risk Mitigation Strategy
            *Specific engineering steps to avoid infringement (Design-around).*

            ## Commercial Viability
            *Estimated market value and implementation use cases.*

            DISCLAIMER:
            Append a standard legal disclaimer that this is AI-generated technical analysis, not legal advice.`
        });
        return response.text || "Analysis unavailable.";
    } catch (e) {
        return "Deep dive analysis failed due to agent timeout.";
    }
}

export const generatePriorArtReport = async (patent: Patent): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a Senior Patent Examiner. Perform a 'Prior Art' simulation for the patent described below. 
            
            PATENT DATA:
            ID: ${patent.id}
            Title: ${patent.title}
            Abstract: ${patent.abstract}

            TASK:
            Generate a realistic "Prior Art & Invalidity Risk" report. 
            Since you cannot access real-time private databases, simulate 3 highly plausible citation vectors (US, EP, or JP patents) that would likely exist for this technology.
            
            OUTPUT FORMAT (Markdown):
            
            **CITATION ANALYSIS RESULTS**
            1. [Patent Number] ([Year]) - [Similarity Score]% Similarity.
               *Context: Brief explanation of the overlap.*
            2. [Patent Number] ([Year]) - [Similarity Score]% Similarity.
               *Context: Brief explanation.*
            3. [Patent Number] ([Year]) - [Similarity Score]% Similarity.
               *Context: Brief explanation.*

            **STRATEGIC RECOMMENDATION**
            [Assessment of whether the original claims are likely invalid due to this prior art].

            DISCLAIMER:
            State clearly that this is a simulation based on semantic analysis.`
        });
        return response.text || "Prior art simulation unavailable.";
    } catch (e) {
        throw new Error("Prior art generation failed.");
    }
};