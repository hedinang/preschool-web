import { getStudents, getTuition } from '../../api/school';
import { getLocalDate } from '../../utils/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadTuition({ token, sequence }) {
  const month = getLocalDate().slice(0, 7);
  return resolvePageRequests({
    tuitionInvoices: getTuition(token, month, { sequence }),
    students: getStudents(token),
  });
}
