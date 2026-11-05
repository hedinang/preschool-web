export const allNavGroups = [
  { title: 'TỔNG QUAN', items: [{ id: 'overview', label: 'Tổng quan', icon: 'grid' }] },
  { title: 'NHÀ TRƯỜNG', items: [
    { id: 'students', label: 'Học sinh', icon: 'users' },
    { id: 'teachers', label: 'Giáo viên', icon: 'graduation' },
    { id: 'parents', label: 'Phụ huynh', icon: 'family' },
    { id: 'users', label: 'Quản lý tài khoản', icon: 'users' },
    { id: 'classes', label: 'Lớp học', icon: 'book' },
    { id: 'schedule', label: 'Thời khóa biểu', icon: 'calendar' },
    { id: 'attendance', label: 'Điểm danh', icon: 'check' },
    { id: 'tuition', label: 'Học phí', icon: 'wallet' },
  ] },
  { title: 'KẾT NỐI', items: [{ id: 'messages', label: 'Thông báo', icon: 'bell' }] },
];

export const rolePages = {
  admin: ['overview', 'students', 'users', 'classes', 'schedule', 'attendance', 'tuition', 'messages'],
  teacher: ['overview', 'students', 'classes', 'schedule', 'attendance', 'messages'],
  parent: ['overview', 'students', 'schedule', 'tuition', 'messages'],
};
