import { startLearningMap, welcomeMap, whatWouldYouLikeToStudyTodayMap } from "../constants/appTranslations";
import { APP_MENU_OPTIONS } from "../constants/menu";
import { useAppContext } from "../Context";
import { capitalize } from "../utils/capitalize";
import ConfigDisplay from "./Config";
import { useNavigate } from "react-router-dom";

export default function Menu() {
    const { userName, userLanguage } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                <ConfigDisplay />
                <div className="absolute top-4 right-4 flex gap-4 text-sm text-gray-500">
                    <button onClick={() => navigate('/assets')} className="hover:text-gray-700 transition-colors">
                        Teacher
                    </button>
                    <button onClick={() => navigate('/admin')} className="hover:text-gray-700 transition-colors">
                        Admin
                    </button>
                    <button onClick={() => navigate('/about')} className="hover:text-gray-700 transition-colors">
                        About
                    </button>
                </div>
                <div className="mb-14 text-center space-y-4">
                    <div onClick={() => navigate('/assets')} className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold">
                        {welcomeMap[userLanguage]}
                    </div>

                    <h1 className="text-6xl font-black tracking-tight leading-tight">
                        {whatWouldYouLikeToStudyTodayMap[userLanguage]},
                        <br />
                        {userName}?
                    </h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {APP_MENU_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() =>
                                navigate(option.id)
                            }
                            className="flex flex-col justify-start group rounded-[36px] bg-white border border-gray-100 shadow-xl p-8 text-left hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="text-5xl mb-6">
                                {option.emoji}
                            </div>

                            <div className="mb-6">
                                <h2 className="text-3xl font-black">
                                    {option.title[userLanguage]}
                                </h2>

                                <p className="text-gray-600 h-30 leading-relaxed">
                                    {option.description[userLanguage]}
                                </p>

                                <div className="pt-3 flex flex-wrap gap-2">
                                    {Object.values(option.items?.[userLanguage] || {}).map(
                                        (item) => (
                                            <div
                                                key={item as string}
                                                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                                            >
                                                {capitalize(item as string)}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto flex items-center text-black font-semibold">
                                {startLearningMap[userLanguage || "en-US"]}

                                <span className="ml-2 transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
