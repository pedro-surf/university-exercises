import { useState } from "react";

type TextCorrectionHighlighterProps = {
    expectedText?: string;
    placeholder?: string;
};

export function TextCorrectionHighlighter({
    expectedText = "I went to the beach yesterday and the waves were amazing.",
    placeholder = "Type the sentence here...",
}: TextCorrectionHighlighterProps) {
    const [userInput, setUserInput] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const tokenize = (text: string) =>
        text
            .replace(/([.,!?])/g, " $$1 ")
            .split(/\s+/)
            .filter(Boolean);

    const expectedWords = tokenize(expectedText);
    const userWords = tokenize(userInput);

    const handleCheck = () => {
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Text Correction Highlighter
                    </h1>

                    <p className="text-gray-600 mt-3 text-lg">
                        Type the expected sentence and receive instant correction feedback.
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="font-semibold text-gray-800 text-lg">
                        Expected sentence
                    </h2>

                    <div className="border rounded-2xl p-5 bg-green-50 text-2xl leading-10 font-medium">
                        {expectedText}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800 text-lg">
                            Your answer
                        </h2>

                        <button
                            onClick={handleCheck}
                            className="bg-black text-white px-5 py-3 rounded-2xl font-medium hover:opacity-90 transition-opacity"
                        >
                            Check Answer
                        </button>
                    </div>

                    <textarea
                        value={userInput}
                        onChange={(e) => {
                            setUserInput(e.target.value);
                            setSubmitted(false);
                        }}
                        placeholder={placeholder}
                        className="w-full min-h-[140px] rounded-2xl border-2 border-gray-200 focus:border-black outline-none p-5 text-xl resize-none transition-colors"
                    />
                </div>

                {submitted && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <h2 className="font-semibold text-gray-800 text-lg">
                            Correction Result
                        </h2>

                        <div className="border rounded-3xl p-6 bg-gray-50 flex flex-wrap gap-3 text-2xl leading-[4rem]">
                            {userWords.map((word, index) => {
                                const expected = expectedWords[index];

                                const normalizedWord = word.toLowerCase();
                                const normalizedExpected = expected?.toLowerCase();

                                const isCorrect = normalizedWord === normalizedExpected;

                                return (
                                    <div
                                        key={index}
                                        className={`relative rounded-2xl px-4 py-3 border-2 transition-all ${isCorrect
                                                ? "bg-green-100 border-green-400 text-green-900"
                                                : "bg-red-100 border-red-500 text-red-900"
                                            }`}
                                    >
                                        <div className="font-semibold">{word}</div>

                                        {!isCorrect && expected && (
                                            <div className="mt-2 text-sm font-semibold text-red-600 whitespace-nowrap">
                                                Expected: {expected}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border p-5 bg-red-50">
                        <h3 className="font-bold text-lg">Grammar Errors</h3>
                        <p className="text-sm text-gray-700 mt-2">
                            Detect wrong verb conjugations and sentence structure.
                        </p>
                    </div>

                    <div className="rounded-2xl border p-5 bg-yellow-50">
                        <h3 className="font-bold text-lg">Missing Words</h3>
                        <p className="text-sm text-gray-700 mt-2">
                            Show missing articles, connectors, and skipped words.
                        </p>
                    </div>

                    <div className="rounded-2xl border p-5 bg-blue-50">
                        <h3 className="font-bold text-lg">Interactive Feedback</h3>
                        <p className="text-sm text-gray-700 mt-2">
                            Perfect for typing exercises, dictation, and AI tutoring.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}