import { useAppContext } from "../Context";
import ConfigDisplay from "./ConfigDisplay";
import { useNavigate } from "react-router-dom";


type StudyMode =
    | "grammar"
    | "vocabulary"
    | "exercises";

const OPTIONS = [
    {
        id: "grammar",
        title: "Grammar",
        emoji: "📚",

        description:
            "Learn sentence structure, verb conjugation, pronouns, and the foundations of the language.",

        examples: [
            "Verb tenses",
            "Pronouns",
            "Sentence structure",
        ],
    },

    {
        id: "vocabulary",
        title: "Vocabulary",
        emoji: "🧠",

        description:
            "Expand your vocabulary with useful words and real-world categories.",

        examples: [
            "Travel",
            "Food",
            "Daily conversation",
        ],
    },

    {
        id: "exercises",
        title: "Exercises",
        emoji: "✍️",

        description:
            "Practice actively with fill-in-the-blank, listening, pronunciation, and matching exercises.",

        examples: [
            "Listening",
            "Pronunciation",
            "Typing challenges",
        ],
    },
] as const;



export default function Menu() {
    const { userName } = useAppContext();
    const navigate = useNavigate();

    const handleSelect = (
        mode: string
    ) => {
        navigate(`/${mode}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                <ConfigDisplay />
                <div className="mb-14 text-center space-y-4">
                    <div className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold">
                        Welcome
                    </div>

                    <h1 className="text-6xl font-black tracking-tight leading-tight">
                        What would you like
                        <br />
                        to study today,
                        <br />
                        {userName}?
                    </h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() =>
                                handleSelect?.(
                                    option.id as StudyMode
                                )
                            }
                            className="group rounded-[36px] bg-white border border-gray-100 shadow-xl p-8 text-left hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="text-5xl mb-6">
                                {option.emoji}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-black">
                                    {option.title}
                                </h2>

                                <p className="text-gray-600 leading-relaxed">
                                    {option.description}
                                </p>

                                <div className="pt-3 flex flex-wrap gap-2">
                                    {option.examples.map(
                                        (example) => (
                                            <div
                                                key={example}
                                                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                                            >
                                                {example}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 flex items-center text-black font-semibold text-lg">
                                Start learning

                                <span className="ml-2 transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
