import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedExercise {
    identifier: string;
    language: string;
    sentence: string;
    solution: string;
    hint: string;
    topic: string;
    difficulty: string;
}

export async function generateExercisesFromAI(
    languages: string[], // The desired languages (e.g., "pt-BR", "es-ES")
    difficulty: string,  // e.g., "beginner", "intermediate", "expert"
    quantity: number = 3
): Promise<GeneratedExercise[]> {
    if (!languages || languages.length < 2) {
        throw new Error("At least two languages must be specified.");
    }

    const isValidLanguageCode = (lang: string) => /^[a-z]{2}-[A-Z]{2}$/.test(lang);

    if (!languages.every(isValidLanguageCode)) {
        throw new Error("All languages must be in the format 'xx-XX' (e.g., 'pt-BR').");
    }

    const prompt = `
    You are an expert polyglot language teacher.
    Generate ${quantity} exercises for each of the following languages: ${languages.join(",")}.
    The exercises must be fill-in-the-blank style. For each language:
    - In the 'identifier' property, create a unique identifier for the exercise. This identifier must be the same for all languages for a given exercise.
    - In the 'language' property, write the current language.
    - In the 'sentence' property, either write a single word to be translated, or a sentence with one or more words replaced in underscores (____) to indicate fill in the blank.
    - In the 'solution' property, write "null" if 'sentence' is a single word to be translated, or the word(s) replaced in underscores in 'sentence', separated by commas.
    - In the 'hint' property, provide a hint, short contextual tip, grammatical explanation to assist the student.
    - In the 'topic' property, pick a topic. FOOD,TRAVEL,FAMILY,SURFING,WEATHER,BUSINESS.
    `;

    const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
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
                                    hint: { type: "string", description: "Instructional tip or translation in the student's native language" },
                                    topic: { type: "string", description: "The exercise topic" }
                                },
                                required: ["identifier", "language", "sentence", "solution", "hint", "topic"],
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