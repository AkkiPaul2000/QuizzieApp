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
import QuestionAnalysis from './components/Dashboard/QuestionAnalysis';


const ProtectedRoute = ({ children,path }) => {
  const { isLoggedIn,user } = useAuth();
    console.log("login",isLoggedIn,"user",user)

    // const requiresAuth = !path.startsWith('/quiz/'); 

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  return (
    <div className='protected-route-container'>
      <Sidebar className="sidebar" /> {/* Sidebar will only render for protected routes */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const MainApp = () => {
  return (
    <Router>
    <AuthProvider>
          

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
              path="/analytics"
              element={
                <ProtectedRoute>
                  <QuizAnalytics />
                </ProtectedRoute>
              }
            />
            <Route path="/quiz/:id" element={<TakeQuiz />} />
            <Route
              path="/analytics/:id"
              element={
                <ProtectedRoute>
                  <QuestionAnalysis />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      
    
    </AuthProvider>
    </Router>

  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
