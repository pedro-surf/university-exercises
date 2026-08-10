import { useEffect, useMemo, useState } from "react";

export type IconType = "EMOJI" | "FONT_AWESOME" | "REACT_ICONS";

export type IconSelection = {
  icon: string | null;
  iconType: IconType | null;
};

type IconSelectorProps = {
  value?: IconSelection;
  onChange: (value: IconSelection) => void;
  /** Optional label above the control */
  label?: string;
  /** Compact single-row trigger that opens the picker and commits on Done */
  compact?: boolean;
  className?: string;
};

const ICON_TYPES: { id: IconType; label: string; hint: string }[] = [
  { id: "EMOJI", label: "Emoji", hint: "Pick a unicode emoji" },
  {
    id: "FONT_AWESOME",
    label: "Font Awesome",
    hint: 'e.g. "fa-solid fa-bread-slice" or "fa-plane"',
  },
  {
    id: "REACT_ICONS",
    label: "React Icons",
    hint: 'e.g. "FaBreadSlice", "MdFlight", "HiOutlineHeart"',
  },
];

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Food",
    emojis: [
      "🍞", "🥖", "🧀", "🥛", "☕", "🍺", "🍚", "🫘", "🐟", "🍎",
      "🍌", "🍇", "🍕", "🍔", "🥗", "🍜", "🍣", "🥐", "🥚", "🥩",
    ],
  },
  {
    label: "Travel",
    emojis: [
      "✈️", "🚗", "🚕", "🚌", "🚆", "🚢", "🛵", "🚲", "🗺️", "🧳",
      "🏨", "🛂", "🎫", "🧭", "🏝️", "🗽", "🗼", "⛰️", "🏖️", "🌉",
    ],
  },
  {
    label: "Emotions",
    emojis: [
      "😀", "😢", "😡", "😨", "❤️", "😰", "☮️", "🙏", "💪", "😎",
      "😊", "🥰", "😭", "😤", "🤗", "😴", "🤔", "😍", "😔", "🤩",
    ],
  },
  {
    label: "Business",
    emojis: [
      "💼", "💻", "📊", "📈", "🏢", "📝", "☎️", "📧", "🤝", "💰",
      "🗓️", "📁", "🧑‍💼", "🏦", "🧾", "🗂️", "🖊️", "🕰️", "📣", "🔑",
    ],
  },
  {
    label: "Surfing",
    emojis: [
      "🏄", "🌊", "🏖️", "🐚", "🦈", "☀️", "🌴", "🩱", "🩴", "🌬️",
      "🌅", "🐠", "🪸", "⛵", "🛟", "🕶️", "🥥", "🌺", "🌀", "💧",
    ],
  },
  {
    label: "General",
    emojis: [
      "📚", "✏️", "🗣️", "👂", "👁️", "🧠", "🏠", "🌍", "⭐", "🔥",
      "💡", "🎯", "✅", "❌", "❓", "🕐", "👤", "👥", "🔔", "🎁",
    ],
  },
];

function Preview({ icon, iconType }: IconSelection) {
  if (!icon || !iconType) {
    return (
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">
        none
      </span>
    );
  }

  if (iconType === "EMOJI") {
    return (
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-white text-3xl">
        {icon}
      </span>
    );
  }

  return (
    <span
      title={icon}
      className="flex h-12 min-w-12 max-w-[10rem] items-center justify-center truncate rounded-2xl border bg-slate-900 px-2 font-mono text-[10px] text-white"
    >
      {icon}
    </span>
  );
}

export function IconSelector({
  value = { icon: null, iconType: null },
  onChange,
  label = "Icon",
  compact = false,
  className = "",
}: IconSelectorProps) {
  const [open, setOpen] = useState(!compact);
  const [draft, setDraft] = useState<IconSelection>(value);
  const [mode, setMode] = useState<IconType>(value.iconType ?? "EMOJI");
  const [emojiGroup, setEmojiGroup] = useState(EMOJI_GROUPS[0].label);
  const [customValue, setCustomValue] = useState(
    value.iconType && value.iconType !== "EMOJI" ? value.icon ?? "" : ""
  );

  useEffect(() => {
    if (!compact || !open) {
      setDraft(value);
      setMode(value.iconType ?? "EMOJI");
      setCustomValue(
        value.iconType && value.iconType !== "EMOJI" ? value.icon ?? "" : ""
      );
    }
  }, [value.icon, value.iconType, compact, open]);

  const activeEmojis = useMemo(
    () =>
      EMOJI_GROUPS.find((group) => group.label === emojiGroup)?.emojis ?? [],
    [emojiGroup]
  );

  const displayed = compact ? draft : value;

  const commit = (next: IconSelection) => {
    if (compact) {
      setDraft(next);
    } else {
      onChange(next);
    }
  };

  const selectEmoji = (emoji: string) => {
    const next = { icon: emoji, iconType: "EMOJI" as const };
    if (compact) {
      setDraft(next);
      onChange(next);
      setOpen(false);
    } else {
      onChange(next);
    }
  };

  const applyCustom = (next: string, type: IconType) => {
    setCustomValue(next);
    const trimmed = next.trim();
    commit({
      icon: trimmed || null,
      iconType: trimmed ? type : null,
    });
  };

  const clear = () => {
    const next = { icon: null, iconType: null };
    setCustomValue("");
    setDraft(next);
    onChange(next);
    if (compact) setOpen(false);
  };

  const finishCompact = () => {
    onChange(draft);
    setOpen(false);
  };

  const panel = (
    <div className="space-y-4 rounded-2xl border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Preview icon={displayed.icon} iconType={displayed.iconType} />
          <div>
            <div className="font-semibold">{label}</div>
            <div className="text-sm text-gray-500">
              {displayed.icon
                ? `${displayed.iconType}: ${displayed.icon}`
                : "No icon selected"}
            </div>
          </div>
        </div>
        {displayed.icon && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {ICON_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setMode(type.id)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === type.id
                ? "bg-black text-white"
                : "border bg-white hover:bg-gray-50"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">
        {ICON_TYPES.find((type) => type.id === mode)?.hint}
      </p>

      {mode === "EMOJI" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {EMOJI_GROUPS.map((group) => (
              <button
                key={group.label}
                type="button"
                onClick={() => setEmojiGroup(group.label)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  emojiGroup === group.label
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
            {activeEmojis.map((emoji) => {
              const selected =
                displayed.iconType === "EMOJI" && displayed.icon === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => selectEmoji(emoji)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition ${
                    selected
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  aria-label={`Select ${emoji}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>

          <label className="block space-y-1 text-sm">
            <span className="text-gray-600">Or paste any emoji</span>
            <input
              value={displayed.iconType === "EMOJI" ? displayed.icon ?? "" : ""}
              onChange={(e) => {
                const next = e.target.value.trim();
                commit({
                  icon: next || null,
                  iconType: next ? "EMOJI" : null,
                });
              }}
              placeholder="🍞"
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>
        </div>
      ) : (
        <label className="block space-y-1 text-sm">
          <span className="text-gray-600">Icon name / class</span>
          <input
            value={customValue}
            onChange={(e) => applyCustom(e.target.value, mode)}
            onFocus={() => {
              if (displayed.iconType !== mode) {
                setCustomValue("");
              }
            }}
            placeholder={
              mode === "FONT_AWESOME" ? "fa-solid fa-water" : "FaWater"
            }
            className="w-full rounded-lg border px-3 py-2 font-mono text-sm"
          />
        </label>
      )}
    </div>
  );

  if (!compact) {
    return <div className={className}>{panel}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 hover:bg-gray-50"
      >
        <Preview icon={value.icon} iconType={value.iconType} />
        <span className="text-sm font-medium text-gray-700">
          {value.icon ? "Change icon" : "Set icon"}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-2 w-[min(100vw-2rem,28rem)] shadow-xl">
          {panel}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border bg-white px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={finishCompact}
              className="rounded-lg bg-black px-3 py-1.5 text-sm text-white"
            >
              Save icon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Renders a stored icon value (emoji inline; library keys as a badge until wired). */
export function IconDisplay({
  icon,
  iconType,
  className = "",
}: IconSelection & { className?: string }) {
  if (!icon || !iconType) return null;

  if (iconType === "EMOJI") {
    return <span className={className}>{icon}</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-white ${className}`}
      title={`${iconType}: ${icon}`}
    >
      {icon}
    </span>
  );
}

export default IconSelector;
