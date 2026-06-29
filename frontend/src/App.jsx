import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import CredentialLookup from './pages/CredentialLookup';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';
import StudentProfile from './pages/Dashboard/StudentProfile';
import Grades from './pages/Dashboard/Grades';
import GPA from './pages/Dashboard/GPA';
import Schedule from './pages/Dashboard/Schedule';
import Courses from './pages/Dashboard/Courses';
import Notifications from './pages/Dashboard/Notifications';
import Resources from './pages/Dashboard/Resources';
import Financials from './pages/Dashboard/Financials';

// Widgets
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import StaffDashboard from './pages/Dashboard/StaffDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
              fontSize: '15px',
            },
            success: { iconTheme: { primary: '#042C76', secondary: '#fff' } },
          }}
        />
        <ChatWidget />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/get-email" element={<CredentialLookup />} />
          {/* Redirect old registration routes to login */}
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route path="/academic-registration" element={<Navigate to="/login" replace />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentProfile />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="grades" element={<Grades />} />
            <Route path="gpa" element={<GPA />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="courses" element={<Courses />} />
            <Route path="financials" element={<Financials />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="resources" element={<Resources />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
