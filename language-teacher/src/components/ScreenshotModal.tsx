import { useEffect, useState } from "react";

export type ViewerShot = {
  id: string;
  name: string;
  url: string;
  instructions?: string;
};

export default function ScreenshotModal({
  shots,
  startIndex,
  onClose,
}: {
  shots: ViewerShot[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const shot = shots[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % shots.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + shots.length) % shots.length);
      }
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, shots.length]);

  if (!shot) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={shot.name}
    >
      <div
        className="relative flex max-h-full w-full max-w-5xl flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-white">
          <p className="truncate text-sm">
            {shot.name}
            {shots.length > 1 ? ` · ${index + 1} of ${shots.length}` : ""}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
          >
            Close
          </button>
        </div>
        <img
          src={shot.url}
          alt={shot.instructions || shot.name}
          className="max-h-[70vh] w-full rounded-2xl bg-black object-contain"
        />
        {shot.instructions ? (
          <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-black">
            <span className="font-black">{index + 1}. </span>
            {shot.instructions}
          </p>
        ) : null}
        {shots.length > 1 && (
          <div className="mt-3 flex justify-between">
            <button
              type="button"
              onClick={() =>
                setIndex((current) => (current - 1 + shots.length) % shots.length)
              }
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setIndex((current) => (current + 1) % shots.length)}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
