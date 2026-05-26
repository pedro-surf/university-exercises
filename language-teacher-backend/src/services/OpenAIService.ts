import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedExercise {
    identifier: string;
    sentence: string;
    solution: string;
    hint: string;
}

export async function generateExercisesFromAI(
    nativeLanguage: string, // The student's language (e.g., "pt-BR", "es-ES")
    targetLanguage: string, // The language being learned (e.g., "en-US", "fr-FR")
    category: string,       // e.g., "grammar", "vocabulary"
    difficulty: string,     // e.g., "beginner", "intermediate"
    quantity: number = 3
): Promise<GeneratedExercise[]> {

    // Fully parameterized English prompt supporting any combination of source/target languages
    const prompt = `
    You are an expert language teacher specializing in instruction for the "${targetLanguage}" language.
    Generate a list of ${quantity} exercises at a "${difficulty}" level for the category "${category}".
    
    The exercises must be fill-in-the-blank style.
    - In the 'sentence' property, write the sentence in "${targetLanguage}" and use three underscores (___) to indicate where the student needs to fill in the blank.
    - In the 'solution' property, provide the exact word or phrase that correctly fills the blank.
    - In the 'hint' property, provide a short contextual tip, grammatical explanation, or supporting translation written entirely in "${nativeLanguage}" to assist the student.
  `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a strict educational data generator that only responds in valid JSON matching the provided schema.' },
            { role: 'user', content: prompt }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "exercise_generation_schema",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        exercises: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    identifier: { type: "string", description: "A short, unique identifier, e.g., EX-001" },
                                    sentence: { type: "string", description: "The sentence with the blank placeholder (___)" },
                                    solution: { type: "string", description: "The correct answer to fill the blank" },
                                    hint: { type: "string", description: "Instructional tip or translation in the student's native language" }
                                },
                                required: ["identifier", "sentence", "solution", "hint"],
                                additionalProperties: false
                            }
                        }
                    },
                    required: ["exercises"],
                    additionalProperties: false
                }
            }
        }
    });

    const jsonString = response.choices[0].message.content;
    if (!jsonString) throw new Error("OpenAI failed to return any content.");

    const parsedData = JSON.parse(jsonString);
    return parsedData.exercises;
}