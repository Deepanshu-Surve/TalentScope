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
 * ✅ FIXED: Proper Vite environment variable usage
 */
function getGeminiClient(apiKey?: string): GoogleGenAI {
  const finalKey =
    apiKey ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined'
      ? process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
      : undefined);

  if (!finalKey) {
    throw new Error(
      "Gemini API key is missing. Add VITE_GEMINI_API_KEY or GEMINI_API_KEY in your environment."
    );
  }

  return new GoogleGenAI({ apiKey: finalKey });
}

function isModelUnavailableError(message: string): boolean {
  return /not found|404|model.*not.*found|model.*not.*available|unsupported.*model|unavailable|not supported/i.test(
    message
  );
}

async function generateContentWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  modelCandidates: string[]
) {
  let lastError: Error | null = null;

  for (const model of modelCandidates) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (isModelUnavailableError(msg)) {
        console.warn(`Gemini model unavailable: ${model}. Trying next fallback model.`);
        lastError = error instanceof Error ? error : new Error(msg);
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    lastError?.message ||
      "No Gemini model is available for this API key. Try a different key or use a supported Gemini account."
  );
}

export async function analyzeResume(
  resumeText: string,
  options?: {
    apiKey?: string;
    targetRole?: string;
    analysisMode?: "basic" | "advanced";
  }
): Promise<AnalysisResult> {
  if (!resumeText || resumeText.length < 50) {
    return getMockData();
  }

  try {
    const ai = getGeminiClient(options?.apiKey);

    const modelCandidates =
      options?.analysisMode === "advanced"
        ? ["gemini-2.5-pro", "gemini-3.1-pro-preview", "gemini-2.5-flash"]
        : ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro"];

    const prompt = `
      You are a world-class ATS expert and Career Architect.
      Analyze the resume and return STRICT JSON.

      ${options?.targetRole ? `Target Role: ${options.targetRole}` : ""}

      Resume:
      """
      ${resumeText}
      """

      JSON format:
      {
        "name": "",
        "atsScore": 0,
        "strengthAnalysis": {
          "keywordDensity": 0,
          "formatCompliance": 0,
          "roleRelevance": 0
        },
        "skills": [],
        "optimization": {
          "before": "",
          "after": ""
        },
        "jobMatches": [
          { "company": "", "role": "", "location": "", "match": 0 }
        ],
        "skillGaps": [],
        "roadmap": [
          {
            "title": "",
            "description": "",
            "duration": "",
            "milestones": [
              { "title": "", "description": "" }
            ]
          }
        ],
        "summary": ""
      }

      Rules:
      - Only return JSON
      - No explanation
    `;

    const response = await generateContentWithFallback(ai, prompt, modelCandidates);

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const finalJson = jsonMatch ? jsonMatch[0] : text;

    return JSON.parse(finalJson);
  } catch (error) {
    console.error("Gemini Error:", error);

    const msg = error instanceof Error ? error.message : String(error);

    if (/missing.*api key/i.test(msg)) {
      throw new Error(
        "Gemini API key missing. Add VITE_GEMINI_API_KEY in Vercel."
      );
    }

    if (/invalid|unauthorized|401/i.test(msg)) {
      throw new Error("Invalid Gemini API key.");
    }

    if (/not found|404|model/i.test(msg)) {
      throw new Error("Gemini model not available.");
    }

    throw new Error(`Gemini request failed: ${msg}`);
  }
}

function getMockData(): AnalysisResult {
  return {
    name: "Alex Pierce",
    atsScore: 78,
    strengthAnalysis: {
      keywordDensity: 92,
      formatCompliance: 65,
      roleRelevance: 84,
    },
    skills: [
      "Product Management",
      "Python",
      "Agile",
      "React",
      "SQL",
      "Cloud",
    ],
    optimization: {
      before: "Managed team projects.",
      after:
        "Led a team delivering projects 20% faster with improved efficiency.",
    },
    jobMatches: [
      {
        company: "Google",
        role: "Software Engineer",
        location: "Remote",
        match: 92,
      },
    ],
    skillGaps: ["System Design", "Kubernetes"],
    roadmap: [
      {
        title: "AWS Certification",
        description: "Improve cloud skills",
        duration: "4 weeks",
        milestones: [
          {
            title: "Basics",
            description: "Learn core AWS services",
          },
        ],
      },
    ],
    summary: "Strong technical candidate with growth potential.",
  };
}