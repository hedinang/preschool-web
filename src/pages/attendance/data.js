import { getAttendance, getStudents } from '../../api/school';
import { getLocalDate } from '../../utils/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadAttendance({ token, sequence }) {
  return resolvePageRequests({
    students: getStudents(token, { sequence }),
    attendanceRecords: getAttendance(token, getLocalDate()),
  });
}
