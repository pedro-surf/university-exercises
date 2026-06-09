import React, { useCallback, useEffect } from "react";
import LanguageInput from "../LanguageInput";
import UserLanguage from "./UserLanguage";
import { useAppContext } from "../../Context";

type ThemeMode = "light" | "dark" | string;

type OnboardingData = {
  name: string;
  email: string;
  location: string;
  spokenLanguage: string;
  targetLanguage: string;
  themeMode: ThemeMode;
};

type Step = {
  key: keyof OnboardingData;
  title: string;
  placeholder?: string;
  component?: React.ComponentType<{ value: string; onChange: (val: string) => void }>;
};

const STEPS: Step[] = [
  {
    key: "name",
    title: "What should we call you?",
    placeholder: "Your name",
  },
  {
    key: "email",
    title: "What's your email?",
    placeholder: "you@example.com",
  },
  {
    key: "location",
    title: "Where are you located?",
    placeholder: "Location",
  },
  {
    key: "spokenLanguage",
    title: "What is your first language?",
    component: UserLanguage,
  },
  {
    key: "targetLanguage",
    title: "What language do you want to learn?",
    component: LanguageInput,
  },
] as const;

export default function Onboarding() {
  const { theme, userName, setUserEmail, setUserLocation, setUserName, userLocation, userEmail, setTargetLanguage, setTheme, setUserLanguage, targetLanguage, userLanguage } = useAppContext();

  const [step, setStep] = React.useState(0);

  const [data, setData] = React.useState<OnboardingData>({
    name: userName || "",
    email: userEmail || "",
    location: userLocation || "",
    spokenLanguage: userLanguage || "",
    targetLanguage: targetLanguage || "",
    themeMode: theme || "light",
  });

  useEffect(() => {
    if (userName || userEmail || userLocation || userLanguage || targetLanguage) {
      setData((prev) => ({
        ...prev,
        name: userName || prev.name,
        email: userEmail || prev.email,
        location: userLocation || prev.location,
        spokenLanguage: userLanguage || prev.spokenLanguage,
        targetLanguage: targetLanguage || prev.targetLanguage,
      }));
    }
  }, [userName, userEmail, userLocation, userLanguage, targetLanguage]);

  

  const currentStep = STEPS[step];

  const progress = ((step + 1) / (STEPS.length + 1)) * 100;

  const updateField = (key: keyof OnboardingData, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validation function
  const validateField = (key: keyof OnboardingData, value: string): boolean => {
    if (key === "name") {
      return /^[a-zA-Z\s]{2,}$/.test(value); // Name must be at least 2 characters long
    }
    if (key === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Basic email validation
    }
    return true; // No validation for other fields
  };

  const next = useCallback(() => {
    if (currentStep?.key && !validateField(currentStep.key, data[currentStep.key])) {
      alert(
        currentStep.key === "name"
          ? "Name must be at least 2 characters long."
          : "Please enter a valid email address."
      );
      return;
    }

    if (step < STEPS.length) {
      setStep((prev) => prev + 1);
    }
  }, [step, currentStep, data]);

  const back = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (!data.targetLanguage) {
      alert("Select a target language!");
      setStep(4);
      return;
    }

    if (!data.spokenLanguage) {
      alert("Select a spoken language!");
      setStep(3);
      return;
    }

    setTargetLanguage(data.targetLanguage);
    setUserLanguage(data.spokenLanguage);
    setTheme(data.themeMode);
    setUserName(data.name);
    setUserEmail(data.email);
    setUserLocation(data.location);
    const hasConfigured = !!userLanguage && !!userName && !!targetLanguage;
    if (!hasConfigured) {
      setStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gray-100">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="p-10 md:p-14 min-h-[700px] flex flex-col justify-between">
          {step < STEPS.length ? (
            <>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-gray-500 font-semibold">
                    Step {step + 1} of {STEPS.length + 1}
                  </div>

                  <h1 className="text-5xl font-black leading-tight">
                    {currentStep.title}
                  </h1>
                </div>

                {currentStep.component ? (
                  <currentStep.component
                    value={data[currentStep.key] as string}
                    onChange={(val) => updateField(currentStep.key, val)}
                  />
                ) : (
                  <input
                    autoFocus
                    type={currentStep.key === "email" ? "email" : "text"}
                    value={data[currentStep.key] as string}
                    onChange={(e) =>
                      updateField(currentStep.key, e.target.value)
                    }
                    placeholder={currentStep.placeholder}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        next();
                      }
                    }}
                    className="w-full text-3xl border-0 border-b-2 border-gray-200 focus:border-black outline-none py-5 bg-transparent transition-colors"
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-4 pt-10">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="px-6 py-4 rounded-2xl border border-gray-200 text-gray-700 disabled:opacity-30"
                >
                  Back
                </button>

                <button
                  onClick={next}
                  className="px-8 py-4 rounded-2xl bg-black text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-8 w-full">
              <div className="space-y-3">
                <div className="text-sm uppercase tracking-[0.2em] text-gray-500 font-semibold">
                  Final Step
                </div>

                <h1 className="text-5xl font-black leading-tight">
                  Choose your theme
                </h1>

                <p className="text-xl text-gray-600">
                  Personalize your experience.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <button
                  onClick={() => updateField("themeMode", "light")}
                  className={`rounded-3xl border-2 p-8 text-left transition-all ${data.themeMode === "light"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                >
                  <div className="text-3xl mb-3">☀️</div>

                  <div className="text-2xl font-bold">Light</div>

                  <p className="mt-2 opacity-80">Clean and bright.</p>
                </button>

                <button
                  onClick={() => updateField("themeMode", "dark")}
                  className={`rounded-3xl border-2 p-8 text-left transition-all ${data.themeMode === "dark"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                >
                  <div className="text-3xl mb-3">🌙</div>

                  <div className="text-2xl font-bold">Dark</div>

                  <p className="mt-2 opacity-80">Focused and immersive.</p>
                </button>
              </div>

              <button
                onClick={handleComplete}
                className="w-full rounded-3xl bg-black text-white py-5 text-xl font-bold hover:opacity-90 transition-opacity"
              >
                Start Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}