import { Button, Card, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { type Question as QuestionType } from '../types';
import { useQuestionsStore } from './store/questions';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Footer } from './Footer';

const getBackgroundColor = (info: QuestionType, index: number) => {
    if (info.userSelectedAnswer === undefined) {
        return "#333";
    } else if (info.userSelectedAnswer === index) {
        return info.isCorrectUserAnswer ? "#4CAF50" : "#F44336";
    } else if (info.correctAnswer === index) {
        return "#4CAF50";
    } else {
        return "#333";
    }
};

const Question = ({ info }: { info: QuestionType }) => {
    const selectAnswer = useQuestionsStore(state => state.selectAnswer);
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion);

    const createHandleClick = (answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex);
        setTimeout(goNextQuestion, 1000);
    };

    return (
        <Card variant="outlined" sx={{ textAlign: "left", bgcolor: "#333", p: 2, marginTop: 4 }}>
            <Typography variant="h5">{info.question}</Typography>

            <SyntaxHighlighter language="javascript" style={gradientDark}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{ bgcolor: "#333" }} disablePadding>
                {info.answers.map((answer, index) => (
                    <ListItem key={index} disablePadding divider>
                        <ListItemButton
                            disabled={info.userSelectedAnswer !== undefined}
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
    );
};

export const Game = () => {
    const questions = useQuestionsStore(state => state.questions);
    const currentQuestion = useQuestionsStore(state => state.currentQuestion);
    const resetGame = useQuestionsStore(state => state.resetGame);
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion);
    const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion);

    const questionInfo = questions[currentQuestion];

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
            {questionInfo && <Question info={questionInfo} />}
            <Stack direction="row" gap={2} justifyContent="center" textAlign="center" style={{ marginTop: "16px" }}>
                <Footer />
                <Button onClick={resetGame} variant="contained" sx={{ marginTop: 2 }}>Reiniciar</Button>
            </Stack>
        </div>
    );
};
