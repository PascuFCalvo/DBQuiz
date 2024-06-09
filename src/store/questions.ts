import { create } from 'zustand';
import { type Question } from '../types';
import confetti from 'canvas-confetti';
import { persist } from 'zustand/middleware';

interface State {
    questions: Question[];
    currentQuestion: number;
    fetchQuestions: (limit: number) => Promise<void>;
    selectAnswer: (questionId: number, answerIndex: number) => void;
}

export const useQuestionsStore = create<State>()(persist((set, get) => {
    return {
        questions: [],
        currentQuestion: 0,
        fetchQuestions: async (limit: number) => {
            const res = await fetch("http://localhost:5173/data.json");
            const data = await res.json();
            const questions = data.sort(() => Math.random() - 0.5).slice(0, limit);
            // Inicializar userSelectedAnswer como null en cada pregunta
            questions.forEach((question: Question) => {
                question.userSelectedAnswer = null;
            });
            set({ questions });
        },

        selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            // Clonar el array de preguntas para no mutar el estado directamente
            const newQuestions = [...questions];
            const questionIndex = newQuestions.findIndex(question => question.id === questionId);

            if (questionIndex !== -1) {
                const questionInfo = newQuestions[questionIndex];
                const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex;

                if (isCorrectUserAnswer) confetti()

                // Actualizar el estado de la pregunta con la respuesta seleccionada
                newQuestions[questionIndex] = {
                    ...questionInfo,
                    isCorrectUserAnswer,
                    userSelectedAnswer: answerIndex
                };

                set({ questions: newQuestions });
            }
        },

        goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nextQuestion = currentQuestion + 1;;

            if (currentQuestion < questions.length) {
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
}))
    // Path: src/types.d.ts
    ;
