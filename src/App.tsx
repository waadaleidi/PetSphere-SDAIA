import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { PetProvider } from '@/context/PetContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/AppLayout';
import { Toaster } from '@/components/Toaster';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import PetsPage from '@/pages/PetsPage';
import PetProfilePage from '@/pages/PetProfilePage';
import FeedingPage from '@/pages/FeedingPage';
import HealthPage from '@/pages/HealthPage';
import GalleryPage from '@/pages/GalleryPage';
import JournalPage from '@/pages/JournalPage';
import RemindersPage from '@/pages/RemindersPage';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/pets"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <PetsPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/pet"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <PetProfilePage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/feeding"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <FeedingPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/health"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <HealthPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/gallery"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <GalleryPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/journal"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <JournalPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/reminders"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <RemindersPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute>
                <PetProvider>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </PetProvider>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
