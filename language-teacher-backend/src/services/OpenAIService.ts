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
    languages: string[], // The desired languages (e.g., "pt-BR", "es-ES")
    difficulty: string,     // e.g., "beginner", "intermediate", "expert"
    quantity: number = 3
): Promise<GeneratedExercise[]> {
    if (!languages || languages.length < 2) {
        throw new Error("At least one two languages must be specified.");
    }

    // Fully parameterized English prompt supporting any combination of source/target languages
    const prompt = `
    You are an expert polyglot language teacher.
    Generate a list of ${quantity} exercises at a "${difficulty}" level, translating each the following languages: ${languages.join(",")}.
    The final list length, or total will be ${quantity} exercises * ${languages.length} languages = ${quantity * languages.length}.
    
    The exercises must be fill-in-the-blank style. For each language:
    - In the 'identifier' property, create an identifier for this exercise, which will be repeated for all languages.
    - In the 'language' property, write the current language.
    - In the 'sentence' property, write the sentence and use three underscores (___) to indicate where the student needs to fill in the blank.
    - In the 'solution' property, provide the exact word or phrase that correctly fills the blank.
    - In the 'hint' property, provide a short contextual tip, grammatical explanation, or supporting translation written to assist the student.
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
                                    language: { type: "string", description: "The language being used, e.g. pt-BR" },
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