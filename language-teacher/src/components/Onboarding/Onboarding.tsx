import React, { useCallback } from "react";
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
  component?: React.ComponentType;
}

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
    title: "What's your spoken language?",
    component: UserLanguage,
  },
  {
    key: "targetLanguage",
    title: "Which language do you want to learn?",
    component: LanguageInput,
  },
] as const;

export default function Onboarding() {
  const {
    setTargetLanguage,
    setTheme,
    setUserLanguage,
  } = useAppContext();

  const [step, setStep] = React.useState(0);


  const [data, setData] = React.useState<OnboardingData>({
    name: "",
    email: "",
    location: "",
    spokenLanguage: "",
    targetLanguage: "",
    themeMode: "light",
  });

  const currentStep = STEPS[step];

  const progress = ((step + 1) / (STEPS.length + 1)) * 100;

  const updateField = (key: keyof OnboardingData, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const next = useCallback(() => {
    if (step < STEPS.length) {
      setStep((prev) => prev + 1);
    }
  }, [step]);

  const back = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    const payload: OnboardingData = { ...data }
    if (!payload.targetLanguage) {
      alert("Select a target language!");
    }
    Object.keys(payload).forEach((key) => {
      const value = payload[key as keyof OnboardingData];
      if (value) {
        localStorage.setItem(key, value);
      } else {
        payload[key as keyof OnboardingData] = localStorage.getItem(key) || "";
      }
      setTargetLanguage(payload.targetLanguage);
      setUserLanguage(payload.spokenLanguage);
      setTheme(payload.themeMode);
    });
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
                  // @ts-expect-error todo
                  <currentStep.component onChange={val => updateField(currentStep.key, val)} />
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