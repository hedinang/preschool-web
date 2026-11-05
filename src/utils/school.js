export const pendingAttendance = 'Chưa điểm danh';
export const attendanceColors = ['peach', 'lilac', 'mint', 'blue', 'yellow'];

export function getLocalDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export function mapStudent(student, attendance = {}) {
  const name = student.name || '';
  const initials = name.split(/\s+/).filter(Boolean);
  return {
    ...student,
    gender: student.gender || '',
    age: student.age || 0,
    parent: student.parent || 'Phụ huynh',
    phone: student.phone || 'Chưa cập nhật',
    status: attendance.status || student.status || pendingAttendance,
    avatar: student.avatar || (initials.length > 1
      ? `${initials[0][0]}${initials[initials.length - 1][0]}`
      : name.slice(0, 2)).toLocaleUpperCase('vi-VN'),
    color: student.color || attendanceColors[(student.name || '').length % attendanceColors.length],
  };
}

export function mapTeacher(teacher) {
  const parts = (teacher.name || '').split(/\s+/).filter(Boolean);
  return {
    ...teacher,
    phone: teacher.phone || 'Chưa cập nhật',
    email: teacher.email || 'Chưa cập nhật',
    experience: teacher.experience || 'Đang cập nhật',
    avatar: teacher.avatar || (parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : (teacher.name || '').slice(0, 2)).toLocaleUpperCase('vi-VN'),
    color: teacher.color || 'mint',
  };
}
