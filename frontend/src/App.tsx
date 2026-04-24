import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import Spinner from '@/components/ui/Spinner';
import type { UserRole } from '@/types/user.types';
import AuthModal from '@/components/auth/AuthModal';

// ─── LAZY LOADING PAGES ───
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetailPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const BookingConfirmPage = lazy(() => import('@/pages/BookingConfirmPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const PaymentResultPage = lazy(() => import('@/pages/PaymentResultPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const MyBookingsPage = lazy(() => import('@/pages/MyBookingsPage'));
const BookingDetailPage = lazy(() => import('@/pages/BookingDetailPage'));

// ─── ADMIN PAGES ───
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminVehicles = lazy(() => import('@/pages/AdminVehicles'));
const AdminBookings = lazy(() => import('@/pages/AdminBookings'));
const AdminUsers = lazy(() => import('@/pages/AdminUsers'));
const AdminSettings = lazy(() => import('@/pages/AdminSettings'));

function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8f9fa]">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  const allRoles = ['CUSTOMER', 'ADMIN', 'STAFF'] as UserRole[];

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Cấu hình thông báo Toast toàn cục */}
        <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 4000 }} />
        
        {/* Modal Đăng nhập/Đăng ký dùng chung */}
        <AuthModal />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ─── PUBLIC ROUTES ─── */}
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.VEHICLE_DETAIL} element={<VehicleDetailPage />} />
            <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
            <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />

            {/* ─── BOOKING FLOW ─── */}
            <Route path={ROUTES.BOOKING} element={<BookingPage />} />
            <Route path={ROUTES.BOOKING_CONFIRM} element={<BookingConfirmPage />} />
            <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
            <Route path={ROUTES.PAYMENT_RESULT} element={<PaymentResultPage />} />

            {/* ─── USER PROFILE & DASHBOARD ─── */}
            <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path={ROUTES.MY_BOOKINGS} element={<ProtectedRoute allowedRoles={allRoles}><MyBookingsPage /></ProtectedRoute>} />
            <Route path={ROUTES.BOOKING_DETAIL} element={<ProtectedRoute allowedRoles={allRoles}><BookingDetailPage /></ProtectedRoute>} />

            {/* ─── ADMIN & STAFF ROUTES ─── */}
            <Route path={ROUTES.ADMIN} element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><AdminDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_VEHICLES} element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><AdminVehicles /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_BOOKINGS} element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><AdminBookings /></ProtectedRoute>} />
            
            {/* Route chi tiết đơn hàng cho Admin (Để Admin bấm icon con mắt không bị văng) */}
            <Route 
              path="/admin/bookings/:id" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><BookingDetailPage /></ProtectedRoute>} 
            />

            {/* ─── SUPER ADMIN ROUTES (Chỉ có ADMIN mới được vào) ─── */}
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettings /></ProtectedRoute>} />

            {/* ─── CATCH-ALL (Đường dẫn sai tự động về trang chủ) ─── */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}