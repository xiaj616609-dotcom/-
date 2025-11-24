import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, AssessmentResult, ScaleType } from "../types";

// IMPORTANT: In a real production app, this call should be proxied through a backend 
// to protect the API Key. For this demo, we use process.env.API_KEY directly.

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeAssessment = async (
  results: AssessmentResult[],
  nickname: string
): Promise<AIAnalysis | null> => {
  const ai = getClient();
  if (!ai) {
    console.warn("Gemini API Key not found.");
    return null;
  }

  // Construct a privacy-preserving prompt. We send scores, not PII.
  const scoresSummary = results.map(r => `${r.scaleId}: Score ${r.score}/${r.maxScore} (${r.severity})`).join(", ");

  const prompt = `
    你是一位富有同理心、专业的大学心理健康助手。
    一位名叫 "${nickname}" 的同学完成了心理筛查，结果如下：
    ${scoresSummary}

    请提供一段支持性、非临床的中文总结建议。
    
    限制条件:
    1. **绝对不要**给出医疗诊断。使用“你的回答显示...”、“分数表明...”等措辞。
    2. 语气要亲切、平和、富有同理心（中文）。
    3. 如果分数较高（中重度/重度），必须强烈建议去学校心理咨询中心寻求专业帮助。
    4. 根据其具体分数情况，提供 3 个具体、可执行的自我关怀小建议（例如针对抑郁的睡眠卫生，针对焦虑的呼吸法等）。
    
    请仅返回符合以下 Schema 的 JSON 数据。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "一段 2-3 句的富有同理心的中文总结。" },
                copingStrategies: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "3条具体的、可执行的中文应对策略列表。"
                },
                isCrisis: { type: Type.BOOLEAN, description: "如果分数显示严重困扰需要立即关注，则为 true。" }
            },
            required: ["summary", "copingStrategies", "isCrisis"]
        }
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIAnalysis;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};