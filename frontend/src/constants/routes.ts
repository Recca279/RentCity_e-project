export const ROUTES = {
  // Public
  HOME: '/',
  SEARCH: '/search',
  VEHICLE_DETAIL: '/vehicles/:id', // Trang chi tiết xe vẫn giữ :id vì link dạng /vehicles/1
  SERVICES: '/services',
  COMMUNITY: '/community',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Booking Flow (Đã bỏ /:id để dùng Query Parameters cho linh hoạt)
  BOOKING: '/booking',
  BOOKING_CONFIRM: '/booking/confirm',
  PAYMENT: '/payment',
  PAYMENT_RESULT: '/payment/result',

  // Customer Profile & My Bookings
  PROFILE: '/profile',
  MY_BOOKINGS: '/my-bookings',
  BOOKING_DETAIL: '/my-bookings/:id',

  // Admin Dashboard
  ADMIN: '/admin',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_BOOKINGS: '/admin/bookings',
} as const;