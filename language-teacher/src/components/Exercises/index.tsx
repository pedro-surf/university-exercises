import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { FillTheBlank } from "../FillTheBlank";
import { useNavigate } from "react-router-dom";
import LanguagePronunciationReader from "../LanguagePronunciationReader";
import { TextCorrectionHighlighter } from "../TextCorrectionHighlighter";

type Exercise = {
  id: string;
  language: string;
  sentence: string;
  solution: string;
  category: string;
  difficulty: string;
};

type ExerciseResult = {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  durationSec: number;
};

export default function ExercisePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch exercises from the API
    axios
      .get("/exercises")
      .then((response) => {
        setExercises(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (payload: { answer: string, durationSec: number }) => {
    const { answer, durationSec } = payload;
    const currentExercise = exercises[currentExerciseIndex];
    const isCorrect = answer.trim() === currentExercise.solution.trim();

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      userAnswer: answer,
      isCorrect,
      durationSec,
    };

    try {
      // Submit the result to the API
      await axios.post("/exercise_results", result);

      // Move to the next exercise if available
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        alert("All exercises completed!");
        navigate("/"); // Navigate back to the home page
      }
    } catch (error) {
      console.error("Error submitting result:", error);
    }
  };

  const renderExercise = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (exercises.length === 0) {
      return <div>No exercises available.</div>;
    }

    const currentExercise = exercises[currentExerciseIndex];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Exercise</h1>
        <FillTheBlank
          sentence={currentExercise.sentence}
          questionIndexes={[currentExercise.sentence.split(" ").indexOf("____")]}
          placeholder="Type your answer..."
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-6">
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/')}
      >
        Go back
      </button>
      <div className="w-full max-w-6xl">

        {renderExercise()}
        <LanguagePronunciationReader />
        <FillTheBlank
          sentence="I went to the beach today."
          questionIndexes={[4]}
          placeholder="Type your answer..."
        />

        <div className="ticks"></div>
        <FillTheBlank
          sentence="I went to the beach today."
          questionIndexes={[4]}
          questionOptions={{
            4: ["beach", "stairs", "bed"],
          }}
          placeholder="Type your answer..."
        />
        <TextCorrectionHighlighter />
      </div>
    </div>
  )
}