import { useState } from "react";

type FillInTheBlankProps = {
  sentence: string;
  questionIndexes: number[];
  questionOptions?: { [index: number]: string[] };
  placeholder?: string;
};

export function FillTheBlank({
  sentence,
  questionIndexes,
  questionOptions,
  placeholder = "Type your answer...",
}: FillInTheBlankProps) {
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [checked, setChecked] = useState(false);

  const words = sentence.split(" ");
  const correctAnswers = questionIndexes.reduce((acc, index) => {
    acc[index] = words[index];
    return acc;
  }, {} as { [index: number]: string });

  const handleDrop = (index: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [index]: option }));
    setChecked(false);
  };

  const handleInputChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
    setChecked(false);
  };

  const isCorrect = questionIndexes.every(
    (index) =>
      answers[index]?.trim().toLowerCase() ===
      correctAnswers[index]?.trim().toLowerCase()
  );

  const handleCheck = () => {
    setChecked(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold">Fill in the Blank</h1>
          <p className="text-gray-600 text-lg">Complete the sentence.</p>
        </div>

        <div className="bg-gray-50 border rounded-3xl p-8 text-3xl leading-relaxed text-center font-medium">
          {words.map((word, index) => {
            if (questionIndexes.includes(index)) {
              return questionOptions ? (
                <span
                  key={index}
                  className="inline-block border-b-2 border-dashed border-gray-400 mx-1 px-2"
                >
                  {answers[index] || "____"}{" "}
                </span>
              ) : (
                <input
                  key={index}
                  type="text"
                  value={answers[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={placeholder}
                  className="inline-block border-b-2 border-dashed border-gray-400 mx-1 px-2 text-center"
                />
              );
            }
            return <span key={index}>{word} </span>;
          })}
        </div>

        {questionOptions && (
          <div className="space-y-4">
            {Object.entries(questionOptions).map(([index, options]) => (
              <div key={index} className="space-y-2">
                <p className="font-medium">Options for blank {+index + 1}:</p>
                <div className="flex gap-2">
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleDrop(Number(index), option)}
                      className="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 text-center"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCheck}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl py-4 text-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
            Check Answer
          </button>
        </div>

        {checked && (
          <div
            className={`rounded-3xl p-8 text-center border-2 transition-all animate-in fade-in duration-300 ${
              isCorrect
                ? "bg-green-100 border-green-500"
                : "bg-red-100 border-red-500"
            }`}
          >
            <div className="text-5xl font-black mb-3">
              {isCorrect ? "CORRECT" : "WRONG"}
            </div>

            {!isCorrect && (
              <div className="text-xl text-red-700 font-medium">
                Correct answers:{" "}
                {questionIndexes.map((index) => correctAnswers[index]).join(", ")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}