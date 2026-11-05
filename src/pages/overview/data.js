import {
  getAttendance,
  getDashboardSummary,
  getStudents,
} from '../../api/school';
import { getLocalDate } from '../../utils/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadOverview({ token, user }) {
  const date = getLocalDate();
  const month = date.slice(0, 7);
  const requests = { students: getStudents(token) };

  if (user.role === 'admin' || user.role === 'teacher') {
    requests.attendanceRecords = getAttendance(token, date);
  }
  if (user.role === 'admin') {
    requests.dashboardSummary = getDashboardSummary(token, date, month);
  }

  return resolvePageRequests(requests);
}
