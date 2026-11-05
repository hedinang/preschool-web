import { getAttendance, getStudents } from '../../api/school';
import { getLocalDate } from '../../utils/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadStudents({ token, user, sequence }) {
  const requests = { students: getStudents(token, { sequence }) };
  if (user.role !== 'admin' && user.role !== 'teacher') {
    return resolvePageRequests(requests);
  }

  requests.attendanceRecords = getAttendance(token, getLocalDate());
  return resolvePageRequests(requests);
}
