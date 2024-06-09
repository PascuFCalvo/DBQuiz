import { useQuestionsStore } from "./store/questions"

export const Footer = () => {
    const questions = useQuestionsStore(state => state.questions)
    const correctAnswers = questions.filter(question => question.isCorrectUserAnser).length
    const totalQuestions = questions.length

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(question => {
        const { userSelectedAnswer, correctAnswer } = question
        if (userSelectedAnswer === null) {
            unanswered++
        } else if (userSelectedAnswer === correctAnswer) {
            correct++
        } else {
            incorrect++
        }
    });


    return (
        <footer style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            marginTop: '20px'
        }}>
            <strong>{`✅${correct} aciertos - ❌${incorrect} fallos -  ${unanswered} restantes`}</strong>
        </footer>
    )
}