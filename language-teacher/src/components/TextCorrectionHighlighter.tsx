import { useMemo } from "react";
import { BLANK_WORD_SPACE } from "../constants/exercises";

type Props = {
  sentence: string;
  userText: string;
  solution: string | null;
};

function normalize(word: string) {
  return word
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();
}

// lightweight typo check (1-2 edits tolerance)
function isCloseMatch(a: string, b: string) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;

  let i = 0,
    j = 0,
    errors = 0;

  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      errors++;
      if (errors > 2) return false;

      // skip one char (typo tolerance)
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else {
        i++;
        j++;
      }
    } else {
      i++;
      j++;
    }
  }

  return true;
}

export function TextCorrectionHighlighter({
  sentence,
  userText,
  solution,
}: Props) {
  const expectedWords = useMemo(
    () => {
      const words = sentence.split(" ");
      if (!words.includes(BLANK_WORD_SPACE) || !solution?.length) {
        return words;
      }
      solution.split(";").forEach(
        sol => {
          const idx = words.findIndex(w => w === BLANK_WORD_SPACE);
          words[idx] = sol;
        }
      );
      return words;
    },
    [sentence, solution]
  );

  const userWords = useMemo(
    () => {
      const words = sentence.split(" ");
      const userWords = userText.split(";");
      if (!words.includes(BLANK_WORD_SPACE)) {
        return userWords;
      }
      userWords.forEach(
        sol => {
          const idx = words.findIndex(w => w === BLANK_WORD_SPACE);
          words[idx] = sol;
        }
      );
      return words;
    },
    [userText, sentence]
  );

  const maxLen = Math.max(expectedWords.length, userWords.length);

  return (
    <div className="flex flex-wrap gap-2 text-xl leading-10">
      {Array.from({ length: maxLen }).map((_, i) => {
        const expected = expectedWords[i];
        const user = userWords[i];

        if (!user) {
          return (
            <div
              key={i}
              className="px-3 py-2 rounded-xl border bg-gray-100 text-gray-400"
            >
              {expected ?? "∅"}
            </div>
          );
        }

        const correct =
          normalize(user) === normalize(expected);

        const typoClose =
          !correct &&
          isCloseMatch(
            normalize(user),
            normalize(expected || "")
          );

        return (
          <div
            key={i}
            className={`px-3 py-2 rounded-xl border font-medium transition
              ${correct
                ? "bg-green-100 border-green-400 text-green-900"
                : typoClose
                  ? "bg-yellow-100 border-yellow-400 text-yellow-900"
                  : "bg-red-100 border-red-400 text-red-900"
              }`}
          >
            {user}

            {!correct && expected && (
              <div className="text-xs mt-1 opacity-70">
                expected: {expected}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}