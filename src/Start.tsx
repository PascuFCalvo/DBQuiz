import { Button } from '@mui/material';
import { useQuestionsStore } from './store/questions';

const NUMNER_OF_QUESTIONS = 10;

export const Start = () => {

    const fetchQuestions = useQuestionsStore(state => state.fetchQuestions)

    const handleClick = () => {
        fetchQuestions(NUMNER_OF_QUESTIONS)
    }

    return (
        <Button onClick={handleClick} variant="contained" color="primary">¡EMPEZAR!</Button>
    )
}