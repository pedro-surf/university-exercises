import {
  createBrowserRouter,
} from "react-router-dom";

import App from "./App";
import GrammarPage from "./components/Grammar";
import VocabularyPage from "./components/Vocabulary";
import ExercisesPage from "./components/Exercises";
import UserMetrics from "./components/UserMetrics";
import UserMetricsV2 from "./components/UserMetricsV2";
import { AssetsInspector } from "./components/AssetsInspector";

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
    {
      path: "/assets",
      element: <AssetsInspector />,
    },
    {
      path: "/metrics",
      element: <UserMetrics />,
    },
    {
      path: "/dashboard",
      element: <UserMetricsV2 />,
    },
  ]);
