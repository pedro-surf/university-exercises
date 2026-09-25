import { useEffect, useMemo, useRef, useState } from "react";
import {
  HOMEWORK_STUDENTS,
  MOCK_ASSIGNMENTS,
  MOCK_HOMEWORKS,
  type Homework,
  type HomeworkAssignment,
  type HomeworkShot,
  type HomeworkStudent,
} from "../data/homeworkMock";
import { downloadHomeworkPdf } from "../utils/homeworkPdf";
import ScreenshotModal from "./ScreenshotModal";

const STORAGE_KEY = "language-teacher-homework-board-v2";
const MAX_SHOTS = 8;
const MAX_BYTES = 1_500_000;

type Board = {
  homeworks: Homework[];
  assignments: HomeworkAssignment[];
};

function seedBoard(): Board {
  return {
    homeworks: MOCK_HOMEWORKS,
    assignments: MOCK_ASSIGNMENTS,
  };
}

function readBoard(): Board {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBoard();
    const parsed = JSON.parse(raw) as Board;
    if (!Array.isArray(parsed.homeworks) || !Array.isArray(parsed.assignments)) {
      return seedBoard();
    }
    return {
      assignments: parsed.assignments,
      homeworks: parsed.homeworks.map((homework) => ({
        ...homework,
        screenshots: (homework.screenshots ?? []).map((shot) => ({
          ...shot,
          instructions: typeof shot.instructions === "string" ? shot.instructions : "",
        })),
      })),
    };
  } catch {
    return seedBoard();
  }
}

function readImage(file: File): Promise<HomeworkShot> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error(`${file.name} is not an image.`));
      return;
    }
    if (file.size > MAX_BYTES) {
      reject(new Error(`${file.name} is larger than 1.5 MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: crypto.randomUUID(),
        name: file.name,
        url: String(reader.result),
        instructions: "",
      });
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function formatWhen(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HomeworkStudio() {
  const [board, setBoard] = useState<Board>(readBoard);
  const [text, setText] = useState("");
  const [shots, setShots] = useState<HomeworkShot[]>([]);
  const [addingShot, setAddingShot] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState(HOMEWORK_STUDENTS[0].id);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ shots: HomeworkShot[]; index: number } | null>(null);
  const [pendingStudents, setPendingStudents] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const latestInstructionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch {
      setError("Could not save homework in this browser. Try smaller screenshots.");
    }
  }, [board]);

  useEffect(() => {
    if (window.location.hash === "#homework") {
      document.getElementById("homework")?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (!addingShot) latestInstructionRef.current?.focus();
  }, [addingShot, shots.length]);

  const studentsById = useMemo(() => {
    return new Map(HOMEWORK_STUDENTS.map((student) => [student.id, student]));
  }, []);

  const homeworksNewestFirst = useMemo(() => {
    return [...board.homeworks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [board.homeworks]);

  const selectedStudent = studentsById.get(selectedStudentId) ?? HOMEWORK_STUDENTS[0];

  const history = useMemo(() => {
    return board.assignments
      .filter((assignment) => assignment.studentId === selectedStudent.id)
      .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt))
      .flatMap((assignment) => {
        const homework = board.homeworks.find((item) => item.id === assignment.homeworkId);
        return homework ? [{ assignment, homework }] : [];
      });
  }, [board.assignments, board.homeworks, selectedStudent.id]);

  const addFiles = async (files: FileList | File[]) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    setError(null);
    if (shots.length >= MAX_SHOTS) {
      setError(`A homework can include up to ${MAX_SHOTS} screenshots.`);
      return;
    }
    if (incoming.length > 1) {
      setNotice(null);
      setError("Add one screenshot at a time, then write the instructions that follow it.");
    }
    try {
      const shot = await readImage(incoming[0]);
      setShots((current) => [...current, shot]);
      setAddingShot(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that screenshot.");
    }
  };

  const draftHomework = (): Homework | null => {
    const title = text.trim();
    if (!title) {
      setError("Add a title for this homework.");
      return null;
    }
    if (shots.length === 0) {
      setError("Add the first screenshot.");
      return null;
    }
    const missing = shots.findIndex((shot) => shot.instructions.trim().length === 0);
    if (missing >= 0) {
      setError(`Write the instructions that follow screenshot ${missing + 1}.`);
      return null;
    }
    return {
      id: crypto.randomUUID(),
      text: title,
      screenshots: shots.map((shot) => ({ ...shot, instructions: shot.instructions.trim() })),
      createdAt: new Date().toISOString(),
    };
  };

  const createHomework = () => {
    const homework = draftHomework();
    if (!homework) return;
    setBoard((current) => ({
      ...current,
      homeworks: [homework, ...current.homeworks],
    }));
    setText("");
    setShots([]);
    setAddingShot(true);
    setError(null);
    setNotice("Homework created. Download the PDF or assign it to students.");
  };

  const downloadPdf = async (homework: Homework, busyKey: string) => {
    setError(null);
    setPdfBusy(busyKey);
    try {
      await downloadHomeworkPdf(homework);
      setNotice("PDF downloaded.");
    } catch (err) {
      setNotice(null);
      setError(err instanceof Error ? err.message : "Could not create the PDF.");
    } finally {
      setPdfBusy(null);
    }
  };

  const downloadDraft = () => {
    const homework = draftHomework();
    if (!homework) return;
    void downloadPdf(homework, "draft");
  };

  const openAssign = (homeworkId: string) => {
    setAssigningId(homeworkId);
    setPendingStudents([]);
    setError(null);
    setNotice(null);
  };

  const toggleStudent = (studentId: string) => {
    setPendingStudents((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId]
    );
  };

  const assignHomework = (homeworkId: string) => {
    if (pendingStudents.length === 0) {
      setError("Choose at least one student.");
      return;
    }
    const now = new Date().toISOString();
    setBoard((current) => {
      const existing = new Set(
        current.assignments
          .filter((assignment) => assignment.homeworkId === homeworkId)
          .map((assignment) => assignment.studentId)
      );
      const additions = pendingStudents
        .filter((studentId) => !existing.has(studentId))
        .map((studentId) => ({
          id: crypto.randomUUID(),
          homeworkId,
          studentId,
          assignedAt: now,
        }));
      return {
        ...current,
        assignments: [...additions, ...current.assignments],
      };
    });
    setSelectedStudentId(pendingStudents[0]);
    setAssigningId(null);
    setPendingStudents([]);
    setNotice("Homework assigned.");
  };

  const resetMock = () => {
    const next = seedBoard();
    setBoard(next);
    setText("");
    setShots([]);
    setAddingShot(true);
    setAssigningId(null);
    setPendingStudents([]);
    setSelectedStudentId(HOMEWORK_STUDENTS[0].id);
    setError(null);
    setNotice("Sample homework restored.");
  };

  const openShots = (shotsToOpen: HomeworkShot[], index: number) => {
    setViewer({ shots: shotsToOpen, index });
  };

  return (
    <section id="homework" className="scroll-mt-6 space-y-6">
      {viewer && (
        <ScreenshotModal
          shots={viewer.shots}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Homework</h2>
          <p className="text-gray-600">
            Add a screenshot, write the instructions that follow it, then add the next one.
            The PDF lists those instructions as 1, 2, 3.
          </p>
        </div>
        <button
          type="button"
          onClick={resetMock}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
        >
          Reset sample data
        </button>
      </div>

      {(error || notice) && (
        <div
          className={`rounded-2xl border px-4 py-3 ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error || notice}
        </div>
      )}

      <div className="rounded-[32px] border bg-white p-6 shadow-sm space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-500">Title</span>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Past tense practice"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
          />
        </label>

        {shots.length > 0 && (
          <ol className="space-y-4">
            {shots.map((shot, index) => (
              <li key={shot.id} className="rounded-3xl border p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = shots.filter((item) => item.id !== shot.id);
                      setShots(next);
                      if (next.length === 0) setAddingShot(true);
                    }}
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
                <button type="button" onClick={() => openShots(shots, index)} className="block">
                  <img
                    src={shot.url}
                    alt={shot.name}
                    className="h-40 w-full rounded-2xl border object-cover sm:w-72"
                  />
                </button>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-gray-500">
                    Instructions after this screenshot
                  </span>
                  <textarea
                    ref={index === shots.length - 1 ? latestInstructionRef : undefined}
                    value={shot.instructions}
                    onChange={(event) => {
                      const instructions = event.target.value;
                      setShots((current) =>
                        current.map((item) => (item.id === shot.id ? { ...item, instructions } : item))
                      );
                    }}
                    rows={3}
                    placeholder="What should the student do with this screenshot?"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                  />
                </label>
              </li>
            ))}
          </ol>
        )}

        {addingShot && shots.length < MAX_SHOTS && (
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              dragDepth.current += 1;
              setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              dragDepth.current = Math.max(0, dragDepth.current - 1);
              if (dragDepth.current === 0) setDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              dragDepth.current = 0;
              setDragging(false);
              void addFiles(event.dataTransfer.files);
            }}
            className={`rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? "border-black bg-gray-50" : "border-gray-200 bg-gray-50/60"
            }`}
          >
            <p className="text-lg font-semibold">Screenshot {shots.length + 1}</p>
            <p className="mt-1 text-sm text-gray-500">
              Drop one image, then write the instructions that follow it.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-2xl bg-black px-5 py-2 text-sm font-semibold text-white"
            >
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) void addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>
        )}

        {!addingShot && shots.length < MAX_SHOTS && (
          <button
            type="button"
            onClick={() => {
              const latest = shots[shots.length - 1];
              if (!latest?.instructions.trim()) {
                setError(`Write the instructions that follow screenshot ${shots.length} before adding another.`);
                return;
              }
              setError(null);
              setAddingShot(true);
            }}
            className="rounded-2xl border bg-white px-5 py-3 font-semibold"
          >
            Add the next screenshot
          </button>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadDraft}
            disabled={pdfBusy === "draft"}
            className="rounded-2xl border bg-white px-5 py-3 font-semibold disabled:opacity-60"
          >
            {pdfBusy === "draft" ? "Preparing PDF…" : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={createHomework}
            className="rounded-2xl bg-black px-5 py-3 font-semibold text-white"
          >
            Create homework
          </button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-4">
          <h3 className="text-xl font-black">All homework</h3>
          {homeworksNewestFirst.map((homework) => {
            const assigned = board.assignments.filter(
              (assignment) => assignment.homeworkId === homework.id
            );
            const assignedIds = new Set(assigned.map((assignment) => assignment.studentId));
            const available = HOMEWORK_STUDENTS.filter((student) => !assignedIds.has(student.id));
            return (
              <article key={homework.id} className="rounded-[28px] border bg-white p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-lg leading-relaxed">{homework.text}</p>
                  <time className="shrink-0 text-xs text-gray-500">{formatWhen(homework.createdAt)}</time>
                </div>
                <NumberedSteps shots={homework.screenshots} onOpen={openShots} />
                <button
                  type="button"
                  onClick={() => void downloadPdf(homework, homework.id)}
                  disabled={pdfBusy === homework.id}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  {pdfBusy === homework.id ? "Preparing PDF…" : "Download PDF"}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {assigned.length === 0 ? (
                    <span className="text-sm text-gray-500">Not assigned yet</span>
                  ) : (
                    assigned.map((assignment) => {
                      const student = studentsById.get(assignment.studentId);
                      if (!student) return null;
                      return (
                        <button
                          key={assignment.id}
                          type="button"
                          onClick={() => setSelectedStudentId(student.id)}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium"
                        >
                          {student.name}
                        </button>
                      );
                    })
                  )}
                  {available.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        assigningId === homework.id ? setAssigningId(null) : openAssign(homework.id)
                      }
                      className="rounded-full border px-3 py-1 text-sm font-semibold"
                    >
                      Assign
                    </button>
                  )}
                </div>
                {assigningId === homework.id && (
                  <div className="rounded-2xl border bg-gray-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-600">Assign to</p>
                    <div className="flex flex-wrap gap-2">
                      {available.map((student) => {
                        const selected = pendingStudents.includes(student.id);
                        return (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => toggleStudent(student.id)}
                            className={`rounded-2xl border px-3 py-2 text-left text-sm ${
                              selected ? "border-black bg-black text-white" : "bg-white"
                            }`}
                          >
                            <div className="font-semibold">{student.name}</div>
                            <div className={selected ? "text-white/70" : "text-gray-500"}>
                              {student.email}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => assignHomework(homework.id)}
                      className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                    >
                      Assign selected
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <aside className="rounded-[28px] border bg-white p-5 space-y-4 lg:sticky lg:top-6">
          <div>
            <h3 className="text-xl font-black">Student history</h3>
            <p className="text-sm text-gray-500">Homework assigned to each student.</p>
          </div>
          <div className="space-y-2">
            {HOMEWORK_STUDENTS.map((student) => {
              const count = board.assignments.filter(
                (assignment) => assignment.studentId === student.id
              ).length;
              const active = student.id === selectedStudent.id;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left ${
                    active ? "border-black bg-black text-white" : "bg-white"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{student.name}</span>
                    <span className={`text-xs ${active ? "text-white/70" : "text-gray-500"}`}>
                      {student.email}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{count}</span>
                </button>
              );
            })}
          </div>

          <StudentHistory
            student={selectedStudent}
            entries={history}
            onOpen={openShots}
            onDownload={(homework) => void downloadPdf(homework, `history-${homework.id}`)}
            pdfBusy={pdfBusy}
          />
        </aside>
      </div>
    </section>
  );
}

function NumberedSteps({
  shots,
  onOpen,
}: {
  shots: HomeworkShot[];
  onOpen: (shots: HomeworkShot[], index: number) => void;
}) {
  return (
    <ol className="space-y-4">
      {shots.map((shot, index) => (
        <li key={shot.id} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {index + 1}
          </span>
          <div className="min-w-0 space-y-2">
            <button type="button" onClick={() => onOpen(shots, index)} className="block">
              <img
                src={shot.url}
                alt={shot.instructions || shot.name}
                className="h-28 w-44 rounded-2xl border object-cover"
              />
            </button>
            <p className="text-sm leading-relaxed">{shot.instructions.trim() || shot.name}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StudentHistory({
  student,
  entries,
  onOpen,
  onDownload,
  pdfBusy,
}: {
  student: HomeworkStudent;
  entries: Array<{ assignment: HomeworkAssignment; homework: Homework }>;
  onOpen: (shots: HomeworkShot[], index: number) => void;
  onDownload: (homework: Homework) => void;
  pdfBusy: string | null;
}) {
  return (
    <div className="space-y-3 border-t pt-4">
      <h4 className="font-bold">{student.name}</h4>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No homework assigned yet.</p>
      ) : (
        entries.map(({ assignment, homework }) => (
          <article key={assignment.id} className="rounded-2xl border p-3 space-y-3">
            <time className="text-xs text-gray-500">Assigned {formatWhen(assignment.assignedAt)}</time>
            <p className="text-sm font-semibold leading-relaxed">{homework.text}</p>
            <NumberedSteps shots={homework.screenshots} onOpen={onOpen} />
            <button
              type="button"
              onClick={() => onDownload(homework)}
              disabled={pdfBusy === `history-${homework.id}`}
              className="rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {pdfBusy === `history-${homework.id}` ? "Preparing PDF…" : "Download PDF"}
            </button>
          </article>
        ))
      )}
    </div>
  );
}
