import { Button, Card, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { type Question as QuestionType } from '../types'
import { useQuestionsStore } from './store/questions'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Footer } from './Footer'

const getBackgroundColor = (info: QuestionType, index: number) => {
    const { userSelectedAnswer, correctAnswer } = info
    if (userSelectedAnswer === null) return "transparent"
    if (index !== correctAnswer && index !== userSelectedAnswer) return "transparent"
    if (index === correctAnswer) return "rgba(0,255,0,0.2)"
    if (index === userSelectedAnswer) return "rgba(255,0,0,0.2)"

    return "transparent"
}

const Question = ({ info }: { info: QuestionType }) => {
    const selectAnswer = useQuestionsStore(state => state.selectAnswer)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)

    // Función que genera handlers para los clicks de las respuestas
    const createHandleClick = (answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex)
        setTimeout(goNextQuestion, 500) // Espera 500ms antes de ir a la siguiente pregunta
    }

    // Determina el color de fondo de cada respuesta
    return (
        <Card variant="outlined" sx={{ textAlign: "left", bgcolor: "#222", p: 2, marginTop: 4 }} >
            <Typography variant="h5">{info.question}</Typography>

            <SyntaxHighlighter language="javascript" style={gradientDark}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{ bgcolor: "#333" }} disablePadding>
                {info.answers.map((answer, index) => (
                    <ListItem key={index} disablePadding divider>
                        <ListItemButton
                            disabled={info.userSelectedAnswer !== null}
                            onClick={createHandleClick(index)}
                            sx={{
                                bgcolor: getBackgroundColor(info, index),
                            }}>
                            <ListItemText primary={answer} sx={{ textAlign: "center" }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Card>
    )
}

export const Game = () => {
    const questions = useQuestionsStore(state => state.questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const resetGame = useQuestionsStore(state => state.resetGame)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
    const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion)

    const questionInfo = questions[currentQuestion]

    return (
        <div>
            <Stack direction="row" gap={2} justifyContent="center" textAlign="center">
                <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0}>
                    <ArrowBack />
                </IconButton>
                {currentQuestion + 1}/{questions.length}
                <IconButton onClick={goNextQuestion} disabled={currentQuestion >= questions.length - 1}>
                    <ArrowForward />
                </IconButton>
            </Stack>
            <Question info={questionInfo} />
            <Stack direction="row" gap={2} justifyContent="center" textAlign="center" style={{ marginTop: "16px" }} >
                <Footer />
                <Button onClick={resetGame} variant="contained" sx={{ marginTop: 2 }}>Reiniciar</Button>
            </Stack>
        </div>
    )
}
