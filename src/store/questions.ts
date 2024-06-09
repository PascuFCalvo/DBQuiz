import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { persist } from 'zustand/middleware';
import { type Question } from '../../types';

interface State {
    questions: Question[];
    currentQuestion: number;
    fetchQuestions: (limit: number) => Promise<void>;
    selectAnswer: (questionId: number, answerIndex: number) => void;
    goNextQuestion: () => void;
    goPreviousQuestion: () => void;
    resetGame: () => void;
}

export const useQuestionsStore = create<State>()(persist((set, get) => {
    return {
        questions: [],
        currentQuestion: 0,
        fetchQuestions: async (limit: number) => {
            const res = await fetch("https://db-quiz-seven.vercel.app/data.json");
            const data = await res.json();
            const questions = data.sort(() => Math.random() - 0.5).slice(0, limit);
            // Inicializar userSelectedAnswer como undefined en cada pregunta
            questions.forEach((question: Question) => {
                question.userSelectedAnswer = undefined;
            });
            set({ questions });
        },

        selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            const newQuestions = [...questions];
            const questionIndex = newQuestions.findIndex(question => question.id === questionId);

            if (questionIndex !== -1) {
                const questionInfo = newQuestions[questionIndex];
                const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex;

                if (isCorrectUserAnswer) confetti();

                newQuestions[questionIndex] = {
                    ...questionInfo,
                    isCorrectUserAnswer: isCorrectUserAnswer,
                    userSelectedAnswer: answerIndex
                };

                set({ questions: newQuestions });
            }
        },

        goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nextQuestion = currentQuestion + 1;

            if (currentQuestion < questions.length - 1) {
                set({ currentQuestion: nextQuestion });
            }
        },

        goPreviousQuestion: () => {
            const { currentQuestion } = get();
            const previousQuestion = currentQuestion - 1;

            if (currentQuestion > 0) {
                set({ currentQuestion: previousQuestion });
            }
        },

        resetGame: () => {
            set({ questions: [], currentQuestion: 0 });
        }
    };
}, {
    name: "questions-storage",
    getStorage: () => localStorage
}));
