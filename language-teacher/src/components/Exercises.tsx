import LanguagePronunciationReader from './LanguagePronunciationReader'
import { TextCorrectionHighlighter } from './TextCorrectionHighlighter'
import { FillTheBlank } from './FillTheBlank'
import { useNavigate } from 'react-router-dom';

const Exercises = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-6">
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/')}
            >
                Go back
            </button>
            <div className="w-full max-w-6xl">


                <LanguagePronunciationReader />
                <FillTheBlank
                    sentence="I went to the beach today."
                    questionIndexes={[4]}
                    placeholder="Type your answer..."
                />

                <div className="ticks"></div>
                <FillTheBlank
                    sentence="I went to the beach today."
                    questionIndexes={[4]}
                    questionOptions={{
                        4: ["beach", "stairs", "bed"],
                    }}
                    placeholder="Type your answer..."
                />
                <TextCorrectionHighlighter />
            </div>
        </div>
    )
}

export default Exercises;