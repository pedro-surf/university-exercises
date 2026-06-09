import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { FillTheBlank } from "./FillTheBlank";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context";
import mockExercises from "../../assets/shared/exercises/index.json";
import type { Exercise } from "../../constants/exercises";
import { goBackMap, nextMap } from "../../constants/app";

type ExerciseResult = {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  durationSec: number;
};

export default function ExercisePage() {
  const { targetLanguage, userLanguage } = useAppContext();

  const [exercises, setExercises] = useState<{
    [key: string]: Exercise[];
  }>({});
  const [answers, setAnswers] = useState<
    Record<number, string>
  >({});
  const [
    currentExerciseIdentifier,
    setCurrentExerciseIdentifier,
  ] = useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [useMockData] =
    useState(true);

  const navigate = useNavigate();

  const groupAndFilterExercises = (
    data: Exercise[]
  ): {
    [key: string]: Exercise[];
  } => {
    const grouped: {
      [key: string]: Exercise[];
    } = data.reduce((acc, exercise) => {
      if (!acc[exercise.identifier]) {
        acc[exercise.identifier] = [];
      }

      acc[exercise.identifier].push(
        exercise
      );

      return acc;
    }, {} as { [key: string]: Exercise[] });

    return Object.fromEntries(
      Object.entries(grouped).filter(
        ([, group]) =>
          group.some(
            (exercise) =>
              exercise.language ===
              targetLanguage
          ) &&
          group.some(
            (exercise) =>
              exercise.language ===
              userLanguage
          )
      )
    );
  };

  useEffect(() => {
    if (useMockData) {
      const groupedExercises =
        groupAndFilterExercises(
          mockExercises as Exercise[]
        );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExercises(groupedExercises);

      setCurrentExerciseIdentifier(
        Object.keys(
          groupedExercises
        )[0] || null
      );

      setLoading(false);

      return;
    }

    axios
      .get("/exercises")
      .then((response) => {
        const groupedExercises =
          groupAndFilterExercises(
            response.data
          );

        setExercises(
          groupedExercises
        );

        setCurrentExerciseIdentifier(
          Object.keys(
            groupedExercises
          )[0] || null
        );
      })
      .catch((error) => {
        console.error(
          "Error fetching exercises:",
          error
        );
      })
      .finally(() =>
        setLoading(false)
      );
  }, [
    useMockData,
    targetLanguage,
    userLanguage,
  ]);

  const handleSubmit = async ({
    answer,
    correct,
  }: {
    answer: string[];
    correct: boolean;
  }) => {
    if (
      !currentExerciseIdentifier
    ) {
      return;
    }

    const currentExerciseGroup =
      exercises[
      currentExerciseIdentifier
      ];

    const target =
      currentExerciseGroup.find(
        (exercise) =>
          exercise.language ===
          targetLanguage
      );

    if (!target) {
      return;
    }

    const result: ExerciseResult =
    {
      exerciseId: target.id,
      userAnswer:
        answer.join(";"),
      isCorrect: correct,
      durationSec: 0,
    };

    try {
      await axios.post(
        "/exercise_results",
        result
      );

      handleNext();
    } catch (error) {
      console.error(
        "Error submitting result:",
        error
      );
    }
  };

  const handleNext = () => {
    if (!currentExerciseIdentifier) {
      return;
    }

    const identifiers =
      Object.keys(exercises);

    const currentIndex =
      identifiers.indexOf(
        currentExerciseIdentifier
      );

    if (
      currentIndex <
      identifiers.length - 1
    ) {
      setAnswers({});

      setCurrentExerciseIdentifier(
        identifiers[currentIndex + 1]
      );
    }
  };

  const renderExercise = () => {
    if (loading) {
      return (
        <div>Loading...</div>
      );
    }

    if (
      !currentExerciseIdentifier ||
      Object.keys(exercises)
        .length === 0
    ) {
      return (
        <div>
          No exercises available.
        </div>
      );
    }

    const currentExerciseGroup =
      exercises[
      currentExerciseIdentifier
      ];

    const origin =
      currentExerciseGroup.find(
        (exercise) =>
          exercise.language ===
          userLanguage
      );

    const target =
      currentExerciseGroup.find(
        (exercise) =>
          exercise.language ===
          targetLanguage
      );

    if (!origin || !target) {
      return (
        <div>
          Invalid exercise pair.
        </div>
      );
    }

    const exercisePair =
    {
      origin,
      target,
    };

    const identifiers =
      Object.keys(exercises);

    const currentIndex =
      identifiers.indexOf(
        currentExerciseIdentifier
      );

    const hasNext =
      currentIndex <
      identifiers.length - 1;

    return (
      <>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {identifiers.map(
            (identifier, index) => (
              <button
                key={identifier}
                onClick={() => {
                  setAnswers({});

                  setCurrentExerciseIdentifier(
                    identifier
                  );
                }}
                className={`w-10 h-10 rounded-full font-bold transition ${identifier ===
                  currentExerciseIdentifier
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
        <FillTheBlank
          exercise={{
            ...exercisePair,
            identifier:
              currentExerciseIdentifier,
          }}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={handleSubmit}
        />
        {hasNext && (
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNext}
          >
            {nextMap[userLanguage]}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-6">
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() =>
          navigate("/")
        }
      >
        {goBackMap[userLanguage]}
      </button>

      <div className="w-full max-w-6xl">
        {renderExercise()}
      </div>
    </div>
  );
}