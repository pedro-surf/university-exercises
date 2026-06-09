import { useAppContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { goBackMap } from "../constants/appTranslations";

export default function AboutScreen() {
    const navigate = useNavigate();

    const {
        userLanguage: originLanguage,
    } = useAppContext();


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 flex flex-col items-center justify-start">
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/')}
            >
                {goBackMap[originLanguage]}
            </button>
            <h1>
                About the App
            </h1>
            <p className="text-md w-full text-justify text-gray-600 mt-5">
                Some features may not work properly if your browser does not support the language you are learning. Consider installing your target language for the best experience.
                Language has always been one of my favorite ways to explore the world.
                I love traveling, surfing, meeting people from different cultures, and learning how they see life. Over the years, I've learned four languages and discovered that every new language opens a completely different perspective on the world.
                Many language apps focus heavily on scaling content, maximizing engagement metrics, or turning learning into a repetitive game.
                This project was born from a simple idea: language learning should feel practical, personal, and enjoyable.
            </p>
            <div className="text-2xl font-bold mt-5 mb-4">
                Why This Project Exists
            </div>
            <p className="text-md w-full text-justify text-gray-600 mt-5">
                Combining AI power to generate and store language exercises and vocabulary, and real human contributors to review and curate content, I wanted to create a language learning experience that feels both personalized and authentic.

                My hope is that this project helps people become more confident travelers, more curious learners, and more connected global citizens.
                Every language learned is an invitation to understand another culture.
                And in a world that often feels divided by borders, politics, and geography, understanding each other a little better is a goal worth pursuing.
                Learn languages. Explore the world. Bring people together.

                — Pedro
            </p>
            <p>My GitHub:
                <a href="https://github.com/pedro-surf" className="text-blue-500 hover:underline ml-1">
                    @pedro-surf
                </a>
            </p>
        </div>
    );
}
