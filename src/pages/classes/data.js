import { getClasses, getStudents, getTeachers } from '../../api/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadClasses({ token, user }) {
  const requests = {
    classrooms: getClasses(token),
    students: getStudents(token),
  };
  if (user.role === 'admin') requests.teacherList = getTeachers(token);
  return resolvePageRequests(requests);
}
