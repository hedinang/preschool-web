import { getTeachers } from '../../api/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadTeachers({ token, sequence }) {
  return resolvePageRequests({ teacherList: getTeachers(token, { sequence }) });
}
