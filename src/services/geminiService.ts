import { GoogleGenAI } from "@google/genai";

export interface AnalysisResult {
  name: string;
  atsScore: number;
  strengthAnalysis: {
    keywordDensity: number;
    formatCompliance: number;
    roleRelevance: number;
  };
  skills: string[];
  optimization: {
    before: string;
    after: string;
  };
  jobMatches: {
    company: string;
    role: string;
    location: string;
    match: number;
  }[];
  skillGaps: string[];
  roadmap: {
    title: string;
    description: string;
    duration: string;
    milestones: {
      title: string;
      description: string;
    }[];
  }[];
  summary: string;
}

/**
 * Lazy initialization of the Gemini SDK.
 * This prevents the app from crashing on startup if the API key is missing.
 */
function getGeminiClient(apiKey?: string): GoogleGenAI {
  const finalKey = apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  if (!finalKey) {
    throw new Error("Missing Gemini API Key. Please add GEMINI_API_KEY to your env or Settings.");
  }
  return new GoogleGenAI({ apiKey: finalKey });
}

export async function analyzeResume(resumeText: string, options?: { apiKey?: string; targetRole?: string; analysisMode?: 'basic' | 'advanced' }): Promise<AnalysisResult> {
  // If no text or too short, return mock for safety (though App.tsx should validate)
  if (!resumeText || resumeText.length < 50) {
    return getMockData();
  }

  try {
    const ai = getGeminiClient(options?.apiKey);
    
    // Select model based on analysis mode
    const modelName = options?.analysisMode === 'advanced' ? "gemini-2.5-pro" : "gemini-2.5-flash";

    const prompt = `
      You are a world-class ATS (Applicant Tracking System) expert and Career Architect.
      Analyze the provided resume text and return a high-fidelity, professional analysis in strict JSON format.
      ${options?.targetRole ? `The candidate is specifically targeting a ${options.targetRole} role.` : ''}
      
      Resume content:
      """
      ${resumeText}
      """
      
      Required JSON Structure:
      {
        "name": "Full name of the candidate",
        "atsScore": 0-100,
        "strengthAnalysis": {
          "keywordDensity": 0-100,
          "formatCompliance": 0-100,
          "roleRelevance": 0-100
        },
        "skills": ["List of top 8 relevant professional skills identified"],
        "optimization": {
          "before": "A generic/weak line from the actual resume",
          "after": "The same line reimagined with powerful action verbs, metrics, and industry keywords"
        },
        "jobMatches": [
          { "company": "Company Name", "role": "Specific Job Title", "location": "City, State or Remote", "match": 80-99 }
        ],
        "skillGaps": ["3 specific high-level skills missing for the next career step"],
        "roadmap": [
          { 
            "title": "Specific Certification or Course", 
            "description": "Short explanation of why it helps", 
            "duration": "e.g. 4 weeks",
            "milestones": [
              { "title": "Step 1 name", "description": "What to do in this step" },
              { "title": "Step 2 name", "description": "What to do in this step" },
              { "title": "Step 3 name", "description": "What to do in this step" }
            ]
          }
        ],
        "summary": "A 2-sentence executive summary of the candidate's core strengths."
      }
      
      Rules:
      1. Return ONLY the JSON object.
      2. Ensure realistic data based ON THE TEXT provided.
      3. For jobMatches, suggest roles like Senior Software Engineer, AI Product Manager, or Data Architect depending on their profile.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    
    // Attempt to extract JSON from the text in case Gemini wraps it in markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const finalJson = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(finalJson);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);

    const rawMessage = error instanceof Error ? error.message : String(error);
    if (/missing.*api key|api key.*missing/i.test(rawMessage)) {
      throw new Error("Gemini API key is missing or not configured. Please add a valid key in Settings or .env.local.");
    }
    if (/unauthorized|permission.*denied|invalid.*api key|401/i.test(rawMessage)) {
      throw new Error("Gemini API key is invalid or not authorized. Update your key in Settings or .env.local.");
    }
    if (/not found|404|models\//i.test(rawMessage)) {
      throw new Error("Gemini model is unavailable or not supported. Please check your API configuration.");
    }

    throw new Error("Gemini API request failed. Please check your API key and network connection.");
  }
}

function getMockData(): AnalysisResult {
  return {
    name: "Alex Pierce",
    atsScore: 78,
    strengthAnalysis: {
      keywordDensity: 92,
      formatCompliance: 65,
      roleRelevance: 84
    },
    skills: ["Product Management", "Python", "Agile/Scrum", "Data Visualization", "React.js", "SQL Architecture", "Cloud Ops", "Leadership"],
    optimization: {
      before: "Managed a team of 5 developers and finished projects on time while staying under budget.",
      after: "Orchestrated a cross-functional team of 5 to deliver 3 high-impact software releases 15% under budget, improving deployment velocity by 22%."
    },
    jobMatches: [
      { company: "Google", role: "Senior Software Engineer", location: "Seattle, WA", match: 94 },
      { company: "Stripe", role: "AI Product Lead", location: "Remote", match: 88 }
    ],
    skillGaps: ["Kubernetes Orchestration", "System Design Patterns"],
    roadmap: [
      { 
        title: "AWS Solutions Architect Certification", 
        description: "Estimated 4 weeks. Will boost match rate for 40% of saved jobs.", 
        duration: "4 weeks",
        milestones: [
          { title: "Cloud Practitioner Foundations", description: "Master AWS global infrastructure and core services." },
          { title: "Hands-on S3 & EC2 Lab", description: "Deploy high-availability storage and compute clusters." },
          { title: "Security & Networking Deep Dive", description: "Configure VPCs, IAM roles, and encryption protocols." },
          { title: "Final Exam Simulation", description: "Complete two full-length practice tests with 85%+ score." }
        ]
      },
      { 
        title: "PyTorch Deep Learning Specialization", 
        description: "Recommended for transitioning into AI Engineering roles.", 
        duration: "8 weeks",
        milestones: [
          { title: "Tensor Operations & Autograd", description: "Understand the core of PyTorch computation graphs." },
          { title: "Computer Vision with CNNs", description: "Build and train image classification models." },
          { title: "NLP with Transformers", description: "Leverage pre-trained LLMs for sentiment analysis." }
        ]
      },
      { 
        title: "Executive Leadership Workshop", 
        description: "Long-term goal for CTO/VP track positioning.", 
        duration: "2 weeks",
        milestones: [
          { title: "Strategic Vision Crafting", description: "Learn to align technical roadmaps with business goals." },
          { title: "Conflict Resolution & Stakeholders", description: "Manage high-stakes cross-functional communication." }
        ]
      }
    ],
    summary: "Strategic leader with significant expertise in product management and cross-functional team leadership. Proven track record of delivering results under budget."
  };
}
