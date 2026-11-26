import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layout/MainLayout';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentClass from './pages/student/StudentClass';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentAttendance from './pages/student/StudentAttendance';

// Mentor
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorProfile from './pages/mentor/MentorProfile';
import MentorClasses from './pages/mentor/MentorClasses';
import MentorSubjects from './pages/mentor/MentorSubjects';
import MentorStudents from './pages/mentor/MentorStudents';
import MentorAttendance from './pages/mentor/MentorAttendance';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminMentors from './pages/admin/AdminMentors';
import AdminClasses from './pages/admin/AdminClasses';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminAssignments from './pages/admin/AdminAssignments';

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Role-based dashboards (layout with sidebar) */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/class" element={<StudentClass />} />
          <Route path="/student/subjects" element={<StudentSubjects />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/mentor/profile" element={<MentorProfile />} />
          <Route path="/mentor/classes" element={<MentorClasses />} />
          <Route path="/mentor/subjects" element={<MentorSubjects />} />
          <Route path="/mentor/students" element={<MentorStudents />} />
          <Route path="/mentor/attendance" element={<MentorAttendance />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/mentors" element={<AdminMentors />} />
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/subjects" element={<AdminSubjects />} />
          <Route path="/admin/assignments" element={<AdminAssignments />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
