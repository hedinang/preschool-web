import { getClasses, getSchedule } from '../../api/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadSchedule({ token, user, sequence, filter }) {
  const requests = {
    scheduleActivities: getSchedule(token, {
      sequence,
      classroom: filter || user.classroom || 'Mầm 1',
    }),
  };
  if (user.role === 'admin' || user.role === 'teacher') {
    requests.classrooms = getClasses(token);
  }
  return resolvePageRequests(requests);
}
