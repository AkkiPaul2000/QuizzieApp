import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CreateQuiz from './components/Dashboard/CreateQuiz';
import QuizAnalytics from './components/Dashboard/QuizAnalytics';
import TakeQuiz from './components/Quiz/TakeQuiz';
import QuizResult from './components/Quiz/QuizResult';
import Sidebar from './components/common/Sidebar'; // Import Sidebar
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div style={{ display: 'flex', flex: 1, height: '100vh' }}>
      <Sidebar /> {/* Sidebar will only render for protected routes */}
      <div style={{ display: 'flex', flex: 3, backgroundColor: '#EDEDED' }}>
        {children}
      </div>
    </div>
  );
};

const MainApp = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ backgroundColor: '#F2F2F2', display: 'flex', flexDirection: 'column', height: '100vh' }}>
          
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/createQuiz"
              element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <QuizAnalytics />
                </ProtectedRoute>
              }
            />
            <Route path="/quiz/:id" element={<TakeQuiz />} />
            <Route path="/quiz/result/:id" element={<QuizResult />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
