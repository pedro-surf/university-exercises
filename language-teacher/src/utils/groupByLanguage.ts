type Exercise = {
    id: string;
    language: string; // Language of the exercise
  };
  
  type ExerciseResult = {
    id: string;
    userId: string;
    exerciseId: string;
    userAnswer: string;
    isCorrect: boolean;
    score: number;
    duration?: number;
    createdAt: Date;
    exercise: Exercise; // Relation to the exercise
  };
  
  export function groupByLanguage(exerciseResults: ExerciseResult[]) {
    return exerciseResults.reduce((grouped, result) => {
      const language = result.exercise.language;
  
      if (!grouped[language]) {
        grouped[language] = [];
      }
  
      grouped[language].push(result);
  
      return grouped;
    }, {} as Record<string, ExerciseResult[]>);
  }