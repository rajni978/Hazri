
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
          {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
       <Route path="/register" element={<RegisterPage />} />

            {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student/dashboard" element={<DashboardPage />} />
      </Route>

         {/* Mentor routes */}
      <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
        <Route path="/mentor/dashboard" element={<DashboardPage />} />
      </Route>

            {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
