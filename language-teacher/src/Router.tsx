import {
  createBrowserRouter,
} from "react-router-dom";

import App from "./App";
import GrammarPage from "./components/Grammar";
import VocabularyPage from "./components/Vocabulary";
import ExercisesPage from "./components/Exercises";

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },

    {
      path: "/grammar",
      element: <GrammarPage />,
    },

    {
      path: "/vocabulary",
      element: <VocabularyPage />,
    },

    {
      path: "/exercises",
      element: <ExercisesPage />,
    },
  ]);
