import { useEffect, useMemo, useState } from "react";
import { speakWord } from "../../utils/speakWord";
import { useAppContext } from "../../Context";
import { checkAnswerMap, correctAnswerMap, hintMap, type Exercise } from "../../constants/exercises";
import { TextCorrectionHighlighter } from "../TextCorrectionHighlighter";
import { correctMap, incorrectMap, translateMap } from "../../constants/app";


export type ExercisePair = {
  origin: Exercise;
  target: Exercise;
  identifier: string;
};

type FillTheBlankProps = {
  exercise: ExercisePair;

  answers: Record<number, string>;

  setAnswers: React.Dispatch<
    React.SetStateAction<
      Record<number, string>
    >
  >;

  onSubmit?: (payload: {
    answer: string[];
    correct: boolean;
  }) => Promise<void> | void;
  loading?: boolean;
};

export function FillTheBlank({
  exercise,
  onSubmit,
  loading = false,
  answers,
  setAnswers,
}: FillTheBlankProps) {
  const { origin, target } = exercise;
  const { targetLanguage, userLanguage } = useAppContext();
  const [checked, setChecked] =
    useState<boolean | null>(
      null
    );
  const blankCount = useMemo(
    () =>
      (
        target.sentence.match(/____/g) || []
      ).length,
    [target.sentence]
  );

  const isTranslationExercise =
    blankCount === 0 &&
    target.solution === null;

  const correctAnswers = useMemo(() => {
    if (isTranslationExercise) {
      return [origin.sentence.trim()];
    }

    return (
      target.solution
        ?.split(";")
        .map((answer) => answer.trim()) || []
    );
  }, [
    isTranslationExercise,
    origin.sentence,
    target.solution,
  ]);

  const isCorrect = correctAnswers.every(
    (correctAnswer, index) =>
      (answers[index] || "")
        .trim()
        .toLowerCase() ===
      correctAnswer.trim().toLowerCase()
  );

  const handleChange = (
    index: number,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));

    setChecked(null);
  };

  useEffect(() => {
    setChecked(null);
  }, [exercise]);

  const handleOptionClick = (
    option: string
  ) => {
    const alreadyUsed =
      Object.values(answers).includes(
        option
      );

    if (alreadyUsed) {
      return;
    }

    const nextEmptyIndex =
      correctAnswers.findIndex(
        (_, index) =>
          !(answers[index] || "").trim()
      );

    if (nextEmptyIndex === -1) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [nextEmptyIndex]: option,
    }));

    setChecked(null);
  };

  const handleSubmit = async () => {
    setChecked(isCorrect);

    try {
      await onSubmit?.({
        answer: correctAnswers.map(
          (_, index) => answers[index] || ""
        ),
        correct: isCorrect,
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };




  const renderTranslationExercise = () => (
    <div className="space-y-8 text-center">
      <div className="text-sm uppercase tracking-widest text-gray-500">
        {translateMap[userLanguage] || "Translate"}
      </div>

      <div onClick={() => speakWord(target.sentence, targetLanguage)} className="cursor-pointer text-6xl font-black">
        {target.sentence}
      </div>

      <input
        type="text"
        value={answers[0] || ""}
        onChange={(e) =>
          handleChange(0, e.target.value)
        }
        className="w-full max-w-lg mx-auto block border-b-2 border-dashed border-gray-400 text-center text-2xl px-4 py-3 outline-none"
      />
    </div>
  );

  const renderFillBlanks = () => {
    const parts =
      target.sentence.split("____");

    return (
      <div className="text-3xl leading-relaxed text-center">
        {parts.map((part, index) => (
          <span key={index}>
            {part}

            {index < blankCount && (
              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) =>
                  handleChange(
                    index,
                    e.target.value
                  )
                }
                className="inline-block w-36 border-b-2 border-dashed border-gray-400 mx-2 px-2 text-center outline-none"
              />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          {/* <div className="text-xs uppercase tracking-widest text-gray-500">
            {target.category}
          </div> */}

          <div className="text-lg font-semibold">
            {target.topic} -  {target.difficulty}
          </div>
        </div>

        {isTranslationExercise
          ? renderTranslationExercise()
          : renderFillBlanks()}

        {target.options &&
          target.options.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {target.options.map(
                (option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      handleOptionClick(
                        option
                      )
                    }
                    title={
                      origin.options?.[
                      index
                      ] || ""
                    }
                    className="px-4 py-3 rounded-xl border bg-white hover:bg-gray-50 transition"
                  >
                    <div className="font-medium">
                      {option}
                    </div>

                    {origin.options?.[
                      index
                    ] && (
                        <div className="text-xs text-gray-500">
                          {
                            origin.options[
                            index
                            ]
                          }
                        </div>
                      )}
                  </button>
                )
              )}
            </div>
          )}

        {target.hint && (
          <div title={
            origin.hint ||
            "No hint available"
          }
            className="cursor-pointer bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="font-semibold mb-1">
              {hintMap[userLanguage] || "Hint"}
            </div>

            <div onClick={() => speakWord(target.hint, targetLanguage)}>{target.hint}</div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xl hover:bg-indigo-700 transition"
        >
          {checkAnswerMap[userLanguage] || "Check Answer"}
        </button>

        {loading ?
          <div
            className="bg-yellow-100 border-green-500"
          >
            <div className="text-4xl font-black mb-3">
              LOADING...
            </div>
          </div>
          : checked !== null && (
            <div
              className={`rounded-2xl p-6 text-center border-2 ${isCorrect
                ? "bg-green-100 border-green-500"
                : "bg-red-100 border-red-500"
                }`}
            >
              <div className="text-4xl font-black mb-3">
                {isCorrect
                  ? correctMap[userLanguage] || "CORRECT"
                  : incorrectMap[userLanguage] || "INCORRECT"}
              </div>

              {!isCorrect && (
                <div className="space-y-2">
                  <div className="font-medium">
                    {correctAnswerMap[userLanguage] || "Correct Answer"}
                  </div>

                  <div className="text-xl">
                    {correctAnswers.join(
                      ", "
                    )}
                  </div>

                  {isTranslationExercise ? (
                    <div className="text-gray-600">
                      {target.sentence} →{" "}
                      {origin.sentence}
                    </div>
                  ) : <TextCorrectionHighlighter
                    expectedText={target.sentence}
                    userText={Object.values(answers).join(" ")}
                  />}
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}