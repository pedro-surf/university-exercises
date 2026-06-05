import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export const mockExerciseResults = [
  {
    id: "1",
    language: "English",
    isCorrect: true,
    durationSec: 45,
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    language: "Spanish",
    isCorrect: false,
    durationSec: 30,
    createdAt: "2026-06-02T12:00:00Z",
  },
  {
    id: "3",
    language: "French",
    isCorrect: true,
    durationSec: 60,
    createdAt: "2026-06-03T14:00:00Z",
  },
  {
    id: "4",
    language: "English",
    isCorrect: false,
    durationSec: 50,
    createdAt: "2026-06-04T16:00:00Z",
  },
];

type ExerciseResult = {
  id: string;
  language: string;
  isCorrect: boolean;
  durationSec?: number;
  createdAt: string;
};

type Props = {
  results?: ExerciseResult[];
};

export default function UserMetrics({ results = mockExerciseResults }: Props) {
  const navigate = useNavigate();

  const [languageFilter, setLanguageFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState<
    "all" | "correct" | "incorrect"
  >("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredResults = useMemo(() => {
    return (results).filter((result) => {
      if (
        languageFilter !== "all" &&
        result.language !== languageFilter
      ) {
        return false;
      }

      if (
        resultFilter === "correct" &&
        !result.isCorrect
      ) {
        return false;
      }

      if (
        resultFilter === "incorrect" &&
        result.isCorrect
      ) {
        return false;
      }

      const date = new Date(result.createdAt);

      if (startDate && date < new Date(startDate)) {
        return false;
      }

      if (endDate && date > new Date(endDate + "T23:59:59")) {
        return false;
      }

      return true;
    });
  }, [
    results,
    languageFilter,
    resultFilter,
    startDate,
    endDate,
  ]);

  const totalExercises = filteredResults.length;

  const correctAnswers = filteredResults.filter(
    (r) => r.isCorrect
  ).length;

  const accuracy =
    totalExercises > 0
      ? ((correctAnswers / totalExercises) * 100).toFixed(1)
      : "0";

  const avgDuration =
    filteredResults.length > 0
      ? (
        filteredResults.reduce(
          (acc, curr) => acc + (curr.durationSec ?? 0),
          0
        ) / filteredResults.length
      ).toFixed(1)
      : "0";

  const languages = [
    ...new Set((results).map((r) => r.language)),
  ];

  const languageChartData = languages.map((language) => {
    const langResults = filteredResults.filter(
      (r) => r.language === language
    );

    const correct = langResults.filter(
      (r) => r.isCorrect
    ).length;

    return {
      language,
      accuracy:
        langResults.length > 0
          ? Math.round(
            (correct / langResults.length) * 100
          )
          : 0,
    };
  });

  const pieData = [
    {
      name: "Correct",
      value: correctAnswers,
    },
    {
      name: "Incorrect",
      value: totalExercises - correctAnswers,
    },
  ];

  const trendMap = filteredResults.reduce(
    (acc, result) => {
      const day = format(
        new Date(result.createdAt),
        "yyyy-MM-dd"
      );

      if (!acc[day]) {
        acc[day] = {
          date: day,
          total: 0,
          correct: 0,
        };
      }

      acc[day].total++;

      if (result.isCorrect) {
        acc[day].correct++;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        date: string;
        total: number;
        correct: number;
      }
    >
  );

  const trendData = Object.values(trendMap).map((day) => ({
    date: day.date,
    accuracy: Math.round(
      (day.correct / day.total) * 100
    ),
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            Learning Analytics
          </h1>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <select
            value={languageFilter}
            onChange={(e) =>
              setLanguageFilter(e.target.value)
            }
            className="rounded-lg border p-3"
          >
            <option value="all">
              All Languages
            </option>

            {languages.map((language) => (
              <option
                key={language}
                value={language}
              >
                {language}
              </option>
            ))}
          </select>

          <select
            value={resultFilter}
            onChange={(e) =>
              setResultFilter(
                e.target.value as
                | "all"
                | "correct"
                | "incorrect"
              )
            }
            className="rounded-lg border p-3"
          >
            <option value="all">
              All Results
            </option>
            <option value="correct">
              Correct
            </option>
            <option value="incorrect">
              Incorrect
            </option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            className="rounded-lg border p-3"
          />
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Exercises"
            value={totalExercises}
          />

          <MetricCard
            title="Accuracy"
            value={`${accuracy}%`}
          />

          <MetricCard
            title="Correct"
            value={correctAnswers}
          />

          <MetricCard
            title="Avg Time"
            value={`${avgDuration}s`}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">
              Accuracy Trend
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">
              Correct vs Incorrect
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  label
                >
                  <Cell />
                  <Cell />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
            <h3 className="mb-4 text-xl font-semibold">
              Accuracy by Language
            </h3>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart
                data={languageChartData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="language" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold">
        {value}
      </div>
    </div>
  );
}