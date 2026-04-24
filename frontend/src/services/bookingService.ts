import api from './api';

export const bookingService = {
  // Lấy danh sách xe từ DB
  getVehicles: () => api.get('/vehicles'),
  
  // Lấy lịch sử đặt xe theo User ID
  getHistory: (userId: string) => api.get(`/bookings/user/${userId}`),

  // Gọi API thanh toán (PUT)
  pay: (bookingId: string) => api.put(`/bookings/${bookingId}/pay`),
};