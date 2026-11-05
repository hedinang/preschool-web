import { getParents } from '../../api/school';
import { resolvePageRequests } from '../resolvePageRequests';
import { mapStudent } from '../../utils/school';

export async function loadParents({ token, sequence }) {
  const { data, error } = await resolvePageRequests({ parents: getParents(token, { sequence }) });
  return {
    data: {
      parents: (data.parents || []).map((parent) => ({
        ...parent,
        children: parent.children.map((student) => mapStudent(student)),
      })),
    },
    error,
  };
}
