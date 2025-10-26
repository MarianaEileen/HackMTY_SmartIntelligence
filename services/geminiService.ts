
import { GoogleGenAI, Type } from "@google/genai";
import type { FlightData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateConsumptionForecast = async (flightData: FlightData) => {
  const prompt = `
    Actúa como un sistema experto en logística de catering aéreo para Gate Group.
    Basado en los siguientes datos de vuelo, genera un pronóstico de consumo de productos en formato JSON.
    Datos del vuelo:
    - Tipo de vuelo: ${flightData.type}
    - Origen: ${flightData.origin}
    - Destino: ${flightData.destination}
    - Aeronave: ${flightData.aircraft}
    - Temporada: ${flightData.season}
    - Duración (horas): ${flightData.duration}
    - Pasajeros: ${flightData.passengers}

    Considera factores como la hora del día implícita en la duración, las preferencias culturales asociadas a la ruta y la temporada.
    El JSON debe ser un array de objetos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING, description: "Nombre del producto" },
              predictedConsumption: { type: Type.NUMBER, description: "Cantidad pronosticada de consumo" },
              unit: { type: Type.STRING, description: "Unidad de medida (ej. unidades, litros)" },
            },
            required: ["productName", "predictedConsumption", "unit"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating consumption forecast:", error);
    throw new Error("No se pudo generar el pronóstico. Inténtelo de nuevo.");
  }
};

export const generateProductivityEstimate = async (products: string) => {
    const prompt = `
    Actúa como un sistema de estimación de productividad basado en una arquitectura híbrida de Gradient Boosting (LightGBM).
    Analiza la siguiente lista de productos para armar en un trolley de catering y estima el tiempo de ensamblaje en minutos.
    
    Productos a empacar:
    ${products}

    Considera la complejidad de manejo, el tamaño y el tipo de cada item.
    Proporciona la respuesta en formato JSON. Incluye el tiempo estimado, un puntaje de confianza (0 a 1), y los factores clave que influyeron en la estimación.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        estimatedTimeMinutes: { type: Type.NUMBER, description: "Tiempo estimado en minutos para el ensamblaje." },
                        confidenceScore: { type: Type.NUMBER, description: "Puntaje de confianza de la estimación (0.0 a 1.0)." },
                        factors: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Factores clave que influyeron en la estimación."
                        },
                    },
                    required: ["estimatedTimeMinutes", "confidenceScore", "factors"],
                },
            },
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating productivity estimate:", error);
        throw new Error("No se pudo generar la estimación. Inténtelo de nuevo.");
    }
};
