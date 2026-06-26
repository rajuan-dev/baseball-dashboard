/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import { AuthLayout } from '@/layouts/auth-layout'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page'
import { LoginPage } from '@/pages/auth/login-page'
import { OtpVerificationPage } from '@/pages/auth/otp-verification-page'
import { ResetPasswordPage } from '@/pages/auth/reset-password-page'
// Hidden for now. Keep the page available in code for future re-enable.
// import { CreateAdminPage } from '@/pages/dashboard/create-admin-page'
import { DashboardOverviewPage } from '@/pages/dashboard/dashboard-overview-page'
import { DrillCategoriesPage } from '@/pages/dashboard/drill-categories-page'
import { DrillManagementPage } from '@/pages/dashboard/drill-management-page'
import { EarningsPage } from '@/pages/dashboard/earnings-page'
import { NotificationsPage } from '@/pages/dashboard/notifications-page'
import { ProfilePage } from '@/pages/dashboard/profile-page'
import { ReportsPage } from '@/pages/dashboard/reports-page'
import { SituationsPage } from '@/pages/dashboard/situations-page'
import { ChangePasswordPage } from '@/pages/settings/change-password-page'
import { ContentEditorPage } from '@/pages/settings/content-editor-page'
import { SettingsPage } from '@/pages/settings/settings-page'
import { useAuthStore } from '@/store/auth-store'

const Protected = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate replace to="/auth/login" />
  }

  return <>{children}</>
}

const configuredBasePath = import.meta.env.VITE_APP_BASE_PATH?.trim()
const adminBasePath = configuredBasePath
  ? configuredBasePath.replace(/\/+$/, '') || '/'
  : '/'

export const router = createBrowserRouter(
  [
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'otp-verification', element: <OtpVerificationPage /> },
        { path: 'reset-password', element: <ResetPasswordPage /> },
      ],
    },
    {
      path: '/',
      element: (
        <Protected>
          <App />
        </Protected>
      ),
      children: [
        { index: true, element: <Navigate replace to="/dashboard" /> },
        { path: 'dashboard', element: <DashboardOverviewPage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'drills', element: <DrillManagementPage /> },
        { path: 'drills/categories', element: <DrillCategoriesPage /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'earnings', element: <EarningsPage /> },
        { path: 'situations', element: <SituationsPage /> },
        // Hidden for now. Keep the route available in code for future re-enable.
        // { path: 'create-admin', element: <CreateAdminPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'settings/change-password', element: <ChangePasswordPage /> },
        { path: 'settings/:section', element: <ContentEditorPage /> },
      ],
    },
  ],
  {
    basename: adminBasePath,
  },
)
