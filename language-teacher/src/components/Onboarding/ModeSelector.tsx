type UserMode = "teacher" | "student";

type ModeSelectorProps = {
  value: UserMode;
  onChange: (mode: UserMode) => void;
};

export function ModeSelector({
  value,
  onChange,
}: ModeSelectorProps) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border bg-white p-6 shadow-lg space-y-5">
      <div>
        <h2 className="text-3xl font-bold">
          Choose Your Mode
        </h2>

        <p className="text-gray-600 mt-2">
          Select how you want to use the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange("student")}
          className={`rounded-2xl border-2 p-6 text-left transition-all ${
            value === "student"
              ? "border-black bg-black text-white"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div className="text-2xl font-bold">
            Student
          </div>

          <p className="mt-2 text-sm opacity-80">
            Learn languages, practice exercises,
            and improve pronunciation.
          </p>
        </button>

        <button
          onClick={() => onChange("teacher")}
          className={`rounded-2xl border-2 p-6 text-left transition-all ${
            value === "teacher"
              ? "border-black bg-black text-white"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div className="text-2xl font-bold">
            Teacher
          </div>

          <p className="mt-2 text-sm opacity-80">
            Create lessons, manage content,
            and expand language assets.
          </p>
        </button>
      </div>
    </div>
  );
}
