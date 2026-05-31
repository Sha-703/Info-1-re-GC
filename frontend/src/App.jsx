import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Cours from './pages/Cours';
import Exercice from './pages/Exercices';
import InformatiquePratique from './pages/InformatiquePratique';
import Quiz from './pages/Quiz';
import LessonQuiz from './pages/LessonQuiz';
import Score from './pages/Score';
import Apropos from './pages/Apropos';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Lexique from './pages/Lexique';
import NavBar from './components/NavBar';

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar isAuthenticated={Boolean(token)} />
        <main>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/cours" element={<Cours />} />
            <Route path="/exercices" element={<Exercice />} />
            <Route path="/informatique-pratique" element={<InformatiquePratique />} />
            <Route path="/lexique" element={<Lexique />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/lesson-quiz" element={<LessonQuiz />} />
            <Route path="/score" element={<Score />} />
            <Route path="/apropos" element={<Apropos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
