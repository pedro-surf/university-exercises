type PronounItem = {
    id: string;
    word: string;
};

type PronounsTableProps = {
    title?: string;

    originLanguageLabel?: string;
    targetLanguageLabel?: string;

    originPronouns: PronounItem[];
    targetPronouns: PronounItem[];
};

export default function PronounsTable({
    title = "Pronouns",
    originLanguageLabel = "English",
    targetLanguageLabel = "Français",
    originPronouns,
    targetPronouns,
}: PronounsTableProps) {
    const targetMap = new Map(
        targetPronouns.map((item) => [
            item.id,
            item.word,
        ])
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                    <h1 className="text-5xl font-black mb-5">
                        {title}
                    </h1>
                <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl">
                    <div className="grid grid-cols-2 bg-black text-white">
                        <div className="p-6 text-2xl font-bold border-r border-white/10">
                            {originLanguageLabel ?? "Origin Language"}
                        </div>

                        <div className="p-6 text-2xl font-bold">
                            {targetLanguageLabel}
                        </div>
                    </div>

                    <div>
                        {originPronouns.map(
                            (originPronoun, index) => {
                                const targetWord =
                                    targetMap.get(
                                        originPronoun.id
                                    ) ?? "—";

                                return (
                                    <div
                                        key={originPronoun.id}
                                        className={`grid grid-cols-2 ${index !==
                                            originPronouns.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                            }`}
                                    >
                                        <div className="p-6 text-3xl font-semibold border-r border-gray-100">
                                            {originPronoun.word}
                                        </div>

                                        <div className="p-6 text-3xl font-semibold text-gray-700">
                                            {targetWord}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
