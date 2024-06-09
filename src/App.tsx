
import './App.css'
import { JavascriptLogo } from './JavaScriptLogo'
import { Stack } from '@mui/material'
import { Start } from './Start'
import { useQuestionsStore } from './store/questions'
import { Game } from './Game'

function App() {

  const questions = useQuestionsStore(state => state.questions)
  console.log(questions)


  return (
    <>
      <main>
        <Stack direction="row" gap={5} alignItems="center" justifyContent="center">
          <h1>DBZ QUIZ</h1>
          <JavascriptLogo />
        </Stack>

        {questions.length === 0 && <Start />}
        {questions.length > 0 && <Game />}

      </main>

    </>
  )
}

export default App
