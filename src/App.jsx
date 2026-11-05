import React, {useEffect, useMemo, useState} from 'react';
import Table from 'antd/es/table';
import {apiRequest, getApiUrl} from './api';
import {SchoolDataProvider, usePageData} from './context/SchoolDataContext';
import {allNavGroups, rolePages} from './routers/navigation';
import {attendanceColors, getLocalDate, mapStudent, mapTeacher, pendingAttendance} from './utils/school';
import {ATTENDANCE, AUTH, STUDENT, TEACHER, TUITION} from './api/apiConstant';

const initialStudents = [
  { name: 'Nguyễn Minh Khôi', gender: 'Nam', age: 4, classroom: 'Mầm 1', parent: 'Chị Ngọc Anh', phone: '0912 345 678', status: 'Đã đến', avatar: 'MK', color: 'peach' },
  { name: 'Trần Bảo Ngọc', gender: 'Nữ', age: 3, classroom: 'Chồi 2', parent: 'Anh Tuấn Minh', phone: '0987 123 456', status: 'Đã đến', avatar: 'BN', color: 'lilac' },
  { name: 'Lê Gia Hân', gender: 'Nữ', age: 5, classroom: 'Lá 1', parent: 'Chị Thanh Hà', phone: '0903 456 789', status: 'Đã đến', avatar: 'GH', color: 'mint' },
  { name: 'Phạm Đức Anh', gender: 'Nam', age: 4, classroom: 'Mầm 2', parent: 'Anh Hoàng Nam', phone: '0934 567 890', status: 'Đã đến', avatar: 'ĐA', color: 'blue' },
  { name: 'Vũ Khánh Linh', gender: 'Nữ', age: 3, classroom: 'Chồi 1', parent: 'Chị Mỹ Linh', phone: '0978 234 567', status: 'Xin nghỉ', avatar: 'KL', color: 'yellow' },
  { name: 'Đỗ Nhật Nam', gender: 'Nam', age: 5, classroom: 'Lá 2', parent: 'Anh Nhật Quang', phone: '0918 765 432', status: 'Đã đến', avatar: 'NN', color: 'pink' },
];

const additionalStudentNames = [
  'Nguyễn Minh Châu', 'Trần Đức Minh', 'Lê Bảo Anh', 'Phạm Khánh An', 'Vũ Minh Nhật', 'Đỗ Ngọc Mai',
  'Nguyễn Gia Bảo', 'Trần Hà My', 'Lê Hoàng Long', 'Phạm Ngọc Diệp', 'Vũ Tuệ Nhi', 'Đỗ Quang Huy',
  'Nguyễn Hải Đăng', 'Trần Minh Khang', 'Lê Phương Thảo', 'Phạm Thiên An', 'Vũ Anh Thư', 'Đỗ Gia Linh',
  'Nguyễn Quốc Bảo', 'Trần Ánh Dương', 'Lê Nhật Minh', 'Phạm Quỳnh Chi', 'Vũ Đức Mạnh', 'Đỗ Minh Tâm',
  'Nguyễn Khánh Vy', 'Trần Gia Huy', 'Lê Thiên Phúc', 'Phạm Bảo Trâm', 'Vũ Minh Quân', 'Đỗ Phương Nhi',
  'Nguyễn Tuấn Kiệt', 'Trần Ngọc Hà', 'Lê Gia Minh', 'Phạm Hoàng Yến', 'Vũ Bảo Châu', 'Đỗ Anh Khoa',
  'Nguyễn Hà Linh', 'Trần Nhật Hào', 'Lê Minh Thư', 'Phạm Gia Hân', 'Vũ Quốc Khánh', 'Đỗ Thanh Tâm',
];

const extraStudents = additionalStudentNames.map((name, index) => {
  const parts = name.split(/\s+/);
  const initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toLocaleUpperCase('vi-VN');
  const rooms = ['Mầm 1', 'Mầm 2', 'Chồi 1', 'Chồi 2', 'Lá 1', 'Lá 2'];
  const parentNames = ['Chị Thu Hà', 'Anh Minh Quân', 'Chị Phương Linh', 'Anh Hoàng Long', 'Chị Bảo Trân', 'Anh Quốc Bảo'];
  const phone = `09${String(10 + (index % 90)).padStart(2, '0')} ${String(120 + index).padStart(3, '0')} ${String(400 + index).slice(-3)}`;
  return {
    name,
    gender: index % 2 === 0 ? 'Nam' : 'Nữ',
    age: 3 + (index % 3),
    classroom: rooms[index % rooms.length],
    parent: `${parentNames[index % parentNames.length]} ${Math.floor(index / parentNames.length) + 1}`,
    phone,
    status: index % 7 === 0 ? 'Xin nghỉ' : 'Đã đến',
    avatar: initials,
    color: ['peach', 'lilac', 'mint', 'blue', 'yellow', 'pink'][index % 6],
  };
});

initialStudents.push(...extraStudents);

const teachers = [
  { name: 'Mai Phương', title: 'Giáo viên chủ nhiệm', classroom: 'Mầm 1', phone: '0901 234 567', email: 'maiphuong@annhien.vn', experience: '6 năm', avatar: 'MP', color: 'mint' },
  { name: 'Thu Hằng', title: 'Giáo viên chủ nhiệm', classroom: 'Mầm 2', phone: '0902 345 678', email: 'thuhang@annhien.vn', experience: '5 năm', avatar: 'TH', color: 'peach' },
  { name: 'Bảo Trân', title: 'Giáo viên chủ nhiệm', classroom: 'Chồi 1', phone: '0903 456 789', email: 'baotran@annhien.vn', experience: '8 năm', avatar: 'BT', color: 'lilac' },
  { name: 'Minh Thư', title: 'Giáo viên chủ nhiệm', classroom: 'Chồi 2', phone: '0904 567 890', email: 'minhthu@annhien.vn', experience: '4 năm', avatar: 'MT', color: 'pink' },
  { name: 'Ngọc Lan', title: 'Giáo viên chủ nhiệm', classroom: 'Lá 1', phone: '0905 678 901', email: 'ngoclan@annhien.vn', experience: '7 năm', avatar: 'NL', color: 'yellow' },
  { name: 'Thanh Vân', title: 'Giáo viên chủ nhiệm', classroom: 'Lá 2', phone: '0906 789 012', email: 'thanhvan@annhien.vn', experience: '3 năm', avatar: 'TV', color: 'blue' },
];

const extraTeacherNames = ['Hồng Nhung', 'Thảo Vy', 'Kim Ngân', 'Hoài An', 'Bích Ngọc', 'Phương Uyên', 'Hải Yến', 'Tuyết Mai', 'Diệu Linh', 'Quỳnh Anh', 'Khánh Hòa', 'Thanh Tâm'];
teachers.push(...extraTeacherNames.map((name, index) => {
  const parts = name.split(/\s+/);
  const avatar = `${parts[0][0]}${parts[parts.length - 1][0]}`.toLocaleUpperCase('vi-VN');
  const classroom = ['Mầm 1', 'Mầm 2', 'Chồi 1', 'Chồi 2', 'Lá 1', 'Lá 2'][index % 6];
  return {
    name,
    title: index % 3 === 0 ? 'Giáo viên bộ môn' : 'Trợ giảng',
    classroom,
    phone: `090${index + 7} ${String(123 + index).padStart(3, '0')} ${String(567 + index).slice(-3)}`,
    email: `${name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '')}@annhien.vn`,
    experience: `${2 + (index % 8)} năm`,
    avatar,
    color: ['mint', 'peach', 'lilac', 'pink', 'yellow', 'blue'][index % 6],
  };
}));

const demoAccounts = {
  admin: { role: 'admin', name: 'Lan Anh', title: 'Quản trị viên', email: 'admin@annhien.vn', password: '123456', avatar: 'LA', color: 'peach' },
  teacher: { role: 'teacher', name: 'Cô Mai Phương', title: 'Giáo viên · Mầm 1', email: 'maiphuong@annhien.vn', password: '123456', avatar: 'MP', color: 'mint', classroom: 'Mầm 1' },
  parent: { role: 'parent', name: 'Chị Ngọc Anh', title: 'Phụ huynh', email: 'ngocanh@annhien.vn', password: '123456', avatar: 'NA', color: 'lilac', child: 'Nguyễn Minh Khôi' },
  student: { role: 'student', name: 'Nguyễn Minh Khôi', title: 'Học sinh · Mầm 1', email: 'minhkhoi@annhien.vn', password: '123456', avatar: 'MK', color: 'peach', classroom: 'Mầm 1' },
};

const scheduleDays = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];
const scheduleTimes = ['07:30', '08:00', '09:00', '09:45', '10:15', '11:00', '14:00', '15:00'];
const weeklySchedule = [
  [{ title: 'Đón bé & thể dục sáng', kind: 'care' }, { title: 'Làm quen chữ cái', kind: 'learn' }, { title: 'Vận động ngoài trời', kind: 'play' }, { title: 'Ăn nhẹ', kind: 'care' }, { title: 'Khám phá thế giới', kind: 'learn' }, { title: 'Ăn trưa & ngủ trưa', kind: 'care' }, { title: 'Tạo hình: chiếc lá', kind: 'art' }, { title: 'Chơi tự do, trả bé', kind: 'play' }],
  [{ title: 'Đón bé & thể dục sáng', kind: 'care' }, { title: 'Nhận biết màu sắc', kind: 'learn' }, { title: 'Âm nhạc vui nhộn', kind: 'art' }, { title: 'Ăn nhẹ', kind: 'care' }, { title: 'Kể chuyện: Thỏ con', kind: 'learn' }, { title: 'Ăn trưa & ngủ trưa', kind: 'care' }, { title: 'Trò chơi vận động', kind: 'play' }, { title: 'Chơi tự do, trả bé', kind: 'play' }],
  [{ title: 'Đón bé & thể dục sáng', kind: 'care' }, { title: 'Bé tập đếm số', kind: 'learn' }, { title: 'Góc chơi khám phá', kind: 'play' }, { title: 'Ăn nhẹ', kind: 'care' }, { title: 'Làm quen tiếng Anh', kind: 'learn' }, { title: 'Ăn trưa & ngủ trưa', kind: 'care' }, { title: 'Vẽ tranh cùng bé', kind: 'art' }, { title: 'Chơi tự do, trả bé', kind: 'play' }],
  [{ title: 'Đón bé & thể dục sáng', kind: 'care' }, { title: 'Thơ: Bé đến lớp', kind: 'learn' }, { title: 'Vườn rau của bé', kind: 'play' }, { title: 'Ăn nhẹ', kind: 'care' }, { title: 'Khám phá khoa học', kind: 'learn' }, { title: 'Ăn trưa & ngủ trưa', kind: 'care' }, { title: 'Xé dán giấy màu', kind: 'art' }, { title: 'Chơi tự do, trả bé', kind: 'play' }],
  [{ title: 'Đón bé & thể dục sáng', kind: 'care' }, { title: 'Ôn tập tuần này', kind: 'learn' }, { title: 'Trò chơi cùng bạn', kind: 'play' }, { title: 'Ăn nhẹ', kind: 'care' }, { title: 'Bé kể chuyện tuần qua', kind: 'learn' }, { title: 'Ăn trưa & ngủ trưa', kind: 'care' }, { title: 'Vũ điệu cuối tuần', kind: 'art' }, { title: 'Chơi tự do, trả bé', kind: 'play' }],
];

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function formatDisplayDate(value) {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN');
}

function normalizeScheduleDay(value) {
  const day = (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const days = ['thu hai', 'thu ba', 'thu tu', 'thu nam', 'thu sau'];
  const englishDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const vietnameseIndex = days.findIndex((name) => day.includes(name));
  if (vietnameseIndex >= 0) return vietnameseIndex;
  return englishDays.findIndex((name) => day.toLowerCase().includes(name));
}

function getRoomCapacity(room) {
  return Number(room.capacity) || Number(room.count?.split('/')[1]?.match(/\d+/)?.[0]) || 0;
}

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
  wallet: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M16 15h.01M7 5V3h10v2" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  down: <path d="m7 10 5 5 5-5" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  graduation: <><path d="m2 10 10-5 10 5-10 5-10-5Z" /><path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v6" /></>,
  family: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M17 11a3 3 0 1 0-1-5.8M18 14a5 5 0 0 1 3 5v1" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  child: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2M9 8h.01M15 8h.01M10 11h4" /></>,
};

function Icon({ name, size = 20, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

function Avatar({ initials, color = 'mint', size = '' }) {
  return <span className={`avatar avatar-${color} ${size ? `avatar-${size}` : ''}`}>{initials}</span>;
}

function ServerPagination({ pageNumber = 1, onPageChange, itemCount = 0, hasNext = true }) {
  if (!onPageChange) return null;
  return <div className="server-pagination">
    <button type="button" disabled={pageNumber <= 1} onClick={() => onPageChange(pageNumber - 1)}>Trang trước</button>
    <span>Trang {pageNumber} · {itemCount} bản ghi</span>
    <button type="button" disabled={!hasNext || itemCount < 10} onClick={() => onPageChange(pageNumber + 1)}>Trang sau</button>
  </div>;
}

function PagedTable({ columns, dataSource, rowKey, compact = false, pageNumber, onPageChange, hasNext }) {
  return <>
    <Table
      className={`preschool-table ${compact ? 'preschool-table-compact' : ''}`}
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      size="small"
      scroll={{ x: 'max-content' }}
      locale={{ emptyText: 'Không có dữ liệu phù hợp.' }}
      pagination={compact || onPageChange ? false : {
        defaultPageSize: 10,
        pageSizeOptions: ['10'],
        showSizeChanger: true,
        showTotal: (total, range) => `Hiển thị ${range[0]}–${range[1]} trong ${total} mục`,
        locale: { items_per_page: ' / trang', jump_to: 'Đến', jump_to_confirm: 'Xác nhận', page: 'Trang' },
      }}
    />
    {!compact && <ServerPagination pageNumber={pageNumber} onPageChange={onPageChange} itemCount={dataSource.length} hasNext={hasNext} />}
  </>;
}

function App() {
  return <SchoolDataProvider><PreschoolApp /></SchoolDataProvider>;
}

function PreschoolApp() {
  const [page, setPage] = useState('overview');
  const [students, setStudents] = useState(initialStudents);
  const [teacherList, setTeacherList] = useState(teachers);
  const [classrooms, setClassrooms] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [scheduleActivities, setScheduleActivities] = useState(null);
  const [tuitionInvoices, setTuitionInvoices] = useState(null);
  const [schoolMessages, setSchoolMessages] = useState(null);
  const [user, setUser] = useState(null);
  const [apiToken, setApiToken] = useState('');
  const [apiError, setApiError] = useState('');
  const [loginRole, setLoginRole] = useState('admin');
  const [loginEmail, setLoginEmail] = useState(demoAccounts.admin.email);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [listPage, setListPage] = useState(1);
  const [listCursors, setListCursors] = useState({});
  const [listHasNext, setListHasNext] = useState({});
  const [scheduleClassroom, setScheduleClassroom] = useState('Mầm 1');
  const listSequence = listCursors[`${page}:${listPage}`] ?? null;
  const listFilter = page === 'schedule' ? scheduleClassroom : '';
  const canLoadNextPage = listHasNext[`${page}:${listPage}`] !== false;
  const {data: pageData, dataPageKey, loading: pageLoading, error: pageError, invalidate} = usePageData(
    page,
    apiToken,
    user,
    listSequence,
    listFilter,
  );

  useEffect(() => {
    if (pageData.students) {
      const attendanceByStudent = Object.fromEntries(
        (pageData.attendanceRecords || []).map((record) => [record.studentId, record]),
      );
      setStudents(pageData.students.map((student) =>
        mapStudent(student, attendanceByStudent[student.id]),
      ));
    }
    if (pageData.teacherList) setTeacherList(pageData.teacherList.map(mapTeacher));
    if ('classrooms' in pageData) setClassrooms(pageData.classrooms);
    if (pageData.dashboardSummary) setDashboardSummary(pageData.dashboardSummary);
    if (pageData.attendanceRecords) setAttendanceRecords(pageData.attendanceRecords);
    if (pageData.scheduleActivities) setScheduleActivities(pageData.scheduleActivities);
    if (pageData.tuitionInvoices) setTuitionInvoices(pageData.tuitionInvoices);
    if (pageData.schoolMessages) setSchoolMessages(pageData.schoolMessages);
  }, [pageData]);

  useEffect(() => {
    const listKey = {
      students: 'students',
      teachers: 'teacherList',
      parents: 'parents',
      attendance: 'students',
      tuition: 'tuitionInvoices',
      messages: 'schoolMessages',
      schedule: 'scheduleActivities',
    }[page];
    const identity = user ? `${apiToken}:${user.id || user.email || user.role}` : '';
    const expectedDataKey = `${identity}:${page}:${listFilter}:${listSequence ?? 'first'}`;
    if (pageLoading || dataPageKey !== expectedDataKey || listPage <= 1 || !listKey || !Array.isArray(pageData[listKey]) || pageData[listKey].length > 0) return;
    setListHasNext((current) => ({ ...current, [`${page}:${listPage - 1}`]: false }));
    setListCursors((current) => {
      const next = { ...current };
      delete next[`${page}:${listPage}`];
      return next;
    });
    setListPage((current) => current === listPage ? listPage - 1 : current);
  }, [page, pageData, dataPageKey, pageLoading, listPage, listFilter, listSequence, apiToken, user]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };
  const allowedPages = user ? rolePages[user.role] : [];
  const navGroups = allNavGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => allowedPages.includes(item.id)),
  })).filter((group) => group.items.length > 0);
  const visibleStudents = user?.role === 'parent'
    ? students.filter((student) => (user.studentId && student.id === user.studentId) || student.name === user.child)
    : user?.role === 'student'
      ? students.filter((student) => (user.studentId && student.id === user.studentId) || student.name === user.name)
      : user?.role === 'teacher'
        ? students.filter((student) => student.classroom === user.classroom)
        : students;
  const filteredStudents = useMemo(() => visibleStudents.filter((student) =>
    `${student.name} ${student.classroom} ${student.parent}`.toLowerCase().includes(query.toLowerCase()),
  ), [visibleStudents, query]);
  const presentCount = visibleStudents.filter((student) => student.status === 'Đã đến').length;
  const currentLabel = navGroups.flatMap((group) => group.items).find((item) => item.id === page)?.label ?? 'Tổng quan';

  function selectRole(role) {
    setLoginRole(role);
    setLoginEmail(demoAccounts[role].email);
    setLoginError('');
  }

  async function signIn(event) {
    event.preventDefault();
    setLoginError('');
    try {
      const response = await apiRequest(`${AUTH}/login`, {
        method: 'POST',
        body: { username: loginEmail.trim(), password: loginPassword },
      });
      if (!response?.token) throw new Error('Phản hồi đăng nhập không có token');
      const account = demoAccounts[loginRole];
      const { password: _demoPassword, ...demoProfile } = account;
      setApiToken(response.token);
      setApiError('');
      setUser({
        ...demoProfile,
        ...response,
        role: response.portalRole || account.role,
        name: response.name || response.username || loginEmail,
        email: response.email || response.username || loginEmail,
        avatar: response.avatar || account.avatar,
        color: response.color || account.color,
      });
      setScheduleClassroom(response.classroom || account.classroom || 'Mầm 1');
      setListPage(1);
      setListCursors({});
      setListHasNext({});
      setPage('overview');
      setLoginPassword('');
    } catch (error) {
      setLoginError(error.message || 'Không thể đăng nhập vào preschool-api.');
    }
  }

  function signOut() {
    setApiToken('');
    setUser(null);
    setPage('overview');
    setListPage(1);
    setListCursors({});
    setListHasNext({});
    setQuery('');
    setLoginPassword('');
    setLoginError('');
  }

  async function addStudent(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = form.get('name').toString().trim();
    if (!name) return;
    const parts = name.split(/\s+/);
    const student = mapStudent({
      name,
      gender: form.get('gender').toString(),
      age: Number(form.get('age')),
      classroom: form.get('classroom').toString(),
      parent: form.get('parent').toString(),
      phone: form.get('phone').toString(),
      avatar: parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2),
      color: attendanceColors[students.length % attendanceColors.length],
    });
    try {
      const created = await apiRequest(STUDENT, {
        token: apiToken,
        method: 'POST',
        body: student,
      });
      setStudents((current) => [mapStudent(created), ...current]);
      invalidate('students', 'parents', 'classes', 'overview', 'attendance', 'tuition');
      setModal('');
      formElement.reset();
      showToast('Đã thêm học sinh mới');
      setApiError('');
    } catch (error) {
      setApiError(`Không thể thêm học sinh: ${error.message}`);
    }
  }

  async function addTeacher(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const teacher = {
      name: form.get('name').toString().trim(),
      title: form.get('title').toString(),
      classroom: form.get('classroom').toString(),
      phone: form.get('phone').toString(),
      email: form.get('email').toString(),
      experience: 'Mới',
      color: attendanceColors[teacherList.length % attendanceColors.length],
    };
    if (!teacher.name) return;
    try {
      const created = await apiRequest(TEACHER, {
        token: apiToken,
        method: 'POST',
        body: teacher,
      });
      setTeacherList((current) => [mapTeacher(created), ...current]);
      invalidate('teachers', 'classes');
      setModal('');
      showToast('Đã thêm giáo viên mới');
      setApiError('');
    } catch (error) {
      setApiError(`Không thể thêm giáo viên: ${error.message}`);
    }
  }

  async function saveAttendance(statuses) {
    const records = visibleStudents.map((student) => {
      const status = statuses[student.id || student.name] || student.status || pendingAttendance;
      const attendance = attendanceRecords.find((record) => record.studentId === student.id);
      return {
        studentId: student.id,
        status,
        checkInTime: status === 'Đã đến'
          ? attendance?.checkInTime || new Date().toTimeString().slice(0, 5)
          : null,
      };
    }).filter((record) => record.studentId);
    try {
      const saved = await apiRequest(ATTENDANCE, {
        token: apiToken,
        method: 'PUT',
        body: { date: getLocalDate(), records },
      });
      setAttendanceRecords(saved);
      invalidate('attendance', 'students', 'overview');
      const attendanceByStudent = Object.fromEntries(saved.map((record) => [record.studentId, record]));
      setStudents((current) => current.map((student) => mapStudent(student, attendanceByStudent[student.id])));
      setApiError('');
      showToast('Đã lưu điểm danh hôm nay');
    } catch (error) {
      setApiError(`Không thể lưu điểm danh: ${error.message}`);
    }
  }

  async function remindTuition() {
    try {
      const month = getLocalDate().slice(0, 7);
      const updated = await apiRequest(`${TUITION}/remind?month=${month}`, {
        token: apiToken,
        method: 'POST',
      });
      setTuitionInvoices(updated);
      invalidate('tuition');
      setApiError('');
      showToast('Đã gửi nhắc học phí');
    } catch (error) {
      setApiError(`Không thể gửi nhắc học phí: ${error.message}`);
    }
  }

  function changePage(nextPage) {
    if (!allowedPages.includes(nextPage)) return;
    setPage(nextPage);
    setListPage(1);
    setListCursors({});
    setListHasNext({});
    setQuery('');
    setSidebarOpen(false);
    setApiError('');
  }

  function changeListPage(nextPage) {
    if (nextPage < 1) return;
    if (nextPage > listPage && listHasNext[`${page}:${listPage}`] === false) return;
    if (nextPage > listPage) {
      const listKey = {
        students: 'students',
        teachers: 'teacherList',
        parents: 'parents',
        attendance: 'students',
        tuition: 'tuitionInvoices',
        messages: 'schoolMessages',
        schedule: 'scheduleActivities',
      }[page];
      const currentItems = pageData[listKey] || [];
      if (currentItems.length < 10) return;
      const nextSequence = currentItems[currentItems.length - 1]?.sequence;
      if (nextSequence == null) return;
      setListCursors((current) => ({
        ...current,
        [`${page}:${nextPage}`]: nextSequence,
      }));
    }
    setListPage(nextPage);
  }

  function changeScheduleClassroom(classroom) {
    setScheduleClassroom(classroom);
    setListPage(1);
    setListCursors({});
    setListHasNext({});
  }

  if (!user) {
    return <LoginPage
      role={loginRole}
      email={loginEmail}
      password={loginPassword}
      error={loginError}
      onRoleChange={selectRole}
      onEmailChange={setLoginEmail}
      onPasswordChange={setLoginPassword}
      onSubmit={signIn}
    />;
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-backdrop" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><span>an</span><i>✿</i></div>
          <div><strong>an nhiên</strong><small>mầm non hạnh phúc</small></div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu"><Icon name="close" /></button>
        </div>
        <div className="school-switcher">
          <div className="school-avatar">AN</div>
          <div className="school-name"><strong>Mầm non An Nhiên</strong><span>Cơ sở Nguyễn Văn Linh</span></div>
          <Icon name="down" size={16} />
        </div>
        <nav className="main-nav" aria-label="Điều hướng chính">
          {navGroups.map((group) => <div className="nav-group" key={group.title}>
            <p className="nav-heading">{group.title}</p>
            {group.items.map((item) => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => changePage(item.id)}>
              <Icon name={item.icon} size={19} /><span>{item.label}</span>
              {item.badge && <small className="nav-badge">{item.badge}</small>}
              {item.dot && <i className="nav-dot" />}
            </button>)}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-art">☁️</div>
            <strong>Cần hỗ trợ?</strong>
            <span>Chúng mình luôn sẵn sàng giúp bạn.</span>
            <button onClick={() => showToast('Đội ngũ hỗ trợ sẽ liên hệ với bạn sớm nhất!')}>Liên hệ hỗ trợ <Icon name="chevron" size={14} /></button>
          </div>
          <button className="profile" onClick={signOut} title="Đăng xuất">
            <Avatar initials={user.avatar} color={user.color} />
            <span><strong>{user.name}</strong><small>{user.title}</small></span>
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Mở menu"><Icon name="menu" /></button>
          <div className="breadcrumb"><span>Trang chủ</span><Icon name="chevron" size={14} /><strong>{currentLabel}</strong></div>
          <div className="topbar-actions">
            <div className="date-pill"><Icon name="calendar" size={16} /><span>Thứ Tư, 04 tháng 11, 2026</span></div>
            <div className="notification-wrap">
              <button className={`icon-button ${noticeOpen ? 'selected' : ''}`} aria-label="Thông báo mới" onClick={() => setNoticeOpen(!noticeOpen)}><Icon name="bell" size={19} /><i className="notification-dot" /></button>
              {noticeOpen && <div className="notification-popover"><strong>Thông báo mới</strong><p><span className="notice-pip" /> 3 phụ huynh chưa xác nhận học phí tháng này.</p><p><span className="notice-pip peach-pip" /> Lớp Mầm 1 có hoạt động ngoài trời lúc 9:00.</p><button onClick={() => { changePage('messages'); setNoticeOpen(false); }}>Xem tất cả thông báo</button></div>}
            </div>
            <button className="top-profile" onClick={signOut} title="Đăng xuất"><Avatar initials={user.avatar} color={user.color} /><span>{user.name}</span><Icon name="logout" size={15} /></button>
          </div>
        </header>

        <div className="page-content">
          {(apiError || pageError) && <p className="login-error api-error" role="alert">{apiError || pageError}</p>}
          {pageLoading && <p className="page-loading" role="status">Đang tải dữ liệu mục này...</p>}
          {page === 'overview' && (user.role === 'admin'
            ? <Dashboard user={user} students={students} presentCount={presentCount} summary={dashboardSummary} onNavigate={changePage} onAdd={() => setModal('student')} onToast={showToast} />
            : <RoleOverview user={user} students={visibleStudents} onNavigate={changePage} />)}
          {page === 'students' && <StudentsPage students={user.role === 'admin' ? filteredStudents : visibleStudents} query={query} setQuery={setQuery} onAdd={() => setModal('student')} canAdd={user.role === 'admin'} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {page === 'teachers' && user.role === 'admin' && <TeachersPage teachers={teacherList} query={query} setQuery={setQuery} onAdd={() => setModal('teacher')} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {page === 'parents' && user.role === 'admin' && <ParentsPage parents={pageData.parents || []} query={query} setQuery={setQuery} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {page === 'classes' && <ClassesPage onToast={showToast} user={user} apiClasses={classrooms} students={students} teacherData={teacherList} />}
          {page === 'schedule' && <SchedulePage user={user} activities={scheduleActivities} classrooms={classrooms} classroom={scheduleClassroom} onClassroomChange={changeScheduleClassroom} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {page === 'attendance' && <AttendancePage students={visibleStudents} records={attendanceRecords} onSave={saveAttendance} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {page === 'tuition' && <TuitionPage onToast={showToast} students={visibleStudents} user={user} apiInvoices={tuitionInvoices} onRemind={remindTuition} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {page === 'messages' && <MessagesPage onToast={showToast} apiMessages={schoolMessages} pageNumber={listPage} onPageChange={changeListPage} hasNext={canLoadNextPage} />}
          {!allowedPages.includes(page) && <div className="panel access-message">Bạn không có quyền truy cập mục này.</div>}
        </div>
      </main>
      {modal === 'student' && <StudentModal onClose={() => setModal('')} onSubmit={addStudent} />}
      {modal === 'teacher' && <TeacherModal onClose={() => setModal('')} onSubmit={addTeacher} />}
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={15} /></span>{toast}</div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="heading-description">{description}</p></div>{action}</div>;
}

function LoginPage({ role, email, password, error, onRoleChange, onEmailChange, onPasswordChange, onSubmit }) {
  const roles = [
    { id: 'admin', label: 'Quản trị viên', icon: 'grid', description: 'Quản lý toàn bộ nhà trường' },
    { id: 'teacher', label: 'Giáo viên', icon: 'graduation', description: 'Lớp học & điểm danh' },
    { id: 'parent', label: 'Phụ huynh', icon: 'family', description: 'Theo dõi hồ sơ của bé' },
    { id: 'student', label: 'Học sinh', icon: 'child', description: 'Thời khóa biểu của bé' },
  ];
  return <main className="login-page">
    <section className="login-card">
      <div className="login-brand"><div className="brand-mark"><span>an</span><i>✿</i></div><div><strong>an nhiên</strong><small>mầm non hạnh phúc</small></div></div>
      <div className="login-heading"><p className="eyebrow">CHÀO MỪNG BẠN ĐẾN VỚI AN NHIÊN</p><h1>Ngôi nhà nhỏ của chúng ta <span>♡</span></h1><p>Đăng nhập để cùng chăm sóc hành trình lớn khôn của bé.</p></div>
      <div className="role-picker" aria-label="Chọn vai trò đăng nhập">{roles.map((item) => <button type="button" className={`role-option ${role === item.id ? 'role-selected' : ''}`} key={item.id} onClick={() => onRoleChange(item.id)}><Icon name={item.icon} size={18} /><span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}</div>
      <form className="login-form" onSubmit={onSubmit}>
        <label className="form-field">Email đăng nhập<input type="email" autoComplete="username" value={email} onChange={(event) => onEmailChange(event.target.value)} required /></label>
        <label className="form-field">Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={(event) => onPasswordChange(event.target.value)} required placeholder="Nhập mật khẩu demo" /></label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="primary-button login-submit" type="submit">Đăng nhập <Icon name="arrow" size={16} /></button>
      </form>
      <div className="demo-hint"><strong>Tài khoản gợi ý</strong><span>{demoAccounts[role].email} <i>·</i> mật khẩu <b>123456</b></span></div>
      <p className="login-disclaimer">Đăng nhập dùng tài khoản đã tạo trong preschool-api. API: {getApiUrl()}.</p>
    </section>
    <aside className="login-art"><span className="login-art-sun" /><span className="login-art-cloud login-cloud-one" /><span className="login-art-cloud login-cloud-two" /><span className="login-art-hill login-hill-back" /><span className="login-art-hill login-hill-front" /><div className="login-art-copy"><span>AN NHIÊN · 2026</span><h2>Mỗi ngày đến trường<br />là một ngày vui.</h2><p>Yêu thương, khám phá, lớn lên cùng nhau.</p></div><span className="login-flower login-flower-one">✿</span><span className="login-flower login-flower-two">✿</span><div className="login-kid login-kid-one"><span /><i /><b /></div><div className="login-kid login-kid-two"><span /><i /><b /></div></aside>
  </main>;
}

function RoleOverview({ user, students, onNavigate }) {
  const isParent = user.role === 'parent';
  const isStudent = user.role === 'student';
  const isTeacher = user.role === 'teacher';
  const child = students[0];
  const heading = isTeacher ? `Chào cô ${user.name.replace('Cô ', '')} ♡` : isParent ? `Chào ${user.name} ♡` : `Chào ${user.name} ♡`;
  return <>
    <PageHeading eyebrow={isTeacher ? 'GÓC GIÁO VIÊN' : isParent ? 'GÓC GIA ĐÌNH' : 'GÓC CỦA BÉ'} title={heading} description={isTeacher ? `Chúc cô và các bé lớp ${user.classroom} có một ngày thật vui.` : isParent ? 'Cùng dõi theo từng khoảnh khắc đáng yêu của bé tại trường.' : 'Chúc bé một ngày học tập và vui chơi thật nhiều niềm vui!'} />
    <section className="welcome-banner role-welcome"><div className="welcome-copy"><span className="banner-tag"><Icon name="sun" size={14} /> AN NHIÊN GỬI LỜI CHÀO</span><h2>{isTeacher ? 'Cảm ơn cô đã gieo<br />những hạt mầm yêu thương' : isParent ? 'Bé vui đến lớp,<br />ba mẹ an tâm mỗi ngày' : 'Hôm nay bé sẽ có<br />thật nhiều điều thú vị'}</h2><p>{isTeacher ? `Lớp ${user.classroom} đang chờ cô cùng khám phá.` : 'Mỗi ngày là một hành trình lớn lên thật dịu dàng.'}</p><button onClick={() => onNavigate(isTeacher ? 'attendance' : 'schedule')}>{isTeacher ? 'Điểm danh lớp học' : 'Xem thời khóa biểu'} <Icon name="arrow" size={15} /></button></div><div className="banner-illustration" aria-hidden="true"><div className="sun-disc" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="flower flower-one">✿</div><div className="child-illustration"><div className="child-hair" /><div className="child-face"><i /><i /><b /></div><div className="child-body" /></div><div className="child-illustration child-second"><div className="child-hair" /><div className="child-face"><i /><i /><b /></div><div className="child-body" /></div></div></section>
    <div className="portal-stats">
      <div className="portal-stat"><span className="quick-icon quick-mint"><Icon name={isTeacher ? 'users' : 'child'} /></span><span><small>{isTeacher ? 'Lớp phụ trách' : 'Học sinh'}</small><strong>{isTeacher ? user.classroom : child?.name ?? user.name}</strong></span></div>
      <div className="portal-stat"><span className="quick-icon quick-peach"><Icon name="calendar" /></span><span><small>{isTeacher ? 'Sĩ số lớp' : 'Lớp học'}</small><strong>{isTeacher ? `${students.length} bé` : child?.classroom ?? user.classroom}</strong></span></div>
      <div className="portal-stat"><span className="quick-icon quick-lilac"><Icon name="clock" /></span><span><small>Hôm nay</small><strong>{isTeacher ? `${students.filter((item) => item.status === 'Đã đến').length}/${students.length} bé có mặt` : '7 hoạt động đáng yêu'}</strong></span></div>
    </div>
    {isTeacher ? <section className="panel portal-panel"><div className="panel-heading"><div><h3>Danh sách lớp {user.classroom}</h3><p>Học sinh và tình hình đến lớp hôm nay</p></div><button className="text-button" onClick={() => onNavigate('students')}>Xem danh sách <Icon name="chevron" size={15} /></button></div><StudentTable students={students} compact /></section>
      : <section className="portal-child-grid"><article className="panel child-profile-card"><p className="eyebrow">{isStudent ? 'HỒ SƠ CỦA BÉ' : 'BÉ ĐANG THEO HỌC'}</p><div className="child-profile-main"><Avatar initials={child?.avatar ?? user.avatar} color={child?.color ?? user.color} size="md" /><div><h3>{child?.name ?? user.name}</h3><span>{child ? `${child.gender} · ${child.age} tuổi · Lớp ${child.classroom}` : user.title}</span></div></div><div className="child-info-lines"><span>Giáo viên chủ nhiệm <strong>{teachers.find((teacher) => teacher.classroom === child?.classroom)?.name ?? 'Đang cập nhật'}</strong></span><span>Tình hình hôm nay <strong className="child-present">{child?.status ?? 'Chưa điểm danh'}</strong></span><span>Đưa đón <strong>07:30 – 16:30</strong></span></div><button className="class-view" onClick={() => onNavigate('schedule')}>Xem thời khóa biểu của bé <Icon name="arrow" size={14} /></button></article><article className="panel portal-note"><span className="quick-icon quick-peach"><Icon name="heart" /></span><h3>{isParent ? 'Ba mẹ cùng đồng hành' : 'Bé ơi, sẵn sàng chưa?'}</h3><p>{isParent ? 'Ba mẹ có thể xem lịch học và các khoản học phí của bé từ menu bên trái.' : 'Hôm nay có nhiều hoạt động hay đang chờ bé. Cùng khám phá thời khóa biểu nhé!'}</p><button className="text-button" onClick={() => onNavigate(isParent ? 'tuition' : 'schedule')}>{isParent ? 'Xem học phí' : 'Xem lịch của bé'} <Icon name="chevron" size={14} /></button></article></section>}
    <div className="page-footer"><span>Thông tin được cung cấp bởi Trường Mầm non An Nhiên</span><span>Dữ liệu demo · Năm học 2026–2027</span></div>
  </>;
}

function TeachersPage({ teachers: teacherRows, query, setQuery, onAdd, pageNumber, onPageChange, hasNext }) {
  const filtered = teacherRows.filter((teacher) => `${teacher.name} ${teacher.classroom} ${teacher.email}`.toLowerCase().includes(query.toLowerCase()));
  const columns = [
    { title: 'GIÁO VIÊN', dataIndex: 'name', key: 'name', render: (_, teacher) => <div className="student-cell"><Avatar initials={teacher.avatar} color={teacher.color} /><span><strong>Cô {teacher.name}</strong><small>{teacher.email}</small></span></div> },
    { title: 'VAI TRÒ', dataIndex: 'title', key: 'title' },
    { title: 'LỚP CHỦ NHIỆM', dataIndex: 'classroom', key: 'classroom', render: (classroom) => <span className="class-tag">{classroom}</span> },
    { title: 'KINH NGHIỆM', dataIndex: 'experience', key: 'experience' },
    { title: 'LIÊN HỆ', dataIndex: 'phone', key: 'phone' },
  ];
  return <>
    <PageHeading eyebrow="ĐỘI NGŨ NHÀ TRƯỜNG" title="Giáo viên" description="Quản lý thông tin giáo viên và lớp chủ nhiệm tại An Nhiên." action={<button className="primary-button" onClick={onAdd}><Icon name="plus" size={18} /> Thêm giáo viên</button>} />
    <div className="class-summary teacher-summary"><div><span>Đội ngũ giáo viên</span><strong>{teacherRows.length} <small>cô giáo</small></strong></div><div><span>Lớp đang phụ trách</span><strong>{new Set(teacherRows.map((teacher) => teacher.classroom)).size} <small>lớp</small></strong></div><div><span>Năm học</span><strong>2026 <small>– 2027</small></strong></div><div><span>Hỗ trợ giảng dạy</span><strong>10 <small>nhân sự</small></strong></div></div>
    <section className="panel listing-panel"><div className="list-toolbar"><div><h3>Danh sách giáo viên <span className="count-badge">{filtered.length}</span></h3><p>Thông tin liên hệ và lớp chủ nhiệm</p></div><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, lớp, email..." /></label></div><PagedTable columns={columns} dataSource={filtered} rowKey="email" pageNumber={pageNumber} onPageChange={onPageChange} hasNext={hasNext} /></section>
  </>;
}

function ParentsPage({ parents, query, setQuery, pageNumber, onPageChange, hasNext }) {
  const families = parents.filter((family) =>
    `${family.name} ${family.phone} ${family.children.map((child) => child.name).join(' ')}`
      .toLowerCase().includes(query.toLowerCase()),
  );
  const columns = [
    { title: 'PHỤ HUYNH', dataIndex: 'name', key: 'name', render: (name) => <div className="student-cell"><Avatar initials={name.split(' ').map((part) => part[0]).slice(-2).join('')} color="lilac" /><span><strong>{name}</strong><small>Phụ huynh</small></span></div> },
    { title: 'ĐIỆN THOẠI', dataIndex: 'phone', key: 'phone' },
    { title: 'HỌC SINH ĐANG THEO HỌC', dataIndex: 'children', key: 'children', render: (children) => <div className="family-children">{children.map((child) => <span key={child.name}><Avatar initials={child.avatar} color={child.color} />{child.name}</span>)}</div> },
    { title: 'LỚP', dataIndex: 'children', key: 'classroom', render: (children) => children.map((child) => <span className="class-tag family-class-tag" key={child.name}>{child.classroom}</span>) },
    { title: 'TÌNH TRẠNG', key: 'status', render: () => <span className="status-pill status-present"><i />Đang theo học</span> },
  ];
  return <>
    <PageHeading eyebrow="KẾT NỐI GIA ĐÌNH & NHÀ TRƯỜNG" title="Phụ huynh" description="Thông tin phụ huynh được liên kết trực tiếp với hồ sơ học sinh." />
    <div className="family-summary"><span><Icon name="family" size={19} /> Đang quản lý</span><strong>{families.length} <small>gia đình</small></strong><p>Mỗi hồ sơ phụ huynh được tổng hợp từ thông tin liên hệ của các bé.</p></div>
    <section className="panel listing-panel"><div className="list-toolbar"><div><h3>Danh sách phụ huynh <span className="count-badge">{families.length}</span></h3><p>Thông tin gia đình và các bé đang theo học</p></div><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm phụ huynh hoặc học sinh..." /></label></div><PagedTable columns={columns} dataSource={families} rowKey="name" pageNumber={pageNumber} onPageChange={onPageChange} hasNext={hasNext} /></section>
  </>;
}

function SchedulePage({ user, activities = null, classrooms = null, classroom, onClassroomChange, pageNumber, onPageChange, hasNext }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const selectedClass = user.role === 'parent' || user.role === 'student' || user.role === 'teacher'
    ? (user.classroom ?? 'Mầm 1')
    : classroom;
  const classOptions = classrooms === null ? ['Mầm 1', 'Mầm 2', 'Chồi 1', 'Chồi 2', 'Lá 1', 'Lá 2'] : classrooms.map((room) => room.name);
  const visibleActivities = activities === null ? null : activities.filter((activity) => activity.classroom === selectedClass);
  const times = visibleActivities === null
    ? scheduleTimes
    : Array.from(new Set(visibleActivities.map((activity) => activity.startTime))).sort();
  const weekStart = new Date(2026, 10, 2 + weekOffset * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);
  const formatScheduleDate = (date) => date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
  return <>
    <PageHeading eyebrow="KẾ HOẠCH HỌC TẬP" title="Thời khóa biểu" description="Lịch sinh hoạt và hoạt động của các bé trong tuần." />
    <section className="schedule-banner"><div className="schedule-banner-icon">🌼</div><div><strong>Mỗi ngày một điều mới mẻ</strong><span>Thời gian biểu cân bằng giữa học tập, vui chơi và nghỉ ngơi.</span></div><span className="schedule-class-label">Lớp {selectedClass}</span></section>
    <section className="panel schedule-panel"><div className="schedule-toolbar"><div><h3>Lịch học trong tuần</h3><p>Tuần {formatScheduleDate(weekStart)} – {formatScheduleDate(weekEnd)}, {weekStart.getFullYear()}</p></div><div className="schedule-controls">{user.role === 'admin' && <label className="select-button schedule-select"><span>Lớp</span><select value={classroom} onChange={(event) => onClassroomChange(event.target.value)}>{classOptions.map((room) => <option key={room}>{room}</option>)}</select><Icon name="down" size={14} /></label>}<button className="select-button" onClick={() => setWeekOffset((offset) => offset - 1)} aria-label="Tuần trước">‹</button><button className="select-button" onClick={() => setWeekOffset(0)}>Tuần này</button><button className="select-button" onClick={() => setWeekOffset((offset) => offset + 1)} aria-label="Tuần sau">›</button></div></div><div className="schedule-scroll"><table className="schedule-table"><thead><tr><th>THỜI GIAN</th>{scheduleDays.map((day, index) => { const date = new Date(weekStart); date.setDate(weekStart.getDate() + index); return <th key={day}>{day}<small>{formatScheduleDate(date)}</small></th>; })}</tr></thead><tbody>{times.map((time, row) => <tr key={time}><th>{time}</th>{scheduleDays.map((day, column) => { const activity = visibleActivities === null ? weeklySchedule[column][row] : visibleActivities.find((item) => normalizeScheduleDay(item.dayOfWeek) === column && item.startTime === time); return <td key={day}>{activity && <div className={`schedule-activity activity-${activity.kind}`}><strong>{activity.title}</strong><span>{time} – {activity.endTime || scheduleTimes[row + 1] || '16:30'}</span></div>}</td>; })}</tr>)}</tbody></table></div><div className="schedule-legend"><span><i className="activity-learn" />Học tập</span><span><i className="activity-play" />Vui chơi</span><span><i className="activity-care" />Sinh hoạt</span><span><i className="activity-art" />Nghệ thuật</span></div><ServerPagination pageNumber={pageNumber} onPageChange={onPageChange} itemCount={visibleActivities?.length ?? 0} hasNext={hasNext} /></section>
  </>;
}

function TeacherModal({ onClose, onSubmit }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-modal-title"><div className="modal-header"><div><p className="eyebrow">HỒ SƠ NHÂN SỰ</p><h2 id="teacher-modal-title">Thêm giáo viên</h2><p>Cập nhật thông tin giáo viên mới.</p></div><button className="icon-button" onClick={onClose} aria-label="Đóng"><Icon name="close" /></button></div><form onSubmit={onSubmit}><label className="form-field full-field">Họ và tên <span>*</span><input name="name" required placeholder="Ví dụ: Nguyễn Thị Mai" autoFocus /></label><div className="form-row"><label className="form-field">Lớp phụ trách<select name="classroom">{['Mầm 1', 'Mầm 2', 'Chồi 1', 'Chồi 2', 'Lá 1', 'Lá 2'].map((room) => <option key={room}>{room}</option>)}</select></label><label className="form-field">Chức vụ<select name="title"><option>Giáo viên chủ nhiệm</option><option>Giáo viên bộ môn</option><option>Trợ giảng</option></select></label></div><label className="form-field full-field">Email<input type="email" name="email" placeholder="giaovien@annhien.vn" /></label><label className="form-field full-field">Số điện thoại<input name="phone" type="tel" placeholder="09xx xxx xxx" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Để sau</button><button type="submit" className="primary-button"><Icon name="plus" size={17} /> Thêm giáo viên</button></div></form></section></div>;
}

function Dashboard({ user, students, presentCount, summary, onNavigate, onAdd, onToast }) {
  const week = [
    { day: 'T2', value: 76 }, { day: 'T3', value: 88 }, { day: 'T4', value: 68, active: true },
    { day: 'T5', value: 92 }, { day: 'T6', value: 82 }, { day: 'T7', value: 56 },
  ];
  return <>
    <PageHeading eyebrow="TỔNG QUAN NHÀ TRƯỜNG" title={<>Chào buổi sáng, {user.name} <span className="wave">✦</span></>} description="Một ngày mới thật nhiều niềm vui đang chờ các bé ở An Nhiên." action={<button className="primary-button" onClick={onAdd}><Icon name="plus" size={18} /> Thêm học sinh</button>} />
    <section className="welcome-banner">
      <div className="welcome-copy"><span className="banner-tag"><Icon name="sun" size={14} /> MỘT NGÀY THẬT DỊU DÀNG</span><h2>Nuôi dưỡng yêu thương,<br />lớn khôn mỗi ngày <span>♡</span></h2><p>Chúc cô và các bé có một ngày học tập tràn đầy năng lượng!</p><button onClick={() => onNavigate('attendance')}>Xem điểm danh hôm nay <Icon name="arrow" size={15} /></button></div>
      <div className="banner-illustration" aria-hidden="true"><div className="sun-disc" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="flower flower-one">✿</div><div className="flower flower-two">✿</div><div className="child-illustration"><div className="child-hair" /><div className="child-face"><i /><i /><b /></div><div className="child-body" /></div><div className="child-illustration child-second"><div className="child-hair" /><div className="child-face"><i /><i /><b /></div><div className="child-body" /></div></div>
    </section>

    <section className="stats-grid">
      <StatCard label="Tổng số học sinh" value={String(summary?.totalStudents ?? students.length)} suffix="bé" change="+8.2%" icon="users" tone="green" foot="theo dữ liệu nhà trường" />
      <StatCard label="Có mặt hôm nay" value={String(summary?.presentStudents ?? presentCount)} suffix={`/ ${summary?.totalStudents ?? students.length}`} change="Tốt lắm!" icon="heart" tone="pink" foot={`${(summary?.totalStudents ?? students.length) ? Math.round(((summary?.presentStudents ?? presentCount) / (summary?.totalStudents ?? students.length)) * 100) : 0}% sĩ số lớp`} />
      <StatCard label="Lớp đang hoạt động" value={String(summary?.activeClassrooms ?? 8)} suffix="lớp" change="Đang hoạt động" icon="book" tone="purple" foot="theo dữ liệu nhà trường" />
      <StatCard label="Học phí tháng 11" value={summary ? `${Math.round((Number(summary.tuitionPaid || 0) / (Number(summary.tuitionPaid || 0) + Number(summary.tuitionOutstanding || 0) || 1)) * 100)}` : '92'} suffix="%" change="Đã thu" icon="wallet" tone="orange" foot="theo dữ liệu nhà trường" />
    </section>

    <section className="dashboard-grid">
      <div className="panel attendance-panel">
        <div className="panel-heading"><div><h3>Tình hình chuyên cần</h3><p>Sĩ số các bé đến trường trong tuần</p></div><button className="select-button" onClick={() => onToast('Đang hiển thị dữ liệu tuần này')}>Tuần này <Icon name="down" size={15} /></button></div>
        <div className="chart-summary"><strong>94.8<span>%</span></strong><span className="trend-up"><Icon name="arrow" size={13} /> 2.4%</span><small>so với tuần trước</small></div>
        <div className="chart" role="img" aria-label="Biểu đồ tỷ lệ đi học từ thứ Hai đến thứ Bảy">
          <div className="chart-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div>
          <div className="chart-area"><div className="chart-gridlines"><i /><i /><i /><i /></div><div className="chart-bars">{week.map((item) => <div className="bar-column" key={item.day}><div className={`bar ${item.active ? 'bar-active' : ''}`} style={{ height: `${item.value}%` }}>{item.active && <span>{item.value}%</span>}</div><small>{item.day}</small></div>)}</div></div>
        </div>
      </div>
      <div className="panel quick-panel">
        <div className="panel-heading"><div><h3>Thao tác nhanh</h3><p>Các công việc thường dùng</p></div><span className="sparkle">✳</span></div>
        <div className="quick-list">
          <button onClick={() => onNavigate('attendance')}><span className="quick-icon quick-peach"><Icon name="calendar" /></span><span><strong>Điểm danh hôm nay</strong><small>Cập nhật sĩ số các lớp</small></span><Icon name="chevron" size={17} /></button>
          <button onClick={() => onAdd()}><span className="quick-icon quick-mint"><Icon name="users" /></span><span><strong>Thêm học sinh mới</strong><small>Ghi danh bé vào trường</small></span><Icon name="chevron" size={17} /></button>
          <button onClick={() => onNavigate('tuition')}><span className="quick-icon quick-lilac"><Icon name="wallet" /></span><span><strong>Quản lý học phí</strong><small>Theo dõi thu chi tháng 11</small></span><Icon name="chevron" size={17} /></button>
        </div>
      </div>
    </section>

    <section className="dashboard-grid lower-grid">
      <div className="panel students-panel">
        <div className="panel-heading"><div><h3>Học sinh hôm nay</h3><p>Cập nhật tình hình đến lớp</p></div><button className="text-button" onClick={() => onNavigate('students')}>Xem tất cả <Icon name="chevron" size={15} /></button></div>
        <StudentTable students={students.slice(0, 4)} compact />
      </div>
      <div className="panel birthday-panel">
        <div className="panel-heading"><div><h3>Sinh nhật tháng 11 <span className="birthday-emoji">🎂</span></h3><p>Cùng gửi lời chúc đến các bé nhé!</p></div><button className="dots-button" onClick={() => onToast('Đang xem danh sách sinh nhật tháng 11')} aria-label="Tùy chọn"><Icon name="dots" /></button></div>
        <div className="birthday-row"><Avatar initials="AT" color="yellow" /><span><strong>Đặng Anh Thư</strong><small>Lớp Mầm 1 · 5 tuổi</small></span><b>06/11</b></div>
        <div className="birthday-row"><Avatar initials="MH" color="lilac" /><span><strong>Nguyễn Minh Hoàng</strong><small>Lớp Chồi 2 · 4 tuổi</small></span><b>12/11</b></div>
        <div className="birthday-row"><Avatar initials="PL" color="pink" /><span><strong>Trần Phương Linh</strong><small>Lớp Lá 1 · 5 tuổi</small></span><b>19/11</b></div>
        <button className="birthday-link" onClick={() => onToast('Đã mở lịch sinh nhật tháng 11')}>Xem lịch sinh nhật <Icon name="arrow" size={14} /></button>
      </div>
    </section>
    <footer className="page-footer"><span>© 2026 An Nhiên Preschool</span><span>Được làm bằng <b>♥</b> cho những năm tháng đầu đời</span></footer>
  </>;
}

function StatCard({ label, value, suffix, change, icon, tone, foot }) {
  return <div className="stat-card"><div className={`stat-icon stat-${tone}`}><Icon name={icon} size={19} /></div><span className="stat-label">{label}</span><div className="stat-number">{value}<small>{suffix}</small></div><div className="stat-foot"><span className={`stat-change ${change === 'Tốt lắm!' || change === 'Đủ giáo viên' ? 'change-calm' : ''}`}>{change}</span><span>{foot}</span></div></div>;
}

function StudentTable({ students, compact = false, pageNumber, onPageChange, hasNext }) {
  const columns = [
    { title: 'HỌC SINH', dataIndex: 'name', key: 'name', render: (_, student) => <div className="student-cell"><Avatar initials={student.avatar} color={student.color} /><span><strong>{student.name}</strong><small>{student.gender} · {student.age} tuổi</small></span></div> },
    { title: 'LỚP', dataIndex: 'classroom', key: 'classroom', render: (classroom) => <span className="class-tag">{classroom}</span> },
    !compact && { title: 'PHỤ HUYNH', dataIndex: 'parent', key: 'parent' },
    { title: 'TRẠNG THÁI', dataIndex: 'status', key: 'status', render: (status) => <span className={`status-pill ${status === 'Đã đến' ? 'status-present' : status === 'Xin nghỉ' ? 'status-absent' : 'status-pending'}`}><i />{status}</span> },
    !compact && { title: 'LIÊN HỆ', dataIndex: 'phone', key: 'phone' },
  ].filter(Boolean);
  return <PagedTable columns={columns} dataSource={students} rowKey="name" compact={compact} pageNumber={pageNumber} onPageChange={onPageChange} hasNext={hasNext} />;
}

function StudentsPage({ students, query, setQuery, onAdd, canAdd, pageNumber, onPageChange, hasNext }) {
  return <>
    <PageHeading eyebrow="DANH SÁCH & HỒ SƠ" title="Học sinh" description="Quản lý thông tin, hồ sơ và tình hình học tập của các bé." action={canAdd && <button className="primary-button" onClick={onAdd}><Icon name="plus" size={18} /> Thêm học sinh</button>} />
    <section className="panel listing-panel"><div className="list-toolbar"><div><h3>Danh sách học sinh <span className="count-badge">{students.length}</span></h3><p>Năm học 2026 – 2027</p></div><div className="list-actions"><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, lớp học..." /><kbd>⌘ K</kbd></label><button className="select-button" onClick={() => setQuery('')}>Tất cả lớp <Icon name="down" size={15} /></button></div></div><StudentTable students={students} pageNumber={pageNumber} onPageChange={onPageChange} hasNext={hasNext} /></section>
    <div className="page-footer"><span>Hiển thị {students.length} học sinh</span><span>Dữ liệu được lưu tạm trên trình duyệt</span></div>
  </>;
}

function ClassesPage({ onToast, user, apiClasses = null, students, teacherData }) {
  const allClasses = [
    { name: 'Mầm 1', age: '3 – 4 tuổi', count: '16 / 18 bé', teacher: 'Cô Mai Phương', time: '07:30 – 16:30', icon: '🌱', tone: 'class-mint' },
    { name: 'Mầm 2', age: '3 – 4 tuổi', count: '15 / 18 bé', teacher: 'Cô Thu Hằng', time: '07:30 – 16:30', icon: '🌼', tone: 'class-peach' },
    { name: 'Chồi 1', age: '4 – 5 tuổi', count: '17 / 18 bé', teacher: 'Cô Bảo Trân', time: '07:30 – 16:30', icon: '🌷', tone: 'class-pink' },
    { name: 'Chồi 2', age: '4 – 5 tuổi', count: '16 / 18 bé', teacher: 'Cô Minh Thư', time: '07:30 – 16:30', icon: '🦋', tone: 'class-lilac' },
    { name: 'Lá 1', age: '5 – 6 tuổi', count: '18 / 20 bé', teacher: 'Cô Ngọc Lan', time: '07:30 – 16:30', icon: '🍃', tone: 'class-blue' },
    { name: 'Lá 2', age: '5 – 6 tuổi', count: '16 / 20 bé', teacher: 'Cô Thanh Vân', time: '07:30 – 16:30', icon: '🌻', tone: 'class-yellow' },
  ];
  const sourceClasses = apiClasses === null ? allClasses : apiClasses.map((room) => {
    const enrolled = students.filter((student) => student.classroom === room.name).length;
    const capacity = Number(room.capacity) || 0;
    const assignedTeacher = teacherData.find((teacher) => teacher.classroom === room.name)?.name || room.teacher || 'Đang cập nhật';
    return {
      ...room,
      age: room.age || 'Chưa cập nhật',
      count: `${enrolled} / ${capacity} bé`,
      teacher: assignedTeacher,
      time: room.time || 'Chưa cập nhật',
      icon: room.icon || '🌱',
      tone: room.tone || 'class-mint',
    };
  });
  const classes = user.role === 'teacher' ? sourceClasses.filter((room) => room.name === user.classroom) : sourceClasses;
  const totalStudents = students.length;
  const displayedTeachers = new Set(classes.map((room) => room.teacher)).size;
  return <><PageHeading eyebrow="TỔ CHỨC LỚP HỌC" title="Lớp học" description="Không gian lớn lên và khám phá của các bé tại An Nhiên." action={<button className="primary-button" onClick={() => onToast('Tính năng tạo lớp mới sẽ sớm được cập nhật')}><Icon name="plus" size={18} /> Tạo lớp mới</button>} /><div className="class-summary"><div><span>Đang hoạt động</span><strong>{classes.length} <small>lớp học</small></strong></div><div><span>Tổng số học sinh</span><strong>{totalStudents} <small>bé</small></strong></div><div><span>Đội ngũ giáo viên</span><strong>{apiClasses === null ? teacherData.length : displayedTeachers} <small>cô giáo</small></strong></div><div><span>Sĩ số trung bình</span><strong>{classes.length ? Math.round(totalStudents / classes.length) : 0} <small>bé / lớp</small></strong></div></div><div className="class-grid">{classes.map((room) => <article className="class-card" key={room.name}><div className={`class-art ${room.tone}`}><span>{room.icon}</span><button aria-label={`Tùy chọn ${room.name}`} onClick={() => onToast(`Đang xem thông tin lớp ${room.name}`)}><Icon name="dots" size={18} /></button></div><div className="class-card-content"><div className="class-title"><h3>{room.name}</h3><span>{room.age}</span></div><div className="class-capacity"><span>{room.count}</span><div><i style={{ width: `${getRoomCapacity(room) ? Math.min(100, (students.filter((student) => student.classroom === room.name).length / getRoomCapacity(room)) * 100) : 0}%` }} /></div></div><div className="class-detail"><span>Giáo viên chủ nhiệm</span><strong>{room.teacher}</strong></div><div className="class-detail"><span>Thời gian</span><strong>{room.time}</strong></div><button className="class-view" onClick={() => onToast(`Đang mở danh sách học sinh lớp ${room.name}`)}>Xem lớp học <Icon name="arrow" size={14} /></button></div></article>)}</div></>;
}

function AttendancePage({ students, onToast, onSave, pageNumber, onPageChange, hasNext }) {
  const [statuses, setStatuses] = useState(() => Object.fromEntries(students.map((student) => [student.name, student.status])));
  const toggle = (name) => setStatuses((current) => ({ ...current, [name]: current[name] === 'Đã đến' ? 'Xin nghỉ' : 'Đã đến' }));
  const present = students.filter((student) => (statuses[student.name] ?? student.status) === 'Đã đến').length;
  const columns = [
    { title: 'HỌC SINH', dataIndex: 'name', key: 'name', render: (_, student) => <div className="student-cell"><Avatar initials={student.avatar} color={student.color} /><span><strong>{student.name}</strong><small>{student.gender} · {student.age} tuổi</small></span></div> },
    { title: 'LỚP', dataIndex: 'classroom', key: 'classroom', render: (classroom) => <span className="class-tag">{classroom}</span> },
    { title: 'GIỜ ĐẾN', key: 'arrival', render: (_, student, index) => (statuses[student.name] ?? student.status) === 'Đã đến' ? ['07:42', '07:56', '08:02', '07:38'][index % 4] : '—' },
    { title: 'TRẠNG THÁI', key: 'status', render: (_, student) => { const status = statuses[student.name] ?? student.status; return <span className={`status-pill ${status === 'Đã đến' ? 'status-present' : status === 'Xin nghỉ' ? 'status-absent' : 'status-pending'}`}><i />{status}</span>; } },
    { title: 'CẬP NHẬT', key: 'action', render: (_, student) => { const status = statuses[student.name] ?? student.status; return <button className="mark-button" onClick={() => toggle(student.name)}>{status === 'Đã đến' ? 'Xin nghỉ' : 'Đánh dấu có mặt'}</button>; } },
  ];
  return <><PageHeading eyebrow="ĐIỂM DANH HẰNG NGÀY" title="Điểm danh" description="Theo dõi tình hình đến lớp của các bé trong ngày." action={<button className="primary-button" onClick={() => onSave(statuses)}><Icon name="check" size={18} /> Lưu điểm danh</button>} /><div className="attendance-banner"><div className="today-calendar"><span>THÁNG 11</span><strong>04</strong><small>THỨ TƯ</small></div><div><h3>Điểm danh ngày hôm nay</h3><p>Thứ Tư, ngày 04 tháng 11 năm 2026 · Cập nhật lần cuối 08:42</p></div><span className="attendance-total"><strong>{present}<small>/{students.length}</small></strong><span>bé đã đến lớp</span></span></div><section className="panel listing-panel"><div className="list-toolbar"><div><h3>Sĩ số học sinh <span className="count-badge">{students.length}</span></h3><p>Chạm vào trạng thái để cập nhật nhanh</p></div><button className="select-button" onClick={() => onToast('Đang hiển thị tất cả các lớp')}>Tất cả lớp <Icon name="down" size={15} /></button></div><PagedTable columns={columns} dataSource={students} rowKey="name" pageNumber={pageNumber} onPageChange={onPageChange} hasNext={hasNext} /></section></>;
}

function TuitionPage({ onToast, students, user, apiInvoices = null, onRemind, pageNumber, onPageChange, hasNext }) {
  const paymentStatuses = ['Đã thanh toán', 'Chờ thanh toán', 'Đã thanh toán', 'Quá hạn', 'Chờ thanh toán'];
  const allInvoices = students.map((student, index) => ({
    ...student,
    room: student.classroom,
    amount: `${(3200000 + (student.age - 3) * 250000 + (index % 4) * 100000).toLocaleString('vi-VN')}đ`,
    due: `${String(5 + (index % 8)).padStart(2, '0')}/11/2026`,
    status: paymentStatuses[index] ?? (index % 5 === 0 ? 'Quá hạn' : index % 3 === 0 ? 'Chờ thanh toán' : 'Đã thanh toán'),
  }));
  const invoiceRows = apiInvoices === null ? allInvoices : apiInvoices.map((invoice) => {
    const student = students.find((item) => item.id === invoice.studentId || item.name === invoice.name);
    return {
      ...invoice,
      room: invoice.room || student?.classroom || 'Chưa cập nhật',
      amount: formatCurrency(invoice.amount),
      due: formatDisplayDate(invoice.due),
      status: invoice.status || 'Chờ thanh toán',
      avatar: invoice.avatar || student?.avatar || 'AN',
      color: invoice.color || student?.color || 'peach',
    };
  });
  const invoices = user.role === 'parent'
    ? invoiceRows.filter((invoice) => students.some((student) => student.name === invoice.name))
    : invoiceRows;
  const columns = [
    { title: 'HỌC SINH', dataIndex: 'name', key: 'name', render: (_, item) => <div className="student-cell"><Avatar initials={item.avatar} color={item.color} /><span><strong>{item.name}</strong><small>Học phí tháng 11</small></span></div> },
    { title: 'LỚP', dataIndex: 'room', key: 'room', render: (room) => <span className="class-tag">{room}</span> },
    { title: 'SỐ TIỀN', dataIndex: 'amount', key: 'amount', render: (amount) => <strong className="amount">{amount}</strong> },
    { title: 'HẠN THANH TOÁN', dataIndex: 'due', key: 'due' },
    { title: 'TRẠNG THÁI', dataIndex: 'status', key: 'status', render: (status) => <span className={`status-pill ${status === 'Đã thanh toán' ? 'status-present' : status === 'Quá hạn' ? 'status-absent' : 'status-pending'}`}><i />{status}</span> },
    { title: '', key: 'action', render: (_, item) => <button className="dots-button" aria-label={`Thao tác ${item.name}`} onClick={() => onToast(`Đã mở hóa đơn của ${item.name}`)}><Icon name="dots" /></button> },
  ];
  return <><PageHeading eyebrow="TÀI CHÍNH & HỌC PHÍ" title="Quản lý học phí" description="Theo dõi các khoản thu và tình trạng thanh toán của phụ huynh." action={<button className="primary-button" onClick={() => onToast('Đã gửi nhắc phí đến phụ huynh chưa thanh toán')}><Icon name="bell" size={17} /> Nhắc học phí</button>} /><div className="tuition-stats"><StatCard label="Tổng học phí tháng 11" value="486" suffix="tr" change="+12.5%" icon="wallet" tone="green" foot="so với tháng trước" /><StatCard label="Đã thu" value="447" suffix="tr" change="92%" icon="check" tone="pink" foot="114 / 128 học sinh" /><StatCard label="Chờ thanh toán" value="31" suffix="tr" change="10 bé" icon="clock" tone="orange" foot="đang chờ xác nhận" /><StatCard label="Khoản quá hạn" value="8" suffix="tr" change="4 bé" icon="bell" tone="purple" foot="cần nhắc nhở" /></div><section className="panel listing-panel"><div className="list-toolbar"><div><h3>Chi tiết học phí <span className="count-badge">Tháng 11</span></h3><p>Học phí và các khoản thu trong tháng</p></div><button className="select-button" onClick={() => onToast('Đang hiển thị học phí tháng 11')}>Tháng 11, 2026 <Icon name="down" size={15} /></button></div><PagedTable columns={columns} dataSource={invoices} rowKey="name" pageNumber={pageNumber} onPageChange={onPageChange} hasNext={hasNext} /></section></>;
}

function MessagesPage({ onToast, apiMessages = null, pageNumber, onPageChange, hasNext }) {
  const fakeMessages = [
    { title: 'Lịch hoạt động ngoài trời tuần này', body: 'Các bé sẽ tham gia hoạt động khám phá thiên nhiên vào sáng thứ Sáu. Ba mẹ nhớ chuẩn bị nón và bình nước cho bé nhé!', date: 'Hôm nay, 08:30', audience: 'Tất cả phụ huynh', initials: 'AN', tone: 'peach', tag: 'HOẠT ĐỘNG' },
    { title: 'Nhắc nhở học phí tháng 11', body: 'Nhà trường kính nhờ ba mẹ hoàn tất học phí tháng 11 trước ngày 05/11. Cảm ơn ba mẹ đã đồng hành cùng An Nhiên.', date: 'Hôm qua, 15:20', audience: 'Phụ huynh các lớp', initials: '💛', tone: 'yellow', tag: 'HỌC PHÍ' },
    { title: 'Thực đơn dinh dưỡng tuần 2', body: 'Thực đơn tuần mới đã được cập nhật. Ba mẹ có thể xem chi tiết bữa ăn của các bé tại bảng tin lớp.', date: '02/11/2026', audience: 'Tất cả phụ huynh', initials: '🥗', tone: 'mint', tag: 'THỰC ĐƠN' },
  ];
  const messages = apiMessages === null ? fakeMessages : apiMessages.map((message) => ({
    ...message,
    date: formatDisplayDate(message.date || message.createdAt),
    audience: message.audience || message.classroom || 'Tất cả phụ huynh',
    initials: message.initials || 'AN',
    tone: message.tone || 'peach',
    tag: message.tag || 'THÔNG BÁO',
  }));
  return <><PageHeading eyebrow="GẮN KẾT CÙNG GIA ĐÌNH" title="Thông báo" description="Chia sẻ tin tức và những khoảnh khắc đáng yêu cùng phụ huynh." action={<button className="primary-button" onClick={() => onToast('Tính năng soạn thông báo mới sẽ sớm ra mắt')}><Icon name="plus" size={18} /> Soạn thông báo</button>} /><div className="message-intro"><div className="message-icon"><Icon name="heart" size={23} /></div><div><strong>Mỗi ngày một niềm vui ♡</strong><span>{messages.length} thông báo trong hệ thống</span></div><div className="message-recipients"><Avatar initials="MK" color="peach" /><Avatar initials="BN" color="lilac" /><Avatar initials="GH" color="mint" /><span>+125</span></div></div><div className="message-list">{messages.map((message) => <article className="panel message-card" key={message.id || message.title}><div className={`message-avatar avatar-${message.tone}`}>{message.initials}</div><div className="message-body"><div className="message-meta"><span className="message-tag">{message.tag}</span><span>{message.date}</span></div><h3>{message.title}</h3><p>{message.body}</p><div className="message-foot"><span><Icon name="users" size={15} /> {message.audience}</span><button onClick={() => onToast(`Đang mở thông báo: ${message.title}`)}>Xem chi tiết <Icon name="arrow" size={14} /></button></div></div></article>)}{messages.length === 0 && <div className="empty-state">Chưa có thông báo nào.</div>}<ServerPagination pageNumber={pageNumber} onPageChange={onPageChange} itemCount={messages.length} hasNext={hasNext} /></div></>;
}

function StudentModal({ onClose, onSubmit }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><p className="eyebrow">HỒ SƠ HỌC SINH</p><h2 id="modal-title">Thêm học sinh mới</h2><p>Điền một vài thông tin cơ bản của bé nhé.</p></div><button className="icon-button" onClick={onClose} aria-label="Đóng"><Icon name="close" /></button></div><form onSubmit={onSubmit}><label className="form-field full-field">Họ và tên bé <span>*</span><input name="name" required placeholder="Ví dụ: Nguyễn Minh Anh" autoFocus /></label><div className="form-row"><label className="form-field">Lớp học<select name="classroom"><option>Mầm 1</option><option>Mầm 2</option><option>Chồi 1</option><option>Chồi 2</option><option>Lá 1</option><option>Lá 2</option></select></label><label className="form-field">Độ tuổi<select name="age"><option value="3">3 tuổi</option><option value="4">4 tuổi</option><option value="5">5 tuổi</option><option value="6">6 tuổi</option></select></label></div><label className="form-field full-field">Phụ huynh <input name="parent" placeholder="Tên phụ huynh" /></label><div className="form-row"><label className="form-field">Số điện thoại<input name="phone" type="tel" placeholder="09xx xxx xxx" /></label><label className="form-field">Giới tính<select name="gender"><option>Nam</option><option>Nữ</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Để sau</button><button type="submit" className="primary-button"><Icon name="plus" size={17} /> Thêm học sinh</button></div></form></section></div>;
}

export default App;
