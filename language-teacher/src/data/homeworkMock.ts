export type HomeworkShot = {
  id: string;
  name: string;
  url: string;
  instructions: string;
};

export type Homework = {
  id: string;
  text: string;
  screenshots: HomeworkShot[];
  createdAt: string;
};

export type HomeworkStudent = {
  id: string;
  name: string;
  email: string;
};

export type HomeworkAssignment = {
  id: string;
  homeworkId: string;
  studentId: string;
  assignedAt: string;
};

function placeholderShot(title: string, detail: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#f4f4f5"/>
    <rect x="28" y="28" width="744" height="444" rx="20" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
    <rect x="28" y="28" width="744" height="56" rx="20" fill="#18181b"/>
    <rect x="28" y="64" width="744" height="20" fill="#18181b"/>
    <text x="52" y="64" fill="#ffffff" font-family="system-ui,sans-serif" font-size="18" font-weight="700">${title}</text>
    <text x="52" y="150" fill="#18181b" font-family="system-ui,sans-serif" font-size="28" font-weight="700">${detail}</text>
    <text x="52" y="200" fill="#71717a" font-family="system-ui,sans-serif" font-size="16">Sample screenshot</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const HOMEWORK_STUDENTS: HomeworkStudent[] = [
  { id: "stu-ada", name: "Ada Student", email: "ada.student@example.com" },
  { id: "stu-kenji", name: "Kenji Sato", email: "kenji.sato@example.com" },
  { id: "stu-marta", name: "Marta Silva", email: "marta.silva@example.com" },
  { id: "stu-leo", name: "Leo Martins", email: "leo.martins@example.com" },
];

export const MOCK_HOMEWORKS: Homework[] = [
  {
    id: "hw-past-tense",
    text: "Write five sentences using the past tense of “to go”. Include a screenshot of your notebook and the exercise page.",
    createdAt: "2026-09-18T14:30:00.000Z",
    screenshots: [
      {
        id: "shot-past-1",
        name: "notebook.png",
        url: placeholderShot("Notebook", "Yesterday I went to the market."),
        instructions: "Read the notebook sentence and underline the past tense of “to go”.",
      },
      {
        id: "shot-past-2",
        name: "exercise-page.png",
        url: placeholderShot("Exercise page", "Past tense · to go"),
        instructions: "Complete the exercise page with five sentences of your own.",
      },
    ],
  },
  {
    id: "hw-food",
    text: "Label the food vocabulary sheet in Portuguese and send a screenshot of your answers.",
    createdAt: "2026-09-20T11:00:00.000Z",
    screenshots: [
      {
        id: "shot-food-1",
        name: "food-sheet.png",
        url: placeholderShot("Food sheet", "pão · queijo · maçã"),
        instructions: "Label each food in Portuguese, then say the three words out loud.",
      },
    ],
  },
  {
    id: "hw-travel",
    text: "Describe a trip in six lines. Attach screenshots of the phrases you looked up.",
    createdAt: "2026-09-22T16:15:00.000Z",
    screenshots: [
      {
        id: "shot-travel-1",
        name: "phrases.png",
        url: placeholderShot("Phrase list", "o bilhete · a plataforma"),
        instructions: "Copy two travel phrases and write what each one means.",
      },
      {
        id: "shot-travel-2",
        name: "draft.png",
        url: placeholderShot("Draft", "I took the train to Porto."),
        instructions: "Rewrite the draft in six lines and include one phrase from the list.",
      },
    ],
  },
];

export const MOCK_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: "asg-1",
    homeworkId: "hw-past-tense",
    studentId: "stu-ada",
    assignedAt: "2026-09-18T15:00:00.000Z",
  },
  {
    id: "asg-2",
    homeworkId: "hw-past-tense",
    studentId: "stu-marta",
    assignedAt: "2026-09-18T15:05:00.000Z",
  },
  {
    id: "asg-3",
    homeworkId: "hw-food",
    studentId: "stu-kenji",
    assignedAt: "2026-09-20T11:20:00.000Z",
  },
  {
    id: "asg-4",
    homeworkId: "hw-food",
    studentId: "stu-ada",
    assignedAt: "2026-09-21T09:10:00.000Z",
  },
];
