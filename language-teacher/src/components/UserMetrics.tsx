import { useNavigate } from "react-router-dom";
import { groupByLanguage } from "../utils/groupByLanguage";

const exerciseResults = [
  {
    id: "1",
    userId: "user1",
    exerciseId: "exercise1",
    userAnswer: "answer1",
    isCorrect: true,
    score: 10,
    duration: 30,
    createdAt: new Date(),
    exercise: { id: "exercise1", language: "en-US" },
  },
  {
    id: "2",
    userId: "user1",
    exerciseId: "exercise2",
    userAnswer: "answer2",
    isCorrect: false,
    score: 5,
    duration: 45,
    createdAt: new Date(),
    exercise: { id: "exercise2", language: "en-ES" },
  },
  {
    id: "3",
    userId: "user1",
    exerciseId: "exercise3",
    userAnswer: "answer3",
    isCorrect: true,
    score: 8,
    duration: 25,
    createdAt: new Date(),
    exercise: { id: "exercise3", language: "en-US" },
  },
];

// Calculate metrics from the mock data
const groupedResults = groupByLanguage(exerciseResults);

const calculateMetrics = (groupedResults: Record<string, typeof exerciseResults>) => {
  return Object.entries(groupedResults).map(([language, results]) => {
    const exercisesCompleted = results.length;
    const correctAnswers = results.filter((result) => result.isCorrect).length;
    const totalAnswers = results.length;

    return {
      language,
      exercisesCompleted,
      correctAnswers,
      totalAnswers,
    };
  });
};

const defaultMetrics = calculateMetrics(groupedResults);

type LanguageMetrics = {
  language: string;
  exercisesCompleted: number;
  correctAnswers: number; // Total number of correct answers
  totalAnswers: number; // Total number of answers
};

type Props = {
  metrics?: LanguageMetrics[]; // Optional, defaults to mock data
};

export default function UserMetrics({ metrics = defaultMetrics }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-6">
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate("/")}
      >
        Go back
      </button>
      <div className="w-full max-w-6xl">
        <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">User Metrics</h2>
          <div className="space-y-4">
            {metrics.map((metric, index) => {
              const correctPercentage = metric.totalAnswers
                ? ((metric.correctAnswers / metric.totalAnswers) * 100).toFixed(2)
                : "0.00";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{metric.language}</div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Exercises: {metric.exercisesCompleted}
                      </p>
                      <p className="text-sm text-gray-500">
                        Correct: {metric.correctAnswers}/{metric.totalAnswers}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {correctPercentage}%
                    </p>
                    <p className="text-sm text-gray-500">Correct Answers</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}