import { GoogleGenAI, Type } from "@google/genai";
import { ProjectPlan, TaskStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectPlan = async (topic: string): Promise<ProjectPlan> => {
  const prompt = `
    Actúa como un Gerente de Proyectos Senior de TI.
    Genera un plan de proyecto detallado para: "${topic}".
    
    El plan debe incluir:
    1. Un título profesional.
    2. Una descripción breve.
    3. Una justificación sólida de por qué este proyecto es necesario y su viabilidad.
    4. 3 objetivos clave.
    5. Una lista de tareas detallada para un diagrama de Gantt. Las tareas deben estar agrupadas en fases lógicas (ej. Análisis, Diseño, Desarrollo, Pruebas, Despliegue).
       - Asegura que 'startDay' sea secuencial y lógico (dependencias implícitas).
       - 'duration' en días.
    6. Un equipo sugerido de 3-4 roles.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          justification: { type: Type.STRING },
          objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          startDate: { type: Type.STRING, description: "Use format YYYY-MM-DD, assume project starts next Monday" },
          team: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING }
              }
            }
          },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                phase: { type: Type.STRING },
                startDay: { type: Type.INTEGER },
                duration: { type: Type.INTEGER },
                assignedTo: { type: Type.STRING },
                status: { type: Type.STRING, enum: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] }
              },
              required: ["id", "name", "phase", "startDay", "duration", "assignedTo", "status"]
            }
          }
        },
        required: ["title", "description", "justification", "objectives", "startDate", "tasks", "team"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as ProjectPlan;
};
