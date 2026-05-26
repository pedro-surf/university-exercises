
export type VocabularyCategory =
    | "food"
    | "travel"
    | "emotions"
    | "business"
    | "surfing";

export const menuItems: {
    id: VocabularyCategory;
    label: string;
    emoji: string;
}[] = [
        {
            id: "food",
            label: "Food",
            emoji: "🍞",
        },

        {
            id: "travel",
            label: "Travel",
            emoji: "✈️",
        },

        {
            id: "emotions",
            label: "Emotions",
            emoji: "❤️",
        },

        {
            id: "business",
            label: "Business",
            emoji: "💼",
        },

        {
            id: "surfing",
            label: "Surfing",
            emoji: "🏄",
        },
    ];