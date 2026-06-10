import { welcomeMap, whatWouldYouLikeToStudyTodayMap } from "../constants/appTranslations";
import { APP_MENU_OPTIONS } from "../constants/menu";
import { useAppContext } from "../Context";
import ConfigDisplay from "./Config";
import { useNavigate } from "react-router-dom";

export default function Menu() {
    const { userName, userLanguage } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                <ConfigDisplay />
                <button onClick={() => navigate('/about')} className="absolute top-4 right-4 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    About
                </button>
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
                            className="group rounded-[36px] bg-white border border-gray-100 shadow-xl p-8 text-left hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="text-5xl mb-6">
                                {option.emoji}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-black">
                                    {option.title[userLanguage]}
                                </h2>

                                <p className="text-gray-600 leading-relaxed">
                                    {option.description[userLanguage]}
                                </p>

                                <div className="pt-3 flex flex-wrap gap-2">
                                    {option.examples.map(
                                        (example) => (
                                            <div
                                                key={example}
                                                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                                            >
                                                {example}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 flex items-center text-black font-semibold text-lg">
                                Start learning

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
