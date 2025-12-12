// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Index from './pages/Index';
import { getToken } from './utils/auth';
import './index.css';

// Защищенный маршрут
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        {/* Можно добавить другие маршруты позже */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;