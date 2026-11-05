import { getUsers } from '../../api/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadUsers({ token, sequence, filter }) {
  return resolvePageRequests({
    managedUsers: getUsers(token, { sequence, role: filter || undefined }),
  });
}
