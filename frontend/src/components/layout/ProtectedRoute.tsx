import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import Spinner from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();
  
  // CHIÊU CUỐI: Kiểm tra trực tiếp localStorage để cứu nguy cho isLoading bị kẹt
  const hasLocalUser = !!localStorage.getItem('user');

  // Chỉ hiện Spinner nếu THỰC SỰ đang load và KHÔNG có dữ liệu trong máy
  if (isLoading && !hasLocalUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check login: ưu tiên isLoggedIn của store hoặc check tạm qua localStorage
  if (!isLoggedIn && !hasLocalUser) {
    return <Navigate to={ROUTES.HOME} state={{ from: location, openAuth: true }} replace />;
  }

  // Đoạn check role giữ nguyên nhưng thêm check null cho user
  const currentUser = user || (hasLocalUser ? JSON.parse(localStorage.getItem('user')!) : null);

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') {
      return <Navigate to={ROUTES.ADMIN} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}