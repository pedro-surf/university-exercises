import LanguagePronunciationReader from './LanguagePronunciationReader'
import { TextCorrectionHighlighter } from './TextCorrectionHighlighter'
import { FillTheBlank } from './FillTheBlank'

const Exercises = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-6">
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